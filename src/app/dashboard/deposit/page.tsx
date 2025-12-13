'use client'

import { useState, useEffect, useCallback } from 'react'
import { Wallet, Copy, CheckCircle2, Loader2, QrCode, Clock, AlertCircle, RefreshCw } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import Image from 'next/image'

const AMOUNTS = [50000, 100000, 200000, 500000, 1000000, 2000000]

// Bank info - read from environment variables
const BANK_CODE = process.env.NEXT_PUBLIC_BANK_CODE || 'MB'
const BANK_NAME = process.env.NEXT_PUBLIC_BANK_NAME || 'MB Bank'
const BANK_ACCOUNT = process.env.NEXT_PUBLIC_BANK_ACCOUNT || '0326868888'
const BANK_ACCOUNT_NAME = process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME || 'NGUYEN VAN A'

type PaymentStatus = 'pending' | 'checking' | 'completed' | 'expired' | 'error'

export default function DepositPage() {
  const [amount, setAmount] = useState(100000)
  const [customAmount, setCustomAmount] = useState('')
  const [paymentCode, setPaymentCode] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [showQR, setShowQR] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending')
  const [isChecking, setIsChecking] = useState(false)
  const [newBalance, setNewBalance] = useState<number | null>(null)

  const finalAmount = customAmount ? parseInt(customAmount) : amount

  const generatePaymentCode = () => {
    return 'OTP' + Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  // Check payment status
  const checkPaymentStatus = useCallback(async () => {
    if (!paymentCode || paymentStatus === 'completed') return

    setIsChecking(true)
    try {
      const res = await fetch('/api/deposit/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_code: paymentCode })
      })

      const data = await res.json()

      if (data.success) {
        if (data.status === 'completed') {
          setPaymentStatus('completed')
          const balanceAfter = data.data?.balance_after
          if (balanceAfter !== undefined && balanceAfter !== null && !isNaN(balanceAfter)) {
            setNewBalance(balanceAfter)
          }
        } else if (data.status === 'expired') {
          setPaymentStatus('expired')
        }
      }
    } catch (error) {
      console.error('Check payment error:', error)
    }
    setIsChecking(false)
  }, [paymentCode, paymentStatus])

  // Auto-check payment every 10 seconds
  useEffect(() => {
    if (showQR && paymentStatus === 'pending' && countdown > 0) {
      const interval = setInterval(checkPaymentStatus, 10000) // Check every 10 seconds
      return () => clearInterval(interval)
    }
  }, [showQR, paymentStatus, countdown, checkPaymentStatus])

  const handleCreateDeposit = async () => {
    if (finalAmount < 10000) {
      alert('Số tiền tối thiểu là 10,000đ')
      return
    }

    setIsCreating(true)
    setPaymentStatus('pending')
    
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
    setIsChecking(true)
    
    try {
      const res = await fetch('/api/deposit/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: finalAmount, payment_code: paymentCode })
      })
      
      const data = await res.json()
      
      if (data.success) {
        setPaymentStatus('completed')
        const balanceAfter = data.data?.balance_after
        if (balanceAfter !== undefined && balanceAfter !== null && !isNaN(balanceAfter)) {
          setNewBalance(balanceAfter)
        }
      } else {
        alert('Lỗi: ' + data.error)
      }
    } catch (error) {
      alert('Có lỗi xảy ra. Vui lòng thử lại.')
    }
    
    setIsChecking(false)
  }

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
  }

  // Countdown timer
  useEffect(() => {
    if (countdown > 0 && paymentStatus === 'pending') {
      const timer = setInterval(() => setCountdown(c => c - 1), 1000)
      return () => clearInterval(timer)
    } else if (countdown === 0 && showQR && paymentStatus === 'pending') {
      setPaymentStatus('expired')
    }
  }, [countdown, showQR, paymentStatus])

  const formatCountdown = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const resetDeposit = () => {
    setShowQR(false)
    setPaymentCode('')
    setPaymentStatus('pending')
    setNewBalance(null)
    setCountdown(0)
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

      {/* Success Message */}
      {paymentStatus === 'completed' && (
        <div className="glass-card p-6 text-center border-2 border-green-500/50 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl shadow-lg">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center mx-auto mb-4 shadow-md">
            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-xl font-bold text-green-700 dark:text-green-400 mb-2">
            Nạp tiền thành công! 🎉
          </h2>
          <p className="text-sm text-green-600 dark:text-green-300 mb-3">
            Số tiền <strong className="text-base">{formatCurrency(finalAmount)}</strong> đã được cộng vào tài khoản
          </p>
          {newBalance !== null && !isNaN(newBalance) && (
            <div className="mb-4 p-3 rounded-lg bg-white/50 dark:bg-dark-800/50 border border-green-200 dark:border-green-800">
              <p className="text-xs text-green-600 dark:text-green-400 mb-1">Số dư mới</p>
              <p className="text-xl font-bold text-green-700 dark:text-green-300">{formatCurrency(newBalance)}</p>
            </div>
          )}
          <button onClick={resetDeposit} className="btn-primary mt-4 text-sm py-2.5 px-6">
            Nạp thêm tiền
          </button>
        </div>
      )}

      {/* Expired Message */}
      {paymentStatus === 'expired' && (
        <div className="glass-card p-6 text-center border-2 border-orange-500/50 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl shadow-lg">
          <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center mx-auto mb-4 shadow-md">
            <Clock className="w-8 h-8 text-orange-600 dark:text-orange-400" />
          </div>
          <h2 className="text-xl font-bold text-orange-700 dark:text-orange-400 mb-2">
            Yêu cầu đã hết hạn
          </h2>
          <p className="text-sm text-orange-600 dark:text-orange-300 mb-4">
            Vui lòng tạo giao dịch mới để tiếp tục
          </p>
          <button onClick={resetDeposit} className="btn-primary mt-4 text-sm py-2.5 px-6">
            Tạo giao dịch mới
          </button>
        </div>
      )}

      {paymentStatus !== 'completed' && paymentStatus !== 'expired' && (
        <>
          {!showQR ? (
            <>
              {/* Amount Selection */}
              <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-sm border border-dark-200/50 dark:border-dark-700/50 p-6 mb-6">
                <h2 className="text-base font-semibold text-dark-900 dark:text-white mb-5">
                  Chọn số tiền nạp
                </h2>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
                  {AMOUNTS.map((a) => (
                    <button
                      key={a}
                      onClick={() => { setAmount(a); setCustomAmount('') }}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        amount === a && !customAmount
                          ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 shadow-md scale-105'
                          : 'border-dark-200 dark:border-dark-700 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-dark-50 dark:hover:bg-dark-700/50'
                      }`}
                    >
                      <span className={`font-semibold text-sm ${
                        amount === a && !customAmount
                          ? 'text-primary-700 dark:text-primary-300'
                          : 'text-dark-700 dark:text-dark-300'
                      }`}>{formatCurrency(a)}</span>
                    </button>
                  ))}
                </div>

                <div className="pt-4 border-t border-dark-200 dark:border-dark-700">
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                    Hoặc nhập số tiền khác
                  </label>
                  <input
                    type="number"
                    placeholder="Nhập số tiền..."
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                    min="10000"
                    step="10000"
                  />
                  <p className="text-xs text-dark-500 dark:text-dark-400 mt-2">Tối thiểu: 10,000₫</p>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-2xl shadow-lg border-2 border-primary-200 dark:border-primary-800 p-6">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-sm font-medium text-dark-600 dark:text-dark-400">Số tiền nạp:</span>
                  <span className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">{formatCurrency(finalAmount)}</span>
                </div>
                
                <button
                  onClick={handleCreateDeposit}
                  disabled={isCreating || finalAmount < 10000}
                  className="w-full bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
              {/* Payment Status Indicator */}
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-2xl border-2 border-orange-200 dark:border-orange-800 p-5 mb-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {isChecking ? (
                      <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-primary-600 dark:text-primary-400 animate-spin" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full bg-orange-500 dark:bg-orange-400 animate-pulse" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-dark-900 dark:text-white text-base">
                        {isChecking ? 'Đang kiểm tra...' : 'Đang chờ thanh toán'}
                      </p>
                      <p className="text-sm text-dark-500 dark:text-dark-400 mt-0.5">
                        Tự động kiểm tra mỗi 10 giây
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={checkPaymentStatus}
                    disabled={isChecking}
                    className="px-4 py-2 bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-xl hover:bg-dark-50 dark:hover:bg-dark-700 transition-all flex items-center gap-2 text-sm font-medium disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
                    Kiểm tra
                  </button>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-sm border border-dark-200/50 dark:border-dark-700/50 p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-dark-900 dark:text-white">
                    Thông tin chuyển khoản
                  </h2>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    <span className="font-mono text-sm font-semibold text-orange-700 dark:text-orange-300">{formatCountdown(countdown)}</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* QR Code */}
                  <div className="flex flex-col items-center p-6 bg-gradient-to-br from-dark-50 to-dark-100 dark:from-dark-700 dark:to-dark-800 rounded-xl border border-dark-200 dark:border-dark-700">
                    <Image
                      src={qrUrl}
                      alt="QR Code"
                      width={250}
                      height={250}
                      className="rounded-xl shadow-lg"
                      unoptimized
                    />
                    <p className="text-xs text-dark-500 dark:text-dark-400 mt-3 font-medium">Quét mã QR để thanh toán</p>
                  </div>

                  {/* Bank Details */}
                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-dark-50 to-dark-100 dark:from-dark-700 dark:to-dark-800 border border-dark-200 dark:border-dark-700">
                      <p className="text-xs text-dark-500 dark:text-dark-400 mb-2 font-medium">Ngân hàng</p>
                      <p className="font-semibold text-dark-900 dark:text-white">{BANK_NAME}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-gradient-to-br from-dark-50 to-dark-100 dark:from-dark-700 dark:to-dark-800 border border-dark-200 dark:border-dark-700">
                      <p className="text-xs text-dark-500 dark:text-dark-400 mb-2 font-medium">Số tài khoản</p>
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-dark-900 dark:text-white font-mono text-base">{BANK_ACCOUNT}</p>
                        <button onClick={() => copyToClipboard(BANK_ACCOUNT, 'account')} className="p-2 rounded-lg hover:bg-dark-200 dark:hover:bg-dark-600 transition-colors">
                          {copied === 'account' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-primary-600" />}
                        </button>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-gradient-to-br from-dark-50 to-dark-100 dark:from-dark-700 dark:to-dark-800 border border-dark-200 dark:border-dark-700">
                      <p className="text-xs text-dark-500 dark:text-dark-400 mb-2 font-medium">Chủ tài khoản</p>
                      <p className="font-semibold text-dark-900 dark:text-white">{BANK_ACCOUNT_NAME}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-gradient-to-br from-dark-50 to-dark-100 dark:from-dark-700 dark:to-dark-800 border border-dark-200 dark:border-dark-700">
                      <p className="text-xs text-dark-500 dark:text-dark-400 mb-2 font-medium">Số tiền</p>
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-primary-600 dark:text-primary-400 text-xl">{formatCurrency(finalAmount)}</p>
                        <button onClick={() => copyToClipboard(finalAmount.toString(), 'amount')} className="p-2 rounded-lg hover:bg-dark-200 dark:hover:bg-dark-600 transition-colors">
                          {copied === 'amount' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-primary-600" />}
                        </button>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-gradient-to-br from-primary-100 to-blue-100 dark:from-primary-900/30 dark:to-blue-900/30 border-2 border-primary-400 dark:border-primary-600 shadow-md">
                      <p className="text-xs text-primary-700 dark:text-primary-300 mb-2 font-bold">Nội dung chuyển khoản (BẮT BUỘC)</p>
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-bold text-primary-800 dark:text-primary-200 font-mono text-base break-all">{transferContent}</p>
                        <button onClick={() => copyToClipboard(transferContent, 'content')} className="p-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white transition-colors flex-shrink-0">
                          {copied === 'content' ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-xl border-l-4 border-amber-500 dark:border-amber-400 p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-800 dark:text-amber-200 text-sm mb-2">Lưu ý quan trọng</p>
                    <ul className="text-xs text-amber-700 dark:text-amber-300 space-y-1.5">
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500 mt-1">•</span>
                        <span>Nhập ĐÚNG nội dung chuyển khoản để được cộng tiền tự động</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500 mt-1">•</span>
                        <span>Hệ thống sẽ tự động kiểm tra thanh toán mỗi 10 giây</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500 mt-1">•</span>
                        <span>Thời gian xử lý: 1-3 phút sau khi chuyển khoản thành công</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500 mt-1">•</span>
                        <span>Liên hệ hỗ trợ nếu quá 10 phút chưa nhận được tiền</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Test Button */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border-2 border-dashed border-green-400 dark:border-green-600 p-5 mb-6">
                <h3 className="font-semibold text-green-700 dark:text-green-400 mb-2 text-sm">🧪 Chế độ Test</h3>
                <p className="text-xs text-dark-600 dark:text-dark-400 mb-4">
                  Nhấn nút bên dưới để giả lập việc nạp tiền thành công (chỉ dùng để test)
                </p>
                <button
                  onClick={handleSimulateDeposit}
                  disabled={isChecking}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isChecking ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Giả lập nạp tiền thành công
                    </>
                  )}
                </button>
              </div>

              {/* New Deposit */}
              <button
                onClick={resetDeposit}
                className="btn-secondary w-full"
              >
                Tạo giao dịch mới
              </button>
            </>
          )}
        </>
      )}
    </div>
  )
}
