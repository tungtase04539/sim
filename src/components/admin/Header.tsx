'use client'

import { useTheme } from '@/components/Providers'
import { Moon, Sun, User } from 'lucide-react'

interface HeaderProps {
  user: {
    email: string
    full_name: string | null
  }
}

export default function AdminHeader({ user }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-40 h-16 glass border-b border-dark-200 dark:border-dark-700 px-6 flex items-center justify-between">
      <div className="lg:hidden w-10" />
      
      <div className="hidden lg:block">
        <h1 className="text-lg font-semibold text-dark-800 dark:text-white">Admin Panel</h1>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-dark-100 dark:bg-dark-700 hover:bg-dark-200 dark:hover:bg-dark-600 transition-colors"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-yellow-500" />
          ) : (
            <Moon className="w-5 h-5 text-dark-600" />
          )}
        </button>

        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-dark-100 dark:bg-dark-700">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium">{user.full_name || 'Admin'}</p>
            <p className="text-xs text-dark-500">{user.email}</p>
          </div>
        </div>
      </div>
    </header>
  )
}

