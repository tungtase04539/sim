'use client'

import { useState, useMemo, useEffect } from 'react'
import { Search, Loader2, Phone, Copy, RefreshCw, CheckCircle2, X, Clock } from 'lucide-react'
import ServiceCard from '@/components/ui/ServiceCard'
import CountryCard from '@/components/ui/CountryCard'
import { cn, formatCurrency } from '@/lib/utils'
import type { Service, Country } from '@/lib/types'

// Demo data - will be replaced with actual API data
const DEMO_SERVICES: Service[] = [
  { id: '1', name: 'Facebook', code: 'FB', icon: '📘', price: 5000, available_numbers: 1250, success_rate: 95, is_active: true, created_at: '' },
  { id: '2', name: 'Google', code: 'GG', icon: '🔍', price: 6000, available_numbers: 890, success_rate: 92, is_active: true, created_at: '' },
  { id: '3', name: 'Telegram', code: 'TG', icon: '✈️', price: 8000, available_numbers: 560, success_rate: 98, is_active: true, created_at: '' },
  { id: '4', name: 'TikTok', code: 'TT', icon: '🎵', price: 4500, available_numbers: 2100, success_rate: 90, is_active: true, created_at: '' },
  { id: '5', name: 'WhatsApp', code: 'WA', icon: '💬', price: 7000, available_numbers: 430, success_rate: 88, is_active: true, created_at: '' },
  { id: '6', name: 'Instagram', code: 'IG', icon: '📸', price: 5500, available_numbers: 780, success_rate: 91, is_active: true, created_at: '' },
  { id: '7', name: 'Twitter/X', code: 'TW', icon: '🐦', price: 6500, available_numbers: 320, success_rate: 89, is_active: true, created_at: '' },
  { id: '8', name: 'Discord', code: 'DC', icon: '🎮', price: 4000, available_numbers: 1800, success_rate: 94, is_active: true, created_at: '' },
  { id: '9', name: 'Shopee', code: 'SP', icon: '🛒', price: 3500, available_numbers: 2500, success_rate: 96, is_active: true, created_at: '' },
  { id: '10', name: 'Lazada', code: 'LZ', icon: '📦', price: 3500, available_numbers: 1900, success_rate: 95, is_active: true, created_at: '' },
]

const DEMO_COUNTRIES: Country[] = [
  { id: '1', name: 'Việt Nam', code: '84', flag: '🇻🇳', is_active: true },
  { id: '2', name: 'Indonesia', code: '62', flag: '🇮🇩', is_active: true },
  { id: '3', name: 'Philippines', code: '63', flag: '🇵🇭', is_active: true },
  { id: '4', name: 'Malaysia', code: '60', flag: '🇲🇾', is_active: true },
  { id: '5', name: 'Thailand', code: '66', flag: '🇹🇭', is_active: true },
  { id: '6', name: 'India', code: '91', flag: '🇮🇳', is_active: true },
  { id: '7', name: 'Russia', code: '7', flag: '🇷🇺', is_active: true },
  { id: '8', name: 'USA', code: '1', flag: '🇺🇸', is_active: true },
  { id: '9', name: 'UK', code: '44', flag: '🇬🇧', is_active: true },
  { id: '10', name: 'China', code: '86', flag: '🇨🇳', is_active: true },
]

interface ActiveOrder {
  id: string
  service: Service
  country: Country
  phone: string
  otp: string | null
  status: 'waiting' | 'success' | 'failed'
  expiresAt: Date
}

