import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import DashboardSidebar from '@/components/dashboard/Sidebar'
import DashboardHeader from '@/components/dashboard/Header'

async function getUser() {
  const supabase = await createServerSupabaseClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return null
  }
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  return { user, profile }
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const userData = await getUser()

  if (!userData) {
    redirect('/login')
  }

  const { user, profile } = userData

  // If no profile exists, create one
  if (!profile) {
    const supabase = await createServerSupabaseClient()
    await supabase.from('profiles').insert({
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
      balance: 0,
      role: 'user',
    })
  }

  const displayUser = profile || {
    id: user.id,
    email: user.email,
    full_name: user.email?.split('@')[0] || 'User',
    balance: 0,
    role: 'user',
    api_key: null,
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-900">
      <DashboardSidebar user={{ ...displayUser, email: user.email || '' }} />
      
      <div className="lg:pl-72">
        <DashboardHeader user={{ ...displayUser, email: user.email || '' }} />
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
