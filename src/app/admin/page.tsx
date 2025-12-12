import { createServerSupabaseClient } from '@/lib/supabase/server'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { 
  Users, 
  DollarSign, 
  ShoppingCart, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Phone,
  CreditCard
} from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboardPage() {
  // Demo data - in production would come from database
  const stats = {
    totalUsers: 1250,
    newUsersToday: 23,
    totalRevenue: 125000000,
    revenueToday: 5200000,
    totalOrders: 45600,
    ordersToday: 342,
    successRate: 95.5,
    pendingDeposits: 5,
  }

  const recentUsers = [
    { id: '1', email: 'user1@example.com', name: 'Nguyễn Văn A', balance: 500000, orders: 45, created: '10 phút trước' },
    { id: '2', email: 'user2@example.com', name: 'Trần Thị B', balance: 1200000, orders: 120, created: '30 phút trước' },
    { id: '3', email: 'user3@example.com', name: 'Lê Văn C', balance: 350000, orders: 28, created: '1 giờ trước' },
  ]

  const recentTransactions = [
    { id: '1', user: 'user1@example.com', type: 'deposit', amount: 500000, status: 'completed', time: '5 phút trước' },
    { id: '2', user: 'user2@example.com', type: 'purchase', amount: -8000, status: 'completed', time: '8 phút trước' },
    { id: '3', user: 'user3@example.com', type: 'deposit', amount: 200000, status: 'pending', time: '15 phút trước' },
    { id: '4', user: 'user1@example.com', type: 'refund', amount: 5000, status: 'completed', time: '20 phút trước' },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-dark-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="text-dark-600 dark:text-dark-400 mt-1">
          Tổng quan hoạt động hệ thống
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="flex items-center gap-1 text-green-600 text-sm">
              <ArrowUpRight className="w-4 h-4" />
              +{stats.newUsersToday}
            </span>
          </div>
          <p className="text-sm text-dark-500 dark:text-dark-400">Tổng người dùng</p>
          <p className="text-2xl font-bold text-dark-900 dark:text-white">
            {formatNumber(stats.totalUsers)}
          </p>
        </div>

        {/* Total Revenue */}
        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600">
              Hôm nay: {formatCurrency(stats.revenueToday)}
            </span>
          </div>
          <p className="text-sm text-dark-500 dark:text-dark-400">Tổng doanh thu</p>
          <p className="text-2xl font-bold text-dark-900 dark:text-white">
            {formatCurrency(stats.totalRevenue)}
          </p>
        </div>

        {/* Total Orders */}
        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <span className="flex items-center gap-1 text-green-600 text-sm">
              +{stats.ordersToday} hôm nay
            </span>
          </div>
          <p className="text-sm text-dark-500 dark:text-dark-400">Tổng đơn hàng</p>
          <p className="text-2xl font-bold text-dark-900 dark:text-white">
            {formatNumber(stats.totalOrders)}
          </p>
        </div>

        {/* Success Rate */}
        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600">
              {stats.pendingDeposits} chờ xử lý
            </span>
          </div>
          <p className="text-sm text-dark-500 dark:text-dark-400">Tỉ lệ thành công</p>
          <p className="text-2xl font-bold text-dark-900 dark:text-white">
            {stats.successRate}%
          </p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-dark-900 dark:text-white">
              Người dùng mới
            </h2>
            <Link 
              href="/admin/users"
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              Xem tất cả
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-200 dark:border-dark-700">
                  <th className="text-left py-3 text-sm font-medium text-dark-500">Email</th>
                  <th className="text-right py-3 text-sm font-medium text-dark-500">Số dư</th>
                  <th className="text-right py-3 text-sm font-medium text-dark-500">Đơn</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((user) => (
                  <tr key={user.id} className="table-row">
                    <td className="py-3">
                      <p className="font-medium text-dark-800 dark:text-white">{user.name}</p>
                      <p className="text-sm text-dark-500">{user.email}</p>
                    </td>
                    <td className="py-3 text-right font-medium">
                      {formatCurrency(user.balance)}
                    </td>
                    <td className="py-3 text-right text-dark-500">
                      {user.orders}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-dark-900 dark:text-white">
              Giao dịch gần đây
            </h2>
            <Link 
              href="/admin/transactions"
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              Xem tất cả
            </Link>
          </div>
          
          <div className="space-y-3">
            {recentTransactions.map((tx) => (
              <div 
                key={tx.id}
                className="flex items-center gap-4 p-3 rounded-xl bg-dark-50 dark:bg-dark-700/50"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  tx.type === 'deposit' ? 'bg-green-100 dark:bg-green-900/30' :
                  tx.type === 'refund' ? 'bg-purple-100 dark:bg-purple-900/30' :
                  'bg-red-100 dark:bg-red-900/30'
                }`}>
                  {tx.type === 'deposit' ? (
                    <CreditCard className="w-5 h-5 text-green-600" />
                  ) : tx.type === 'refund' ? (
                    <ArrowDownRight className="w-5 h-5 text-purple-600" />
                  ) : (
                    <Phone className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-dark-800 dark:text-white truncate">
                    {tx.user}
                  </p>
                  <p className="text-xs text-dark-500">
                    {tx.type === 'deposit' ? 'Nạp tiền' : tx.type === 'refund' ? 'Hoàn tiền' : 'Thuê OTP'}
                    {' • '}{tx.time}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    tx.amount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    tx.status === 'completed' 
                      ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                  }`}>
                    {tx.status === 'completed' ? 'Hoàn thành' : 'Chờ xử lý'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
          Quản lý nhanh
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            href="/admin/users"
            className="p-4 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white text-center hover:shadow-lg hover:shadow-blue-500/30 transition-all"
          >
            <Users className="w-8 h-8 mx-auto mb-2" />
            <span className="font-medium">Quản lý User</span>
          </Link>
          <Link
            href="/admin/services"
            className="p-4 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white text-center hover:shadow-lg hover:shadow-green-500/30 transition-all"
          >
            <Phone className="w-8 h-8 mx-auto mb-2" />
            <span className="font-medium">Dịch vụ OTP</span>
          </Link>
          <Link
            href="/admin/transactions"
            className="p-4 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white text-center hover:shadow-lg hover:shadow-purple-500/30 transition-all"
          >
            <CreditCard className="w-8 h-8 mx-auto mb-2" />
            <span className="font-medium">Giao dịch</span>
          </Link>
          <Link
            href="/admin/settings"
            className="p-4 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white text-center hover:shadow-lg hover:shadow-amber-500/30 transition-all"
          >
            <TrendingUp className="w-8 h-8 mx-auto mb-2" />
            <span className="font-medium">Cài đặt</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

