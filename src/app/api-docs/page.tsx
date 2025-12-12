import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import { Code, Copy, Terminal } from 'lucide-react'

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header user={null} />
      
      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-dark-900 dark:text-white mb-4">
              API Documentation
            </h1>
            <p className="text-lg text-dark-600 dark:text-dark-400">
              Tích hợp dịch vụ OTP vào ứng dụng của bạn
            </p>
          </div>

          <div className="space-y-8">
            {/* Authentication */}
            <section className="glass-card p-6">
              <h2 className="text-xl font-bold text-dark-900 dark:text-white mb-4 flex items-center gap-2">
                <Terminal className="w-6 h-6 text-primary-500" />
                Authentication
              </h2>
              <p className="text-dark-600 dark:text-dark-400 mb-4">
                Sử dụng API Key trong header để xác thực:
              </p>
              <pre className="bg-dark-900 text-green-400 p-4 rounded-xl overflow-x-auto">
{`Authorization: Bearer YOUR_API_KEY`}
              </pre>
            </section>

            {/* Get Services */}
            <section className="glass-card p-6">
              <h2 className="text-xl font-bold text-dark-900 dark:text-white mb-4">
                Lấy danh sách dịch vụ
              </h2>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm font-mono">GET</span>
                <code className="text-primary-600">/api/services</code>
              </div>
              <pre className="bg-dark-900 text-green-400 p-4 rounded-xl overflow-x-auto text-sm">
{`// Response
{
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
}`}
              </pre>
            </section>

            {/* Create Order */}
            <section className="glass-card p-6">
              <h2 className="text-xl font-bold text-dark-900 dark:text-white mb-4">
                Thuê số nhận OTP
              </h2>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm font-mono">POST</span>
                <code className="text-primary-600">/api/orders</code>
              </div>
              <pre className="bg-dark-900 text-green-400 p-4 rounded-xl overflow-x-auto text-sm">
{`// Request
{
  "service_id": "uuid",
  "country_id": "uuid"
}

// Response
{
  "success": true,
  "data": {
    "id": "order-uuid",
    "phone_number": "+84912345678",
    "status": "waiting",
    "expires_at": "2024-01-01T00:10:00Z"
  }
}`}
              </pre>
            </section>

            {/* Check Order */}
            <section className="glass-card p-6">
              <h2 className="text-xl font-bold text-dark-900 dark:text-white mb-4">
                Kiểm tra trạng thái đơn
              </h2>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm font-mono">GET</span>
                <code className="text-primary-600">/api/orders/:id</code>
              </div>
              <pre className="bg-dark-900 text-green-400 p-4 rounded-xl overflow-x-auto text-sm">
{`// Response
{
  "success": true,
  "data": {
    "id": "order-uuid",
    "phone_number": "+84912345678",
    "otp_code": "123456",
    "status": "success"
  }
}`}
              </pre>
            </section>

            {/* Cancel Order */}
            <section className="glass-card p-6">
              <h2 className="text-xl font-bold text-dark-900 dark:text-white mb-4">
                Hủy đơn và hoàn tiền
              </h2>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm font-mono">DELETE</span>
                <code className="text-primary-600">/api/orders/:id</code>
              </div>
              <pre className="bg-dark-900 text-green-400 p-4 rounded-xl overflow-x-auto text-sm">
{`// Response
{
  "success": true,
  "message": "Đơn đã được hủy và hoàn tiền"
}`}
              </pre>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

