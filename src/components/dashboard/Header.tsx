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
    <header className="sticky top-0 z-40 h-16 glass-card-strong border-b border-white/20 px-6 flex items-center justify-between backdrop-blur-2xl">
      {/* Page Title - will be dynamic */}
      <div className="lg:hidden w-10" /> {/* Spacer for mobile menu button */}
      
      <div className="hidden lg:block">
        <h1 className="text-lg font-bold gradient-text">Dashboard</h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Balance Badge */}
        <Link 
          href="/dashboard/deposit"
          className="hidden sm:flex items-center gap-2.5 px-4 py-2 rounded-md backdrop-blur-xl bg-gradient-to-r from-primary-500/20 via-blue-500/20 to-blue-600/20 border border-white/30 hover:border-white/50 transition-all"
        >
          <Wallet className="w-4 h-4 text-white drop-shadow-lg" />
          <span className="text-sm font-bold text-white drop-shadow-md">
            {formatCurrency(user.balance)}
          </span>
        </Link>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-md backdrop-blur-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-yellow-400 drop-shadow-lg" />
          ) : (
            <Moon className="w-4 h-4 text-white drop-shadow-lg" />
          )}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2.5 rounded-md backdrop-blur-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 text-white drop-shadow-lg" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] flex items-center justify-center font-bold shadow-lg animate-pulse-glow">
                {notifications.length}
              </span>
            )}
          </button>

          {notifOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 mt-2 w-80 glass-card-strong py-3 z-50 animate-slide-down">
                <div className="px-5 py-3 border-b border-white/20">
                  <h3 className="font-bold text-white drop-shadow-md">Thông báo</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="px-5 py-3 hover:bg-white/10 cursor-pointer border-b border-white/10 last:border-b-0 transition-all"
                    >
                      <p className="font-semibold text-sm text-white drop-shadow-sm">{notif.title}</p>
                      <p className="text-sm text-white/80 mt-1">{notif.message}</p>
                      <p className="text-xs text-white/60 mt-1.5">{notif.time}</p>
                    </div>
                  ))}
                </div>
                <div className="px-5 py-3 border-t border-white/20">
                  <Link 
                    href="/dashboard/notifications"
                    className="text-sm font-semibold gradient-text hover:underline"
                    onClick={() => setNotifOpen(false)}
                  >
                    Xem tất cả →
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
            className="flex items-center gap-2.5 p-1.5 rounded-md backdrop-blur-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all"
            aria-label="User menu"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 via-blue-500 to-blue-600 flex items-center justify-center shadow-lg animate-pulse-glow">
              <User className="w-4 h-4 text-white drop-shadow-lg" />
            </div>
            <ChevronDown className={cn(
              "w-4 h-4 transition-transform hidden sm:block text-white drop-shadow-lg",
              userMenuOpen && "rotate-180"
            )} />
          </button>

          {userMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
              <div className="absolute right-0 mt-2 w-64 glass-card-strong py-3 z-50 animate-slide-down">
                <div className="px-5 py-3 border-b border-white/20">
                  <p className="font-bold text-white truncate drop-shadow-md">{user.full_name || 'User'}</p>
                  <p className="text-sm text-white/80 truncate mt-1">{user.email}</p>
                </div>
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-3 px-5 py-3 hover:bg-white/10 transition-all rounded-lg mx-2 my-1"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <Settings className="w-4 h-4 text-white" />
                  <span className="text-white font-medium">Cài đặt</span>
                </Link>
                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-3 px-5 py-3 hover:bg-white/10 transition-all rounded-lg mx-2 my-1"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <span className="text-2xl">🔐</span>
                    <span className="text-white font-medium gradient-text">Admin Panel</span>
                  </Link>
                )}
                <hr className="my-2 border-white/20" />
                <form action="/auth/signout" method="POST">
                  <button
                    type="submit"
                    className="flex items-center gap-3 px-5 py-3 w-full text-left text-red-400 hover:bg-red-500/20 transition-all rounded-lg mx-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="font-medium">Đăng xuất</span>
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

