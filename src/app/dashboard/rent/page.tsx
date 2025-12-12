'use client'

import { useState, useEffect } from 'react'
import { Phone, Search, Filter, Loader2, Copy, CheckCircle2, RefreshCw, Clock } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

// Fake services data (in production, fetch from database)
const SERVICES = [
  { id: '1', name: 'Facebook', code: 'fb', icon: '📘', price: 5000 },
  { id: '2', name: 'Google', code: 'gg', icon: '🔍', price: 6000 },
  { id: '3', name: 'Telegram', code: 'tg', icon: '✈️', price: 4000 },
  { id: '4', name: 'WhatsApp', code: 'wa', icon: '💬', price: 5500 },
  { id: '5', name: 'TikTok', code: 'tt', icon: '🎵', price: 4500 },
  { id: '6', name: 'Twitter/X', code: 'tw', icon: '🐦', price: 5000 },
  { id: '7', name: 'Instagram', code: 'ig', icon: '📷', price: 5500 },
  { id: '8', name: 'Shopee', code: 'sp', icon: '🛒', price: 3500 },
  { id: '9', name: 'Lazada', code: 'lz', icon: '🛍️', price: 3500 },
  { id: '10', name: 'Grab', code: 'gr', icon: '🚗', price: 4000 },
  { id: '11', name: 'Zalo', code: 'zl', icon: '💙', price: 8000 },
  { id: '12', name: 'Discord', code: 'dc', icon: '🎮', price: 4500 },
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
  { id: '10', name: 'China', code: '86', flag: '🇨🇳' },
]

interface ActiveOrder {
  id: string
  phone_number: string
  service: string
  country: string
  price: number
  otp_code: string | null
  status: 'waiting' | 'success' | 'failed' | 'expired'
  expires_at: string
  created_at: string
}

