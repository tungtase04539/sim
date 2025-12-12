'use client'

import { 
  Zap, 
  Shield, 
  CreditCard, 
  RefreshCw, 
  Headphones, 
  Globe,
  Code,
  Lock
} from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Siêu nhanh',
    description: 'Nhận số điện thoại và mã OTP chỉ trong vài giây. Hệ thống tự động hoá 100%.',
    color: 'bg-yellow-500',
  },
  {
    icon: Shield,
    title: 'An toàn tuyệt đối',
    description: 'Số điện thoại chỉ sử dụng một lần, đảm bảo quyền riêng tư của bạn.',
    color: 'bg-green-500',
  },
  {
    icon: CreditCard,
    title: 'Thanh toán tự động',
    description: 'Nạp tiền qua chuyển khoản ngân hàng, tự động cộng số dư ngay lập tức.',
    color: 'bg-blue-500',
  },
  {
    icon: RefreshCw,
    title: 'Hoàn tiền 100%',
    description: 'Không nhận được OTP? Tiền sẽ được hoàn lại tự động vào tài khoản.',
    color: 'bg-purple-500',
  },
  {
    icon: Headphones,
    title: 'Hỗ trợ 24/7',
    description: 'Đội ngũ hỗ trợ luôn sẵn sàng giải đáp mọi thắc mắc của bạn.',
    color: 'bg-pink-500',
  },
  {
    icon: Globe,
    title: '180+ Quốc gia',
    description: 'Số điện thoại từ hơn 180 quốc gia trên toàn thế giới.',
    color: 'bg-indigo-500',
  },
  {
    icon: Code,
    title: 'API mạnh mẽ',
    description: 'Tích hợp dễ dàng với API RESTful đầy đủ tài liệu.',
    color: 'bg-cyan-500',
  },
  {
    icon: Lock,
    title: 'Bảo mật cao',
    description: 'Mã hoá dữ liệu end-to-end, tuân thủ GDPR và các tiêu chuẩn bảo mật.',
    color: 'bg-red-500',
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-dark-900 dark:text-white mb-4">
            Tại sao chọn <span className="text-gradient">OTP Resale</span>?
          </h2>
          <p className="text-lg text-dark-600 dark:text-dark-400 max-w-2xl mx-auto">
            Chúng tôi cung cấp dịch vụ thuê SIM nhận OTP tốt nhất với giá cả hợp lý và chất lượng dịch vụ tuyệt vời.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-card p-6 card-hover animate-fade-in group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-dark-800 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-dark-600 dark:text-dark-400 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

