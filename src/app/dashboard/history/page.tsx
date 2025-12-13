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
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark-900 dark:text-white flex items-center gap-3">
            <History className="w-8 h-8 text-primary-500" />
            Lịch sử thuê OTP
          </h1>
          <p className="text-dark-600 dark:text-dark-400 mt-1">
            Xem lại tất cả đơn hàng đã thuê
          </p>
        </div>
        <button onClick={fetchOrders} className="btn-secondary flex items-center gap-2">
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          Làm mới
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
            <input
              type="text"
              placeholder="Tìm theo SĐT, dịch vụ, OTP..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
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
      <div className="glass-card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-dark-500">
            <History className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Chưa có đơn hàng nào</p>
            <p className="text-sm">Hãy thuê OTP để bắt đầu</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-50 dark:bg-dark-800">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-dark-500">Dịch vụ</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-dark-500">Số điện thoại</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-dark-500">OTP</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-dark-500">Giá</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-dark-500">Trạng thái</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-dark-500">Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, i) => (
                  <tr key={order.id} className={cn("table-row", i % 2 === 0 && "bg-dark-50/50 dark:bg-dark-800/30")}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{order.countries?.flag || '🌍'}</span>
                        <div>
                          <p className="font-medium text-dark-900 dark:text-white">{order.services?.name || 'Service'}</p>
                          <p className="text-xs text-dark-500">{order.countries?.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono">{order.phone_number}</span>
                        <button 
                          onClick={() => copyToClipboard(order.phone_number, order.id + '-phone')}
                          className="text-dark-400 hover:text-primary-600"
                        >
                          {copied === order.id + '-phone' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {order.otp_code ? (
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-green-600">{order.otp_code}</span>
                          <button 
                            onClick={() => copyToClipboard(order.otp_code!, order.id + '-otp')}
                            className="text-dark-400 hover:text-primary-600"
                          >
                            {copied === order.id + '-otp' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      ) : order.status === 'waiting' ? (
                        <span className="text-orange-500 flex items-center gap-1">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Đang chờ...
                        </span>
                      ) : (
                        <span className="text-dark-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-dark-600">{formatCurrency(order.price)}</td>
                    <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                    <td className="px-6 py-4 text-dark-500 text-sm">{formatDate(order.created_at)}</td>
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
