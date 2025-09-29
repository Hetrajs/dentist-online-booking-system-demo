import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  trend?: number
  loading?: boolean
  color?: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'yellow'
}

export function StatsCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend, 
  loading = false,
  color = 'orange'
}: StatsCardProps) {
  if (loading) {
    return (
      <Card className="bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-[#404040]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
            <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
          </div>
        </CardContent>
      </Card>
    )
  }

  const colorClasses = {
    blue: {
      accent: 'from-blue-500 to-blue-600',
      icon: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
    },
    green: {
      accent: 'from-green-500 to-green-600',
      icon: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
    },
    orange: {
      accent: 'from-orange-500 to-orange-600',
      icon: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
    },
    purple: {
      accent: 'from-purple-500 to-purple-600',
      icon: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
    },
    red: {
      accent: 'from-red-500 to-red-600',
      icon: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
    },
    yellow: {
      accent: 'from-yellow-500 to-yellow-600',
      icon: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
    }
  }

  const isPositiveTrend = trend !== undefined && trend > 0
  const TrendIcon = isPositiveTrend ? ArrowUpRight : ArrowDownRight

  return (
    <Card className="relative overflow-hidden bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-[#404040] hover:shadow-lg transition-all duration-200 group">
      {/* Gradient accent */}
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${colorClasses[color].accent}`} />

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </CardTitle>
        <div className={`p-2.5 rounded-xl ${colorClasses[color].icon} group-hover:scale-110 transition-transform duration-200`}>
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-3xl font-bold text-gray-900 dark:text-white">
          {value}
        </div>
        <div className="flex items-center justify-between">
          {description && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {description}
            </span>
          )}
          {trend !== undefined && (
            <div className="flex items-center gap-1">
              <TrendIcon className={`h-3 w-3 ${
                isPositiveTrend
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`} />
              <span className={`text-xs font-medium ${
                isPositiveTrend
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {Math.abs(trend)}%
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface StatsGridProps {
  children: React.ReactNode
  columns?: 2 | 3 | 4
}

export function StatsGrid({ children, columns = 4 }: StatsGridProps) {
  const gridClasses = {
    2: 'grid gap-6 md:grid-cols-2',
    3: 'grid gap-6 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid gap-6 md:grid-cols-2 lg:grid-cols-4'
  }

  return (
    <div className={gridClasses[columns]}>
      {children}
    </div>
  )
}
