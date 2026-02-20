import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AccountPage from '@/components/account/AccountPage'

export const metadata = {
  title: 'My Account — Practice Lab',
}

export default async function Account() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  return <AccountPage user={user} profile={profile} />
}
