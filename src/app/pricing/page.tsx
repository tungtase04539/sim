import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import { Check, Zap } from 'lucide-react'
import Link from 'next/link'

const pricingTiers = [
  {
    name: 'Cơ bản',
    description: 'Phù hợp cho người dùng cá nhân',
    price: '0',
    features: [
      'Thuê OTP không giới hạn',
      'Hỗ trợ 180+ quốc gia',
      'Hoàn tiền tự động',
      'Hỗ trợ qua Telegram',
    ],
    cta: 'Bắt đầu miễn phí',
    highlighted: false,
  },
  {
    name: 'Pro',
    description: 'Dành cho developer & doanh nghiệp',
    price: 'API',
    features: [
      'Tất cả tính năng Cơ bản',
      'API không giới hạn',
      'Webhook thông báo',
      'Ưu tiên hỗ trợ 24/7',
      'Dashboard thống kê',
      'Giảm giá theo số lượng',
    ],
    cta: 'Liên hệ',
    highlighted: true,
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header user={null} />
      
      <main className="flex-1 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-dark-900 dark:text-white mb-4">
              Bảng giá <span className="text-gradient">minh bạch</span>
            </h1>
            <p className="text-lg text-dark-600 dark:text-dark-400 max-w-2xl mx-auto">
              Không phí ẩn, chỉ trả tiền khi sử dụng. Giá OTP từ 3,500đ - 10,000đ tùy dịch vụ và quốc gia.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`glass-card p-8 ${
                  tier.highlighted
                    ? 'ring-2 ring-primary-500 shadow-xl shadow-primary-500/20'
                    : ''
                }`}
              >
                {tier.highlighted && (
                  <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 mb-4">
                    <Zap className="w-5 h-5" />
                    <span className="text-sm font-semibold">Phổ biến nhất</span>
                  </div>
                )}
                
                <h2 className="text-2xl font-bold text-dark-900 dark:text-white">
                  {tier.name}
                </h2>
                <p className="text-dark-600 dark:text-dark-400 mt-2">
                  {tier.description}
                </p>
                
                <div className="mt-6 mb-8">
                  <span className="text-4xl font-bold text-dark-900 dark:text-white">
                    {tier.price === '0' ? 'Miễn phí' : tier.price}
                  </span>
                </div>

                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-dark-700 dark:text-dark-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={tier.highlighted ? '/contact' : '/register'}
                  className={`block w-full py-3 text-center rounded-xl font-semibold transition-all ${
                    tier.highlighted
                      ? 'btn-primary'
                      : 'bg-dark-100 dark:bg-dark-700 hover:bg-dark-200 dark:hover:bg-dark-600 text-dark-800 dark:text-white'
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* Service Prices */}
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-dark-900 dark:text-white text-center mb-8">
              Giá thuê OTP theo dịch vụ
            </h2>
            
            <div className="glass-card overflow-hidden">
              <table className="w-full">
                <thead className="bg-dark-50 dark:bg-dark-800">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-medium text-dark-500">Dịch vụ</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-dark-500">Giá (VND)</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-dark-500">Tỷ lệ thành công</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Facebook', icon: '📘', price: 5000, rate: 95 },
                    { name: 'Google', icon: '🔍', price: 6000, rate: 92 },
                    { name: 'Telegram', icon: '✈️', price: 8000, rate: 98 },
                    { name: 'TikTok', icon: '🎵', price: 4500, rate: 90 },
                    { name: 'WhatsApp', icon: '💬', price: 7000, rate: 88 },
                    { name: 'Instagram', icon: '📸', price: 5500, rate: 91 },
                    { name: 'Discord', icon: '🎮', price: 4000, rate: 94 },
                    { name: 'Shopee', icon: '🛒', price: 3500, rate: 96 },
                  ].map((service, i) => (
                    <tr key={service.name} className={i % 2 === 0 ? 'bg-dark-50/50 dark:bg-dark-800/30' : ''}>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-3">
                          <span className="text-xl">{service.icon}</span>
                          <span className="font-medium">{service.name}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-primary-600">
                        {service.price.toLocaleString()}đ
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 text-sm">
                          {service.rate}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
