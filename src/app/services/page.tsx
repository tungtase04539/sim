import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import OTPRentalSection from '@/components/home/OTPRentalSection'

export default function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header user={null} />
      <main className="flex-1">
        <OTPRentalSection isAuthenticated={false} />
      </main>
      <Footer />
    </div>
  )
}
