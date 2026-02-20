import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DrillForm from '@/components/admin/DrillForm'

export default async function NewDrillPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== process.env.ADMIN_EMAIL) redirect('/')

  return <DrillForm mode="new" />
}