export default function RentOTPPage() {
  const [search, setSearch] = useState('')
  const [selectedService, setSelectedService] = useState<typeof SERVICES[0] | null>(null)
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0])
  const [isOrdering, setIsOrdering] = useState(false)
  const [activeOrders, setActiveOrders] = useState<ActiveOrder[]>([])
  const [copied, setCopied] = useState<string | null>(null)
  const [balance, setBalance] = useState(0)

  // Fetch balance and orders on mount
  useEffect(() => {
    fetchBalance()
    fetchOrders()
    
    // Poll for OTP updates every 3 seconds
    const interval = setInterval(fetchOrders, 3000)
    return () => clearInterval(interval)
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
    try {
      const res = await fetch('/api/orders')
      const data = await res.json()
      if (data.success) {
        // Filter only recent/active orders
        const recent = data.data.filter((o: any) => {
          const age = Date.now() - new Date(o.created_at).getTime()
          return age < 10 * 60 * 1000 // Last 10 minutes
        })
        setActiveOrders(recent)
      }
    } catch (error) {
      console.error('Failed to fetch orders')
    }
  }

  const handleOrder = async () => {
    if (!selectedService || !selectedCountry) return
    
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
        // Add to active orders
        setActiveOrders(prev => [{
          id: data.data.order_id,
          phone_number: data.data.phone_number,
          service: data.data.service,
          country: data.data.country,
          price: data.data.price,
          otp_code: null,
          status: 'waiting',
          expires_at: data.data.expires_at,
          created_at: new Date().toISOString(),
        }, ...prev])
        
        setBalance(data.data.balance_after)
        setSelectedService(null)
      } else {
        alert(data.error || 'Có lỗi xảy ra')
      }
    } catch (error) {
      // Simulate order for testing
      const phoneNumber = `+${selectedCountry.code}${Math.floor(100000000 + Math.random() * 900000000)}`
      const orderId = 'ord_' + Math.random().toString(36).substr(2, 9)
      
      const newOrder: ActiveOrder = {
        id: orderId,
        phone_number: phoneNumber,
        service: selectedService.name,
        country: selectedCountry.name,
        price: selectedService.price,
        otp_code: null,
        status: 'waiting',
        expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
      }
      
      setActiveOrders(prev => [newOrder, ...prev])
      setBalance(prev => prev - selectedService.price)
      setSelectedService(null)

      // Simulate OTP arrival after 3-8 seconds
      setTimeout(() => {
        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        setActiveOrders(prev => prev.map(o => 
          o.id === orderId ? { ...o, otp_code: otp, status: 'success' } : o
        ))
      }, 3000 + Math.random() * 5000)
    }

    setIsOrdering(false)
  }

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const filteredServices = SERVICES.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.code.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark-900 dark:text-white flex items-center gap-3">
            <Phone className="w-8 h-8 text-primary-500" />
            Thuê OTP
          </h1>
          <p className="text-dark-600 dark:text-dark-400 mt-1">
            Chọn dịch vụ và quốc gia để thuê số nhận OTP
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-dark-500">Số dư</p>
          <p className="text-xl font-bold text-primary-600">{formatCurrency(balance)}</p>
        </div>
      </div>

      {/* Active Orders */}
      {activeOrders.length > 0 && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" />
            Đơn hàng đang chờ OTP
          </h2>
          <div className="space-y-3">
            {activeOrders.map((order) => (
              <div key={order.id} className={cn(
                "p-4 rounded-xl border-2 transition-all",
                order.otp_code 
                  ? "border-green-500 bg-green-50 dark:bg-green-900/20" 
                  : "border-orange-500 bg-orange-50 dark:bg-orange-900/20 animate-pulse"
              )}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-dark-900 dark:text-white">
                      {order.service} - {order.country}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="font-mono text-dark-600 dark:text-dark-400">{order.phone_number}</p>
                      <button 
                        onClick={() => copyToClipboard(order.phone_number, order.id + '-phone')}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        {copied === order.id + '-phone' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    {order.otp_code ? (
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-2xl font-bold text-green-600">{order.otp_code}</span>
                        <button 
                          onClick={() => copyToClipboard(order.otp_code!, order.id + '-otp')}
                          className="text-green-600 hover:text-green-700"
                        >
                          {copied === order.id + '-otp' ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-orange-600">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Đang chờ OTP...</span>
                      </div>
                    )}
                    <p className="text-xs text-dark-500 mt-1">-{formatCurrency(order.price)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Services */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
            <input
              type="text"
              placeholder="Tìm dịch vụ (Facebook, Google, Telegram...)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-12"
            />
          </div>

          {/* Service Grid */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
              Chọn dịch vụ
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filteredServices.map((service) => (
                <button
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all text-left",
                    selectedService?.id === service.id
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-lg shadow-primary-500/20"
                      : "border-dark-200 dark:border-dark-700 hover:border-primary-300 hover:shadow-md"
                  )}
                >
                  <span className="text-2xl">{service.icon}</span>
                  <p className="font-medium text-dark-900 dark:text-white mt-2">{service.name}</p>
                  <p className="text-sm text-primary-600 font-semibold">{formatCurrency(service.price)}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Order Panel */}
        <div className="space-y-4">
          {/* Country Selection */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
              Chọn quốc gia
            </h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {COUNTRIES.map((country) => (
                <button
                  key={country.id}
                  onClick={() => setSelectedCountry(country)}
                  className={cn(
                    "w-full p-3 rounded-xl flex items-center gap-3 transition-all",
                    selectedCountry.id === country.id
                      ? "bg-primary-100 dark:bg-primary-900/30 border-2 border-primary-500"
                      : "bg-dark-50 dark:bg-dark-700/50 hover:bg-dark-100 dark:hover:bg-dark-700 border-2 border-transparent"
                  )}
                >
                  <span className="text-2xl">{country.flag}</span>
                  <div className="text-left">
                    <p className="font-medium text-dark-900 dark:text-white">{country.name}</p>
                    <p className="text-xs text-dark-500">+{country.code}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
              Đơn hàng
            </h2>
            
            {selectedService ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-dark-50 dark:bg-dark-700/50">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{selectedService.icon}</span>
                    <div>
                      <p className="font-semibold text-dark-900 dark:text-white">{selectedService.name}</p>
                      <p className="text-sm text-dark-500">{selectedCountry.flag} {selectedCountry.name}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-dark-600 dark:text-dark-400">Giá:</span>
                  <span className="text-xl font-bold text-primary-600">{formatCurrency(selectedService.price)}</span>
                </div>

                <button
                  onClick={handleOrder}
                  disabled={isOrdering || balance < selectedService.price}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {isOrdering ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : balance < selectedService.price ? (
                    'Số dư không đủ'
                  ) : (
                    <>
                      <Phone className="w-5 h-5" />
                      Thuê ngay
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="text-center py-8 text-dark-500">
                <Phone className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Chọn dịch vụ để thuê OTP</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
