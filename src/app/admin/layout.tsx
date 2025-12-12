import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/Sidebar'
import AdminHeader from '@/components/admin/Header'

// Demo mode check
const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || 
  process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://demo.supabase.co'

const DEMO_ADMIN = {
  id: 'demo-admin-id',
  email: 'admin@otpresale.com',
  full_name: 'Admin Demo',
  balance: 0,
  role: 'admin' as const,
}

async function getAdminUser() {
  if (isDemoMode) {
    return { user: { email: DEMO_ADMIN.email }, profile: DEMO_ADMIN }
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

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, profile } = await getAdminUser()

  if (!user || !profile) {
    if (!isDemoMode) {
      redirect('/login')
    }
    // Use demo admin in demo mode
    return (
      <div className="min-h-screen bg-dark-50 dark:bg-dark-900">
        <AdminSidebar />
        
        <div className="lg:pl-72">
          <AdminHeader user={{ ...DEMO_ADMIN, email: DEMO_ADMIN.email }} />
          
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    )
  }

  if (profile.role !== 'admin' && !isDemoMode) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-900">
      <AdminSidebar />
      
      <div className="lg:pl-72">
        <AdminHeader user={{ ...profile, email: user.email || '' }} />
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

