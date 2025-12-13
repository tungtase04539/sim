'use client'

import { useState, useEffect } from 'react'
import { CreditCard, CheckCircle2, XCircle, Loader2, RefreshCw, Search } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

interface DepositRequest {
  id: string
  user_id: string
  amount: number
  payment_code: string
  status: string
  created_at: string
  expires_at: string
  profiles?: {
    email: string
    full_name: string
    balance: number
  }
}

export default function AdminDepositsPage() {
  const [deposits, setDeposits] = useState<DepositRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [filter, setFilter] = useState('pending')

  useEffect(() => {
    fetchDeposits()
  }, [filter])

  const fetchDeposits = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/admin/deposits?status=${filter}`)
      const data = await res.json()
      if (data.success) {
        setDeposits(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch deposits')
    }
    setIsLoading(false)
  }

  const handleApprove = async (deposit: DepositRequest) => {
    if (!confirm(`Xác nhận duyệt nạp ${formatCurrency(deposit.amount)} cho ${deposit.profiles?.email}?`)) {
      return
    }

    setProcessingId(deposit.id)
    try {
      const res = await fetch('/api/admin/deposits/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deposit_id: deposit.id })
      })

      const data = await res.json()
      if (data.success) {
        alert('✅ Đã duyệt nạp tiền thành công!')
        fetchDeposits()
      } else {
        alert('Lỗi: ' + data.error)
      }
    } catch (error) {
      alert('Có lỗi xảy ra')
    }
    setProcessingId(null)
  }

  const handleReject = async (deposit: DepositRequest) => {
    if (!confirm(`Từ chối nạp tiền của ${deposit.profiles?.email}?`)) {
      return
    }

    setProcessingId(deposit.id)
    try {
      const res = await fetch('/api/admin/deposits/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deposit_id: deposit.id })
      })

      const data = await res.json()
      if (data.success) {
        alert('Đã từ chối yêu cầu nạp tiền')
        fetchDeposits()
      } else {
        alert('Lỗi: ' + data.error)
      }
    } catch (error) {
      alert('Có lỗi xảy ra')
    }
    setProcessingId(null)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark-900 dark:text-white flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-primary-500" />
            Quản lý nạp tiền
          </h1>
          <p className="text-dark-600 dark:text-dark-400 mt-1">
            Duyệt và quản lý các yêu cầu nạp tiền
          </p>
        </div>
        <button onClick={fetchDeposits} className="btn-secondary flex items-center gap-2">
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          Làm mới
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex gap-2">
          {['pending', 'completed', 'expired', 'all'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? 'bg-primary-500 text-white'
                  : 'bg-dark-100 dark:bg-dark-700 hover:bg-dark-200 dark:hover:bg-dark-600'
              }`}
            >
              {status === 'pending' ? 'Chờ duyệt' :
               status === 'completed' ? 'Đã duyệt' :
               status === 'expired' ? 'Hết hạn' : 'Tất cả'}
            </button>
          ))}
        </div>
      </div>

      {/* Deposits List */}
      <div className="glass-card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          </div>
        ) : deposits.length === 0 ? (
          <div className="text-center py-12 text-dark-500">
            <CreditCard className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Không có yêu cầu nạp tiền</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-50 dark:bg-dark-800">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-dark-500">Người dùng</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-dark-500">Mã thanh toán</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-dark-500">Số tiền</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-dark-500">Trạng thái</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-dark-500">Thời gian</th>
                  <th className="text-center px-6 py-4 text-sm font-medium text-dark-500">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {deposits.map((deposit, i) => (
                  <tr key={deposit.id} className={i % 2 === 0 ? 'bg-dark-50/50 dark:bg-dark-800/30' : ''}>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-dark-900 dark:text-white">
                          {deposit.profiles?.full_name || 'Unknown'}
                        </p>
                        <p className="text-sm text-dark-500">{deposit.profiles?.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="px-2 py-1 bg-dark-100 dark:bg-dark-700 rounded font-mono text-sm">
                        {deposit.payment_code}
                      </code>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-bold text-green-600">{formatCurrency(deposit.amount)}</span>
                    </td>
                    <td className="px-6 py-4">
                      {deposit.status === 'pending' ? (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                          Chờ duyệt
                        </span>
                      ) : deposit.status === 'completed' ? (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          Đã duyệt
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400">
                          Hết hạn
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-dark-500 text-sm">
                      {formatDate(deposit.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      {deposit.status === 'pending' && (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleApprove(deposit)}
                            disabled={processingId === deposit.id}
                            className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50"
                            title="Duyệt"
                          >
                            {processingId === deposit.id ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <CheckCircle2 className="w-5 h-5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleReject(deposit)}
                            disabled={processingId === deposit.id}
                            className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50"
                            title="Từ chối"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>
                      )}
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

