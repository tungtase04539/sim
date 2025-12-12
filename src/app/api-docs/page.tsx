import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import { Code, Copy, CheckCircle2 } from 'lucide-react'

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header user={null} />
      
      <main className="flex-1 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Code className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-dark-900 dark:text-white">
                API Documentation
              </h1>
            </div>
            <p className="text-dark-600 dark:text-dark-400">
              Tích hợp dịch vụ OTP vào ứng dụng của bạn với API đơn giản.
            </p>
          </div>

          {/* Authentication */}
          <section className="glass-card p-6 mb-8">
            <h2 className="text-xl font-bold text-dark-900 dark:text-white mb-4">
              🔐 Authentication
            </h2>
            <p className="text-dark-600 dark:text-dark-400 mb-4">
              Sử dụng API Key trong header của mỗi request:
            </p>
            <div className="bg-dark-900 rounded-xl p-4 font-mono text-sm text-green-400 overflow-x-auto">
              <code>Authorization: Bearer YOUR_API_KEY</code>
            </div>
            <p className="text-sm text-dark-500 mt-3">
              Lấy API Key tại: Dashboard → API Key
            </p>
          </section>

          {/* Endpoints */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold text-dark-900 dark:text-white">
              📡 Endpoints
            </h2>

            {/* Get Services */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 text-sm font-mono font-bold">
                  GET
                </span>
                <code className="text-dark-800 dark:text-dark-200">/api/services</code>
              </div>
              <p className="text-dark-600 dark:text-dark-400 mb-4">
                Lấy danh sách tất cả dịch vụ có sẵn
              </p>
              <div className="bg-dark-900 rounded-xl p-4 font-mono text-sm overflow-x-auto">
                <pre className="text-gray-300">{`{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Facebook",
      "code": "FB",
      "price": 5000,
      "available_numbers": 1250
    }
  ]
}`}</pre>
              </div>
            </div>

            {/* Get Countries */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 text-sm font-mono font-bold">
                  GET
                </span>
                <code className="text-dark-800 dark:text-dark-200">/api/countries</code>
              </div>
              <p className="text-dark-600 dark:text-dark-400 mb-4">
                Lấy danh sách quốc gia hỗ trợ
              </p>
            </div>

            {/* Create Order */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 text-sm font-mono font-bold">
                  POST
                </span>
                <code className="text-dark-800 dark:text-dark-200">/api/orders</code>
              </div>
              <p className="text-dark-600 dark:text-dark-400 mb-4">
                Tạo đơn thuê số nhận OTP
              </p>
              <h4 className="font-semibold text-dark-800 dark:text-dark-200 mb-2">Request Body:</h4>
              <div className="bg-dark-900 rounded-xl p-4 font-mono text-sm overflow-x-auto mb-4">
                <pre className="text-gray-300">{`{
  "service_id": "uuid",
  "country_id": "uuid"
}`}</pre>
              </div>
              <h4 className="font-semibold text-dark-800 dark:text-dark-200 mb-2">Response:</h4>
              <div className="bg-dark-900 rounded-xl p-4 font-mono text-sm overflow-x-auto">
                <pre className="text-gray-300">{`{
  "success": true,
  "data": {
    "order_id": "uuid",
    "phone_number": "+84912345678",
    "status": "waiting",
    "expires_at": "2024-01-01T00:05:00Z"
  }
}`}</pre>
              </div>
            </div>

            {/* Check Order */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 text-sm font-mono font-bold">
                  GET
                </span>
                <code className="text-dark-800 dark:text-dark-200">/api/orders/:id</code>
              </div>
              <p className="text-dark-600 dark:text-dark-400 mb-4">
                Kiểm tra trạng thái đơn hàng và lấy mã OTP
              </p>
              <div className="bg-dark-900 rounded-xl p-4 font-mono text-sm overflow-x-auto">
                <pre className="text-gray-300">{`{
  "success": true,
  "data": {
    "order_id": "uuid",
    "phone_number": "+84912345678",
    "otp_code": "123456",
    "status": "success"
  }
}`}</pre>
              </div>
            </div>

            {/* Cancel Order */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 text-sm font-mono font-bold">
                  DELETE
                </span>
                <code className="text-dark-800 dark:text-dark-200">/api/orders/:id</code>
              </div>
              <p className="text-dark-600 dark:text-dark-400 mb-4">
                Hủy đơn hàng (hoàn tiền nếu chưa nhận OTP)
              </p>
            </div>
          </section>

          {/* Status Codes */}
          <section className="glass-card p-6 mt-8">
            <h2 className="text-xl font-bold text-dark-900 dark:text-white mb-4">
              📊 Status Codes
            </h2>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 rounded bg-green-100 text-green-600 font-mono text-sm">200</span>
                <span>Thành công</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-600 font-mono text-sm">400</span>
                <span>Bad Request - Thiếu tham số</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 rounded bg-red-100 text-red-600 font-mono text-sm">401</span>
                <span>Unauthorized - API Key không hợp lệ</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 rounded bg-red-100 text-red-600 font-mono text-sm">402</span>
                <span>Insufficient Balance - Không đủ số dư</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 rounded bg-red-100 text-red-600 font-mono text-sm">404</span>
                <span>Not Found - Không tìm thấy</span>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
