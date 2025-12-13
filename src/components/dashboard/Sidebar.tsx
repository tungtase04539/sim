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
        "fixed top-0 left-0 h-full w-72 glass-card-strong border-r border-white/20 z-50 transition-transform duration-300 backdrop-blur-2xl",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Close Button (Mobile) */}
        <button
          onClick={() => setIsOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 rounded-xl backdrop-blur-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all hover:scale-110"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Logo */}
        <div className="p-6 border-b border-white/20">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 via-blue-500 to-purple-500 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform animate-pulse-glow">
              <span className="text-white font-bold text-2xl drop-shadow-lg">O</span>
            </div>
            <span className="text-2xl font-bold gradient-text">
              OTP Resale
            </span>
          </Link>
        </div>

        {/* User Info */}
        <div className="p-5 border-b border-white/20 backdrop-blur-xl bg-gradient-to-br from-primary-500/20 via-blue-500/20 to-purple-500/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 via-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-2xl animate-float">
              {user.full_name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-white truncate drop-shadow-md">
                {user.full_name || 'User'}
              </p>
              <p className="text-xl font-bold gradient-text">
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
                  "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-sm font-medium group",
                  isActive
                    ? "backdrop-blur-xl bg-gradient-to-r from-primary-500/30 via-blue-500/30 to-purple-500/30 text-white shadow-xl border border-white/30 glow-effect"
                    : "text-white/80 hover:bg-white/10 hover:text-white hover:scale-105 hover:shadow-lg border border-transparent hover:border-white/20"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 flex-shrink-0 transition-transform",
                  isActive ? "drop-shadow-lg" : "group-hover:scale-110"
                )} />
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight className="w-4 h-4 flex-shrink-0 animate-float" />}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/20">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl w-full backdrop-blur-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 transition-all border border-red-500/30 hover:border-red-500/50 hover:scale-105 hover:shadow-xl disabled:opacity-50"
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
