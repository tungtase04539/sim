'use client'

import { useState } from 'react'
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Search,
  Filter,
  RefreshCw,
  Copy,
  ChevronDown
} from 'lucide-react'
import { cn, formatCurrency, formatDate, getStatusColor, getStatusText } from '@/lib/utils'

// Demo data
const DEMO_ORDERS = [
  { id: '1', service: { name: 'Facebook', icon: '📘' }, country: { name: 'Vietnam', flag: '🇻🇳' }, phone: '+84912345678', otp: '123456', price: 5000, status: 'success', created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString() },
  { id: '2', service: { name: 'Google', icon: '🔍' }, country: { name: 'Indonesia', flag: '🇮🇩' }, phone: '+62812345678', otp: null, price: 6000, status: 'waiting', created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString() },
  { id: '3', service: { name: 'Telegram', icon: '✈️' }, country: { name: 'Russia', flag: '🇷🇺' }, phone: '+79123456789', otp: '654321', price: 8000, status: 'success', created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString() },
  { id: '4', service: { name: 'TikTok', icon: '🎵' }, country: { name: 'USA', flag: '🇺🇸' }, phone: '+13121234567', otp: null, price: 4500, status: 'failed', created_at: new Date(Date.now() - 20 * 60 * 1000).toISOString() },
  { id: '5', service: { name: 'WhatsApp', icon: '💬' }, country: { name: 'India', flag: '🇮🇳' }, phone: '+919876543210', otp: '789012', price: 7000, status: 'success', created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
  { id: '6', service: { name: 'Instagram', icon: '📸' }, country: { name: 'UK', flag: '🇬🇧' }, phone: '+447123456789', otp: null, price: 5500, status: 'refunded', created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString() },
  { id: '7', service: { name: 'Discord', icon: '🎮' }, country: { name: 'Vietnam', flag: '🇻🇳' }, phone: '+84987654321', otp: '345678', price: 4000, status: 'success', created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString() },
  { id: '8', service: { name: 'Shopee', icon: '🛒' }, country: { name: 'Malaysia', flag: '🇲🇾' }, phone: '+60123456789', otp: '901234', price: 3500, status: 'success', created_at: new Date(Date.now() - 90 * 60 * 1000).toISOString() },
]

const STATUS_OPTIONS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'success', label: 'Thành công' },
  { value: 'waiting', label: 'Đang chờ' },
  { value: 'failed', label: 'Thất bại' },
  { value: 'refunded', label: 'Đã hoàn' },
]

export default function HistoryPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [copied, setCopied] = useState<string | null>(null)

  const filteredOrders = DEMO_ORDERS.filter(order => {
    const matchesSearch = 
      order.service.name.toLowerCase().includes(search.toLowerCase()) ||
      order.phone.includes(search) ||
      (order.otp && order.otp.includes(search))
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const copyToClipboard = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case 'waiting':
        return <Clock className="w-5 h-5 text-amber-500 animate-pulse" />
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'refunded':
        return <RefreshCw className="w-5 h-5 text-purple-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-900 dark:text-white flex items-center gap-3">
            <Clock className="w-8 h-8 text-primary-500" />
            Lịch sử thuê OTP
          </h1>
          <p className="text-dark-600 dark:text-dark-400 mt-1">
            Xem lại các đơn thuê OTP của bạn
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4">
          <div className="text-center px-4 py-2 rounded-xl bg-green-100 dark:bg-green-900/30">
            <p className="text-2xl font-bold text-green-600">{DEMO_ORDERS.filter(o => o.status === 'success').length}</p>
            <p className="text-xs text-green-600">Thành công</p>
          </div>
          <div className="text-center px-4 py-2 rounded-xl bg-red-100 dark:bg-red-900/30">
            <p className="text-2xl font-bold text-red-600">{DEMO_ORDERS.filter(o => o.status === 'failed').length}</p>
            <p className="text-xs text-red-600">Thất bại</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
            <input
              type="text"
              placeholder="Tìm theo dịch vụ, số điện thoại, OTP..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field pl-10 pr-10 appearance-none cursor-pointer"
            >
              {STATUS_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="glass-card overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <Clock className="w-16 h-16 mx-auto text-dark-300 dark:text-dark-600 mb-4" />
            <h3 className="text-lg font-medium text-dark-600 dark:text-dark-400">
              Không có đơn hàng nào
            </h3>
            <p className="text-dark-500 mt-1">
              {search || statusFilter !== 'all' 
                ? 'Thử thay đổi bộ lọc để xem thêm kết quả'
                : 'Bạn chưa thuê OTP nào'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-50 dark:bg-dark-800">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-dark-500">Dịch vụ</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-dark-500">Số điện thoại</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-dark-500">Mã OTP</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-dark-500">Giá</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-dark-500">Trạng thái</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-dark-500">Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => (
                  <tr 
                    key={order.id} 
                    className={cn(
                      "table-row",
                      index % 2 === 0 && "bg-dark-50/50 dark:bg-dark-800/30"
                    )}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{order.service.icon}</span>
                        <div>
                          <p className="font-medium text-dark-800 dark:text-white">
                            {order.service.name}
                          </p>
                          <p className="text-sm text-dark-500">
                            {order.country.flag} {order.country.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono">{order.phone}</span>
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
                    </td>
                    <td className="px-6 py-4">
                      {order.otp ? (
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-lg text-green-600 dark:text-green-400">
                            {order.otp}
                          </span>
                          <button
                            onClick={() => copyToClipboard(order.otp!, `otp-${order.id}`)}
                            className="p-1 rounded hover:bg-dark-200 dark:hover:bg-dark-600"
                          >
                            {copied === `otp-${order.id}` ? (
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                            ) : (
                              <Copy className="w-4 h-4 text-dark-400" />
                            )}
                          </button>
                        </div>
                      ) : (
                        <span className="text-dark-400">---</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {formatCurrency(order.price)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          getStatusColor(order.status)
                        )}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-dark-500 text-sm">
                      {formatDate(order.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="glass-card p-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-dark-800 dark:text-white">
              {filteredOrders.length}
            </p>
            <p className="text-sm text-dark-500">Tổng đơn</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(filteredOrders.filter(o => o.status === 'success').reduce((sum, o) => sum + o.price, 0))}
            </p>
            <p className="text-sm text-dark-500">Chi tiêu thành công</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">
              {formatCurrency(filteredOrders.filter(o => o.status === 'refunded').reduce((sum, o) => sum + o.price, 0))}
            </p>
            <p className="text-sm text-dark-500">Đã hoàn tiền</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary-600">
              {((filteredOrders.filter(o => o.status === 'success').length / filteredOrders.length) * 100 || 0).toFixed(0)}%
            </p>
            <p className="text-sm text-dark-500">Tỉ lệ thành công</p>
          </div>
        </div>
      </div>
    </div>
  )
}

