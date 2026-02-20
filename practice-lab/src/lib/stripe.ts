import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover' as any,
})

export const PRICE_IDS = {
  tier1: {
    monthly: process.env.NEXT_PUBLIC_STRIPE_TIER1_MONTHLY_PRICE_ID!,
    yearly: process.env.NEXT_PUBLIC_STRIPE_TIER1_YEARLY_PRICE_ID!,
  },
  tier2: {
    monthly: process.env.NEXT_PUBLIC_STRIPE_TIER2_MONTHLY_PRICE_ID!,
    yearly: process.env.NEXT_PUBLIC_STRIPE_TIER2_YEARLY_PRICE_ID!,
  },
  tier3: {
    monthly: process.env.NEXT_PUBLIC_STRIPE_TIER3_MONTHLY_PRICE_ID!,
    yearly: process.env.NEXT_PUBLIC_STRIPE_TIER3_YEARLY_PRICE_ID!,
  },
}

export function getTierFromPriceId(priceId: string): 'tier1' | 'tier2' | 'tier3' | null {
  for (const [tier, prices] of Object.entries(PRICE_IDS)) {
    if (prices.monthly === priceId || prices.yearly === priceId) {
      return tier as 'tier1' | 'tier2' | 'tier3'
    }
  }
  return null
}
