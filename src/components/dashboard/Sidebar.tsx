'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Phone, 
  History, 
  Wallet, 
  Key, 
  Settings, 
  HelpCircle,
  X,
  Menu,
  LogOut,
  ChevronRight
} from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'

interface SidebarProps {
  user: {
    email: string
    full_name: string | null
    balance: number
    role: string
  }
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Tổng quan', href: '/dashboard' },
  { icon: Phone, label: 'Thuê OTP', href: '/dashboard/rent' },
  { icon: History, label: 'Lịch sử', href: '/dashboard/history' },
  { icon: Wallet, label: 'Nạp tiền', href: '/dashboard/deposit' },
  { icon: Key, label: 'API Key', href: '/dashboard/api' },
  { icon: Settings, label: 'Cài đặt', href: '/dashboard/settings' },
  { icon: HelpCircle, label: 'Hỗ trợ', href: '/dashboard/support' },
]

export default function DashboardSidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-dark-200 dark:border-dark-700">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg">O</span>
          </div>
          <span className="text-xl font-bold text-dark-800 dark:text-white">OTP Resale</span>
        </Link>
      </div>

      {/* User Info */}
      <div className="p-4 mx-4 mt-4 rounded-xl bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-200 dark:border-primary-800">
        <p className="text-sm text-dark-600 dark:text-dark-400 truncate">
          {user.full_name || user.email}
        </p>
        <p className="text-lg font-bold text-primary-600 dark:text-primary-400 mt-1">
          {formatCurrency(user.balance)}
        </p>
        <Link 
          href="/dashboard/deposit"
          className="mt-3 flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-colors"
        >
          <Wallet className="w-4 h-4" />
          Nạp tiền
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/dashboard' && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "sidebar-link",
                isActive && "sidebar-link-active"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight className="w-4 h-4" />}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-dark-200 dark:border-dark-700">
        <form action="/auth/signout" method="POST">
          <button
            type="submit"
            className="sidebar-link w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut className="w-5 h-5" />
            <span>Đăng xuất</span>
          </button>
        </form>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl glass"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white dark:bg-dark-800 flex flex-col animate-slide-up">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-700"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-72 bg-white dark:bg-dark-800 border-r border-dark-200 dark:border-dark-700">
        <SidebarContent />
      </aside>
    </>
  )
}

