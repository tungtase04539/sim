'use client'

import { useState, useEffect } from 'react'
import { 
  Wallet, 
  Copy, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  QrCode,
  Building2,
  RefreshCw
} from 'lucide-react'
import { cn, formatCurrency, generatePaymentCode } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

const BANK_INFO = {
  bankName: 'MB Bank',
  accountNumber: '0326868888',
  accountName: 'OTP RESALE',
  bankBin: '970422',
}

const PRESET_AMOUNTS = [50000, 100000, 200000, 500000, 1000000, 2000000]

export default function DepositPage() {
  const [amount, setAmount] = useState(100000)
  const [customAmount, setCustomAmount] = useState('')
  const [paymentCode, setPaymentCode] = useState('')
  const [copied, setCopied] = useState<string | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [depositStatus, setDepositStatus] = useState<'pending' | 'success' | null>(null)

  useEffect(() => {
    setPaymentCode(generatePaymentCode())
  }, [])

  const qrCodeUrl = `https://img.vietqr.io/image/${BANK_INFO.bankBin}-${BANK_INFO.accountNumber}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(paymentCode)}&accountName=${encodeURIComponent(BANK_INFO.accountName)}`

  const copyToClipboard = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleAmountChange = (value: number) => {
    setAmount(value)
    setCustomAmount('')
  }

  const handleCustomAmountChange = (value: string) => {
    const numValue = parseInt(value.replace(/\D/g, '')) || 0
    setCustomAmount(value)
    if (numValue >= 10000) {
      setAmount(numValue)
    }
  }

  const checkDeposit = async () => {
    setIsChecking(true)
    // Simulate checking - in production this would call the API
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // For demo, randomly show success
    if (Math.random() > 0.5) {
      setDepositStatus('success')
    }
    
    setIsChecking(false)
  }

  const transferContent = paymentCode

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-dark-900 dark:text-white flex items-center gap-3">
          <Wallet className="w-8 h-8 text-primary-500" />
          Nạp tiền
        </h1>
        <p className="text-dark-600 dark:text-dark-400 mt-1">
          Chuyển khoản qua ngân hàng, số dư được cộng tự động sau 1-3 phút.
        </p>
      </div>

      {depositStatus === 'success' ? (
        <div className="glass-card p-8 text-center animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-dark-900 dark:text-white mb-2">
            Nạp tiền thành công!
          </h2>
          <p className="text-dark-600 dark:text-dark-400 mb-6">
            Số dư của bạn đã được cộng {formatCurrency(amount)}
          </p>
          <button
            onClick={() => {
              setDepositStatus(null)
              setPaymentCode(generatePaymentCode())
            }}
            className="btn-primary"
          >
            Nạp thêm
          </button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Amount Selection */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
              1. Chọn số tiền
            </h2>
            
            <div className="grid grid-cols-3 gap-3 mb-4">
              {PRESET_AMOUNTS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => handleAmountChange(preset)}
                  className={cn(
                    "py-3 px-4 rounded-xl font-medium transition-all",
                    amount === preset && !customAmount
                      ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30"
                      : "bg-dark-100 dark:bg-dark-700 hover:bg-dark-200 dark:hover:bg-dark-600 text-dark-700 dark:text-dark-200"
                  )}
                >
                  {formatCurrency(preset)}
                </button>
              ))}
            </div>

            <div className="relative">
              <input
                type="text"
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                placeholder="Nhập số tiền khác..."
                className="input-field text-center text-lg"
              />
              {customAmount && (
                <p className="text-center text-sm text-dark-500 mt-2">
                  = {formatCurrency(amount)}
                </p>
              )}
            </div>

            <div className="mt-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800 dark:text-amber-200">
                  <p className="font-medium">Lưu ý quan trọng:</p>
                  <ul className="mt-1 space-y-1 list-disc list-inside text-amber-700 dark:text-amber-300">
                    <li>Số tiền nạp tối thiểu: 10,000 VND</li>
                    <li>Nội dung chuyển khoản phải chính xác</li>
                    <li>Số dư được cộng tự động sau 1-3 phút</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
              2. Thông tin chuyển khoản
            </h2>

            {/* QR Code */}
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-white rounded-2xl shadow-lg">
                <img 
                  src={qrCodeUrl} 
                  alt="QR Code" 
                  className="w-48 h-48 object-contain"
                />
              </div>
            </div>

            <p className="text-center text-sm text-dark-500 dark:text-dark-400 mb-6">
              Quét mã QR hoặc chuyển khoản thủ công
            </p>

            {/* Bank Details */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-dark-50 dark:bg-dark-700/50">
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-dark-400" />
                  <div>
                    <p className="text-xs text-dark-500">Ngân hàng</p>
                    <p className="font-medium">{BANK_INFO.bankName}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-dark-50 dark:bg-dark-700/50">
                <div>
                  <p className="text-xs text-dark-500">Số tài khoản</p>
                  <p className="font-mono font-bold text-lg">{BANK_INFO.accountNumber}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(BANK_INFO.accountNumber, 'account')}
                  className="p-2 rounded-lg hover:bg-dark-200 dark:hover:bg-dark-600 transition-colors"
                >
                  {copied === 'account' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <Copy className="w-5 h-5 text-dark-400" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-dark-50 dark:bg-dark-700/50">
                <div>
                  <p className="text-xs text-dark-500">Tên tài khoản</p>
                  <p className="font-medium">{BANK_INFO.accountName}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(BANK_INFO.accountName, 'name')}
                  className="p-2 rounded-lg hover:bg-dark-200 dark:hover:bg-dark-600 transition-colors"
                >
                  {copied === 'name' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <Copy className="w-5 h-5 text-dark-400" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-dark-50 dark:bg-dark-700/50">
                <div>
                  <p className="text-xs text-dark-500">Số tiền</p>
                  <p className="font-bold text-lg text-primary-600">{formatCurrency(amount)}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(amount.toString(), 'amount')}
                  className="p-2 rounded-lg hover:bg-dark-200 dark:hover:bg-dark-600 transition-colors"
                >
                  {copied === 'amount' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <Copy className="w-5 h-5 text-dark-400" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 border-2 border-primary-200 dark:border-primary-800">
                <div>
                  <p className="text-xs text-dark-500">Nội dung chuyển khoản</p>
                  <p className="font-mono font-bold text-lg text-primary-600">{transferContent}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(transferContent, 'content')}
                  className="p-2 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
                >
                  {copied === 'content' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <Copy className="w-5 h-5 text-primary-500" />
                  )}
                </button>
              </div>
            </div>

            {/* Check Button */}
            <button
              onClick={checkDeposit}
              disabled={isChecking}
              className={cn(
                "w-full mt-6 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all",
                isChecking
                  ? "bg-dark-200 dark:bg-dark-700 text-dark-500 cursor-not-allowed"
                  : "btn-primary"
              )}
            >
              {isChecking ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang kiểm tra...
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5" />
                  Kiểm tra giao dịch
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Transaction History Preview */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
          Lịch sử nạp tiền gần đây
        </h2>
        <div className="text-center py-8 text-dark-500">
          Chưa có giao dịch nạp tiền nào
        </div>
      </div>
    </div>
  )
}

