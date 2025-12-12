import { createServerSupabaseClient } from '@/lib/supabase/server'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Users, Search, Shield, User } from 'lucide-react'

async function getUsers() {
  const supabase = await createServerSupabaseClient()
  
  const { data: users, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  return users || []
}

export default async function AdminUsersPage() {
  const users = await getUsers()

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-dark-900 dark:text-white flex items-center gap-3">
          <Users className="w-8 h-8 text-primary-500" />
          Quản lý người dùng
        </h1>
        <p className="text-dark-600 dark:text-dark-400 mt-1">
          Xem và quản lý tất cả người dùng trong hệ thống
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-4 text-center">
          <p className="text-sm text-dark-500">Tổng người dùng</p>
          <p className="text-2xl font-bold text-dark-900 dark:text-white">{users.length}</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-sm text-dark-500">Admin</p>
          <p className="text-2xl font-bold text-purple-600">
            {users.filter(u => u.role === 'admin').length}
          </p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-sm text-dark-500">Tổng số dư</p>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(users.reduce((sum, u) => sum + (u.balance || 0), 0))}
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card overflow-hidden">
        {users.length === 0 ? (
          <div className="text-center py-12 text-dark-500">
            <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Chưa có người dùng</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-50 dark:bg-dark-800">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-dark-500">Người dùng</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-dark-500">Email</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-dark-500">Vai trò</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-dark-500">Số dư</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-dark-500">Ngày tạo</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, i) => (
                  <tr key={user.id} className={i % 2 === 0 ? 'bg-dark-50/50 dark:bg-dark-800/30' : ''}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-medium">
                          {user.full_name?.charAt(0) || 'U'}
                        </div>
                        <span className="font-medium text-dark-900 dark:text-white">
                          {user.full_name || 'Unknown'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-dark-600">{user.email}</td>
                    <td className="px-6 py-4">
                      {user.role === 'admin' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                          <Shield className="w-3 h-3" />
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                          <User className="w-3 h-3" />
                          User
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-green-600">
                      {formatCurrency(user.balance || 0)}
                    </td>
                    <td className="px-6 py-4 text-dark-500 text-sm">
                      {formatDate(user.created_at)}
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
