import { NextRequest, NextResponse } from 'next/server'
import { stripe, getTierFromPriceId } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature error:', err)
    return NextResponse.json({ error: 'Webhook signature invalid' }, { status: 400 })
  }

  try {
    const obj = event.data.object as any

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const priceId = obj.items?.data?.[0]?.price?.id
        const tier = priceId ? getTierFromPriceId(priceId) : null
        const userId = obj.metadata?.supabase_user_id

        console.log('Subscription event:', { priceId, tier, userId, status: obj.status })

        if (userId && tier) {
          // current_period_end may be on the item in newer API versions
          const periodEnd = obj.current_period_end
            ?? obj.items?.data?.[0]?.current_period_end

          const { error } = await supabaseAdmin
            .from('users')
            .update({
              subscription_tier: tier,
              subscription_status: obj.status,
              subscription_period_end: periodEnd
                ? new Date(periodEnd * 1000).toISOString()
                : null,
            })
            .eq('id', userId)

          if (error) console.error('Supabase update error:', error)
        } else {
          console.warn('Missing userId or tier — skipping update', { userId, tier, priceId })
        }
        break
      }

      case 'customer.subscription.deleted': {
        const userId = obj.metadata?.supabase_user_id
        if (userId) {
          await supabaseAdmin
            .from('users')
            .update({
              subscription_tier: null,
              subscription_status: 'canceled',
              subscription_period_end: null,
            })
            .eq('id', userId)
        }
        break
      }
    }
  } catch (err) {
    console.error('Webhook handler error:', err)
    return NextResponse.json({ error: 'Handler error' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
