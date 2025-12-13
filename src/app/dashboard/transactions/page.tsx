'use client'

import { useState, useEffect } from 'react'
import { 
  CreditCard, 
  Search, 
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  RefreshCw,
  Download
} from 'lucide-react'
import { cn, formatCurrency, formatDate, getTransactionTypeText } from '@/lib/utils'

interface Transaction {
  id: string
  type: 'deposit' | 'purchase' | 'refund' | 'bonus'
  amount: number
  balance_before: number
  balance_after: number
  description: string
  status: string
  created_at: string
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/transactions')
      const data = await res.json()
      if (data.success) {
        setTransactions(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch transactions')
    }
    setIsLoading(false)
  }

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.description.toLowerCase().includes(search.toLowerCase())
    const matchesType = typeFilter === 'all' || tx.type === typeFilter
    return matchesSearch && matchesType
  })

  const totalDeposit = transactions.filter(t => t.type === 'deposit').reduce((sum, t) => sum + t.amount, 0)
  const totalSpent = Math.abs(transactions.filter(t => t.type === 'purchase').reduce((sum, t) => sum + t.amount, 0))
  const totalRefund = transactions.filter(t => t.type === 'refund').reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-primary-700 dark:text-primary-300 flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-md bg-gradient-to-br from-primary-500 via-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            Lịch sử giao dịch
          </h1>
          <p className="text-gray-700 dark:text-gray-300 text-lg">
            Xem tất cả giao dịch nạp tiền, chi tiêu và hoàn tiền
          </p>
        </div>
        <button onClick={fetchTransactions} className="btn-secondary flex items-center gap-2">
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Làm mới
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card-strong p-6 text-center bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-teal-500/10 border border-green-200/50 dark:border-green-700/50">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-semibold uppercase tracking-wider">Tổng nạp</p>
          <p className="text-2xl font-bold text-green-700 dark:text-green-400">+{formatCurrency(totalDeposit)}</p>
        </div>
        <div className="glass-card-strong p-6 text-center bg-gradient-to-br from-red-500/10 via-pink-500/10 to-rose-500/10 border border-red-200/50 dark:border-red-700/50">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-semibold uppercase tracking-wider">Tổng chi</p>
          <p className="text-2xl font-bold text-red-700 dark:text-red-400">-{formatCurrency(totalSpent)}</p>
        </div>
        <div className="glass-card-strong p-6 text-center bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-200/50 dark:border-blue-700/50">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-semibold uppercase tracking-wider">Hoàn tiền</p>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">+{formatCurrency(totalRefund)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card-strong p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm giao dịch..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-11"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="input-field w-full sm:w-auto"
          >
            <option value="all">Tất cả</option>
            <option value="deposit">Nạp tiền</option>
            <option value="purchase">Chi tiêu</option>
            <option value="refund">Hoàn tiền</option>
          </select>
        </div>
      </div>

      {/* Transactions List */}
      <div className="glass-card-strong overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-16 text-gray-600 dark:text-gray-400">
            <CreditCard className="w-16 h-16 mx-auto mb-4 opacity-40" />
            <p className="font-semibold mb-1">Chưa có giao dịch nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-50/50 dark:bg-blue-900/20">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Loại</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Mô tả</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Số tiền</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Số dư sau</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx, i) => (
                  <tr key={tx.id} className={cn(
                    "border-b border-blue-200/50 dark:border-blue-700/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors",
                    i % 2 === 0 && "bg-blue-50/20 dark:bg-blue-900/10"
                  )}>
                    <td className="px-6 py-4">
                      <div className={`w-9 h-9 rounded-md flex items-center justify-center ${
                        tx.type === 'deposit' ? 'bg-green-100 dark:bg-green-900/30' :
                        tx.type === 'refund' ? 'bg-blue-100 dark:bg-blue-900/30' :
                        'bg-red-100 dark:bg-red-900/30'
                      }`}>
                        {tx.amount > 0 ? (
                          <ArrowDownRight className={`w-4 h-4 ${tx.type === 'deposit' ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}`} />
                        ) : (
                          <ArrowUpRight className="w-4 h-4 text-red-600 dark:text-red-400" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-sm text-gray-900 dark:text-white">{tx.description}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{getTransactionTypeText(tx.type)}</p>
                    </td>
                    <td className={`px-6 py-4 text-right font-bold text-sm ${tx.amount > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-900 dark:text-white font-semibold text-sm">
                      {formatCurrency(tx.balance_after)}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400 text-xs">
                      {formatDate(tx.created_at)}
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
