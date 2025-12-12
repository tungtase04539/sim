'use client'

import { useState } from 'react'
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical,
  Mail,
  Wallet,
  ShoppingCart,
  ChevronDown,
  UserPlus,
  Ban,
  Edit,
  Trash2
} from 'lucide-react'
import { cn, formatCurrency, formatDate } from '@/lib/utils'

// Demo data
const DEMO_USERS = [
  { id: '1', email: 'user1@example.com', full_name: 'Nguyễn Văn A', balance: 500000, orders: 45, role: 'user', status: 'active', created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '2', email: 'user2@example.com', full_name: 'Trần Thị B', balance: 1200000, orders: 120, role: 'user', status: 'active', created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '3', email: 'user3@example.com', full_name: 'Lê Văn C', balance: 350000, orders: 28, role: 'user', status: 'active', created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '4', email: 'admin@example.com', full_name: 'Admin User', balance: 0, orders: 0, role: 'admin', status: 'active', created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '5', email: 'user4@example.com', full_name: 'Phạm Văn D', balance: 0, orders: 5, role: 'user', status: 'banned', created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '6', email: 'user5@example.com', full_name: 'Hoàng Thị E', balance: 2500000, orders: 250, role: 'user', status: 'active', created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString() },
]

export default function AdminUsersPage() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  const filteredUsers = DEMO_USERS.filter(user => {
    const matchesSearch = 
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(search.toLowerCase())
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const toggleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const toggleSelectAll = () => {
    setSelectedUsers(prev => 
      prev.length === filteredUsers.length 
        ? []
        : filteredUsers.map(u => u.id)
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-900 dark:text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-500" />
            Quản lý người dùng
          </h1>
          <p className="text-dark-600 dark:text-dark-400 mt-1">
            Tổng cộng {DEMO_USERS.length} người dùng
          </p>
        </div>

        <button className="btn-primary flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          Thêm user
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
            <input
              type="text"
              placeholder="Tìm theo email, tên..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Role Filter */}
          <div className="relative">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="input-field pr-10 appearance-none cursor-pointer"
            >
              <option value="all">Tất cả role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field pr-10 appearance-none cursor-pointer"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="banned">Bị cấm</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400 pointer-events-none" />
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="mt-4 pt-4 border-t border-dark-200 dark:border-dark-700 flex items-center gap-4">
            <span className="text-sm text-dark-500">
              Đã chọn {selectedUsers.length} user
            </span>
            <button className="text-sm text-red-600 hover:underline flex items-center gap-1">
              <Ban className="w-4 h-4" />
              Cấm
            </button>
            <button className="text-sm text-red-600 hover:underline flex items-center gap-1">
              <Trash2 className="w-4 h-4" />
              Xóa
            </button>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-50 dark:bg-dark-800">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-dark-300"
                  />
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-dark-500">User</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-dark-500">Số dư</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-dark-500">Đơn hàng</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-dark-500">Role</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-dark-500">Trạng thái</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-dark-500">Ngày tạo</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr 
                  key={user.id} 
                  className={cn(
                    "table-row",
                    index % 2 === 0 && "bg-dark-50/50 dark:bg-dark-800/30"
                  )}
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleSelectUser(user.id)}
                      className="w-4 h-4 rounded border-dark-300"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold">
                        {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-dark-800 dark:text-white">
                          {user.full_name || 'N/A'}
                        </p>
                        <p className="text-sm text-dark-500 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-primary-600 dark:text-primary-400 flex items-center gap-1">
                      <Wallet className="w-4 h-4" />
                      {formatCurrency(user.balance)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1 text-dark-600 dark:text-dark-300">
                      <ShoppingCart className="w-4 h-4" />
                      {user.orders}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      user.role === 'admin' 
                        ? "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                        : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                    )}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      user.status === 'active' 
                        ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                    )}>
                      {user.status === 'active' ? 'Hoạt động' : 'Bị cấm'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-dark-500 text-sm">
                    {formatDate(user.created_at)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-700 text-dark-500 hover:text-primary-500">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-700 text-dark-500 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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

