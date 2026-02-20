'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { SPORTS, SUBSCRIPTION_TIERS, type SubscriptionTier } from '@/types'
import { CheckCircle, Crown, LogOut, Settings, ChevronRight } from 'lucide-react'

interface Props {
  user: User
  profile: {
    name: string | null
    subscription_tier: SubscriptionTier | null
    subscription_status: string | null
    subscription_period_end: string | null
    selected_sport_ids: string[]
    sports_last_changed_at: string | null
  } | null
}

const tierLabels: Record<string, string> = {
  tier1: 'Single Sport',
  tier2: 'Dual Sport',
  tier3: 'All Sports',
}

export default function AccountPage({ user, profile }: Props) {
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  const tier = profile?.subscription_tier
  const status = profile?.subscription_status
  const isActive = status === 'active'
  const tierInfo = tier ? SUBSCRIPTION_TIERS[tier] : null
  const periodEnd = profile?.subscription_period_end
    ? new Date(profile.subscription_period_end).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric',
      })
    : null

  async function handleLogout() {
    setLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>

      {/* Profile */}
      <section className="bg-white border border-gray-100 rounded-2xl p-6 mb-4">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Profile</h2>
          <Settings className="w-4 h-4 text-gray-400" />
        </div>
        <div className="mt-3">
          <p className="font-semibold text-gray-900">{profile?.name ?? 'Coach'}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </section>

      {/* Subscription */}
      <section className="bg-white border border-gray-100 rounded-2xl p-6 mb-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Subscription</h2>

        {isActive && tier && tierInfo ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-900">{tierLabels[tier]} Plan</span>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Active</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              ${tierInfo.monthlyPrice}/mo · Renews {periodEnd}
            </p>

            {/* Selected sports */}
            {(tier === 'tier1' || tier === 'tier2') && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Your sport{tier === 'tier2' ? 's' : ''}</p>
                <div className="flex flex-wrap gap-2">
                  {profile.selected_sport_ids.length > 0 ? (
                    profile.selected_sport_ids.map(id => {
                      const sport = SPORTS.find(s => s.id === id)
                      return sport ? (
                        <span key={id} className="flex items-center gap-1.5 text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100">
                          {sport.icon} {sport.label}
                        </span>
                      ) : null
                    })
                  ) : (
                    <Link href="/account/sports" className="text-sm text-blue-600 hover:underline">
                      Select your sport →
                    </Link>
                  )}
                </div>
              </div>
            )}

            {tier === 'tier3' && (
              <div className="flex flex-wrap gap-2 mb-4">
                {SPORTS.map(sport => (
                  <span key={sport.id} className="flex items-center gap-1.5 text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100">
                    {sport.icon} {sport.label}
                  </span>
                ))}
              </div>
            )}

            {/* Manage via Stripe */}
            <a
              href="/api/stripe/portal"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Manage billing & subscription
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        ) : (
          <div>
            <p className="text-gray-500 text-sm mb-4">
              You don&apos;t have an active subscription. Browse 2 drills free or subscribe for full access.
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors"
            >
              View plans
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </section>

      {/* What's included */}
      {isActive && tierInfo && (
        <section className="bg-white border border-gray-100 rounded-2xl p-6 mb-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">What&apos;s included</h2>
          <ul className="flex flex-col gap-2">
            {tierInfo.features.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                {f}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Sign out */}
      <button
        onClick={handleLogout}
        disabled={loggingOut}
        className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 transition-colors mt-2 disabled:opacity-50"
      >
        <LogOut className="w-4 h-4" />
        {loggingOut ? 'Signing out...' : 'Sign out'}
      </button>
    </div>
  )
}
