'use client'

import Link from 'next/link'
import { Drill, SPORTS, SUBSCRIPTION_TIERS } from '@/types'
import { Lock, CheckCircle, ArrowRight } from 'lucide-react'

interface Props {
  drill: Drill
}

export default function PaywallModal({ drill }: Props) {
  const sport = SPORTS.find(s => s.id === drill.sport)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">

      {/* Blurred preview */}
      <div className="relative mb-8 rounded-2xl overflow-hidden border border-gray-100">
        <div className="p-6 blur-sm select-none pointer-events-none">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{drill.title}</h1>
          <p className="text-gray-600 mb-4">{drill.goal}</p>
          <div className="flex gap-3 mb-6">
            <div className="bg-gray-50 rounded-xl p-3 w-24 h-16" />
            <div className="bg-gray-50 rounded-xl p-3 w-24 h-16" />
            <div className="bg-gray-50 rounded-xl p-3 w-24 h-16" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-100 rounded w-full" />
            <div className="h-4 bg-gray-100 rounded w-5/6" />
            <div className="h-4 bg-gray-100 rounded w-4/6" />
          </div>
        </div>

        {/* Lock overlay */}
        <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex flex-col items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 max-w-sm w-full mx-4 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Subscribe to unlock this drill
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              You&apos;ve used your 2 free drills. Subscribe to get full access to all{' '}
              <span className="font-medium">{sport?.label}</span> drills and more.
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors mb-3"
            >
              See plans — from $9.99/mo
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center w-full text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Already subscribed? Log in
            </Link>
          </div>
        </div>
      </div>

      {/* Plan cards below */}
      <h3 className="text-lg font-semibold text-gray-900 text-center mb-6">Choose a plan to continue</h3>
      <div className="grid sm:grid-cols-3 gap-4">
        {Object.entries(SUBSCRIPTION_TIERS).map(([key, tier], i) => (
          <div
            key={key}
            className={`rounded-2xl border p-5 flex flex-col ${
              i === 2 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-200 bg-white'
            }`}
          >
            <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${i === 2 ? 'text-blue-200' : 'text-blue-600'}`}>
              {tier.name}
            </p>
            <p className={`text-2xl font-bold mb-1 ${i === 2 ? 'text-white' : 'text-gray-900'}`}>
              ${tier.monthlyPrice}
              <span className={`text-sm font-normal ${i === 2 ? 'text-blue-100' : 'text-gray-400'}`}>/mo</span>
            </p>
            <ul className="flex flex-col gap-1.5 mb-4 flex-1">
              {tier.features.slice(0, 3).map((f, fi) => (
                <li key={fi} className="flex items-start gap-1.5 text-xs">
                  <CheckCircle className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${i === 2 ? 'text-blue-200' : 'text-blue-500'}`} />
                  <span className={i === 2 ? 'text-blue-50' : 'text-gray-600'}>{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/pricing"
              className={`text-center text-xs font-semibold py-2 rounded-lg transition-colors ${
                i === 2
                  ? 'bg-white text-blue-600 hover:bg-blue-50'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Get started
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
