import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { TrendingUp, Zap } from 'lucide-react'

const SERVICES = [
  { id: '1', name: 'Facebook', code: 'FB', icon: '📘', price: 5000, available: 1250, rate: 95 },
  { id: '2', name: 'Google', code: 'GG', icon: '🔍', price: 6000, available: 890, rate: 92 },
  { id: '3', name: 'Telegram', code: 'TG', icon: '✈️', price: 8000, available: 560, rate: 98 },
  { id: '4', name: 'TikTok', code: 'TT', icon: '🎵', price: 4500, available: 2100, rate: 90 },
  { id: '5', name: 'WhatsApp', code: 'WA', icon: '💬', price: 7000, available: 430, rate: 88 },
  { id: '6', name: 'Instagram', code: 'IG', icon: '📸', price: 5500, available: 780, rate: 91 },
  { id: '7', name: 'Twitter/X', code: 'TW', icon: '🐦', price: 6500, available: 320, rate: 89 },
  { id: '8', name: 'Discord', code: 'DC', icon: '🎮', price: 4000, available: 1800, rate: 94 },
  { id: '9', name: 'Shopee', code: 'SP', icon: '🛒', price: 3500, available: 2500, rate: 96 },
  { id: '10', name: 'Lazada', code: 'LZ', icon: '📦', price: 3500, available: 1900, rate: 95 },
  { id: '11', name: 'Grab', code: 'GR', icon: '🚗', price: 5000, available: 800, rate: 92 },
  { id: '12', name: 'Gojek', code: 'GJ', icon: '🏍️', price: 4500, available: 650, rate: 90 },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header user={null} />
      
      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-dark-900 dark:text-white mb-4">
              Danh sách dịch vụ
            </h1>
            <p className="text-lg text-dark-600 dark:text-dark-400">
              Hỗ trợ hơn 1000+ dịch vụ từ khắp nơi trên thế giới
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {SERVICES.map((service) => (
              <div key={service.id} className="glass-card p-4 card-hover">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{service.icon}</span>
                  <div>
                    <h3 className="font-semibold text-dark-800 dark:text-white">{service.name}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-dark-100 dark:bg-dark-700">
                      {service.code}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary-600 dark:text-primary-400">
                    {formatCurrency(service.price)}
                  </span>
                  <div className="text-right text-sm">
                    <div className="flex items-center gap-1 text-green-600">
                      <TrendingUp className="w-3 h-3" />
                      {service.rate}%
                    </div>
                    <div className="flex items-center gap-1 text-dark-500">
                      <Zap className="w-3 h-3" />
                      {formatNumber(service.available)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

