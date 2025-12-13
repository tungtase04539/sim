import Link from 'next/link'
import { Phone, Wallet, Shield, Zap } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Phone className="w-8 h-8 text-primary-600" />
            <h1 className="text-2xl font-bold text-dark-900 dark:text-white">OTP Resale</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="px-4 py-2 text-dark-700 dark:text-dark-300 hover:text-primary-600 transition-colors"
            >
              Đăng nhập
            </Link>
            <Link 
              href="/register" 
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Đăng ký
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-dark-900 dark:text-white mb-6">
            Thuê SIM nhận OTP
            <br />
            <span className="text-primary-600">Nhanh chóng - An toàn - Tiện lợi</span>
          </h2>
          <p className="text-xl text-dark-600 dark:text-dark-400 mb-8">
            Dịch vụ cho thuê số điện thoại nhận mã OTP từ các dịch vụ phổ biến như Facebook, Google, Telegram, WhatsApp và nhiều hơn nữa
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link 
              href="/register" 
              className="px-8 py-4 bg-primary-600 text-white rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg"
            >
              Bắt đầu ngay
            </Link>
            <Link 
              href="/dashboard/rent" 
              className="px-8 py-4 bg-white dark:bg-dark-800 text-primary-600 border-2 border-primary-600 rounded-lg text-lg font-semibold hover:bg-primary-50 dark:hover:bg-dark-700 transition-colors"
            >
              Xem dịch vụ
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-dark-900 dark:text-white mb-2">
              Nhanh chóng
            </h3>
            <p className="text-dark-600 dark:text-dark-400">
              Nhận OTP chỉ trong vài giây sau khi đặt hàng
            </p>
          </div>

          <div className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-dark-900 dark:text-white mb-2">
              An toàn
            </h3>
            <p className="text-dark-600 dark:text-dark-400">
              Bảo mật thông tin và giao dịch của bạn
            </p>
          </div>

          <div className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-4">
              <Wallet className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-dark-900 dark:text-white mb-2">
              Dễ dàng
            </h3>
            <p className="text-dark-600 dark:text-dark-400">
              Nạp tiền và sử dụng dịch vụ một cách đơn giản
            </p>
          </div>
        </div>

        {/* Services */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold text-center text-dark-900 dark:text-white mb-8">
            Hỗ trợ các dịch vụ phổ biến
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {['Facebook', 'Google', 'Telegram', 'WhatsApp', 'TikTok', 'Twitter', 'Instagram', 'Shopee'].map((service) => (
              <div 
                key={service}
                className="bg-white dark:bg-dark-800 p-4 rounded-lg text-center font-medium text-dark-700 dark:text-dark-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
              >
                {service}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-20 border-t border-dark-200 dark:border-dark-700">
        <div className="text-center text-dark-600 dark:text-dark-400">
          <p>&copy; 2025 OTP Resale. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
