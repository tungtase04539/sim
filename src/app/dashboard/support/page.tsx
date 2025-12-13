import { MessageCircle, Mail, Phone, Clock, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function SupportPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold text-primary-700 dark:text-primary-300 flex items-center gap-4 mb-3">
          <div className="w-12 h-12 rounded-md bg-gradient-to-br from-primary-500 via-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          Hỗ trợ
        </h1>
        <p className="text-gray-700 dark:text-gray-300 text-lg">
          Liên hệ với chúng tôi nếu bạn cần giúp đỡ
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Telegram */}
        <a
          href="https://t.me/otpresale"
          target="_blank"
          rel="noopener noreferrer"
          className="glass-card-strong p-6 hover:shadow-lg hover:border-primary-400 dark:hover:border-primary-600 transition-all group"
        >
          <div className="w-12 h-12 rounded-md bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 transition-transform shadow-sm">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            Telegram
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Chat trực tiếp với đội ngũ hỗ trợ qua Telegram. Phản hồi nhanh nhất!
          </p>
          <span className="text-primary-600 dark:text-primary-400 font-medium flex items-center gap-2 text-sm">
            @otpresale
            <ExternalLink className="w-3.5 h-3.5" />
          </span>
        </a>

        {/* Email */}
        <a
          href="mailto:support@otpresale.com"
          className="glass-card-strong p-6 hover:shadow-lg hover:border-red-400 dark:hover:border-red-600 transition-all group"
        >
          <div className="w-12 h-12 rounded-md bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mb-4 transition-transform shadow-sm">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            Email
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Gửi email cho chúng tôi. Phản hồi trong vòng 24 giờ.
          </p>
          <span className="text-primary-600 dark:text-primary-400 font-medium text-sm">
            support@otpresale.com
          </span>
        </a>
      </div>

      {/* FAQ */}
      <div className="glass-card-strong p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Câu hỏi thường gặp
        </h2>
        
        <div className="space-y-3">
          {[
            {
              q: 'Làm sao để nạp tiền?',
              a: 'Vào mục "Nạp tiền", chọn số tiền và chuyển khoản theo thông tin hiển thị. Số dư sẽ được cộng tự động sau 1-3 phút.'
            },
            {
              q: 'Không nhận được OTP thì sao?',
              a: 'Nếu không nhận được OTP trong 5 phút, hệ thống sẽ tự động hoàn tiền vào tài khoản của bạn.'
            },
            {
              q: 'Số điện thoại có thể nhận nhiều OTP không?',
              a: 'Mỗi số chỉ nhận được 1 OTP. Nếu cần thêm, bạn cần thuê số mới.'
            },
            {
              q: 'Làm sao để sử dụng API?',
              a: 'Vào mục "API Key" để lấy key, sau đó tham khảo tài liệu API để tích hợp vào hệ thống của bạn.'
            },
          ].map((item, i) => (
            <details key={i} className="group">
              <summary className="flex items-center justify-between cursor-pointer p-4 rounded-md bg-blue-50/50 dark:bg-blue-900/20 hover:bg-blue-100/50 dark:hover:bg-blue-900/30 border border-blue-200/50 dark:border-blue-700/50 transition-all">
                <span className="font-semibold text-sm text-gray-900 dark:text-white">{item.q}</span>
                <span className="text-xl text-primary-600 dark:text-primary-400 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="p-4 text-sm text-gray-700 dark:text-gray-300 bg-white/50 dark:bg-dark-800/50 rounded-b-md">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>

      {/* Working Hours */}
      <div className="glass-card-strong p-6 bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-teal-500/10 border border-green-200/50 dark:border-green-700/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-md bg-green-100 dark:bg-green-900/30 flex items-center justify-center shadow-sm">
            <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-base">Hỗ trợ 24/7</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Đội ngũ hỗ trợ luôn sẵn sàng phục vụ bạn mọi lúc
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

