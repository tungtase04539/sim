import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header user={null} />
      
      <main className="flex-1 py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-dark-900 dark:text-white mb-8">
            Chính sách bảo mật
          </h1>
          
          <div className="glass-card p-8 space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-dark-800 dark:text-white mb-3">
                1. Thu thập thông tin
              </h2>
              <p className="text-dark-600 dark:text-dark-400">
                Chúng tôi thu thập các thông tin sau khi bạn đăng ký và sử dụng dịch vụ:
              </p>
              <ul className="list-disc list-inside text-dark-600 dark:text-dark-400 mt-2 space-y-1">
                <li>Email đăng ký</li>
                <li>Lịch sử giao dịch</li>
                <li>Địa chỉ IP truy cập</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-dark-800 dark:text-white mb-3">
                2. Sử dụng thông tin
              </h2>
              <p className="text-dark-600 dark:text-dark-400">
                Thông tin của bạn được sử dụng để:
              </p>
              <ul className="list-disc list-inside text-dark-600 dark:text-dark-400 mt-2 space-y-1">
                <li>Cung cấp và cải thiện dịch vụ</li>
                <li>Xử lý giao dịch và hoàn tiền</li>
                <li>Gửi thông báo quan trọng</li>
                <li>Phát hiện và ngăn chặn gian lận</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-dark-800 dark:text-white mb-3">
                3. Bảo mật dữ liệu
              </h2>
              <p className="text-dark-600 dark:text-dark-400">
                Chúng tôi áp dụng các biện pháp bảo mật tiêu chuẩn ngành để bảo vệ 
                thông tin của bạn, bao gồm mã hóa SSL/TLS và xác thực hai yếu tố.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-dark-800 dark:text-white mb-3">
                4. Chia sẻ thông tin
              </h2>
              <p className="text-dark-600 dark:text-dark-400">
                Chúng tôi KHÔNG bán hoặc chia sẻ thông tin cá nhân của bạn cho bên thứ ba, 
                ngoại trừ khi được yêu cầu bởi pháp luật.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-dark-800 dark:text-white mb-3">
                5. Quyền của bạn
              </h2>
              <p className="text-dark-600 dark:text-dark-400">
                Bạn có quyền yêu cầu xem, sửa đổi hoặc xóa thông tin cá nhân của mình 
                bằng cách liên hệ với chúng tôi qua email hỗ trợ.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-dark-800 dark:text-white mb-3">
                6. Liên hệ
              </h2>
              <p className="text-dark-600 dark:text-dark-400">
                Nếu bạn có câu hỏi về chính sách bảo mật, vui lòng liên hệ qua 
                Telegram hoặc email hỗ trợ của chúng tôi.
              </p>
            </section>

            <p className="text-sm text-dark-500 pt-4 border-t border-dark-200 dark:border-dark-700">
              Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
