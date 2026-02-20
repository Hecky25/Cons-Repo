import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Drill } from '@/types'
import DrillDetail from '@/components/drills/DrillDetail'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: drill } = await supabase
    .from('drills')
    .select('title, goal, sport')
    .eq('slug', slug)
    .single()

  if (!drill) return {}

  return {
    title: `${drill.title} — Practice Lab`,
    description: drill.goal,
  }
}

export default async function DrillPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: drill } = await supabase
    .from('drills')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!drill) notFound()

  // Get the drill's position in the full library (for paywall)
  const { data: allDrills } = await supabase
    .from('drills')
    .select('id')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  const drillIndex = allDrills?.findIndex(d => d.id === drill.id) ?? 0
  const isLocked = drillIndex >= 2

  return <DrillDetail drill={drill as Drill} isLocked={isLocked} />
}
