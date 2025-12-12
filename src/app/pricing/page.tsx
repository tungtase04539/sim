import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import { Check, Zap } from 'lucide-react'
import Link from 'next/link'

const PRICING_TIERS = [
  {
    name: 'Cơ bản',
    price: 0,
    description: 'Dành cho người dùng mới bắt đầu',
    features: [
      'Thuê OTP không giới hạn',
      'Hỗ trợ 180+ quốc gia',
      'Hoàn tiền 100% nếu thất bại',
      'Hỗ trợ qua Telegram',
    ],
    cta: 'Bắt đầu miễn phí',
    popular: false,
  },
  {
    name: 'Pro',
    price: 500000,
    description: 'Dành cho người dùng thường xuyên',
    features: [
      'Tất cả tính năng Cơ bản',
      'API không giới hạn',
      'Ưu tiên nhận số',
      'Hỗ trợ 24/7',
      'Giảm 10% phí thuê',
    ],
    cta: 'Nâng cấp Pro',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: null,
    description: 'Giải pháp cho doanh nghiệp',
    features: [
      'Tất cả tính năng Pro',
      'Dedicated support',
      'SLA 99.9%',
      'Custom integration',
      'Volume discount',
    ],
    cta: 'Liên hệ',
    popular: false,
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header user={null} />
      
      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-dark-900 dark:text-white mb-4">
              Bảng giá dịch vụ
            </h1>
            <p className="text-lg text-dark-600 dark:text-dark-400">
              Thanh toán theo lượt sử dụng, không phí ẩn
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PRICING_TIERS.map((tier) => (
              <div 
                key={tier.name}
                className={`glass-card p-6 relative ${
                  tier.popular ? 'border-2 border-primary-500 shadow-xl shadow-primary-500/20' : ''
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary-500 text-white text-sm font-medium rounded-full flex items-center gap-1">
                    <Zap className="w-4 h-4" />
                    Phổ biến
                  </div>
                )}
                
                <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-2">
                  {tier.name}
                </h3>
                <p className="text-dark-600 dark:text-dark-400 text-sm mb-4">
                  {tier.description}
                </p>
                
                <div className="mb-6">
                  {tier.price !== null ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-dark-900 dark:text-white">
                        {tier.price === 0 ? 'Miễn phí' : `${(tier.price / 1000).toFixed(0)}K`}
                      </span>
                      {tier.price > 0 && (
                        <span className="text-dark-500">/tháng</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-3xl font-bold text-dark-900 dark:text-white">
                      Liên hệ
                    </span>
                  )}
                </div>

                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-dark-600 dark:text-dark-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/register"
                  className={`block w-full py-3 rounded-xl font-semibold text-center transition-all ${
                    tier.popular
                      ? 'btn-primary'
                      : 'bg-dark-100 dark:bg-dark-700 hover:bg-dark-200 dark:hover:bg-dark-600 text-dark-700 dark:text-dark-200'
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-16 glass-card p-8 max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-dark-900 dark:text-white mb-4">
              Giá thuê OTP theo dịch vụ
            </h2>
            <p className="text-dark-600 dark:text-dark-400 mb-6">
              Giá thuê OTP dao động từ 3,000đ - 15,000đ tùy dịch vụ và quốc gia.
              Xem chi tiết tại trang Dịch vụ.
            </p>
            <Link href="/services" className="btn-primary inline-block">
              Xem danh sách dịch vụ
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

