'use client'

import { useState, useEffect } from 'react'
import { Key, Copy, RefreshCw, CheckCircle2, Eye, EyeOff, Code, Loader2 } from 'lucide-react'
import { generateApiKey } from '@/lib/utils'
import Link from 'next/link'

export default function ApiKeyPage() {
  const [apiKey, setApiKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchApiKey()
  }, [])

  const fetchApiKey = async () => {
    try {
      const res = await fetch('/api/user/api-key')
      const data = await res.json()
      if (data.success && data.data.api_key) {
        setApiKey(data.data.api_key)
      }
    } catch (error) {
      console.error('Failed to fetch API key')
    }
    setIsLoading(false)
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(apiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const regenerateKey = async () => {
    if (!confirm('Bạn có chắc muốn tạo API Key mới? Key cũ sẽ không còn hoạt động.')) return
    
    setIsGenerating(true)
    
    try {
      const res = await fetch('/api/user/api-key', {
        method: 'POST',
      })
      const data = await res.json()
      if (data.success) {
        setApiKey(data.data.api_key)
      }
    } catch (error) {
      // Fallback - generate locally
      const newKey = generateApiKey()
      setApiKey(newKey)
    }
    
    setIsGenerating(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-dark-900 dark:text-white flex items-center gap-3 mb-2">
          <Key className="w-8 h-8 text-primary-500" />
          API Key
        </h1>
        <p className="text-dark-500 dark:text-dark-400">
          Sử dụng API Key để tích hợp dịch vụ OTP vào ứng dụng của bạn
        </p>
      </div>

      {/* API Key Card */}
      <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-sm border border-dark-200/50 dark:border-dark-700/50 p-6">
        <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-5">
          API Key của bạn
        </h2>
        
        {apiKey ? (
          <>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-dark-50 to-dark-100 dark:from-dark-700 dark:to-dark-800 border-2 border-dark-200 dark:border-dark-700">
              <code className="flex-1 font-mono text-xs overflow-x-auto text-dark-900 dark:text-white">
                {showKey ? apiKey : '•'.repeat(40)}
              </code>
              
              <button
                onClick={() => setShowKey(!showKey)}
                className="p-2 rounded-lg hover:bg-dark-200 dark:hover:bg-dark-600 transition-colors"
              >
                {showKey ? <EyeOff className="w-4 h-4 text-dark-600" /> : <Eye className="w-4 h-4 text-dark-600" />}
              </button>
              
              <button
                onClick={copyToClipboard}
                className="p-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white transition-colors"
              >
                {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center gap-4 mt-5">
              <button
                onClick={regenerateKey}
                disabled={isGenerating}
                className="px-4 py-2.5 bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-xl hover:bg-dark-50 dark:hover:bg-dark-700 transition-all flex items-center gap-2 text-sm font-medium shadow-sm disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                Tạo key mới
              </button>
              
              <Link href="/api-docs" className="text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-2 text-sm font-medium">
                <Code className="w-4 h-4" />
                Xem tài liệu API
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Key className="w-16 h-16 mx-auto mb-4 text-dark-300 opacity-40" />
            <p className="text-dark-600 dark:text-dark-400 mb-5 font-medium">Bạn chưa có API Key</p>
            <button
              onClick={regenerateKey}
              disabled={isGenerating}
              className="bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                <>
                  <Key className="w-4 h-4" />
                  Tạo API Key
                </>
              )}
            </button>
          </div>
        )}

        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-2 border-amber-200 dark:border-amber-800">
          <p className="text-amber-800 dark:text-amber-200 text-xs font-medium">
            <strong>⚠️ Bảo mật:</strong> Không chia sẻ API Key với bất kỳ ai. 
            Nếu key bị lộ, hãy tạo key mới ngay lập tức.
          </p>
        </div>
      </div>

      {/* Usage Example */}
      <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-sm border border-dark-200/50 dark:border-dark-700/50 p-6">
        <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-5">
          Ví dụ sử dụng
        </h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2 text-sm text-dark-700 dark:text-dark-300">Thuê số nhận OTP:</h3>
            <div className="bg-gradient-to-br from-dark-900 to-dark-800 rounded-xl p-4 overflow-x-auto border border-dark-700">
              <pre className="text-xs text-gray-300 font-mono">{`curl -X POST https://your-domain.vercel.app/api/orders \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"service_id": "1", "country_id": "1"}'`}</pre>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2 text-sm text-dark-700 dark:text-dark-300">Kiểm tra trạng thái:</h3>
            <div className="bg-gradient-to-br from-dark-900 to-dark-800 rounded-xl p-4 overflow-x-auto border border-dark-700">
              <pre className="text-xs text-gray-300 font-mono">{`curl https://your-domain.vercel.app/api/orders/ORDER_ID \\
  -H "Authorization: Bearer YOUR_API_KEY"`}</pre>
            </div>
          </div>
        </div>
      </div>

      {/* Rate Limits */}
      <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-sm border border-dark-200/50 dark:border-dark-700/50 p-6">
        <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-5">
          Giới hạn API
        </h2>
        
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 border-2 border-primary-200 dark:border-primary-800 text-center shadow-sm">
            <p className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">100</p>
            <p className="text-xs text-dark-500 dark:text-dark-400 mt-2 font-medium">requests/phút</p>
          </div>
          <div className="p-5 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 text-center shadow-sm">
            <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">10,000</p>
            <p className="text-xs text-dark-500 dark:text-dark-400 mt-2 font-medium">requests/ngày</p>
          </div>
          <div className="p-5 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-2 border-purple-200 dark:border-purple-800 text-center shadow-sm">
            <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">∞</p>
            <p className="text-xs text-dark-500 dark:text-dark-400 mt-2 font-medium">đơn hàng/ngày</p>
          </div>
        </div>
      </div>
    </div>
  )
}
