import { ReactNode } from 'react'
import { PageHeader } from './page-header'
import { LucideIcon } from 'lucide-react'

interface PageLayoutProps {
  title: string
  description?: string
  icon?: LucideIcon
  actions?: ReactNode
  stats?: ReactNode
  children: ReactNode
}

export function PageLayout({ 
  title, 
  description, 
  icon, 
  actions, 
  stats, 
  children 
}: PageLayoutProps) {
  return (
    <div className="space-y-8">
      <PageHeader 
        title={title} 
        description={description} 
        icon={icon} 
        actions={actions}
      >
        {stats}
      </PageHeader>
      
      <div className="space-y-6">
        {children}
      </div>
    </div>
  )
}
