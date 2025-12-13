'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTheme } from '@/components/Providers'
import { 
  Moon, 
  Sun, 
  Bell
} from 'lucide-react'

interface HeaderProps {
  user?: {
    email: string
    full_name: string | null
    balance: number
    role: string
  }
}

export default function DashboardHeader({ user }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()
  const [notifications] = useState([
    { id: 1, title: 'Nạp tiền thành công', message: '+100,000 VND', time: '5 phút trước' },
    { id: 2, title: 'OTP đã nhận', message: 'Facebook - 123456', time: '10 phút trước' },
  ])
  const [notifOpen, setNotifOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 h-16 glass-card-strong border-b border-blue-200/50 dark:border-blue-700/50 px-6 flex items-center justify-between">
      {/* Page Title - will be dynamic */}
      <div className="lg:hidden w-10" /> {/* Spacer for mobile menu button */}
      
      <div className="hidden lg:block">
        <h1 className="text-lg font-bold text-primary-700 dark:text-primary-300">Dashboard</h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-md bg-white/90 hover:bg-white border border-blue-300/50 hover:border-primary-500 transition-all shadow-sm"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-yellow-600" />
          ) : (
            <Moon className="w-4 h-4 text-gray-700" />
          )}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2.5 rounded-md bg-white/90 hover:bg-white border border-blue-300/50 hover:border-primary-500 transition-all shadow-sm"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 text-gray-700 dark:text-gray-300" />
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
                <div className="px-5 py-3 border-b border-blue-200/50 dark:border-blue-700/50">
                  <h3 className="font-bold text-gray-900 dark:text-white">Thông báo</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="px-5 py-3 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 cursor-pointer border-b border-blue-100/50 dark:border-blue-800/50 last:border-b-0 transition-all"
                    >
                      <p className="font-semibold text-sm text-gray-900 dark:text-white">{notif.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{notif.message}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">{notif.time}</p>
                    </div>
                  ))}
                </div>
                <div className="px-5 py-3 border-t border-blue-200/50 dark:border-blue-700/50">
                  <Link 
                    href="/dashboard/notifications"
                    className="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline"
                    onClick={() => setNotifOpen(false)}
                  >
                    Xem tất cả →
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

