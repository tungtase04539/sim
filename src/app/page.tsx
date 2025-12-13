import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import HeroSection from '@/components/home/HeroSection'
import OTPRentalSection from '@/components/home/OTPRentalSection'
import StatsSection from '@/components/home/StatsSection'
import FeaturesSection from '@/components/home/FeaturesSection'

// Demo mode check
const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || 
  process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://demo.supabase.co'

async function getUser() {
  if (isDemoMode) {
    return { user: null, profile: null }
  }
  
  try {
    const { createServerSupabaseClient } = await import('@/lib/supabase/server')
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    let profile = null
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      profile = data
    }
    
    return { user, profile }
  } catch {
    return { user: null, profile: null }
  }
}

export default async function HomePage() {
  const { user, profile } = await getUser()

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={profile ? {
        email: user?.email || '',
        full_name: profile.full_name,
        balance: profile.balance,
        role: profile.role
      } : null} />
      
      <main className="flex-1">
        <HeroSection />
        <OTPRentalSection isAuthenticated={!!user} />
        <StatsSection />
        <FeaturesSection />
      </main>

      <Footer />
    </div>
  )
}
