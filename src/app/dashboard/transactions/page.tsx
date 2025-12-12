'use client'

import { useState } from 'react'
import { 
  CreditCard, 
  Search, 
  Filter, 
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown
} from 'lucide-react'
import { cn, formatCurrency, formatDate, getTransactionTypeText } from '@/lib/utils'

const DEMO_TRANSACTIONS = [
  { id: '1', type: 'deposit', amount: 500000, balance_after: 500000, description: 'Nạp tiền qua MB Bank', status: 'completed', created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
  { id: '2', type: 'purchase', amount: -5000, balance_after: 495000, description: 'Thuê OTP - Facebook', status: 'completed', created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
  { id: '3', type: 'refund', amount: 4500, balance_after: 499500, description: 'Hoàn tiền - TikTok lỗi', status: 'completed', created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() },
  { id: '4', type: 'purchase', amount: -8000, balance_after: 491500, description: 'Thuê OTP - Telegram', status: 'completed', created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() },
  { id: '5', type: 'deposit', amount: 200000, balance_after: 691500, description: 'Nạp tiền qua Vietcombank', status: 'completed', created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
  { id: '6', type: 'purchase', amount: -6000, balance_after: 685500, description: 'Thuê OTP - Google', status: 'completed', created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() },
]

export default function TransactionsPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  const filteredTransactions = DEMO_TRANSACTIONS.filter(tx => {
    const matchesSearch = tx.description.toLowerCase().includes(search.toLowerCase())
    const matchesType = typeFilter === 'all' || tx.type === typeFilter
    return matchesSearch && matchesType
  })

  const totalDeposit = DEMO_TRANSACTIONS.filter(t => t.type === 'deposit').reduce((sum, t) => sum + t.amount, 0)
  const totalSpent = Math.abs(DEMO_TRANSACTIONS.filter(t => t.type === 'purchase').reduce((sum, t) => sum + t.amount, 0))
  const totalRefund = DEMO_TRANSACTIONS.filter(t => t.type === 'refund').reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-dark-900 dark:text-white flex items-center gap-3">
          <CreditCard className="w-8 h-8 text-primary-500" />
          Lịch sử giao dịch
        </h1>
        <p className="text-dark-600 dark:text-dark-400 mt-1">
          Xem tất cả giao dịch nạp tiền, chi tiêu và hoàn tiền
        </p>
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
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input-field pr-10 appearance-none cursor-pointer"
            >
              <option value="all">Tất cả</option>
              <option value="deposit">Nạp tiền</option>
              <option value="purchase">Chi tiêu</option>
              <option value="refund">Hoàn tiền</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="glass-card overflow-hidden">
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
                    <p className="font-medium">{tx.description}</p>
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
      </div>
    </div>
  )
}

