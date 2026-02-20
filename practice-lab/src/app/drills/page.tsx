import { createClient } from '@/lib/supabase/server'
import DrillLibrary from '@/components/drills/DrillLibrary'
import { Drill } from '@/types'

export const metadata = {
  title: 'Drill Library — Practice Lab',
  description: 'Browse hundreds of structured coaching drills by sport, age group, and skill level.',
}

export default async function DrillsPage({
  searchParams,
}: {
  searchParams: Promise<{ sport?: string; age_group?: string; skill_level?: string; search?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('drills')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (params.sport) {
    query = query.eq('sport', params.sport)
  }
  if (params.skill_level) {
    query = query.eq('skill_level', params.skill_level)
  }
  if (params.age_group) {
    query = query.contains('age_groups', [params.age_group])
  }
  if (params.search) {
    query = query.ilike('title', `%${params.search}%`)
  }

  const { data: drills } = await query

  return <DrillLibrary drills={(drills as Drill[]) ?? []} filters={params} />
}