export default function RentOTPPage() {
  const [serviceSearch, setServiceSearch] = useState('')
  const [countrySearch, setCountrySearch] = useState('')
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [isOrdering, setIsOrdering] = useState(false)
  const [activeOrders, setActiveOrders] = useState<ActiveOrder[]>([])
  const [copied, setCopied] = useState<string | null>(null)

  const filteredServices = useMemo(() => {
    return DEMO_SERVICES.filter(s => 
      s.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
      s.code.toLowerCase().includes(serviceSearch.toLowerCase())
    )
  }, [serviceSearch])

  const filteredCountries = useMemo(() => {
    return DEMO_COUNTRIES.filter(c => 
      c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.code.includes(countrySearch)
    )
  }, [countrySearch])

  const handleOrder = async () => {
    if (!selectedService || !selectedCountry) return
    
    setIsOrdering(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const newOrder: ActiveOrder = {
      id: Date.now().toString(),
      service: selectedService,
      country: selectedCountry,
      phone: `+${selectedCountry.code}${Math.floor(100000000 + Math.random() * 900000000)}`,
      otp: null,
      status: 'waiting',
      expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
    }
    
    setActiveOrders(prev => [newOrder, ...prev])
    
    // Simulate OTP arrival after random time
    setTimeout(() => {
      setActiveOrders(prev => prev.map(o => 
        o.id === newOrder.id 
          ? { ...o, otp: Math.floor(100000 + Math.random() * 900000).toString(), status: 'success' as const }
          : o
      ))
    }, 3000 + Math.random() * 5000)
    
    setIsOrdering(false)
    setSelectedService(null)
    setSelectedCountry(null)
  }

  const cancelOrder = (orderId: string) => {
    setActiveOrders(prev => prev.filter(o => o.id !== orderId))
  }

  const copyToClipboard = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-dark-900 dark:text-white flex items-center gap-3">
          <Phone className="w-8 h-8 text-primary-500" />
          Thuê SIM Nhận OTP
        </h1>
        <p className="text-dark-600 dark:text-dark-400 mt-1">
          Chọn dịch vụ và quốc gia để thuê số nhận mã OTP
        </p>
      </div>

      {/* Active Orders */}
      {activeOrders.length > 0 && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary-500" />
            Đơn đang hoạt động ({activeOrders.length})
          </h2>
          
          <div className="space-y-3">
            {activeOrders.map((order) => (
              <div
                key={order.id}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all",
                  order.status === 'success' 
                    ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                    : order.status === 'failed'
                    ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                    : "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{order.service.icon}</span>
                      <div>
                        <p className="font-semibold text-dark-800 dark:text-white">
                          {order.service.name}
                        </p>
                        <p className="text-sm text-dark-500">
                          {order.country.flag} {order.country.name}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-lg">{order.phone}</span>
                      <button
                        onClick={() => copyToClipboard(order.phone, `phone-${order.id}`)}
                        className="p-1 rounded hover:bg-dark-200 dark:hover:bg-dark-600"
                      >
                        {copied === `phone-${order.id}` ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-dark-400" />
                        )}
                      </button>
                    </div>

                    {order.status === 'waiting' && (
                      <div className="flex items-center gap-2 text-amber-600">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Đang chờ OTP...</span>
                      </div>
                    )}

                    {order.status === 'success' && order.otp && (
                      <div className="flex items-center gap-2">
                        <span className="text-3xl font-mono font-bold text-green-600 dark:text-green-400 tracking-widest">
                          {order.otp}
                        </span>
                        <button
                          onClick={() => copyToClipboard(order.otp!, `otp-${order.id}`)}
                          className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-800/30"
                        >
                          {copied === `otp-${order.id}` ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : (
                            <Copy className="w-5 h-5 text-green-600" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => cancelOrder(order.id)}
                    className="p-2 rounded-lg hover:bg-dark-200 dark:hover:bg-dark-600 text-dark-400 hover:text-red-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Services Column */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-dark-800 dark:text-dark-100 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-600 font-bold">
              1
            </span>
            Chọn dịch vụ
          </h3>
          
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
            <input
              type="text"
              placeholder="Tìm dịch vụ..."
              value={serviceSearch}
              onChange={(e) => setServiceSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Services List */}
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 scrollbar-hide">
            {filteredServices.map(service => (
              <ServiceCard
                key={service.id}
                service={service}
                onSelect={setSelectedService}
                isSelected={selectedService?.id === service.id}
              />
            ))}
          </div>
        </div>

        {/* Countries Column */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-dark-800 dark:text-dark-100 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-600 font-bold">
              2
            </span>
            Chọn quốc gia
          </h3>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
            <input
              type="text"
              placeholder="Tìm quốc gia..."
              value={countrySearch}
              onChange={(e) => setCountrySearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Countries List */}
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 scrollbar-hide">
            {filteredCountries.map(country => (
              <CountryCard
                key={country.id}
                country={country}
                onSelect={setSelectedCountry}
                isSelected={selectedCountry?.id === country.id}
              />
            ))}
          </div>
        </div>

        {/* Order Panel */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-dark-800 dark:text-dark-100 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-600 font-bold">
              3
            </span>
            Xác nhận
          </h3>

          {/* Order Summary */}
          <div className="space-y-4 mb-6">
            <div className="p-4 rounded-xl bg-dark-50 dark:bg-dark-700/50">
              <p className="text-sm text-dark-500 dark:text-dark-400 mb-1">Dịch vụ</p>
              <p className="font-semibold text-dark-800 dark:text-dark-100">
                {selectedService ? (
                  <span className="flex items-center gap-2">
                    <span className="text-xl">{selectedService.icon}</span>
                    {selectedService.name}
                  </span>
                ) : (
                  <span className="text-dark-400">Chưa chọn</span>
                )}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-dark-50 dark:bg-dark-700/50">
              <p className="text-sm text-dark-500 dark:text-dark-400 mb-1">Quốc gia</p>
              <p className="font-semibold text-dark-800 dark:text-dark-100">
                {selectedCountry ? (
                  <span className="flex items-center gap-2">
                    <span className="text-xl">{selectedCountry.flag}</span>
                    {selectedCountry.name}
                  </span>
                ) : (
                  <span className="text-dark-400">Chưa chọn</span>
                )}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 border border-primary-200 dark:border-primary-800">
              <p className="text-sm text-dark-500 dark:text-dark-400 mb-1">Giá thuê</p>
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {selectedService ? formatCurrency(selectedService.price) : '---'}
              </p>
            </div>
          </div>

          {/* Order Button */}
          <button
            onClick={handleOrder}
            disabled={!selectedService || !selectedCountry || isOrdering}
            className={cn(
              "w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300",
              selectedService && selectedCountry && !isOrdering
                ? "btn-primary"
                : "bg-dark-200 dark:bg-dark-700 text-dark-400 cursor-not-allowed"
            )}
          >
            {isOrdering ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Đang xử lý...
              </span>
            ) : (
              'Thuê số ngay'
            )}
          </button>

          <div className="mt-4 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-sm text-blue-700 dark:text-blue-300">
            <p className="font-medium mb-1">💡 Lưu ý:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-600 dark:text-blue-400">
              <li>OTP sẽ được gửi trong vòng 30 giây</li>
              <li>Số điện thoại có hiệu lực 5 phút</li>
              <li>Hoàn tiền 100% nếu không nhận được OTP</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

