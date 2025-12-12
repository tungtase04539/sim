import { redirect } from 'next/navigation'
import DashboardSidebar from '@/components/dashboard/Sidebar'
import DashboardHeader from '@/components/dashboard/Header'

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
  // Always try to get real user first
  try {
    const { createServerSupabaseClient } = await import('@/lib/supabase/server')
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      // Return demo user if no authenticated user
      return { user: { email: DEMO_USER.email }, profile: DEMO_USER, isDemo: true }
    }
    
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (profileError || !profile) {
      // User exists but no profile - might need to create one or use demo
      return { user: { email: DEMO_USER.email }, profile: DEMO_USER, isDemo: true }
    }
    
    return { user, profile, isDemo: false }
  } catch (error) {
    console.error('Dashboard auth error:', error)
    // Fallback to demo mode on any error
    return { user: { email: DEMO_USER.email }, profile: DEMO_USER, isDemo: true }
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, profile, isDemo } = await getUser()

  const displayUser = profile || DEMO_USER

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-900">
      <DashboardSidebar user={{ ...displayUser, email: user?.email || DEMO_USER.email }} />
      
      <div className="lg:pl-72">
        <DashboardHeader user={{ ...displayUser, email: user?.email || DEMO_USER.email }} />
        
        <main className="p-6">
          {isDemo && (
            <div className="mb-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200">
              <p className="font-medium">🔔 Chế độ Demo</p>
              <p className="text-sm mt-1">Bạn đang xem giao diện demo. <a href="/login" className="underline">Đăng nhập</a> để sử dụng đầy đủ tính năng.</p>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  )
}

