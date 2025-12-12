'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  Phone,
  CreditCard, 
  Settings, 
  Globe,
  BarChart3,
  X,
  Menu,
  LogOut,
  ChevronRight,
  Server
} from 'lucide-react'
import { cn } from '@/lib/utils'

const menuItems = [
  { icon: LayoutDashboard, label: 'Tổng quan', href: '/admin' },
  { icon: Users, label: 'Quản lý User', href: '/admin/users' },
  { icon: Phone, label: 'Dịch vụ OTP', href: '/admin/services' },
  { icon: Globe, label: 'Quốc gia', href: '/admin/countries' },
  { icon: CreditCard, label: 'Giao dịch', href: '/admin/transactions' },
  { icon: BarChart3, label: 'Thống kê', href: '/admin/statistics' },
  { icon: Server, label: 'Cài đặt hệ thống', href: '/admin/settings' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-dark-200 dark:border-dark-700">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <div>
            <span className="text-xl font-bold text-dark-800 dark:text-white">Admin</span>
            <p className="text-xs text-dark-500">OTP Resale</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/admin' && pathname.startsWith(item.href))
          
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

      {/* Back to Dashboard */}
      <div className="p-4 border-t border-dark-200 dark:border-dark-700">
        <Link
          href="/dashboard"
          className="sidebar-link text-primary-600 dark:text-primary-400"
        >
          <LogOut className="w-5 h-5 rotate-180" />
          <span>Về Dashboard</span>
        </Link>
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

