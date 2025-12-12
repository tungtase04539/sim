'use client'

import { cn } from '@/lib/utils'
import type { Country } from '@/lib/types'

interface CountryCardProps {
  country: Country
  onSelect: (country: Country) => void
  isSelected?: boolean
}

export default function CountryCard({ country, onSelect, isSelected }: CountryCardProps) {
  return (
    <button
      onClick={() => onSelect(country)}
      className={cn(
        "w-full p-3 rounded-xl border-2 transition-all duration-300 text-left flex items-center gap-3 group",
        isSelected
          ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-lg shadow-primary-500/20"
          : "border-transparent bg-white dark:bg-dark-800 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md"
      )}
    >
      {/* Flag */}
      <span className="text-2xl group-hover:scale-110 transition-transform">
        {country.flag}
      </span>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-dark-800 dark:text-dark-100 truncate">
          {country.name}
        </h3>
        <p className="text-xs text-dark-500 dark:text-dark-400">
          +{country.code}
        </p>
      </div>

      {/* Selected indicator */}
      {isSelected && (
        <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </button>
  )
}

