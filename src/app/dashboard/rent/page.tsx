'use client'

import { useState, useEffect, useCallback } from 'react'
import { Phone, Loader2, Copy, CheckCircle2, Clock, XCircle, RefreshCw } from 'lucide-react'
import { formatCurrency, cn } from '@/lib/utils'

// Services data
const SERVICES = [
  { id: '1', name: 'Facebook', code: 'fb', price: 5000 },
  { id: '2', name: 'Google/Gmail', code: 'gg', price: 6000 },
  { id: '3', name: 'Telegram', code: 'tg', price: 4000 },
  { id: '4', name: 'WhatsApp', code: 'wa', price: 5500 },
  { id: '5', name: 'TikTok', code: 'tt', price: 4500 },
  { id: '6', name: 'Twitter/X', code: 'tw', price: 5000 },
  { id: '7', name: 'Instagram', code: 'ig', price: 5500 },
  { id: '8', name: 'Shopee', code: 'sp', price: 3500 },
  { id: '9', name: 'Lazada', code: 'lz', price: 3500 },
  { id: '10', name: 'Grab', code: 'gr', price: 4000 },
  { id: '11', name: 'Zalo', code: 'zl', price: 8000 },
  { id: '12', name: 'Discord', code: 'dc', price: 4500 },
  { id: '13', name: 'Microsoft', code: 'ms', price: 5000 },
  { id: '14', name: 'Any Other', code: 'other', price: 3000 },
]

const COUNTRIES = [
  { id: '1', name: 'Vietnam', code: '84', flag: '🇻🇳' },
  { id: '2', name: 'Indonesia', code: '62', flag: '🇮🇩' },
  { id: '3', name: 'Philippines', code: '63', flag: '🇵🇭' },
  { id: '4', name: 'Malaysia', code: '60', flag: '🇲🇾' },
  { id: '5', name: 'Thailand', code: '66', flag: '🇹🇭' },
  { id: '6', name: 'India', code: '91', flag: '🇮🇳' },
  { id: '7', name: 'Russia', code: '7', flag: '🇷🇺' },
  { id: '8', name: 'USA', code: '1', flag: '🇺🇸' },
  { id: '9', name: 'UK', code: '44', flag: '🇬🇧' },
  { id: '10', name: 'Ukraine', code: '380', flag: '🇺🇦' },
]

interface Order {
  id: string
  code: string
  phone_number: string
  service: string
  country: string
  country_flag: string
  price: number
  otp_code: string | null
  sms_content: string | null
  status: 'waiting' | 'success' | 'failed' | 'cancelled' | 'pending'
  created_at: string
  expires_at: string
}

