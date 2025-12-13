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
      <aside className={cn(
        "fixed top-0 left-0 h-full w-72 bg-white dark:bg-dark-800 border-r border-dark-200 dark:border-dark-700 z-50 transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Close Button (Mobile) */}
        <button
          onClick={() => setIsOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-1 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-700"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo */}
        <div className="p-6 border-b border-dark-200 dark:border-dark-700">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">O</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              OTP Resale
            </span>
          </Link>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-dark-200 dark:border-dark-700 bg-gradient-to-br from-primary-50/50 to-accent-50/50 dark:from-primary-900/10 dark:to-accent-900/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold shadow-md">
              {user.full_name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-dark-900 dark:text-white truncate">
                {user.full_name || 'User'}
              </p>
              <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                {formatCurrency(user.balance)}
              </p>
            </div>
          </div>
          <Link href="/dashboard/deposit" className="btn-primary w-full flex items-center justify-center gap-2 text-xs py-2.5">
            <Wallet className="w-4 h-4" />
            Nạp tiền
          </Link>
        </div>

        {/* Menu */}
        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/dashboard' && pathname.startsWith(item.href))
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm",
                  isActive
                    ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium shadow-sm"
                    : "text-dark-600 dark:text-dark-400 hover:bg-dark-50 dark:hover:bg-dark-700/50"
                )}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight className="w-3 h-3 flex-shrink-0" />}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-dark-200 dark:border-dark-700">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            {isLoggingOut ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <LogOut className="w-5 h-5" />
            )}
            <span>{isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}</span>
          </button>
        </div>
      </aside>
    </>
  )
}
