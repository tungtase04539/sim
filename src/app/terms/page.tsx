import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header user={null} />
      
      <main className="flex-1 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-dark-900 dark:text-white mb-8">
            Điều khoản sử dụng
          </h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div className="glass-card p-8 space-y-6">
              <section>
                <h2 className="text-xl font-bold mb-4">1. Giới thiệu</h2>
                <p className="text-dark-600 dark:text-dark-400">
                  Chào mừng bạn đến với OTP Resale. Bằng việc sử dụng dịch vụ của chúng tôi, 
                  bạn đồng ý tuân thủ các điều khoản và điều kiện được nêu dưới đây.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-4">2. Dịch vụ</h2>
                <p className="text-dark-600 dark:text-dark-400">
                  OTP Resale cung cấp dịch vụ cho thuê số điện thoại ảo để nhận mã OTP. 
                  Dịch vụ chỉ được sử dụng cho mục đích hợp pháp.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-4">3. Thanh toán</h2>
                <p className="text-dark-600 dark:text-dark-400">
                  - Thanh toán được thực hiện qua chuyển khoản ngân hàng<br/>
                  - Số dư được cộng tự động sau 1-3 phút<br/>
                  - Hoàn tiền 100% nếu không nhận được OTP trong thời gian quy định
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-4">4. Trách nhiệm người dùng</h2>
                <p className="text-dark-600 dark:text-dark-400">
                  Người dùng cam kết không sử dụng dịch vụ cho các mục đích:<br/>
                  - Vi phạm pháp luật<br/>
                  - Gian lận, lừa đảo<br/>
                  - Spam hoặc quấy rối
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-4">5. Liên hệ</h2>
                <p className="text-dark-600 dark:text-dark-400">
                  Nếu có thắc mắc về điều khoản sử dụng, vui lòng liên hệ qua Telegram hoặc email.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

