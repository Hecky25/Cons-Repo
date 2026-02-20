export type Sport = 'baseball' | 'basketball' | 'hockey' | 'lacrosse' | 'golf'

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced'

export type AgeGroup = '5-7' | '8-10' | '11-13' | '14-18' | 'adult'

export type SubscriptionTier = 'tier1' | 'tier2' | 'tier3'

export type BillingInterval = 'monthly' | 'yearly'

export interface Drill {
  id: string
  title: string
  slug: string
  sport: Sport
  age_groups: AgeGroup[]
  skill_level: SkillLevel
  goal: string
  instructions: string[]
  coaching_cues: string[]
  common_mistakes: string[]
  equipment: string[]
  diagram_url: string | null
  duration_minutes: number
  min_players: number
  max_players: number
  space_needed: string
  variations: {
    easier: string
    harder: string
  }
  safety_notes: string
  focus_tags: string[]
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  name: string | null
  stripe_customer_id: string | null
  subscription_tier: SubscriptionTier | null
  subscription_status: 'active' | 'canceled' | 'past_due' | null
  subscription_period_end: string | null
  selected_sport_ids: Sport[]
  sports_last_changed_at: string | null
  created_at: string
}

export interface DrillFilters {
  sport?: Sport
  age_group?: AgeGroup
  skill_level?: SkillLevel
  focus_tag?: string
  search?: string
}

export const SPORTS: { id: Sport; label: string; icon: string; color: string }[] = [
  { id: 'baseball', label: 'Baseball', icon: '⚾', color: '#E85D04' },
  { id: 'basketball', label: 'Basketball', icon: '🏀', color: '#F77F00' },
  { id: 'hockey', label: 'Hockey', icon: '🏒', color: '#4361EE' },
  { id: 'lacrosse', label: 'Lacrosse', icon: '🥍', color: '#2DC653' },
  { id: 'golf', label: 'Golf', icon: '⛳', color: '#06A77D' },
]

export const AGE_GROUPS: { id: AgeGroup; label: string }[] = [
  { id: '5-7', label: 'Ages 5–7' },
  { id: '8-10', label: 'Ages 8–10' },
  { id: '11-13', label: 'Ages 11–13' },
  { id: '14-18', label: 'Ages 14–18' },
  { id: 'adult', label: 'Adult' },
]

export const SKILL_LEVELS: { id: SkillLevel; label: string }[] = [
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' },
]

export const SUBSCRIPTION_TIERS = {
  tier1: {
    name: 'Single Sport',
    monthlyPrice: 9.99,
    yearlyPrice: 99.99,
    sports: 1,
    description: 'Full access to all drills for 1 sport of your choice',
    features: [
      'All drills for 1 sport',
      'All age groups & skill levels',
      'New drills added regularly',
      'Change sport once per month',
    ],
  },
  tier2: {
    name: 'Dual Sport',
    monthlyPrice: 14.99,
    yearlyPrice: 149.99,
    sports: 2,
    description: 'Full access to all drills for 2 sports of your choice',
    features: [
      'All drills for 2 sports',
      'All age groups & skill levels',
      'New drills added regularly',
      'Change sports once per month',
    ],
  },
  tier3: {
    name: 'All Sports',
    monthlyPrice: 24.99,
    yearlyPrice: 249.99,
    sports: 5,
    description: 'Unlimited access to every drill across all 5 sports',
    features: [
      'All drills for all 5 sports',
      'All age groups & skill levels',
      'New drills added regularly',
      'Practice plan builder (coming soon)',
    ],
  },
}
