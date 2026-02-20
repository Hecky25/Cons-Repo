import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import DrillForm from '@/components/admin/DrillForm'
import { Drill } from '@/types'

export default async function EditDrillPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== process.env.ADMIN_EMAIL) redirect('/')

  const { data: drill } = await supabase
    .from('drills')
    .select('*')
    .eq('id', id)
    .single()

  if (!drill) notFound()

  return <DrillForm mode="edit" drill={drill as Drill} />
}
