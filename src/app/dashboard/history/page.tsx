'use client'

import { useState, useEffect } from 'react'
import { History, Search, Filter, Copy, CheckCircle2, XCircle, Clock, Loader2, RefreshCw } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface Order {
  id: string
  phone_number: string
  otp_code: string | null
  price: number
  status: 'waiting' | 'success' | 'failed' | 'expired' | 'refunded'
  created_at: string
  services?: { name: string; code: string }
  countries?: { name: string; code: string; flag: string }
}

export default function HistoryPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

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
    }
    setIsLoading(false)
  }

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.phone_number.includes(search) ||
      order.services?.name.toLowerCase().includes(search.toLowerCase()) ||
      order.otp_code?.includes(search)
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Thành công</span>
      case 'waiting':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 animate-pulse">Đang chờ</span>
      case 'failed':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Thất bại</span>
      case 'expired':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400">Hết hạn</span>
      case 'refunded':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">Đã hoàn</span>
      default:
        return null
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-primary-700 dark:text-primary-300 flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-md bg-gradient-to-br from-primary-500 via-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
              <History className="w-6 h-6 text-white" />
            </div>
            Lịch sử thuê OTP
          </h1>
          <p className="text-gray-700 dark:text-gray-300 text-lg">
            Xem lại tất cả đơn hàng đã thuê
          </p>
        </div>
        <button onClick={fetchOrders} className="btn-secondary flex items-center gap-2">
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Làm mới
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card-strong p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo SĐT, dịch vụ, OTP..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-11"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field w-full sm:w-auto"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="success">Thành công</option>
            <option value="waiting">Đang chờ</option>
            <option value="failed">Thất bại</option>
            <option value="refunded">Đã hoàn</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="glass-card-strong overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16 text-gray-600 dark:text-gray-400">
            <History className="w-16 h-16 mx-auto mb-4 opacity-40" />
            <p className="font-semibold mb-1">Chưa có đơn hàng nào</p>
            <p className="text-sm">Hãy thuê OTP để bắt đầu</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-50/50 dark:bg-blue-900/20">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Dịch vụ</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Số điện thoại</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">OTP</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Giá</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Trạng thái</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, i) => (
                  <tr key={order.id} className={cn(
                    "border-b border-blue-200/50 dark:border-blue-700/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors",
                    i % 2 === 0 && "bg-blue-50/20 dark:bg-blue-900/10"
                  )}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{order.countries?.flag || '🌍'}</span>
                        <div>
                          <p className="font-semibold text-sm text-gray-900 dark:text-white">{order.services?.name || 'Service'}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{order.countries?.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-gray-900 dark:text-white">{order.phone_number}</span>
                        <button 
                          onClick={() => copyToClipboard(order.phone_number, order.id + '-phone')}
                          className="p-1.5 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                        >
                          {copied === order.id + '-phone' ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {order.otp_code ? (
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-green-600 dark:text-green-400">{order.otp_code}</span>
                          <button 
                            onClick={() => copyToClipboard(order.otp_code!, order.id + '-otp')}
                            className="p-1.5 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                          >
                            {copied === order.id + '-otp' ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                          </button>
                        </div>
                      ) : order.status === 'waiting' ? (
                        <span className="text-orange-500 dark:text-orange-400 flex items-center gap-1 text-sm">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Đang chờ...
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white font-semibold text-sm">{formatCurrency(order.price)}</td>
                    <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400 text-xs">{formatDate(order.created_at)}</td>
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
