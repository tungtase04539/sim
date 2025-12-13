'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTheme } from '@/components/Providers'
import { 
  Moon, 
  Sun, 
  Bell, 
  User, 
  ChevronDown,
  Settings,
  LogOut,
  Wallet
} from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'

interface HeaderProps {
  user: {
    email: string
    full_name: string | null
    balance: number
    role: string
  }
}

export default function DashboardHeader({ user }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notifications] = useState([
    { id: 1, title: 'Nạp tiền thành công', message: '+100,000 VND', time: '5 phút trước' },
    { id: 2, title: 'OTP đã nhận', message: 'Facebook - 123456', time: '10 phút trước' },
  ])
  const [notifOpen, setNotifOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 h-14 glass border-b border-dark-200/50 dark:border-dark-700/50 px-5 flex items-center justify-between backdrop-blur-sm bg-white/80 dark:bg-dark-800/80">
      {/* Page Title - will be dynamic */}
      <div className="lg:hidden w-10" /> {/* Spacer for mobile menu button */}
      
      <div className="hidden lg:block">
        <h1 className="text-base font-semibold text-dark-800 dark:text-white">Dashboard</h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Balance Badge */}
        <Link 
          href="/dashboard/deposit"
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-200/50 dark:border-primary-800/50 hover:border-primary-400 dark:hover:border-primary-600 transition-all hover:shadow-sm"
        >
          <Wallet className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
          <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
            {formatCurrency(user.balance)}
          </span>
        </Link>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-dark-100 dark:bg-dark-700 hover:bg-dark-200 dark:hover:bg-dark-600 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-yellow-500" />
          ) : (
            <Moon className="w-4 h-4 text-dark-600" />
          )}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-lg bg-dark-100 dark:bg-dark-700 hover:bg-dark-200 dark:hover:bg-dark-600 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {notifications.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
                {notifications.length}
              </span>
            )}
          </button>

          {notifOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 mt-2 w-80 glass-card py-2 z-50 animate-slide-down">
                <div className="px-4 py-2 border-b border-dark-200 dark:border-dark-700">
                  <h3 className="font-semibold">Thông báo</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="px-4 py-3 hover:bg-dark-50 dark:hover:bg-dark-700/50 cursor-pointer border-b border-dark-100 dark:border-dark-700 last:border-b-0"
                    >
                      <p className="font-medium text-sm">{notif.title}</p>
                      <p className="text-sm text-dark-500 dark:text-dark-400">{notif.message}</p>
                      <p className="text-xs text-dark-400 mt-1">{notif.time}</p>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-dark-200 dark:border-dark-700">
                  <Link 
                    href="/dashboard/notifications"
                    className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                    onClick={() => setNotifOpen(false)}
                  >
                    Xem tất cả
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 p-1.5 rounded-lg bg-dark-100 dark:bg-dark-700 hover:bg-dark-200 dark:hover:bg-dark-600 transition-colors"
            aria-label="User menu"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-sm">
              <User className="w-3.5 h-3.5 text-white" />
            </div>
            <ChevronDown className={cn(
              "w-3.5 h-3.5 transition-transform hidden sm:block text-dark-500",
              userMenuOpen && "rotate-180"
            )} />
          </button>

          {userMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
              <div className="absolute right-0 mt-2 w-56 glass-card py-2 z-50 animate-slide-down">
                <div className="px-4 py-2 border-b border-dark-200 dark:border-dark-700">
                  <p className="font-medium truncate">{user.full_name || 'User'}</p>
                  <p className="text-sm text-dark-500 dark:text-dark-400 truncate">{user.email}</p>
                </div>
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-3 px-4 py-2 hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <Settings className="w-4 h-4" />
                  <span>Cài đặt</span>
                </Link>
                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-3 px-4 py-2 hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors text-accent-600 dark:text-accent-400"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <span>🔐</span>
                    <span>Admin Panel</span>
                  </Link>
                )}
                <hr className="my-2 border-dark-200 dark:border-dark-700" />
                <form action="/auth/signout" method="POST">
                  <button
                    type="submit"
                    className="flex items-center gap-3 px-4 py-2 w-full text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Đăng xuất</span>
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

