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
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark-900 dark:text-white flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-primary-500" />
            Lịch sử giao dịch
          </h1>
          <p className="text-dark-600 dark:text-dark-400 mt-1">
            Xem tất cả giao dịch nạp tiền, chi tiêu và hoàn tiền
          </p>
        </div>
        <button onClick={fetchTransactions} className="btn-secondary flex items-center gap-2">
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          Làm mới
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-4 text-center">
          <p className="text-sm text-dark-500">Tổng nạp</p>
          <p className="text-xl font-bold text-green-600">+{formatCurrency(totalDeposit)}</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-sm text-dark-500">Tổng chi</p>
          <p className="text-xl font-bold text-red-600">-{formatCurrency(totalSpent)}</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-sm text-dark-500">Hoàn tiền</p>
          <p className="text-xl font-bold text-purple-600">+{formatCurrency(totalRefund)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
            <input
              type="text"
              placeholder="Tìm giao dịch..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
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
      <div className="glass-card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-12 text-dark-500">
            <CreditCard className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Chưa có giao dịch nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-50 dark:bg-dark-800">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-dark-500">Loại</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-dark-500">Mô tả</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-dark-500">Số tiền</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-dark-500">Số dư sau</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-dark-500">Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx, i) => (
                  <tr key={tx.id} className={cn("table-row", i % 2 === 0 && "bg-dark-50/50 dark:bg-dark-800/30")}>
                    <td className="px-6 py-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tx.type === 'deposit' ? 'bg-green-100 dark:bg-green-900/30' :
                        tx.type === 'refund' ? 'bg-purple-100 dark:bg-purple-900/30' :
                        'bg-red-100 dark:bg-red-900/30'
                      }`}>
                        {tx.amount > 0 ? (
                          <ArrowDownRight className={`w-5 h-5 ${tx.type === 'deposit' ? 'text-green-600' : 'text-purple-600'}`} />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-dark-900 dark:text-white">{tx.description}</p>
                      <p className="text-sm text-dark-500">{getTransactionTypeText(tx.type)}</p>
                    </td>
                    <td className={`px-6 py-4 text-right font-semibold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                    </td>
                    <td className="px-6 py-4 text-right text-dark-600">
                      {formatCurrency(tx.balance_after)}
                    </td>
                    <td className="px-6 py-4 text-dark-500 text-sm">
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
