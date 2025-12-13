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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-dark-900 dark:text-white flex items-center gap-3 mb-2">
            <CreditCard className="w-8 h-8 text-primary-500" />
            Lịch sử giao dịch
          </h1>
          <p className="text-dark-500 dark:text-dark-400">
            Xem tất cả giao dịch nạp tiền, chi tiêu và hoàn tiền
          </p>
        </div>
        <button onClick={fetchTransactions} className="px-4 py-2.5 bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-xl hover:bg-dark-50 dark:hover:bg-dark-700 transition-all flex items-center gap-2 text-sm font-medium shadow-sm">
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Làm mới
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border-2 border-green-200 dark:border-green-800 p-5 text-center shadow-sm">
          <p className="text-xs text-green-700 dark:text-green-400 mb-2 font-medium uppercase tracking-wide">Tổng nạp</p>
          <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">+{formatCurrency(totalDeposit)}</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl border-2 border-red-200 dark:border-red-800 p-5 text-center shadow-sm">
          <p className="text-xs text-red-700 dark:text-red-400 mb-2 font-medium uppercase tracking-wide">Tổng chi</p>
          <p className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">-{formatCurrency(totalSpent)}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border-2 border-purple-200 dark:border-purple-800 p-5 text-center shadow-sm">
          <p className="text-xs text-purple-700 dark:text-purple-400 mb-2 font-medium uppercase tracking-wide">Hoàn tiền</p>
          <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">+{formatCurrency(totalRefund)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-sm border border-dark-200/50 dark:border-dark-700/50 p-5">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
            <input
              type="text"
              placeholder="Tìm giao dịch..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 pl-11 rounded-xl border-2 border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full sm:w-auto px-4 py-3 rounded-xl border-2 border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
          >
            <option value="all">Tất cả</option>
            <option value="deposit">Nạp tiền</option>
            <option value="purchase">Chi tiêu</option>
            <option value="refund">Hoàn tiền</option>
          </select>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-sm border border-dark-200/50 dark:border-dark-700/50 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-16 text-dark-400">
            <CreditCard className="w-16 h-16 mx-auto mb-4 opacity-40" />
            <p className="font-medium mb-1">Chưa có giao dịch nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-dark-50 to-dark-100 dark:from-dark-800 dark:to-dark-700">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-dark-600 dark:text-dark-400 uppercase tracking-wide">Loại</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-dark-600 dark:text-dark-400 uppercase tracking-wide">Mô tả</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-dark-600 dark:text-dark-400 uppercase tracking-wide">Số tiền</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-dark-600 dark:text-dark-400 uppercase tracking-wide">Số dư sau</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-dark-600 dark:text-dark-400 uppercase tracking-wide">Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx, i) => (
                  <tr key={tx.id} className={cn(
                    "border-b border-dark-200/50 dark:border-dark-700/50 hover:bg-dark-50/50 dark:hover:bg-dark-800/30 transition-colors",
                    i % 2 === 0 && "bg-dark-50/20 dark:bg-dark-800/10"
                  )}>
                    <td className="px-6 py-4">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        tx.type === 'deposit' ? 'bg-green-100 dark:bg-green-900/30' :
                        tx.type === 'refund' ? 'bg-purple-100 dark:bg-purple-900/30' :
                        'bg-red-100 dark:bg-red-900/30'
                      }`}>
                        {tx.amount > 0 ? (
                          <ArrowDownRight className={`w-4 h-4 ${tx.type === 'deposit' ? 'text-green-600 dark:text-green-400' : 'text-purple-600 dark:text-purple-400'}`} />
                        ) : (
                          <ArrowUpRight className="w-4 h-4 text-red-600 dark:text-red-400" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-sm text-dark-900 dark:text-white">{tx.description}</p>
                      <p className="text-xs text-dark-500 dark:text-dark-400 mt-0.5">{getTransactionTypeText(tx.type)}</p>
                    </td>
                    <td className={`px-6 py-4 text-right font-semibold text-sm ${tx.amount > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                    </td>
                    <td className="px-6 py-4 text-right text-dark-700 dark:text-dark-300 font-medium text-sm">
                      {formatCurrency(tx.balance_after)}
                    </td>
                    <td className="px-6 py-4 text-dark-500 dark:text-dark-400 text-xs">
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