export default function RentOTPPage() {
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0])
  const [selectedService, setSelectedService] = useState<typeof SERVICES[0] | null>(null)
  const [isOrdering, setIsOrdering] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])
  const [copied, setCopied] = useState<string | null>(null)
  const [balance, setBalance] = useState(0)

  // Fetch balance and orders on mount
  useEffect(() => {
    fetchBalance()
    fetchOrders()
  }, [])

  const fetchBalance = async () => {
    try {
      const res = await fetch('/api/user/balance')
      const data = await res.json()
      if (data.success) {
        setBalance(data.data.balance)
      }
    } catch (error) {
      console.error('Failed to fetch balance')
    }
  }

  const fetchOrders = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/orders')
      const data = await res.json()
      if (data.success) {
        setOrders(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch orders')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOrder = async () => {
    if (!selectedService) return
    
    if (balance < selectedService.price) {
      alert('Số dư không đủ. Vui lòng nạp thêm tiền.')
      return
    }

    setIsOrdering(true)

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: selectedService.id,
          country_id: selectedCountry.id,
        })
      })

      const data = await res.json()

      if (data.success) {
        const newOrder: Order = {
          id: data.data.order_id,
          code: data.data.order_code,
          phone_number: data.data.phone_number,
          service: data.data.service,
          country: data.data.country,
          country_flag: data.data.country_flag || selectedCountry.flag,
          price: data.data.price,
          otp_code: data.data.otp_code,
          sms_content: data.data.sms_content,
          status: data.data.status,
          created_at: data.data.created_at || new Date().toISOString(),
          expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        }
        
        // Add new order to the top of the list
        setOrders(prev => [newOrder, ...prev])
        setBalance(data.data.balance_after)
      } else {
        alert(data.error || 'Có lỗi xảy ra')
      }
    } catch (error) {
      alert('Có lỗi xảy ra. Vui lòng thử lại.')
    }

    setIsOrdering(false)
  }

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-6 h-6 text-green-500" />
      case 'cancelled':
      case 'failed':
        return <XCircle className="w-6 h-6 text-red-500" />
      case 'waiting':
      case 'pending':
        return <Clock className="w-6 h-6 text-orange-500 animate-pulse" />
      default:
        return <Clock className="w-6 h-6 text-gray-400" />
    }
  }

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'waiting':
      case 'pending':
        return 'bg-yellow-50 dark:bg-yellow-900/10'
      case 'success':
        return 'bg-green-50/50 dark:bg-green-900/5'
      default:
        return ''
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-primary-700 dark:text-primary-300 flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-md bg-gradient-to-br from-primary-500 via-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
              <Phone className="w-6 h-6 text-white" />
            </div>
            Thuê SIM nhận OTP
          </h1>
          <p className="text-gray-700 dark:text-gray-300 text-lg">
            Chọn dịch vụ và quốc gia để thuê số nhận OTP
          </p>
        </div>
        <div className="text-right glass-card-strong px-6 py-4 rounded-md">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 font-semibold uppercase tracking-wider">Số dư</p>
          <p className="text-3xl font-bold text-primary-700 dark:text-primary-300">{formatCurrency(balance)}</p>
        </div>
      </div>

      {/* Activation Form */}
      <div className="glass-card-strong p-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <div className="w-2 h-6 bg-gradient-to-b from-primary-400 via-blue-400 to-blue-500 rounded-md shadow-sm"></div>
          ACTIVATIONS
        </h2>

        <div className="grid md:grid-cols-3 gap-5 mb-6">
          {/* Country */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
              Country
            </label>
            <select
              value={selectedCountry.id}
              onChange={(e) => setSelectedCountry(COUNTRIES.find(c => c.id === e.target.value) || COUNTRIES[0])}
              className="input-field"
            >
              {COUNTRIES.map(country => (
                <option key={country.id} value={country.id}>
                  {country.flag} {country.name}
                </option>
              ))}
            </select>
          </div>

          {/* Operator */}
          <div>
            <label className="block text-xs font-semibold text-white/90 mb-3 uppercase tracking-wider">
              Operator
            </label>
            <select className="input-field">
              <option>any</option>
            </select>
          </div>

          {/* Service */}
          <div>
            <label className="block text-xs font-semibold text-white/90 mb-3 uppercase tracking-wider">
              Service
            </label>
            <select
              value={selectedService?.id || ''}
              onChange={(e) => setSelectedService(SERVICES.find(s => s.id === e.target.value) || null)}
              className="input-field"
            >
              <option value="">-- Chọn dịch vụ --</option>
              {SERVICES.map(service => (
                <option key={service.id} value={service.id}>
                  {service.name} - {formatCurrency(service.price)} - 15 Minute
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Order Button */}
        <button
          onClick={handleOrder}
          disabled={!selectedService || isOrdering || balance < (selectedService?.price || 0)}
          className="btn-primary w-full md:w-auto text-base py-4 px-10"
        >
          {isOrdering ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Đang xử lý...
            </>
          ) : !selectedService ? (
            'Chọn dịch vụ để thuê'
          ) : balance < selectedService.price ? (
            'Số dư không đủ'
          ) : (
            <>
              <Phone className="w-5 h-5" />
              Thuê ngay - {formatCurrency(selectedService.price)}
            </>
          )}
        </button>
      </div>

      {/* My Orders */}
      <div className="glass-card-strong overflow-hidden">
        <div className="p-5 bg-gradient-to-r from-primary-600 to-blue-600 text-white flex items-center justify-between">
          <h2 className="font-semibold flex items-center gap-2 text-base">
            MY ORDERS ({orders.length})
          </h2>
          <button 
            onClick={fetchOrders} 
            className="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-all"
          >
            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
            Refresh
          </button>
        </div>

        {isLoading ? (
          <div className="p-16 text-center">
            <Loader2 className="w-10 h-10 mx-auto mb-4 animate-spin text-primary-500" />
            <p className="text-dark-500 dark:text-dark-400 text-sm">Đang tải lịch sử...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-16 text-center text-dark-400">
            <Phone className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="font-medium mb-1">Chưa có đơn hàng nào</p>
            <p className="text-sm">Chọn dịch vụ và quốc gia để bắt đầu thuê OTP</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-dark-50 to-dark-100 dark:from-dark-800 dark:to-dark-700">
                <tr>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-dark-600 dark:text-dark-400 uppercase tracking-wide">Code</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-dark-600 dark:text-dark-400 uppercase tracking-wide">Date</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-dark-600 dark:text-dark-400 uppercase tracking-wide">Service</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-dark-600 dark:text-dark-400 uppercase tracking-wide">Phone</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-dark-600 dark:text-dark-400 uppercase tracking-wide">OTP</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-dark-600 dark:text-dark-400 uppercase tracking-wide">Message</th>
                  <th className="text-right px-5 py-4 text-xs font-semibold text-dark-600 dark:text-dark-400 uppercase tracking-wide">Price</th>
                  <th className="text-center px-5 py-4 text-xs font-semibold text-dark-600 dark:text-dark-400 uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, idx) => (
                  <tr key={order.id} className={cn(
                    "border-b border-dark-200/50 dark:border-dark-700/50 hover:bg-dark-50/50 dark:hover:bg-dark-800/30 transition-colors",
                    getStatusBgColor(order.status),
                    idx % 2 === 0 && "bg-dark-50/20 dark:bg-dark-800/10"
                  )}>
                    <td className="px-5 py-4 font-mono text-xs font-medium text-dark-700 dark:text-dark-300">{order.code}</td>
                    <td className="px-5 py-4 text-xs text-dark-500 dark:text-dark-400">
                      {new Date(order.created_at).toLocaleString('vi-VN')}
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-medium text-sm text-dark-900 dark:text-white">{order.service}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/30 dark:to-blue-900/30 px-2.5 py-1 rounded-lg text-primary-700 dark:text-primary-300 text-xs font-medium border border-primary-200 dark:border-primary-800">
                          {order.phone_number}
                        </span>
                        <button
                          onClick={() => copyToClipboard(order.phone_number, order.id + '-phone')}
                          className="px-2 py-1 bg-primary-500 hover:bg-primary-600 text-white text-xs rounded-lg transition-all shadow-sm hover:shadow"
                        >
                          {copied === order.id + '-phone' ? '✓' : 'Copy'}
                        </button>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {order.otp_code ? (
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 px-2.5 py-1 rounded-lg text-green-700 dark:text-green-300 text-xs border border-green-200 dark:border-green-800">
                            {order.otp_code}
                          </span>
                          <button
                            onClick={() => copyToClipboard(order.otp_code!, order.id + '-otp')}
                            className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded-lg transition-all shadow-sm hover:shadow"
                          >
                            {copied === order.id + '-otp' ? '✓' : 'Copy'}
                          </button>
                        </div>
                      ) : order.status === 'waiting' || order.status === 'pending' ? (
                        <span className="flex items-center gap-2 text-orange-600 dark:text-orange-400 text-xs">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Waiting...
                        </span>
                      ) : (
                        <span className="text-dark-400 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-xs text-dark-600 dark:text-dark-400 max-w-xs truncate">
                      {order.sms_content || '-'}
                    </td>
                    <td className="px-5 py-4 text-right font-semibold text-primary-600 dark:text-primary-400 text-sm">
                      {formatCurrency(order.price)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-center">
                        {getStatusIcon(order.status)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
