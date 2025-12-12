'use client'

import { useEffect, useState } from 'react'
import { Users, ShoppingCart, Globe, Percent } from 'lucide-react'
import { formatNumber } from '@/lib/utils'

interface StatItem {
  icon: React.ElementType
  value: number
  suffix: string
  label: string
  color: string
}

const stats: StatItem[] = [
  { icon: Users, value: 50000, suffix: '+', label: 'Người dùng tin tưởng', color: 'from-blue-500 to-cyan-500' },
  { icon: ShoppingCart, value: 1000000, suffix: '+', label: 'Giao dịch thành công', color: 'from-green-500 to-emerald-500' },
  { icon: Globe, value: 180, suffix: '+', label: 'Quốc gia hỗ trợ', color: 'from-purple-500 to-pink-500' },
  { icon: Percent, value: 98, suffix: '%', label: 'Tỉ lệ thành công', color: 'from-orange-500 to-red-500' },
]

export default function StatsSection() {
  const [mounted, setMounted] = useState(false)
  const [counts, setCounts] = useState(stats.map(() => 0))

  useEffect(() => {
    setMounted(true)
    
    const duration = 2000 // 2 seconds
    const steps = 60
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const easeOut = 1 - Math.pow(1 - progress, 3) // Cubic ease out
      
      setCounts(stats.map(stat => Math.floor(stat.value * easeOut)))
      
      if (step >= steps) {
        clearInterval(timer)
        setCounts(stats.map(stat => stat.value))
      }
    }, interval)

    return () => clearInterval(timer)
  }, [])

  if (!mounted) return null

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="glass-card p-6 text-center card-hover animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-7 h-7 text-white" />
              </div>
              <div className="text-3xl font-bold text-dark-800 dark:text-white mb-1">
                {formatNumber(counts[index])}{stat.suffix}
              </div>
              <p className="text-dark-500 dark:text-dark-400 text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

