import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header user={null} />
      
      <main className="flex-1 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-dark-900 dark:text-white mb-8">
            Chính sách bảo mật
          </h1>
          
          <div className="glass-card p-8 space-y-6">
            <section>
              <h2 className="text-xl font-bold mb-4 text-dark-900 dark:text-white">
                1. Thu thập thông tin
              </h2>
              <p className="text-dark-600 dark:text-dark-400">
                Chúng tôi thu thập thông tin bạn cung cấp khi đăng ký tài khoản, 
                bao gồm email và thông tin thanh toán.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4 text-dark-900 dark:text-white">
                2. Sử dụng thông tin
              </h2>
              <p className="text-dark-600 dark:text-dark-400">
                Thông tin được sử dụng để:<br/>
                - Cung cấp và cải thiện dịch vụ<br/>
                - Xử lý giao dịch<br/>
                - Liên lạc với bạn về dịch vụ
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4 text-dark-900 dark:text-white">
                3. Bảo mật thông tin
              </h2>
              <p className="text-dark-600 dark:text-dark-400">
                Chúng tôi áp dụng các biện pháp bảo mật tiên tiến để bảo vệ thông tin của bạn, 
                bao gồm mã hóa SSL và các tiêu chuẩn bảo mật ngành.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4 text-dark-900 dark:text-white">
                4. Chia sẻ thông tin
              </h2>
              <p className="text-dark-600 dark:text-dark-400">
                Chúng tôi không bán hoặc chia sẻ thông tin cá nhân của bạn cho bên thứ ba, 
                trừ khi được yêu cầu bởi pháp luật.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4 text-dark-900 dark:text-white">
                5. Liên hệ
              </h2>
              <p className="text-dark-600 dark:text-dark-400">
                Nếu có câu hỏi về chính sách bảo mật, vui lòng liên hệ với chúng tôi 
                qua Telegram hoặc email.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

