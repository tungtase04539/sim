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
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold gradient-text flex items-center gap-4 mb-3 drop-shadow-lg">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 via-blue-500 to-purple-500 flex items-center justify-center shadow-2xl animate-pulse-glow">
            <Wallet className="w-6 h-6 text-white drop-shadow-lg" />
          </div>
          Nạp tiền
        </h1>
        <p className="text-white/80 text-lg drop-shadow-md">
          Chuyển khoản ngân hàng - Cộng tiền tự động trong 1-3 phút
        </p>
      </div>

      {/* Success Message */}
      {paymentStatus === 'completed' && (
        <div className="glass-card-strong p-8 text-center border-2 border-green-400/50 bg-gradient-to-br from-green-500/20 via-emerald-500/20 to-teal-500/20 rounded-3xl shadow-2xl animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-2xl animate-pulse-glow">
            <CheckCircle2 className="w-10 h-10 text-white drop-shadow-lg" />
          </div>
          <h2 className="text-3xl font-bold gradient-text mb-3 drop-shadow-lg">
            Nạp tiền thành công! 🎉
          </h2>
          <p className="text-base text-white/90 mb-4 drop-shadow-md">
            Số tiền <strong className="text-lg text-white font-bold">{formatCurrency(finalAmount)}</strong> đã được cộng vào tài khoản
          </p>
          {newBalance !== null && !isNaN(newBalance) && (
            <div className="mb-6 p-5 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/30 shadow-xl">
              <p className="text-xs text-white/70 mb-2 uppercase tracking-wider font-semibold">Số dư mới</p>
              <p className="text-3xl font-bold gradient-text">{formatCurrency(newBalance)}</p>
            </div>
          )}
          <button onClick={resetDeposit} className="btn-primary mt-6 text-base py-4 px-8">
            Nạp thêm tiền
          </button>
        </div>
      )}

      {/* Expired Message */}
      {paymentStatus === 'expired' && (
        <div className="glass-card-strong p-8 text-center border-2 border-orange-400/50 bg-gradient-to-br from-orange-500/20 via-amber-500/20 to-yellow-500/20 rounded-3xl shadow-2xl animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mx-auto mb-6 shadow-2xl animate-pulse-glow">
            <Clock className="w-10 h-10 text-white drop-shadow-lg" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3 drop-shadow-lg">
            Yêu cầu đã hết hạn
          </h2>
          <p className="text-base text-white/80 mb-6 drop-shadow-md">
            Vui lòng tạo giao dịch mới để tiếp tục
          </p>
          <button onClick={resetDeposit} className="btn-primary mt-6 text-base py-4 px-8">
            Tạo giao dịch mới
          </button>
        </div>
      )}

      {paymentStatus !== 'completed' && paymentStatus !== 'expired' && (
        <>
          {!showQR ? (
            <>
              {/* Amount Selection */}
              <div className="glass-card-strong p-8 mb-8">
                <h2 className="text-xl font-bold text-white mb-6 drop-shadow-md">
                  Chọn số tiền nạp
                </h2>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                  {AMOUNTS.map((a, index) => (
                    <button
                      key={a}
                      onClick={() => { setAmount(a); setCustomAmount('') }}
                      className={`p-5 rounded-2xl border-2 transition-all duration-300 backdrop-blur-xl ${
                        amount === a && !customAmount
                          ? 'border-white/50 bg-gradient-to-br from-primary-500/30 via-blue-500/30 to-purple-500/30 shadow-2xl scale-105 glow-effect'
                          : 'border-white/20 bg-white/10 hover:border-white/40 hover:bg-white/20 hover:scale-105'
                      }`}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <span className={`font-bold text-base ${
                        amount === a && !customAmount
                          ? 'text-white drop-shadow-lg'
                          : 'text-white/80'
                      }`}>{formatCurrency(a)}</span>
                    </button>
                  ))}
                </div>

                <div className="pt-6 border-t border-white/20">
                  <label className="block text-sm font-semibold text-white/90 mb-3 uppercase tracking-wider">
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
                  <p className="text-xs text-white/60 mt-3 font-medium">Tối thiểu: 10,000₫</p>
                </div>
              </div>

              {/* Summary */}
              <div className="glass-card-strong p-8 bg-gradient-to-br from-primary-500/20 via-blue-500/20 to-purple-500/20 border-2 border-white/30">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-base font-semibold text-white/90 uppercase tracking-wider">Số tiền nạp:</span>
                  <span className="text-4xl font-bold gradient-text drop-shadow-lg">{formatCurrency(finalAmount)}</span>
                </div>
                
                <button
                  onClick={handleCreateDeposit}
                  disabled={isCreating || finalAmount < 10000}
                  className="btn-primary w-full text-base py-4 px-8"
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
              <div className="glass-card-strong p-6 mb-8 bg-gradient-to-br from-orange-500/20 via-amber-500/20 to-yellow-500/20 border-2 border-white/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    {isChecking ? (
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500/30 to-blue-500/30 flex items-center justify-center shadow-xl">
                        <Loader2 className="w-7 h-7 text-white animate-spin drop-shadow-lg" />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/30 to-amber-500/30 flex items-center justify-center shadow-xl animate-pulse-glow">
                        <div className="w-5 h-5 rounded-full bg-white animate-pulse" />
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-white text-lg drop-shadow-md">
                        {isChecking ? 'Đang kiểm tra...' : 'Đang chờ thanh toán'}
                      </p>
                      <p className="text-sm text-white/80 mt-1 drop-shadow-sm">
                        Tự động kiểm tra mỗi 10 giây
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={checkPaymentStatus}
                    disabled={isChecking}
                    className="btn-secondary px-5 py-3 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
                    Kiểm tra
                  </button>
                </div>
              </div>

              {/* Payment Info */}
              <div className="glass-card-strong p-8 mb-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-white drop-shadow-md">
                    Thông tin chuyển khoản
                  </h2>
                  <div className="flex items-center gap-3 px-4 py-2.5 backdrop-blur-xl bg-orange-500/20 border border-white/30 rounded-2xl shadow-lg">
                    <Clock className="w-5 h-5 text-white drop-shadow-lg" />
                    <span className="font-mono text-lg font-bold text-white drop-shadow-lg">{formatCountdown(countdown)}</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* QR Code */}
                  <div className="flex flex-col items-center p-8 backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl">
                    <Image
                      src={qrUrl}
                      alt="QR Code"
                      width={280}
                      height={280}
                      className="rounded-2xl shadow-2xl border-2 border-white/30"
                      unoptimized
                    />
                    <p className="text-sm text-white/80 mt-4 font-semibold drop-shadow-md">Quét mã QR để thanh toán</p>
                  </div>

                  {/* Bank Details */}
                  <div className="space-y-4">
                    <div className="p-5 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/15 transition-all">
                      <p className="text-xs text-white/70 mb-2 uppercase tracking-wider font-semibold">Ngân hàng</p>
                      <p className="font-bold text-white text-lg drop-shadow-md">{BANK_NAME}</p>
                    </div>

                    <div className="p-5 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/15 transition-all">
                      <p className="text-xs text-white/70 mb-2 uppercase tracking-wider font-semibold">Số tài khoản</p>
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-white font-mono text-xl drop-shadow-md">{BANK_ACCOUNT}</p>
                        <button onClick={() => copyToClipboard(BANK_ACCOUNT, 'account')} className="p-2.5 rounded-xl backdrop-blur-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all hover:scale-110">
                          {copied === 'account' ? <CheckCircle2 className="w-5 h-5 text-green-300" /> : <Copy className="w-5 h-5 text-white" />}
                        </button>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/15 transition-all">
                      <p className="text-xs text-white/70 mb-2 uppercase tracking-wider font-semibold">Chủ tài khoản</p>
                      <p className="font-bold text-white text-lg drop-shadow-md">{BANK_ACCOUNT_NAME}</p>
                    </div>

                    <div className="p-5 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/15 transition-all">
                      <p className="text-xs text-white/70 mb-2 uppercase tracking-wider font-semibold">Số tiền</p>
                      <div className="flex items-center justify-between">
                        <p className="font-bold gradient-text text-2xl drop-shadow-lg">{formatCurrency(finalAmount)}</p>
                        <button onClick={() => copyToClipboard(finalAmount.toString(), 'amount')} className="p-2.5 rounded-xl backdrop-blur-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all hover:scale-110">
                          {copied === 'amount' ? <CheckCircle2 className="w-5 h-5 text-green-300" /> : <Copy className="w-5 h-5 text-white" />}
                        </button>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-primary-500/30 via-blue-500/30 to-purple-500/30 border-2 border-white/40 shadow-2xl glow-effect">
                      <p className="text-xs text-white mb-3 uppercase tracking-wider font-bold">Nội dung chuyển khoản (BẮT BUỘC)</p>
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-bold text-white font-mono text-lg break-all drop-shadow-md">{transferContent}</p>
                        <button onClick={() => copyToClipboard(transferContent, 'content')} className="p-3 rounded-xl bg-gradient-to-r from-primary-500 to-blue-500 hover:from-primary-600 hover:to-blue-600 text-white transition-all hover:scale-110 shadow-lg flex-shrink-0">
                          {copied === 'content' ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className="glass-card-strong p-6 mb-8 bg-gradient-to-br from-amber-500/20 via-yellow-500/20 to-orange-500/20 border-l-4 border-amber-400 rounded-3xl">
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-amber-300 flex-shrink-0 mt-1 drop-shadow-lg" />
                  <div>
                    <p className="font-bold text-white text-base mb-3 drop-shadow-md">Lưu ý quan trọng</p>
                    <ul className="text-sm text-white/90 space-y-2.5">
                      <li className="flex items-start gap-3">
                        <span className="text-amber-300 mt-1 font-bold">•</span>
                        <span className="drop-shadow-sm">Nhập ĐÚNG nội dung chuyển khoản để được cộng tiền tự động</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-amber-300 mt-1 font-bold">•</span>
                        <span className="drop-shadow-sm">Hệ thống sẽ tự động kiểm tra thanh toán mỗi 10 giây</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-amber-300 mt-1 font-bold">•</span>
                        <span className="drop-shadow-sm">Thời gian xử lý: 1-3 phút sau khi chuyển khoản thành công</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-amber-300 mt-1 font-bold">•</span>
                        <span className="drop-shadow-sm">Liên hệ hỗ trợ nếu quá 10 phút chưa nhận được tiền</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Test Button */}
              <div className="glass-card-strong p-6 mb-8 bg-gradient-to-br from-green-500/20 via-emerald-500/20 to-teal-500/20 border-2 border-dashed border-green-400/50 rounded-3xl">
                <h3 className="font-bold text-white text-base mb-2 drop-shadow-md">🧪 Chế độ Test</h3>
                <p className="text-sm text-white/80 mb-5 drop-shadow-sm">
                  Nhấn nút bên dưới để giả lập việc nạp tiền thành công (chỉ dùng để test)
                </p>
                <button
                  onClick={handleSimulateDeposit}
                  disabled={isChecking}
                  className="w-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white font-bold py-4 px-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 hover:scale-105"
                >
                  {isChecking ? (
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
                onClick={resetDeposit}
                className="btn-secondary w-full text-base py-4"
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
