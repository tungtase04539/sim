import { createServerSupabaseClient } from '@/lib/supabase/server'
import { formatCurrency } from '@/lib/utils'
import { 
  Users, 
  CreditCard, 
  Phone, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

async function getAdminStats() {
  const supabase = await createServerSupabaseClient()
  
  // Get total users
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  // Get total orders
  const { count: totalOrders } = await supabase
    .from('otp_orders')
    .select('*', { count: 'exact', head: true })

  // Get total deposits
  const { data: deposits } = await supabase
    .from('transactions')
    .select('amount')
    .eq('type', 'deposit')
    .eq('status', 'completed')

  const totalDeposits = deposits?.reduce((sum, d) => sum + d.amount, 0) || 0

  // Get today's stats
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const { count: todayOrders } = await supabase
    .from('otp_orders')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', today.toISOString())

  const { data: todayDeposits } = await supabase
    .from('transactions')
    .select('amount')
    .eq('type', 'deposit')
    .eq('status', 'completed')
    .gte('created_at', today.toISOString())

  const todayRevenue = todayDeposits?.reduce((sum, d) => sum + d.amount, 0) || 0

  // Get recent orders
  const { data: recentOrders } = await supabase
    .from('otp_orders')
    .select(`
      *,
      profiles:user_id(full_name, email),
      services:service_id(name),
      countries:country_id(name, flag)
    `)
    .order('created_at', { ascending: false })
    .limit(10)

  // Get recent transactions
  const { data: recentTransactions } = await supabase
    .from('transactions')
    .select(`
      *,
      profiles:user_id(full_name, email)
    `)
    .order('created_at', { ascending: false })
    .limit(10)

  return {
    totalUsers: totalUsers || 0,
    totalOrders: totalOrders || 0,
    totalDeposits,
    todayOrders: todayOrders || 0,
    todayRevenue,
    recentOrders: recentOrders || [],
    recentTransactions: recentTransactions || [],
  }
}

export default async function AdminDashboard() {
  const stats = await getAdminStats()

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-dark-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="text-dark-600 dark:text-dark-400 mt-1">
          Tổng quan hoạt động hệ thống
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-dark-500 mt-4 text-sm">Tổng người dùng</p>
          <p className="text-2xl font-bold text-dark-900 dark:text-white">{stats.totalUsers}</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-dark-500 mt-4 text-sm">Tổng nạp tiền</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalDeposits)}</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <Phone className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-dark-500 mt-4 text-sm">Tổng đơn hàng</p>
          <p className="text-2xl font-bold text-dark-900 dark:text-white">{stats.totalOrders}</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-dark-500 mt-4 text-sm">Doanh thu hôm nay</p>
          <p className="text-2xl font-bold text-orange-600">{formatCurrency(stats.todayRevenue)}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
            Đơn hàng gần đây
          </h2>
          
          {stats.recentOrders.length === 0 ? (
            <p className="text-dark-500 text-center py-8">Chưa có đơn hàng</p>
          ) : (
            <div className="space-y-3">
              {stats.recentOrders.slice(0, 5).map((order: any) => (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-dark-50 dark:bg-dark-700/50">
                  <div>
                    <p className="font-medium text-dark-900 dark:text-white">
                      {order.services?.name} - {order.countries?.flag} {order.countries?.name}
                    </p>
                    <p className="text-sm text-dark-500">
                      {order.profiles?.email || 'Unknown'}
                    </p>
                  </div>
                  <div className="text-right">
                    {order.otp_code ? (
                      <span className="text-green-600 font-mono">{order.otp_code}</span>
                    ) : (
                      <span className="text-orange-500 text-sm">Đang chờ</span>
                    )}
                    <p className="text-xs text-dark-400">{formatCurrency(order.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
            Giao dịch gần đây
          </h2>
          
          {stats.recentTransactions.length === 0 ? (
            <p className="text-dark-500 text-center py-8">Chưa có giao dịch</p>
          ) : (
            <div className="space-y-3">
              {stats.recentTransactions.slice(0, 5).map((tx: any) => (
                <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl bg-dark-50 dark:bg-dark-700/50">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      tx.amount > 0 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
                    }`}>
                      {tx.amount > 0 ? (
                        <ArrowDownRight className="w-4 h-4 text-green-600" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-dark-900 dark:text-white text-sm">
                        {tx.description}
                      </p>
                      <p className="text-xs text-dark-500">{tx.profiles?.email}</p>
                    </div>
                  </div>
                  <span className={`font-semibold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
