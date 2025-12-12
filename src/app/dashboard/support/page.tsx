import { MessageCircle, Mail, Phone, Clock, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function SupportPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-dark-900 dark:text-white flex items-center gap-3">
          <MessageCircle className="w-8 h-8 text-primary-500" />
          Hỗ trợ
        </h1>
        <p className="text-dark-600 dark:text-dark-400 mt-1">
          Liên hệ với chúng tôi nếu bạn cần giúp đỡ
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Telegram */}
        <a
          href="https://t.me/otpresale"
          target="_blank"
          rel="noopener noreferrer"
          className="glass-card p-6 card-hover group"
        >
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <MessageCircle className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-dark-900 dark:text-white mb-2">
            Telegram
          </h2>
          <p className="text-dark-600 dark:text-dark-400 mb-4">
            Chat trực tiếp với đội ngũ hỗ trợ qua Telegram. Phản hồi nhanh nhất!
          </p>
          <span className="text-primary-600 dark:text-primary-400 font-medium flex items-center gap-2">
            @otpresale
            <ExternalLink className="w-4 h-4" />
          </span>
        </a>

        {/* Email */}
        <a
          href="mailto:support@otpresale.com"
          className="glass-card p-6 card-hover group"
        >
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Mail className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-dark-900 dark:text-white mb-2">
            Email
          </h2>
          <p className="text-dark-600 dark:text-dark-400 mb-4">
            Gửi email cho chúng tôi. Phản hồi trong vòng 24 giờ.
          </p>
          <span className="text-primary-600 dark:text-primary-400 font-medium">
            support@otpresale.com
          </span>
        </a>
      </div>

      {/* FAQ */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-dark-900 dark:text-white mb-6">
          Câu hỏi thường gặp
        </h2>
        
        <div className="space-y-4">
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
              <summary className="flex items-center justify-between cursor-pointer p-4 rounded-xl bg-dark-50 dark:bg-dark-700/50 hover:bg-dark-100 dark:hover:bg-dark-700">
                <span className="font-medium">{item.q}</span>
                <span className="text-2xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="p-4 text-dark-600 dark:text-dark-400">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>

      {/* Working Hours */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <Clock className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-dark-900 dark:text-white">Hỗ trợ 24/7</h3>
            <p className="text-dark-600 dark:text-dark-400">
              Đội ngũ hỗ trợ luôn sẵn sàng phục vụ bạn mọi lúc
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

