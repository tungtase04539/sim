import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/Sidebar'
import AdminHeader from '@/components/admin/Header'

async function getAdminUser() {
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
  
  if (!profile || profile.role !== 'admin') {
    return { user, profile, isAdmin: false }
  }
  
  return { user, profile, isAdmin: true }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const userData = await getAdminUser()

  if (!userData) {
    redirect('/login')
  }

  if (!userData.isAdmin) {
    redirect('/dashboard/rent')
  }

  const { user, profile } = userData

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-900">
      <AdminSidebar />
      
      <div className="lg:pl-72">
        <AdminHeader user={{ full_name: profile?.full_name || 'Admin', email: user.email || '' }} />
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
