'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, Zap } from 'lucide-react'
import { SUBSCRIPTION_TIERS, SPORTS } from '@/types'
import { createClient } from '@/lib/supabase/client'

export default function PricingPage() {
  const router = useRouter()
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')
  const [loadingTier, setLoadingTier] = useState<string | null>(null)

  async function handleGetStarted(tier: string) {
    setLoadingTier(tier)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push(`/auth/signup?plan=${tier}&billing=${billing}`)
      return
    }

    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tier, billing }),
    })
    const { url } = await res.json()
    if (url) window.location.href = url
    setLoadingTier(null)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, flexible pricing</h1>
        <p className="text-lg text-gray-500 mb-8">
          Pick the sports you coach. Upgrade or cancel anytime.
        </p>

        {/* Billing toggle */}
        <div className="inline-flex items-center bg-gray-100 rounded-xl p-1 gap-1">
          <button
            onClick={() => setBilling('monthly')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              billing === 'monthly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling('yearly')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              billing === 'yearly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Yearly
            <span className="bg-green-100 text-green-700 text-xs font-semibold px-1.5 py-0.5 rounded-full">
              2 months free
            </span>
          </button>
        </div>
      </div>

      {/* Plans */}
      <div className="grid sm:grid-cols-3 gap-6 mb-16">
        {Object.entries(SUBSCRIPTION_TIERS).map(([key, tier], i) => {
          const price = billing === 'monthly' ? tier.monthlyPrice : tier.yearlyPrice
          const perMonth = billing === 'yearly' ? (tier.yearlyPrice / 12).toFixed(2) : null

          return (
            <div
              key={key}
              className={`rounded-2xl border p-7 flex flex-col relative ${
                i === 2
                  ? 'border-blue-600 bg-blue-600 text-white shadow-xl shadow-blue-100'
                  : 'border-gray-200 bg-white'
              }`}
            >
              {i === 2 && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-blue-700 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Most popular
                  </span>
                </div>
              )}

              <div className="mb-5">
                <p className={`text-sm font-semibold uppercase tracking-wide mb-2 ${i === 2 ? 'text-blue-200' : 'text-blue-600'}`}>
                  {tier.name}
                </p>
                <div className="flex items-end gap-1 mb-1">
                  <span className={`text-4xl font-bold ${i === 2 ? 'text-white' : 'text-gray-900'}`}>
                    ${price}
                  </span>
                  <span className={`text-sm pb-1 ${i === 2 ? 'text-blue-200' : 'text-gray-400'}`}>
                    /{billing === 'monthly' ? 'mo' : 'yr'}
                  </span>
                </div>
                {perMonth && (
                  <p className={`text-xs ${i === 2 ? 'text-blue-200' : 'text-gray-400'}`}>
                    ${perMonth}/mo billed annually
                  </p>
                )}
                <p className={`text-sm mt-2 ${i === 2 ? 'text-blue-100' : 'text-gray-500'}`}>
                  {tier.description}
                </p>
              </div>

              <ul className="flex flex-col gap-3 mb-7 flex-1">
                {tier.features.map((f, fi) => (
                  <li key={fi} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${i === 2 ? 'text-blue-200' : 'text-blue-500'}`} />
                    <span className={i === 2 ? 'text-blue-50' : 'text-gray-700'}>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleGetStarted(key)}
                disabled={loadingTier === key}
                className={`text-center font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed w-full ${
                  i === 2
                    ? 'bg-white text-blue-600 hover:bg-blue-50'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {loadingTier === key ? 'Loading...' : 'Get started'}
              </button>
            </div>
          )
        })}
      </div>

      {/* Sports coverage */}
      <div className="bg-gray-50 rounded-2xl p-8 mb-16">
        <h2 className="text-xl font-bold text-gray-900 text-center mb-6">What sports are covered?</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {SPORTS.map(sport => (
            <div key={sport.id} className="flex flex-col items-center gap-2 bg-white rounded-xl p-4 border border-gray-100">
              <span className="text-3xl">{sport.icon}</span>
              <span className="text-sm font-medium text-gray-700">{sport.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Common questions</h2>
        <div className="flex flex-col gap-6">
          {[
            {
              q: 'Can I change my sport selection after subscribing?',
              a: 'Yes — Tier 1 and Tier 2 subscribers can change their selected sport(s) once per 30 days. Tier 3 has access to all sports with no restrictions.',
            },
            {
              q: 'How many drills are included?',
              a: 'We launched with a curated set of drills and are actively adding more. Our goal is 30–50 drills per sport before launch, with new drills added regularly after.',
            },
            {
              q: 'Can I cancel anytime?',
              a: 'Yes. Cancel anytime from your account page. You keep access until the end of your billing period.',
            },
            {
              q: 'Is there a free trial?',
              a: 'Every visitor gets 2 free drills with no account needed. This lets you see the drill format and quality before subscribing.',
            },
            {
              q: 'What payment methods do you accept?',
              a: 'We accept all major credit and debit cards via Stripe. Your payment info is never stored on our servers.',
            },
          ].map((faq, i) => (
            <div key={i} className="border-b border-gray-100 pb-6">
              <p className="font-semibold text-gray-900 mb-2">{faq.q}</p>
              <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
