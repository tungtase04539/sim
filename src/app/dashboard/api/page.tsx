'use client'

import { useState } from 'react'
import { Key, Copy, RefreshCw, CheckCircle2, Eye, EyeOff, Code } from 'lucide-react'
import { generateApiKey } from '@/lib/utils'
import Link from 'next/link'

export default function ApiKeyPage() {
  const [apiKey, setApiKey] = useState('otp_demo_xxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  const [showKey, setShowKey] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(apiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const regenerateKey = async () => {
    if (!confirm('Bạn có chắc muốn tạo API Key mới? Key cũ sẽ không còn hoạt động.')) return
    
    setIsGenerating(true)
    await new Promise(r => setTimeout(r, 1000))
    setApiKey(generateApiKey())
    setIsGenerating(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-dark-900 dark:text-white flex items-center gap-3">
          <Key className="w-8 h-8 text-primary-500" />
          API Key
        </h1>
        <p className="text-dark-600 dark:text-dark-400 mt-1">
          Sử dụng API Key để tích hợp dịch vụ OTP vào ứng dụng của bạn
        </p>
      </div>

      {/* API Key Card */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
          API Key của bạn
        </h2>
        
        <div className="flex items-center gap-3 p-4 rounded-xl bg-dark-100 dark:bg-dark-700">
          <code className="flex-1 font-mono text-sm overflow-hidden">
            {showKey ? apiKey : '•'.repeat(40)}
          </code>
          
          <button
            onClick={() => setShowKey(!showKey)}
            className="p-2 rounded-lg hover:bg-dark-200 dark:hover:bg-dark-600"
          >
            {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
          
          <button
            onClick={copyToClipboard}
            className="p-2 rounded-lg hover:bg-dark-200 dark:hover:bg-dark-600"
          >
            {copied ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>

        <div className="flex items-center gap-4 mt-4">
          <button
            onClick={regenerateKey}
            disabled={isGenerating}
            className="btn-secondary flex items-center gap-2"
          >
            <RefreshCw className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
            Tạo key mới
          </button>
          
          <Link href="/api-docs" className="text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-2">
            <Code className="w-5 h-5" />
            Xem tài liệu API
          </Link>
        </div>

        <div className="mt-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <p className="text-amber-800 dark:text-amber-200 text-sm">
            <strong>⚠️ Bảo mật:</strong> Không chia sẻ API Key với bất kỳ ai. 
            Nếu key bị lộ, hãy tạo key mới ngay lập tức.
          </p>
        </div>
      </div>

      {/* Usage Example */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
          Ví dụ sử dụng
        </h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Thuê số nhận OTP:</h3>
            <div className="bg-dark-900 rounded-xl p-4 overflow-x-auto">
              <pre className="text-sm text-gray-300">{`curl -X POST https://sim-five-red.vercel.app/api/orders \\
  -H "Authorization: Bearer ${showKey ? apiKey : 'YOUR_API_KEY'}" \\
  -H "Content-Type: application/json" \\
  -d '{"service_id": "xxx", "country_id": "xxx"}'`}</pre>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Kiểm tra trạng thái:</h3>
            <div className="bg-dark-900 rounded-xl p-4 overflow-x-auto">
              <pre className="text-sm text-gray-300">{`curl https://sim-five-red.vercel.app/api/orders/ORDER_ID \\
  -H "Authorization: Bearer ${showKey ? apiKey : 'YOUR_API_KEY'}"`}</pre>
            </div>
          </div>
        </div>
      </div>

      {/* Rate Limits */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
          Giới hạn API
        </h2>
        
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-dark-50 dark:bg-dark-700/50 text-center">
            <p className="text-3xl font-bold text-primary-600">100</p>
            <p className="text-sm text-dark-500">requests/phút</p>
          </div>
          <div className="p-4 rounded-xl bg-dark-50 dark:bg-dark-700/50 text-center">
            <p className="text-3xl font-bold text-primary-600">10,000</p>
            <p className="text-sm text-dark-500">requests/ngày</p>
          </div>
          <div className="p-4 rounded-xl bg-dark-50 dark:bg-dark-700/50 text-center">
            <p className="text-3xl font-bold text-primary-600">∞</p>
            <p className="text-sm text-dark-500">đơn hàng/ngày</p>
          </div>
        </div>
      </div>
    </div>
  )
}

