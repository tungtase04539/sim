'use client'

import { useState, useMemo } from 'react'
import { Search, ChevronDown, Loader2, Phone, Copy, RefreshCw, CheckCircle2 } from 'lucide-react'
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

interface OTPRentalSectionProps {
  isAuthenticated?: boolean
}

export default function OTPRentalSection({ isAuthenticated = false }: OTPRentalSectionProps) {
  const [serviceSearch, setServiceSearch] = useState('')
  const [countrySearch, setCountrySearch] = useState('')
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [isOrdering, setIsOrdering] = useState(false)
  const [orderResult, setOrderResult] = useState<{
    phone: string
    otp: string | null
    status: 'waiting' | 'success'
  } | null>(null)

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
    
    setOrderResult({
      phone: '+84' + Math.floor(100000000 + Math.random() * 900000000),
      otp: null,
      status: 'waiting'
    })
    
    // Simulate OTP arrival
    setTimeout(() => {
      setOrderResult(prev => prev ? {
        ...prev,
        otp: Math.floor(100000 + Math.random() * 900000).toString(),
        status: 'success'
      } : null)
    }, 5000)
    
    setIsOrdering(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <section className="py-16 bg-dark-50/50 dark:bg-dark-900/50" id="rent-otp">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-dark-900 dark:text-white mb-3">
            Thuê SIM Nhận OTP
          </h2>
          <p className="text-dark-600 dark:text-dark-400">
            Chọn dịch vụ và quốc gia để bắt đầu thuê số nhận OTP
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Services Column */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-dark-800 dark:text-dark-100 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-600">
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
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
              {filteredServices.map(service => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onSelect={setSelectedService}
                  isSelected={selectedService?.id === service.id}
                />
              ))}
            </div>

            {filteredServices.length === 0 && (
              <p className="text-center text-dark-500 py-8">
                Không tìm thấy dịch vụ
              </p>
            )}
          </div>

          {/* Countries Column */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-dark-800 dark:text-dark-100 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-600">
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
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
              {filteredCountries.map(country => (
                <CountryCard
                  key={country.id}
                  country={country}
                  onSelect={setSelectedCountry}
                  isSelected={selectedCountry?.id === country.id}
                />
              ))}
            </div>

            {filteredCountries.length === 0 && (
              <p className="text-center text-dark-500 py-8">
                Không tìm thấy quốc gia
              </p>
            )}
          </div>

          {/* Order Panel */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-dark-800 dark:text-dark-100 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-600">
                3
              </span>
              Xác nhận đơn hàng
            </h3>

            {/* Order Summary */}
            <div className="space-y-4 mb-6">
              <div className="p-4 rounded-xl bg-dark-50 dark:bg-dark-700/50">
                <p className="text-sm text-dark-500 dark:text-dark-400 mb-1">Dịch vụ</p>
                <p className="font-semibold text-dark-800 dark:text-dark-100">
                  {selectedService ? (
                    <span className="flex items-center gap-2">
                      <span>{selectedService.icon}</span>
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
                      <span>{selectedCountry.flag}</span>
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

            {/* Order Result */}
            {orderResult && (
              <div className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 animate-fade-in">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">
                    Số điện thoại
                  </span>
                  <button
                    onClick={() => copyToClipboard(orderResult.phone)}
                    className="p-1.5 rounded-lg hover:bg-green-100 dark:hover:bg-green-800/30"
                  >
                    <Copy className="w-4 h-4 text-green-600" />
                  </button>
                </div>
                <p className="text-lg font-mono font-bold text-green-800 dark:text-green-200 flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  {orderResult.phone}
                </p>

                {orderResult.otp ? (
                  <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-green-700 dark:text-green-300 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Mã OTP
                      </span>
                      <button
                        onClick={() => copyToClipboard(orderResult.otp!)}
                        className="p-1.5 rounded-lg hover:bg-green-100 dark:hover:bg-green-800/30"
                      >
                        <Copy className="w-4 h-4 text-green-600" />
                      </button>
                    </div>
                    <p className="text-3xl font-mono font-bold text-green-800 dark:text-green-200 tracking-widest">
                      {orderResult.otp}
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-700">
                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="text-sm font-medium">Đang chờ OTP...</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Order Button */}
            {isAuthenticated ? (
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
            ) : (
              <a
                href="/login"
                className="block w-full py-4 rounded-xl font-semibold text-lg text-center btn-primary"
              >
                Đăng nhập để thuê
              </a>
            )}

            <p className="text-xs text-dark-500 dark:text-dark-400 text-center mt-4">
              ⚡ Hoàn tiền 100% nếu không nhận được OTP trong 5 phút
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

