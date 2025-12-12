'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTheme } from '@/components/Providers'
import { 
  Moon, 
  Sun, 
  Menu, 
  X, 
  User,
  LogIn,
  Wallet,
  ChevronDown
} from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'

interface HeaderProps {
  user?: {
    email: string
    full_name: string | null
    balance: number
    role: string
  } | null
}

export default function Header({ user }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 glass border-b border-dark-200/50 dark:border-dark-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:shadow-primary-500/50 transition-shadow">
                <span className="text-white font-bold text-lg">O</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-dark-800 animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-bold text-gradient">OTP Resale</span>
              <p className="text-xs text-dark-500 dark:text-dark-400 -mt-1">Thuê SIM nhận OTP</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link 
              href="/" 
              className="px-4 py-2 rounded-lg text-dark-600 dark:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors font-medium"
            >
              Trang chủ
            </Link>
            <Link 
              href="/services" 
              className="px-4 py-2 rounded-lg text-dark-600 dark:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors font-medium"
            >
              Dịch vụ
            </Link>
            <Link 
              href="/pricing" 
              className="px-4 py-2 rounded-lg text-dark-600 dark:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors font-medium"
            >
              Bảng giá
            </Link>
            <Link 
              href="/api-docs" 
              className="px-4 py-2 rounded-lg text-dark-600 dark:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors font-medium"
            >
              API
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-dark-100 dark:bg-dark-700 hover:bg-dark-200 dark:hover:bg-dark-600 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-dark-600" />
              )}
            </button>

            {user ? (
              /* User Menu */
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-dark-100 dark:bg-dark-700 hover:bg-dark-200 dark:hover:bg-dark-600 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-dark-800 dark:text-dark-100 truncate max-w-[120px]">
                      {user.full_name || user.email.split('@')[0]}
                    </p>
                    <p className="text-xs text-primary-600 dark:text-primary-400 font-semibold flex items-center gap-1">
                      <Wallet className="w-3 h-3" />
                      {formatCurrency(user.balance)}
                    </p>
                  </div>
                  <ChevronDown className={cn(
                    "w-4 h-4 text-dark-500 transition-transform",
                    userMenuOpen && "rotate-180"
                  )} />
                </button>

                {userMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setUserMenuOpen(false)} 
                    />
                    <div className="absolute right-0 mt-2 w-56 rounded-xl glass-card py-2 z-50 animate-slide-down">
                      <div className="px-4 py-2 border-b border-dark-200 dark:border-dark-700">
                        <p className="text-sm text-dark-500 dark:text-dark-400">Số dư</p>
                        <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                          {formatCurrency(user.balance)}
                        </p>
                      </div>
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-2 hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        href="/dashboard/deposit"
                        className="flex items-center gap-3 px-4 py-2 hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Wallet className="w-4 h-4" />
                        <span>Nạp tiền</span>
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
                          <LogIn className="w-4 h-4" />
                          <span>Đăng xuất</span>
                        </button>
                      </form>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* Auth Buttons */
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl text-dark-600 dark:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors font-medium"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="btn-primary text-sm"
                >
                  Đăng ký
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-dark-100 dark:bg-dark-700"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-dark-200 dark:border-dark-700 animate-slide-down">
            <nav className="flex flex-col gap-2">
              <Link 
                href="/" 
                className="px-4 py-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                Trang chủ
              </Link>
              <Link 
                href="/services" 
                className="px-4 py-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dịch vụ
              </Link>
              <Link 
                href="/pricing" 
                className="px-4 py-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                Bảng giá
              </Link>
              <Link 
                href="/api-docs" 
                className="px-4 py-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                API
              </Link>
              {!user && (
                <>
                  <hr className="my-2 border-dark-200 dark:border-dark-700" />
                  <Link 
                    href="/login" 
                    className="px-4 py-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Đăng nhập
                  </Link>
                  <Link 
                    href="/register" 
                    className="btn-primary text-center mx-4"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Đăng ký
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

