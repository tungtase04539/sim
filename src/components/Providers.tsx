'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within Providers')
  }
  return context
}

export function Providers({ children }: { children: React.ReactNode }) {
  // Default theme for SSR - will be updated on client mount
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Only access browser APIs after mounting
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as Theme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      
      // Check if dark class is already on html element (from script)
      const isDark = document.documentElement.classList.contains('dark')
      
      if (savedTheme) {
        setTheme(savedTheme)
      } else if (isDark || prefersDark) {
        setTheme('dark')
      } else {
        setTheme('light')
      }
    }
  }, [])

  // Apply theme to document whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement
      if (theme === 'dark') {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
      if (mounted) {
        localStorage.setItem('theme', theme)
      }
    }
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  // Always provide theme context, even during SSR
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

