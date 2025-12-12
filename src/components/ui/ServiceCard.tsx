'use client'

import { useState } from 'react'
import { Star, TrendingUp, Zap } from 'lucide-react'
import { cn, formatCurrency, formatNumber } from '@/lib/utils'
import type { Service } from '@/lib/types'

interface ServiceCardProps {
  service: Service
  onSelect: (service: Service) => void
  isSelected?: boolean
}

export default function ServiceCard({ service, onSelect, isSelected }: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <button
      onClick={() => onSelect(service)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "w-full p-4 rounded-xl border-2 transition-all duration-300 text-left group",
        isSelected
          ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-lg shadow-primary-500/20"
          : "border-transparent bg-white dark:bg-dark-800 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-lg"
      )}
    >
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold transition-transform duration-300",
          isSelected || isHovered ? "scale-110" : "",
          "bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/50 dark:to-primary-800/50 text-primary-600 dark:text-primary-400"
        )}>
          {service.icon || service.code.substring(0, 2).toUpperCase()}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-dark-800 dark:text-dark-100 truncate">
            {service.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs px-2 py-0.5 rounded-full bg-dark-100 dark:bg-dark-700 text-dark-600 dark:text-dark-400">
              {service.code}
            </span>
            {service.success_rate >= 90 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {service.success_rate}%
              </span>
            )}
          </div>
        </div>

        {/* Price & Stock */}
        <div className="text-right">
          <p className="font-bold text-primary-600 dark:text-primary-400">
            {formatCurrency(service.price)}
          </p>
          <p className="text-xs text-dark-500 dark:text-dark-400 flex items-center gap-1 justify-end">
            <Zap className="w-3 h-3" />
            {formatNumber(service.available_numbers)} số
          </p>
        </div>
      </div>
    </button>
  )
}

