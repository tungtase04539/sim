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
    <div className="space-y-8 animate-fade-in">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary-700 dark:text-primary-300 mb-3">
          Xin chào, {profile?.full_name || 'User'}! 👋
        </h1>
        <p className="text-gray-700 dark:text-gray-300 text-lg">
          Tổng quan hoạt động tài khoản của bạn
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card-strong p-6 card-hover">
          <div className="flex items-start justify-between mb-5">
            <div className="w-14 h-14 rounded-md bg-gradient-to-br from-primary-500 via-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
              <Wallet className="w-7 h-7 text-white drop-shadow-lg" />
            </div>
            <Link href="/dashboard/deposit" className="text-xs font-semibold text-white/80 hover:text-white hover:underline flex items-center gap-1 px-3 py-1.5 rounded-xl backdrop-blur-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all">
              Nạp thêm <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider font-medium">Số dư hiện tại</p>
          <p className="text-3xl font-bold text-primary-700 dark:text-primary-300">
            {formatCurrency(profile?.balance)}
          </p>
        </div>

        <div className="glass-card-strong p-6 card-hover animate-float" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-start justify-between mb-5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 flex items-center justify-center shadow-2xl animate-pulse-glow">
              <ShoppingCart className="w-7 h-7 text-white drop-shadow-lg" />
            </div>
            <span className="text-xs px-3 py-1.5 backdrop-blur-xl bg-blue-500/20 text-white rounded-xl font-semibold border border-white/20">
              Tháng này
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider font-medium">Tổng đơn hàng</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalOrders}</p>
        </div>

        <div className="glass-card-strong p-6 card-hover animate-float" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-start justify-between mb-5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 flex items-center justify-center shadow-2xl animate-pulse-glow">
              <CheckCircle2 className="w-7 h-7 text-white drop-shadow-lg" />
            </div>
            <span className="text-xs px-3 py-1.5 backdrop-blur-xl bg-green-500/20 text-white rounded-xl font-semibold border border-white/20 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> {stats.successRate}%
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider font-medium">Thành công</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.successOrders}</p>
        </div>

        <div className="glass-card-strong p-6 card-hover animate-float" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-start justify-between mb-5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 flex items-center justify-center shadow-2xl animate-pulse-glow">
              <Clock className="w-7 h-7 text-white drop-shadow-lg" />
            </div>
            <Link href="/dashboard/history" className="text-xs font-semibold text-white/80 hover:text-white hover:underline px-3 py-1.5 rounded-xl backdrop-blur-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all">
              Xem
            </Link>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider font-medium">Đang chờ</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.pendingOrders}</p>
        </div>
      </div>

      {/* Recent Orders & Transactions */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="glass-card-strong p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white drop-shadow-md">Đơn hàng gần đây</h2>
            <Link href="/dashboard/history" className="text-xs font-semibold gradient-text hover:underline">
              Xem tất cả →
            </Link>
          </div>
          
          {orders.length === 0 ? (
            <div className="text-center py-16 text-white/60">
              <Phone className="w-16 h-16 mx-auto mb-4 opacity-40" />
              <p className="text-sm mb-3 font-medium">Chưa có đơn hàng nào</p>
              <Link href="/dashboard/rent" className="text-xs font-semibold gradient-text hover:underline">
                Thuê OTP ngay →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order: any, index: number) => (
                <div key={order.id} className="flex items-center justify-between p-4 rounded-2xl backdrop-blur-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all hover:scale-[1.02] hover:shadow-xl animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="text-2xl flex-shrink-0 drop-shadow-lg">{order.countries?.flag || '🌍'}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-white truncate drop-shadow-sm">
                        {order.services?.name || 'Service'}
                      </p>
                      <p className="text-xs text-white/70 truncate mt-1">{order.phone_number || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    {order.otp_code ? (
                      <p className="font-mono font-bold text-base text-green-300 drop-shadow-lg">{order.otp_code}</p>
                    ) : order.status === 'waiting' ? (
                      <p className="text-xs text-orange-300 font-medium">Đang chờ...</p>
                    ) : (
                      <p className="text-xs text-red-300 font-medium">Thất bại</p>
                    )}
                    <p className="text-xs text-white/60 mt-1">{formatShortDate(order.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="glass-card-strong p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white drop-shadow-md">Giao dịch gần đây</h2>
            <Link href="/dashboard/transactions" className="text-xs font-semibold gradient-text hover:underline">
              Xem tất cả →
            </Link>
          </div>
          
          {transactions.length === 0 ? (
            <div className="text-center py-16 text-white/60">
              <CreditCard className="w-16 h-16 mx-auto mb-4 opacity-40" />
              <p className="text-sm mb-3 font-medium">Chưa có giao dịch nào</p>
              <Link href="/dashboard/deposit" className="text-xs font-semibold gradient-text hover:underline">
                Nạp tiền ngay →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx: any, index: number) => (
                <div key={tx.id} className="flex items-center justify-between p-4 rounded-2xl backdrop-blur-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all hover:scale-[1.02] hover:shadow-xl animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                      tx.type === 'deposit' ? 'bg-gradient-to-br from-green-500/30 to-emerald-500/30 border border-green-400/30' :
                      tx.type === 'refund' ? 'bg-gradient-to-br from-purple-500/30 to-pink-500/30 border border-purple-400/30' :
                      'bg-gradient-to-br from-red-500/30 to-orange-500/30 border border-red-400/30'
                    }`}>
                      {tx.amount > 0 ? (
                        <ArrowDownRight className={`w-5 h-5 ${tx.type === 'deposit' ? 'text-green-300' : 'text-purple-300'} drop-shadow-lg`} />
                      ) : (
                        <ArrowUpRight className="w-5 h-5 text-red-300 drop-shadow-lg" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-white truncate drop-shadow-sm">{tx.description || 'Giao dịch'}</p>
                      <p className="text-xs text-white/70 mt-1">{formatShortDate(tx.created_at)}</p>
                    </div>
                  </div>
                  <p className={`font-bold text-base flex-shrink-0 ml-3 drop-shadow-lg ${tx.amount > 0 ? 'text-green-300' : 'text-red-300'}`}>
                    {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card-strong p-6">
        <h2 className="text-lg font-bold text-white drop-shadow-md mb-6">Thao tác nhanh</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link href="/dashboard/rent" className="group flex flex-col items-center p-6 rounded-md backdrop-blur-xl bg-gradient-to-br from-primary-500/30 via-blue-500/30 to-blue-600/30 border border-white/30 hover:border-white/50 text-white transition-all">
            <Phone className="w-8 h-8 mb-3 drop-shadow-lg group-hover:scale-110 transition-transform" />
            <span className="text-sm font-bold drop-shadow-md">Thuê OTP</span>
          </Link>
          <Link href="/dashboard/deposit" className="group flex flex-col items-center p-6 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-green-500/30 via-emerald-500/30 to-teal-500/30 border border-white/30 hover:border-white/50 text-white hover:shadow-2xl transition-all hover:scale-110 glow-effect animate-float" style={{ animationDelay: '0.1s' }}>
            <Wallet className="w-8 h-8 mb-3 drop-shadow-lg group-hover:scale-110 transition-transform" />
            <span className="text-sm font-bold drop-shadow-md">Nạp tiền</span>
          </Link>
          <Link href="/dashboard/history" className="group flex flex-col items-center p-6 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-blue-500/30 via-cyan-500/30 to-sky-500/30 border border-white/30 hover:border-white/50 text-white hover:shadow-2xl transition-all hover:scale-110 glow-effect animate-float" style={{ animationDelay: '0.2s' }}>
            <History className="w-8 h-8 mb-3 drop-shadow-lg group-hover:scale-110 transition-transform" />
            <span className="text-sm font-bold drop-shadow-md">Lịch sử</span>
          </Link>
          <Link href="/dashboard/api" className="group flex flex-col items-center p-6 rounded-md backdrop-blur-xl bg-gradient-to-br from-blue-500/30 via-blue-600/30 to-primary-500/30 border border-white/30 hover:border-white/50 text-white transition-all">
            <Key className="w-8 h-8 mb-3 drop-shadow-lg group-hover:scale-110 transition-transform" />
            <span className="text-sm font-bold drop-shadow-md">API</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
