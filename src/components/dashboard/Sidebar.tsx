'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  Phone,
  History,
  Wallet,
  Key,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  X,
  Menu,
  CreditCard,
  Loader2
} from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import type { User } from '@/lib/types'

interface SidebarProps {
  user: User & { email: string }
}

const menuItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Tổng quan' },
  { href: '/dashboard/rent', icon: Phone, label: 'Thuê OTP' },
  { href: '/dashboard/history', icon: History, label: 'Lịch sử' },
  { href: '/dashboard/deposit', icon: Wallet, label: 'Nạp tiền' },
  { href: '/dashboard/transactions', icon: CreditCard, label: 'Giao dịch' },
  { href: '/dashboard/api', icon: Key, label: 'API Key' },
  { href: '/dashboard/settings', icon: Settings, label: 'Cài đặt' },
  { href: '/dashboard/support', icon: HelpCircle, label: 'Hỗ trợ' },
]

export default function DashboardSidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await fetch('/api/auth/signout', { method: 'POST' })
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
      router.push('/login')
    }
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-dark-800 shadow-lg"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside         className={cn(
        "fixed top-0 left-0 h-full w-72 glass-card-strong border-r border-blue-200/50 dark:border-blue-700/50 z-50 transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Close Button (Mobile) */}
        <button
          onClick={() => setIsOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 rounded-md backdrop-blur-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Logo */}
        <div className="p-6 border-b border-blue-200/50 dark:border-blue-700/50">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-md bg-gradient-to-br from-primary-500 via-blue-500 to-blue-600 flex items-center justify-center shadow-sm transition-all">
              <span className="text-white font-bold text-2xl">O</span>
            </div>
            <span className="text-2xl font-bold text-primary-700 dark:text-primary-300">
              OTP Resale
            </span>
          </Link>
        </div>

        {/* User Info */}
        <div className="p-5 border-b border-blue-200/50 dark:border-blue-700/50 bg-gradient-to-br from-blue-50/50 via-primary-50/50 to-blue-50/50 dark:from-blue-900/20 dark:via-primary-900/20 dark:to-blue-900/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-md bg-gradient-to-br from-primary-500 via-blue-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-sm">
              {user.full_name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                {user.full_name || 'User'}
              </p>
              <p className="text-xl font-bold text-primary-700 dark:text-primary-300">
                {formatCurrency(user.balance)}
              </p>
            </div>
          </div>
          <Link href="/dashboard/deposit" className="btn-primary w-full flex items-center justify-center gap-2 text-sm py-3">
            <Wallet className="w-4 h-4" />
            Nạp tiền
          </Link>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/dashboard' && pathname.startsWith(item.href))
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-md transition-all text-sm font-medium group",
                  isActive
                    ? "bg-blue-100 dark:bg-blue-900/30 text-primary-700 dark:text-primary-300 shadow-sm border border-blue-300/50 dark:border-blue-600/50"
                    : "text-gray-700 dark:text-gray-300 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 border border-transparent hover:border-blue-200/50 dark:hover:border-blue-700/50"
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight className="w-4 h-4 flex-shrink-0" />}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-blue-200/50 dark:border-blue-700/50">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-3 px-4 py-3 rounded-md w-full bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-all border border-red-200 dark:border-red-800 disabled:opacity-50"
          >
            {isLoggingOut ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <LogOut className="w-5 h-5" />
            )}
            <span className="font-semibold">{isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}</span>
          </button>
        </div>
      </aside>
    </>
  )
}
