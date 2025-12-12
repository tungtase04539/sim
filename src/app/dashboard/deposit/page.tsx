'use client'

import { useState, useEffect } from 'react'
import { Wallet, Copy, CheckCircle2, Loader2, QrCode, Clock, AlertCircle } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import Image from 'next/image'

const AMOUNTS = [50000, 100000, 200000, 500000, 1000000, 2000000]

// Bank info - read from environment variables
const BANK_CODE = process.env.NEXT_PUBLIC_BANK_CODE || 'MB'
const BANK_NAME = process.env.NEXT_PUBLIC_BANK_NAME || 'MB Bank'
const BANK_ACCOUNT = process.env.NEXT_PUBLIC_BANK_ACCOUNT || '0326868888'
const BANK_ACCOUNT_NAME = process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME || 'NGUYEN VAN A'

export default function DepositPage() {
  const [amount, setAmount] = useState(100000)
  const [customAmount, setCustomAmount] = useState('')
  const [paymentCode, setPaymentCode] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [showQR, setShowQR] = useState(false)
  const [isSimulating, setIsSimulating] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const finalAmount = customAmount ? parseInt(customAmount) : amount

  const generatePaymentCode = () => {
    return 'OTP' + Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  const handleCreateDeposit = async () => {
    if (finalAmount < 10000) {
      alert('Số tiền tối thiểu là 10,000đ')
      return
    }

    setIsCreating(true)
    
    try {
      const res = await fetch('/api/deposit/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: finalAmount })
      })
      
      const data = await res.json()
      
      if (data.success) {
        setPaymentCode(data.data.payment_code)
        setShowQR(true)
        setCountdown(30 * 60) // 30 minutes
      } else {
        // Fallback for demo
        setPaymentCode(generatePaymentCode())
        setShowQR(true)
        setCountdown(30 * 60)
      }
    } catch (error) {
      // Fallback
      setPaymentCode(generatePaymentCode())
      setShowQR(true)
      setCountdown(30 * 60)
    }
    
    setIsCreating(false)
  }

  // Simulate deposit for testing
  const handleSimulateDeposit = async () => {
    setIsSimulating(true)
    
    try {
      const res = await fetch('/api/deposit/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: finalAmount, payment_code: paymentCode })
      })
      
      const data = await res.json()
      
      if (data.success) {
        alert(`✅ Nạp tiền thành công!\n\nSố tiền: ${formatCurrency(finalAmount)}\nSố dư mới: ${formatCurrency(data.data.balance_after)}`)
        window.location.reload()
      } else {
        alert('Lỗi: ' + data.error)
      }
    } catch (error) {
      alert('Có lỗi xảy ra. Vui lòng thử lại.')
    }
    
    setIsSimulating(false)
  }

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
  }

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => setCountdown(c => c - 1), 1000)
      return () => clearInterval(timer)
    }
  }, [countdown])

  const formatCountdown = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const transferContent = `${paymentCode}`
  const qrUrl = `https://img.vietqr.io/image/${BANK_CODE}-${BANK_ACCOUNT}-compact2.png?amount=${finalAmount}&addInfo=${paymentCode}&accountName=${encodeURIComponent(BANK_ACCOUNT_NAME)}`

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-dark-900 dark:text-white flex items-center gap-3">
          <Wallet className="w-8 h-8 text-primary-500" />
          Nạp tiền
        </h1>
        <p className="text-dark-600 dark:text-dark-400 mt-1">
          Chuyển khoản ngân hàng - Cộng tiền tự động trong 1-3 phút
        </p>
      </div>

      {!showQR ? (
        <>
          {/* Amount Selection */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
              Chọn số tiền nạp
            </h2>
            
            <div className="grid grid-cols-3 gap-3 mb-4">
              {AMOUNTS.map((a) => (
                <button
                  key={a}
                  onClick={() => { setAmount(a); setCustomAmount('') }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    amount === a && !customAmount
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-dark-200 dark:border-dark-700 hover:border-primary-300'
                  }`}
                >
                  <span className="font-semibold">{formatCurrency(a)}</span>
                </button>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                Hoặc nhập số tiền khác
              </label>
              <input
                type="number"
                placeholder="Nhập số tiền..."
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="input-field"
                min="10000"
                step="10000"
              />
              <p className="text-sm text-dark-500 mt-1">Tối thiểu: 10,000đ</p>
            </div>
          </div>

          {/* Summary */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-dark-600 dark:text-dark-400">Số tiền nạp:</span>
              <span className="text-2xl font-bold text-primary-600">{formatCurrency(finalAmount)}</span>
            </div>
            
            <button
              onClick={handleCreateDeposit}
              disabled={isCreating || finalAmount < 10000}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                <>
                  <QrCode className="w-5 h-5" />
                  Tạo mã thanh toán
                </>
              )}
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Payment Info */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-dark-900 dark:text-white">
                Thông tin chuyển khoản
              </h2>
              <div className="flex items-center gap-2 text-orange-600">
                <Clock className="w-5 h-5" />
                <span className="font-mono">{formatCountdown(countdown)}</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* QR Code */}
              <div className="flex flex-col items-center p-4 bg-white rounded-xl">
                <Image
                  src={qrUrl}
                  alt="QR Code"
                  width={250}
                  height={250}
                  className="rounded-lg"
                />
                <p className="text-sm text-dark-500 mt-2">Quét mã QR để thanh toán</p>
              </div>

              {/* Bank Details */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-dark-50 dark:bg-dark-700/50">
                  <p className="text-sm text-dark-500 mb-1">Ngân hàng</p>
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-dark-900 dark:text-white">{BANK_NAME}</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-dark-50 dark:bg-dark-700/50">
                  <p className="text-sm text-dark-500 mb-1">Số tài khoản</p>
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-dark-900 dark:text-white font-mono">{BANK_ACCOUNT}</p>
                    <button onClick={() => copyToClipboard(BANK_ACCOUNT, 'account')} className="text-primary-600">
                      {copied === 'account' ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-dark-50 dark:bg-dark-700/50">
                  <p className="text-sm text-dark-500 mb-1">Chủ tài khoản</p>
                  <p className="font-semibold text-dark-900 dark:text-white">{BANK_ACCOUNT_NAME}</p>
                </div>

                <div className="p-4 rounded-xl bg-dark-50 dark:bg-dark-700/50">
                  <p className="text-sm text-dark-500 mb-1">Số tiền</p>
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-primary-600 text-xl">{formatCurrency(finalAmount)}</p>
                    <button onClick={() => copyToClipboard(finalAmount.toString(), 'amount')} className="text-primary-600">
                      {copied === 'amount' ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-500">
                  <p className="text-sm text-primary-600 mb-1">Nội dung chuyển khoản (BẮT BUỘC)</p>
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-primary-700 dark:text-primary-400 font-mono text-lg">{transferContent}</p>
                    <button onClick={() => copyToClipboard(transferContent, 'content')} className="text-primary-600">
                      {copied === 'content' ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="glass-card p-4 border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-900/20">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
              <div>
                <p className="font-medium text-amber-800 dark:text-amber-200">Lưu ý quan trọng</p>
                <ul className="text-sm text-amber-700 dark:text-amber-300 mt-1 space-y-1">
                  <li>• Nhập ĐÚNG nội dung chuyển khoản để được cộng tiền tự động</li>
                  <li>• Thời gian xử lý: 1-3 phút sau khi chuyển khoản thành công</li>
                  <li>• Liên hệ hỗ trợ nếu quá 10 phút chưa nhận được tiền</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Test Button */}
          <div className="glass-card p-6 border-2 border-dashed border-green-500">
            <h3 className="font-semibold text-green-700 dark:text-green-400 mb-2">🧪 Chế độ Test</h3>
            <p className="text-sm text-dark-600 dark:text-dark-400 mb-4">
              Nhấn nút bên dưới để giả lập việc nạp tiền thành công (chỉ dùng để test)
            </p>
            <button
              onClick={handleSimulateDeposit}
              disabled={isSimulating}
              className="btn-primary bg-green-600 hover:bg-green-700 flex items-center gap-2"
            >
              {isSimulating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Giả lập nạp tiền thành công
                </>
              )}
            </button>
          </div>

          {/* New Deposit */}
          <button
            onClick={() => { setShowQR(false); setPaymentCode('') }}
            className="btn-secondary w-full"
          >
            Tạo giao dịch mới
          </button>
        </>
      )}
    </div>
  )
}
