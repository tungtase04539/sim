import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header user={null} />
      
      <main className="flex-1 py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-dark-900 dark:text-white mb-8">
            Điều khoản sử dụng
          </h1>
          
          <div className="prose prose-lg dark:prose-invert">
            <div className="glass-card p-8 space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-dark-800 dark:text-white mb-3">
                  1. Giới thiệu
                </h2>
                <p className="text-dark-600 dark:text-dark-400">
                  Chào mừng bạn đến với OTP Resale. Bằng việc sử dụng dịch vụ của chúng tôi, 
                  bạn đồng ý tuân thủ các điều khoản và điều kiện sau đây.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-dark-800 dark:text-white mb-3">
                  2. Dịch vụ
                </h2>
                <p className="text-dark-600 dark:text-dark-400">
                  OTP Resale cung cấp dịch vụ cho thuê số điện thoại ảo để nhận mã OTP. 
                  Dịch vụ này chỉ được sử dụng cho mục đích hợp pháp.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-dark-800 dark:text-white mb-3">
                  3. Thanh toán & Hoàn tiền
                </h2>
                <ul className="list-disc list-inside text-dark-600 dark:text-dark-400 space-y-2">
                  <li>Thanh toán được thực hiện trước khi sử dụng dịch vụ</li>
                  <li>Hoàn tiền 100% nếu không nhận được OTP trong thời gian quy định</li>
                  <li>Số dư trong tài khoản không được rút về tiền mặt</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-dark-800 dark:text-white mb-3">
                  4. Hành vi bị cấm
                </h2>
                <ul className="list-disc list-inside text-dark-600 dark:text-dark-400 space-y-2">
                  <li>Sử dụng dịch vụ cho mục đích lừa đảo, gian lận</li>
                  <li>Tạo nhiều tài khoản để lợi dụng khuyến mãi</li>
                  <li>Bán lại hoặc chia sẻ tài khoản cho bên thứ ba</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-dark-800 dark:text-white mb-3">
                  5. Giới hạn trách nhiệm
                </h2>
                <p className="text-dark-600 dark:text-dark-400">
                  OTP Resale không chịu trách nhiệm cho bất kỳ thiệt hại nào phát sinh từ 
                  việc sử dụng dịch vụ không đúng mục đích hoặc vi phạm điều khoản.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-dark-800 dark:text-white mb-3">
                  6. Thay đổi điều khoản
                </h2>
                <p className="text-dark-600 dark:text-dark-400">
                  Chúng tôi có quyền thay đổi điều khoản sử dụng bất cứ lúc nào. 
                  Người dùng sẽ được thông báo qua email khi có thay đổi quan trọng.
                </p>
              </section>

              <p className="text-sm text-dark-500 pt-4 border-t border-dark-200 dark:border-dark-700">
                Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
