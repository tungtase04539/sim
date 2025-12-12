import Link from 'next/link'
import { 
  MessageCircle, 
  Mail, 
  Phone,
  Facebook,
  Github
} from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-dark-900 text-dark-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">O</span>
              </div>
              <span className="text-xl font-bold text-white">OTP Resale</span>
            </div>
            <p className="text-dark-400 mb-4 max-w-md">
              Dịch vụ cho thuê SIM nhận OTP uy tín, nhanh chóng. Hỗ trợ hơn 180+ quốc gia và 1000+ dịch vụ. 
              Thanh toán tự động qua ngân hàng, hoàn tiền 100% nếu không nhận được OTP.
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="https://t.me/otpresale" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-dark-800 hover:bg-primary-600 flex items-center justify-center transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-dark-800 hover:bg-blue-600 flex items-center justify-center transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="mailto:support@otpresale.com"
                className="w-10 h-10 rounded-lg bg-dark-800 hover:bg-red-600 flex items-center justify-center transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Liên kết</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services" className="hover:text-primary-400 transition-colors">
                  Dịch vụ
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-primary-400 transition-colors">
                  Bảng giá
                </Link>
              </li>
              <li>
                <Link href="/api-docs" className="hover:text-primary-400 transition-colors">
                  API Documentation
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-primary-400 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Hỗ trợ</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="hover:text-primary-400 transition-colors">
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary-400 transition-colors">
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary-400 transition-colors">
                  Liên hệ
                </Link>
              </li>
              <li className="flex items-center gap-2 text-primary-400">
                <Phone className="w-4 h-4" />
                <span>Hotline: 24/7</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-dark-500 text-sm">
            © {new Date().getFullYear()} OTP Resale. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-dark-500">
            <span>Chấp nhận thanh toán:</span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-dark-800 rounded text-xs">VietQR</span>
              <span className="px-2 py-1 bg-dark-800 rounded text-xs">Bank Transfer</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

