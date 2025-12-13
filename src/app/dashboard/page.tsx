import { createServerSupabaseClient } from '@/lib/supabase/server'
import { formatCurrency, formatDate, formatShortDate } from '@/lib/utils'
import Link from 'next/link'
import { 
  Wallet, 
  ShoppingCart, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  Phone,
  CreditCard,
  History,
  Key
} from 'lucide-react'

async function getDashboardData(userId: string) {
  const supabase = await createServerSupabaseClient()
  
  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  // Get recent orders
  const { data: orders } = await supabase
    .from('otp_orders')
    .select(`
      *,
      services:service_id(name, code),
      countries:country_id(name, code, flag)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(5)

  // Get recent transactions
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(5)

  // Get stats
  const { count: totalOrders } = await supabase
    .from('otp_orders')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  const { count: successOrders } = await supabase
    .from('otp_orders')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'success')

  const { count: pendingOrders } = await supabase
    .from('otp_orders')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'waiting')

  return {
    profile,
    orders: orders || [],
    transactions: transactions || [],
    stats: {
      totalOrders: totalOrders || 0,
      successOrders: successOrders || 0,
      pendingOrders: pendingOrders || 0,
      successRate: totalOrders ? Math.round((successOrders || 0) / totalOrders * 100) : 0
    }
  }
}

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  const { profile, orders, transactions, stats } = await getDashboardData(user.id)

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-dark-900 dark:text-white mb-2">
          Xin chào, {profile?.full_name || 'User'}! 👋
        </h1>
        <p className="text-dark-500 dark:text-dark-400">
          Tổng quan hoạt động tài khoản của bạn
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 hover:shadow-lg transition-all border border-dark-200/50 dark:border-dark-700/50">
          <div className="flex items-start justify-between mb-4">
            <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-md">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <Link href="/dashboard/deposit" className="text-primary-600 dark:text-primary-400 text-xs font-medium hover:underline flex items-center gap-1 px-2 py-1 rounded-md hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
              Nạp thêm <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <p className="text-xs text-dark-500 dark:text-dark-400 mb-1">Số dư hiện tại</p>
          <p className="text-2xl font-bold text-dark-900 dark:text-white">
            {formatCurrency(profile?.balance)}
          </p>
        </div>

        <div className="glass-card p-5 hover:shadow-lg transition-all border border-dark-200/50 dark:border-dark-700/50">
          <div className="flex items-start justify-between mb-4">
            <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-md font-medium">
              Tháng này
            </span>
          </div>
          <p className="text-xs text-dark-500 dark:text-dark-400 mb-1">Tổng đơn hàng</p>
          <p className="text-2xl font-bold text-dark-900 dark:text-white">{stats.totalOrders}</p>
        </div>

        <div className="glass-card p-5 hover:shadow-lg transition-all border border-dark-200/50 dark:border-dark-700/50">
          <div className="flex items-start justify-between mb-4">
            <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-md font-medium flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> {stats.successRate}%
            </span>
          </div>
          <p className="text-xs text-dark-500 dark:text-dark-400 mb-1">Thành công</p>
          <p className="text-2xl font-bold text-dark-900 dark:text-white">{stats.successOrders}</p>
        </div>

        <div className="glass-card p-5 hover:shadow-lg transition-all border border-dark-200/50 dark:border-dark-700/50">
          <div className="flex items-start justify-between mb-4">
            <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <Link href="/dashboard/history" className="text-xs text-orange-600 dark:text-orange-400 font-medium hover:underline px-2 py-1 rounded-md hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors">
              Xem
            </Link>
          </div>
          <p className="text-xs text-dark-500 dark:text-dark-400 mb-1">Đang chờ</p>
          <p className="text-2xl font-bold text-dark-900 dark:text-white">{stats.pendingOrders}</p>
        </div>
      </div>

      {/* Recent Orders & Transactions */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Recent Orders */}
        <div className="glass-card p-5 border border-dark-200/50 dark:border-dark-700/50">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-dark-900 dark:text-white">Đơn hàng gần đây</h2>
            <Link href="/dashboard/history" className="text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium">
              Xem tất cả →
            </Link>
          </div>
          
          {orders.length === 0 ? (
            <div className="text-center py-12 text-dark-400">
              <Phone className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm mb-2">Chưa có đơn hàng nào</p>
              <Link href="/dashboard/rent" className="text-xs text-primary-600 hover:underline font-medium">
                Thuê OTP ngay →
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {orders.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-dark-50/50 dark:bg-dark-700/30 hover:bg-dark-100 dark:hover:bg-dark-700/50 transition-colors border border-dark-200/30 dark:border-dark-700/30">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="text-xl flex-shrink-0">{order.countries?.flag || '🌍'}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-dark-900 dark:text-white truncate">
                        {order.services?.name || 'Service'}
                      </p>
                      <p className="text-xs text-dark-500 truncate">{order.phone_number || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    {order.otp_code ? (
                      <p className="font-mono font-bold text-sm text-green-600 dark:text-green-400">{order.otp_code}</p>
                    ) : order.status === 'waiting' ? (
                      <p className="text-xs text-orange-600 dark:text-orange-400">Đang chờ...</p>
                    ) : (
                      <p className="text-xs text-red-600 dark:text-red-400">Thất bại</p>
                    )}
                    <p className="text-xs text-dark-400 mt-0.5">{formatShortDate(order.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="glass-card p-5 border border-dark-200/50 dark:border-dark-700/50">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-dark-900 dark:text-white">Giao dịch gần đây</h2>
            <Link href="/dashboard/transactions" className="text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium">
              Xem tất cả →
            </Link>
          </div>
          
          {transactions.length === 0 ? (
            <div className="text-center py-12 text-dark-400">
              <CreditCard className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm mb-2">Chưa có giao dịch nào</p>
              <Link href="/dashboard/deposit" className="text-xs text-primary-600 hover:underline font-medium">
                Nạp tiền ngay →
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {transactions.map((tx: any) => (
                <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-dark-50/50 dark:bg-dark-700/30 hover:bg-dark-100 dark:hover:bg-dark-700/50 transition-colors border border-dark-200/30 dark:border-dark-700/30">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
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
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-dark-900 dark:text-white truncate">{tx.description || 'Giao dịch'}</p>
                      <p className="text-xs text-dark-500">{formatShortDate(tx.created_at)}</p>
                    </div>
                  </div>
                  <p className={`font-semibold text-sm flex-shrink-0 ml-2 ${tx.amount > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card p-5 border border-dark-200/50 dark:border-dark-700/50">
        <h2 className="text-base font-semibold text-dark-900 dark:text-white mb-4">Thao tác nhanh</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link href="/dashboard/rent" className="flex flex-col items-center p-4 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 text-white hover:shadow-lg hover:shadow-primary-500/30 transition-all hover:scale-105">
            <Phone className="w-6 h-6 mb-2" />
            <span className="text-sm font-medium">Thuê OTP</span>
          </Link>
          <Link href="/dashboard/deposit" className="flex flex-col items-center p-4 rounded-lg bg-gradient-to-br from-green-500 to-green-600 text-white hover:shadow-lg hover:shadow-green-500/30 transition-all hover:scale-105">
            <Wallet className="w-6 h-6 mb-2" />
            <span className="text-sm font-medium">Nạp tiền</span>
          </Link>
          <Link href="/dashboard/history" className="flex flex-col items-center p-4 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/30 transition-all hover:scale-105">
            <History className="w-6 h-6 mb-2" />
            <span className="text-sm font-medium">Lịch sử</span>
          </Link>
          <Link href="/dashboard/api" className="flex flex-col items-center p-4 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all hover:scale-105">
            <Key className="w-6 h-6 mb-2" />
            <span className="text-sm font-medium">API</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
