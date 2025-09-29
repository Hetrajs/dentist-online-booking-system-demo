import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { LucideIcon } from 'lucide-react'

interface PageHeaderProps {
  title: string
  description?: string
  icon?: LucideIcon
  actions?: ReactNode
  children?: ReactNode
}

export function PageHeader({ 
  title, 
  description, 
  icon: Icon, 
  actions, 
  children 
}: PageHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {Icon && (
            <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
              <Icon className="h-6 w-6 text-white" />
            </div>
          )}
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
              {title}
            </h1>
            {description && (
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {description}
              </p>
            )}
          </div>
        </div>
        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>
      
      {/* Additional content like stats cards */}
      {children}
    </div>
  )
}
