import { createServerSupabaseClient } from '@/lib/supabase/server'
import { formatCurrency, formatDate } from '@/lib/utils'
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

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-6 card-hover">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <Link href="/dashboard/deposit" className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline flex items-center gap-1">
              Nạp thêm <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <p className="text-dark-500 mt-4 text-sm">Số dư hiện tại</p>
          <p className="text-2xl font-bold text-dark-900 dark:text-white">
            {formatCurrency(profile?.balance || 0)}
          </p>
        </div>

        <div className="glass-card p-6 card-hover">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full">
              Tháng này
            </span>
          </div>
          <p className="text-dark-500 mt-4 text-sm">Tổng đơn hàng</p>
          <p className="text-2xl font-bold text-dark-900 dark:text-white">{stats.totalOrders}</p>
        </div>

        <div className="glass-card p-6 card-hover">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> {stats.successRate}%
            </span>
          </div>
          <p className="text-dark-500 mt-4 text-sm">Thành công</p>
          <p className="text-2xl font-bold text-dark-900 dark:text-white">{stats.successOrders}</p>
        </div>

        <div className="glass-card p-6 card-hover">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <Link href="/dashboard/history" className="text-orange-600 dark:text-orange-400 text-sm font-medium hover:underline">
              Xem
            </Link>
          </div>
          <p className="text-dark-500 mt-4 text-sm">Đang chờ</p>
          <p className="text-2xl font-bold text-dark-900 dark:text-white">{stats.pendingOrders}</p>
        </div>
      </div>

      {/* Recent Orders & Transactions */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-dark-900 dark:text-white">Đơn hàng gần đây</h2>
            <Link href="/dashboard/history" className="text-primary-600 dark:text-primary-400 text-sm hover:underline">
              Xem tất cả
            </Link>
          </div>
          
          {orders.length === 0 ? (
            <div className="text-center py-8 text-dark-500">
              <Phone className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Chưa có đơn hàng nào</p>
              <Link href="/dashboard/rent" className="text-primary-600 hover:underline text-sm">
                Thuê OTP ngay
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-dark-50 dark:bg-dark-700/50 hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{order.countries?.flag || '🌍'}</div>
                    <div>
                      <p className="font-medium text-dark-900 dark:text-white">
                        {order.services?.name || 'Service'} 
                        <span className="text-xs text-dark-500 ml-2">{order.countries?.name}</span>
                      </p>
                      <p className="text-sm text-dark-500">{order.phone_number}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {order.otp_code ? (
                      <p className="font-mono font-bold text-green-600">{order.otp_code}</p>
                    ) : order.status === 'waiting' ? (
                      <p className="text-orange-600 text-sm">Đang chờ...</p>
                    ) : (
                      <p className="text-red-600 text-sm">Thất bại</p>
                    )}
                    <p className="text-xs text-dark-400">{formatDate(order.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-dark-900 dark:text-white">Giao dịch gần đây</h2>
            <Link href="/dashboard/transactions" className="text-primary-600 dark:text-primary-400 text-sm hover:underline">
              Xem tất cả
            </Link>
          </div>
          
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-dark-500">
              <CreditCard className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Chưa có giao dịch nào</p>
              <Link href="/dashboard/deposit" className="text-primary-600 hover:underline text-sm">
                Nạp tiền ngay
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx: any) => (
                <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl bg-dark-50 dark:bg-dark-700/50">
                  <div className="flex items-center gap-3">
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
                    <div>
                      <p className="font-medium text-dark-900 dark:text-white">{tx.description}</p>
                      <p className="text-xs text-dark-500">{formatDate(tx.created_at)}</p>
                    </div>
                  </div>
                  <p className={`font-semibold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">Thao tác nhanh</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/dashboard/rent" className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white hover:shadow-lg hover:shadow-primary-500/25 transition-all">
            <Phone className="w-8 h-8 mb-2" />
            <span className="font-medium">Thuê OTP</span>
          </Link>
          <Link href="/dashboard/deposit" className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white hover:shadow-lg hover:shadow-green-500/25 transition-all">
            <Wallet className="w-8 h-8 mb-2" />
            <span className="font-medium">Nạp tiền</span>
          </Link>
          <Link href="/dashboard/history" className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all">
            <History className="w-8 h-8 mb-2" />
            <span className="font-medium">Lịch sử</span>
          </Link>
          <Link href="/dashboard/api" className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all">
            <Key className="w-8 h-8 mb-2" />
            <span className="font-medium">API</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
