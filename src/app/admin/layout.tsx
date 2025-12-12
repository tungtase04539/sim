import AdminSidebar from '@/components/admin/Sidebar'
import AdminHeader from '@/components/admin/Header'

const DEMO_ADMIN = {
  id: 'demo-admin-id',
  email: 'admin@otpresale.com',
  full_name: 'Admin Demo',
  balance: 0,
  role: 'admin' as const,
}

async function getAdminUser() {
  try {
    const { createServerSupabaseClient } = await import('@/lib/supabase/server')
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { user: { email: DEMO_ADMIN.email }, profile: DEMO_ADMIN, isDemo: true }
    }
    
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (profileError || !profile) {
      return { user: { email: DEMO_ADMIN.email }, profile: DEMO_ADMIN, isDemo: true }
    }
    
    return { user, profile, isDemo: false }
  } catch (error) {
    console.error('Admin auth error:', error)
    return { user: { email: DEMO_ADMIN.email }, profile: DEMO_ADMIN, isDemo: true }
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, profile, isDemo } = await getAdminUser()

  const displayUser = profile || DEMO_ADMIN

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-900">
      <AdminSidebar />
      
      <div className="lg:pl-72">
        <AdminHeader user={{ ...displayUser, email: user?.email || DEMO_ADMIN.email }} />
        
        <main className="p-6">
          {isDemo && (
            <div className="mb-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200">
              <p className="font-medium">🔔 Chế độ Demo Admin</p>
              <p className="text-sm mt-1">Bạn đang xem giao diện demo. <a href="/login" className="underline">Đăng nhập</a> với tài khoản admin để quản lý hệ thống.</p>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  )
}

