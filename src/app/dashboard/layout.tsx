import { redirect } from 'next/navigation'
import DashboardSidebar from '@/components/dashboard/Sidebar'
import DashboardHeader from '@/components/dashboard/Header'

// Demo mode check
const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || 
  process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://demo.supabase.co'

// Demo user data
const DEMO_USER = {
  id: 'demo-user-id',
  email: 'demo@otpresale.com',
  full_name: 'Demo User',
  balance: 500000,
  role: 'admin' as const,
  api_key: 'demo_api_key_123',
  avatar_url: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

async function getUser() {
  if (isDemoMode) {
    return { user: { email: DEMO_USER.email }, profile: DEMO_USER }
  }
  
  try {
    const { createServerSupabaseClient } = await import('@/lib/supabase/server')
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { user: null, profile: null }
    }
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    return { user, profile }
  } catch {
    return { user: null, profile: null }
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, profile } = await getUser()

  if (!user || !profile) {
    if (!isDemoMode) {
      redirect('/login')
    }
    // Use demo user in demo mode
    return (
      <div className="min-h-screen bg-dark-50 dark:bg-dark-900">
        <DashboardSidebar user={{ ...DEMO_USER, email: DEMO_USER.email }} />
        
        <div className="lg:pl-72">
          <DashboardHeader user={{ ...DEMO_USER, email: DEMO_USER.email }} />
          
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-900">
      <DashboardSidebar user={{ ...profile, email: user.email || '' }} />
      
      <div className="lg:pl-72">
        <DashboardHeader user={{ ...profile, email: user.email || '' }} />
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

