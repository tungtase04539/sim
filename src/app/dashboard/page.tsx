import { formatCurrency, formatNumber } from '@/lib/utils'

// Demo mode check
const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || 
  process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://demo.supabase.co'

const DEMO_PROFILE = {
  id: 'demo-user-id',
  full_name: 'Demo User',
  balance: 500000,
}
import { 
  Wallet, 
  ShoppingCart, 
  CheckCircle2, 
  Clock,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import Link from 'next/link'

async function getProfile() {
  if (isDemoMode) {
    return DEMO_PROFILE
  }
  
  try {
    const { createServerSupabaseClient } = await import('@/lib/supabase/server')
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user?.id)
      .single()
    
    return profile || DEMO_PROFILE
  } catch {
    return DEMO_PROFILE
  }
}

export default async function DashboardPage() {
  const profile = await getProfile()

  // For demo purposes - these would come from actual database queries
  const stats = {
    balance: profile?.balance || 0,
    totalOrders: 156,
    successfulOrders: 148,
    pendingOrders: 3,
    todaySpent: 125000,
    thisMonthSpent: 2450000,
  }

  const recentOrders = [
    { id: '1', service: 'Facebook', country: '🇻🇳 Vietnam', phone: '+84912****78', status: 'success', otp: '123456', price: 5000, time: '5 phút trước' },
    { id: '2', service: 'Google', country: '🇮🇩 Indonesia', phone: '+62812****56', status: 'waiting', otp: null, price: 6000, time: '10 phút trước' },
    { id: '3', service: 'Telegram', country: '🇷🇺 Russia', phone: '+7912****34', status: 'success', otp: '654321', price: 8000, time: '15 phút trước' },
    { id: '4', service: 'TikTok', country: '🇺🇸 USA', phone: '+1312****90', status: 'failed', otp: null, price: 4500, time: '20 phút trước' },
  ]

  const recentTransactions = [
    { id: '1', type: 'deposit', amount: 500000, description: 'Nạp tiền qua MB Bank', time: '1 giờ trước' },
    { id: '2', type: 'purchase', amount: -5000, description: 'Thuê OTP - Facebook', time: '5 phút trước' },
    { id: '3', type: 'refund', amount: 4500, description: 'Hoàn tiền - TikTok lỗi', time: '20 phút trước' },
    { id: '4', type: 'purchase', amount: -8000, description: 'Thuê OTP - Telegram', time: '15 phút trước' },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-dark-900 dark:text-white">
          Xin chào, {profile?.full_name || 'User'}! 👋
        </h1>
        <p className="text-dark-600 dark:text-dark-400 mt-1">
          Đây là tổng quan hoạt động tài khoản của bạn.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Balance */}
        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <Link 
              href="/dashboard/deposit"
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
            >
              Nạp thêm
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <p className="text-sm text-dark-500 dark:text-dark-400">Số dư hiện tại</p>
          <p className="text-2xl font-bold text-dark-900 dark:text-white">
            {formatCurrency(stats.balance)}
          </p>
        </div>

        {/* Total Orders */}
        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              Tháng này
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <span className="flex items-center gap-1 text-green-600 text-sm">
              <TrendingUp className="w-4 h-4" />
              95%
            </span>
          </div>
          <p className="text-sm text-dark-500 dark:text-dark-400">Thành công</p>
          <p className="text-2xl font-bold text-dark-900 dark:text-white">
            {formatNumber(stats.successfulOrders)}
          </p>
        </div>

        {/* Pending */}
        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <Link 
              href="/dashboard/history?status=pending"
              className="text-sm text-amber-600 dark:text-amber-400 hover:underline"
            >
              Xem
            </Link>
          </div>
          <p className="text-sm text-dark-500 dark:text-dark-400">Đang chờ</p>
          <p className="text-2xl font-bold text-dark-900 dark:text-white">
            {stats.pendingOrders}
          </p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-dark-900 dark:text-white">
              Đơn hàng gần đây
            </h2>
            <Link 
              href="/dashboard/history"
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              Xem tất cả
            </Link>
          </div>
          
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div 
                key={order.id}
                className="flex items-center gap-4 p-3 rounded-xl bg-dark-50 dark:bg-dark-700/50 hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-dark-800 dark:text-white">
                      {order.service}
                    </span>
                    <span className="text-sm text-dark-500">{order.country}</span>
                  </div>
                  <p className="text-sm text-dark-500 dark:text-dark-400 font-mono">
                    {order.phone}
                  </p>
                </div>
                <div className="text-right">
                  {order.status === 'success' && (
                    <span className="text-lg font-mono font-bold text-green-600 dark:text-green-400">
                      {order.otp}
                    </span>
                  )}
                  {order.status === 'waiting' && (
                    <span className="text-sm text-amber-600 dark:text-amber-400">
                      Đang chờ...
                    </span>
                  )}
                  {order.status === 'failed' && (
                    <span className="text-sm text-red-600 dark:text-red-400">
                      Thất bại
                    </span>
                  )}
                  <p className="text-xs text-dark-400">{order.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-dark-900 dark:text-white">
              Giao dịch gần đây
            </h2>
            <Link 
              href="/dashboard/transactions"
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
                  {tx.amount > 0 ? (
                    <ArrowDownRight className={`w-5 h-5 ${
                      tx.type === 'deposit' ? 'text-green-600' : 'text-purple-600'
                    }`} />
                  ) : (
                    <ArrowUpRight className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-dark-800 dark:text-white truncate">
                    {tx.description}
                  </p>
                  <p className="text-xs text-dark-500">{tx.time}</p>
                </div>
                <div className={`font-semibold ${
                  tx.amount > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
          Thao tác nhanh
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            href="/dashboard/rent"
            className="p-4 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white text-center hover:shadow-lg hover:shadow-primary-500/30 transition-all"
          >
            <ShoppingCart className="w-8 h-8 mx-auto mb-2" />
            <span className="font-medium">Thuê OTP</span>
          </Link>
          <Link
            href="/dashboard/deposit"
            className="p-4 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white text-center hover:shadow-lg hover:shadow-green-500/30 transition-all"
          >
            <Wallet className="w-8 h-8 mx-auto mb-2" />
            <span className="font-medium">Nạp tiền</span>
          </Link>
          <Link
            href="/dashboard/history"
            className="p-4 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white text-center hover:shadow-lg hover:shadow-blue-500/30 transition-all"
          >
            <Clock className="w-8 h-8 mx-auto mb-2" />
            <span className="font-medium">Lịch sử</span>
          </Link>
          <Link
            href="/dashboard/api"
            className="p-4 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white text-center hover:shadow-lg hover:shadow-purple-500/30 transition-all"
          >
            <TrendingUp className="w-8 h-8 mx-auto mb-2" />
            <span className="font-medium">API</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

