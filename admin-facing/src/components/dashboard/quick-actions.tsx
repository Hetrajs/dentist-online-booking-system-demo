'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Calendar, 
  Users, 
  MessageSquare, 
  FileText,
  UserPlus,
  Bell,
  Settings,
  BarChart3,
  Plus,
  Search
} from 'lucide-react'

const quickActions = [
  {
    title: 'New Appointment',
    description: 'Schedule a new appointment',
    icon: Calendar,
    color: 'bg-blue-500 hover:bg-blue-600',
    action: () => console.log('New appointment')
  },
  {
    title: 'Add Patient',
    description: 'Register new patient',
    icon: UserPlus,
    color: 'bg-green-500 hover:bg-green-600',
    action: () => console.log('Add patient')
  },
  {
    title: 'Send Message',
    description: 'Contact patients',
    icon: MessageSquare,
    color: 'bg-purple-500 hover:bg-purple-600',
    action: () => console.log('Send message')
  },
  {
    title: 'Generate Report',
    description: 'Create analytics report',
    icon: BarChart3,
    color: 'bg-orange-500 hover:bg-orange-600',
    action: () => console.log('Generate report')
  },
]

const recentActions = [
  {
    title: 'Patient Search',
    description: 'Find patient records quickly',
    icon: Search,
    href: '/patients'
  },
  {
    title: 'Notifications',
    description: 'View all notifications',
    icon: Bell,
    href: '/communications/notifications'
  },
  {
    title: 'Reports',
    description: 'Access detailed reports',
    icon: FileText,
    href: '/reports'
  },
  {
    title: 'Settings',
    description: 'Configure system settings',
    icon: Settings,
    href: '/settings'
  },
]

export function QuickActions() {
  return (
    <Card className="bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-[#404040]">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-gray-900 dark:text-white">Quick Actions</CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Frequently used actions and shortcuts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Primary Actions */}
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <Button
                key={index}
                variant="outline"
                className="h-auto flex-col gap-2 p-4 hover:shadow-md transition-all border-gray-200 dark:border-[#404040] hover:bg-gray-50 dark:hover:bg-[#2a2a2a] group"
                onClick={action.action}
              >
                <div className={`rounded-lg p-2 text-white ${action.color} group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium text-gray-900 dark:text-white">{action.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {action.description}
                  </p>
                </div>
              </Button>
            )
          })}
        </div>

        {/* Secondary Actions */}
        <div className="space-y-2 border-t pt-4">
          <h4 className="text-sm font-medium text-muted-foreground">
            Quick Links
          </h4>
          {recentActions.map((action, index) => {
            const Icon = action.icon
            return (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start gap-3 h-auto p-3"
                asChild
              >
                <a href={action.href}>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <div className="text-left">
                    <p className="text-sm font-medium">{action.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                </a>
              </Button>
            )
          })}
        </div>

        {/* Emergency Actions */}
        <div className="space-y-2 border-t pt-4">
          <h4 className="text-sm font-medium text-muted-foreground">
            Emergency
          </h4>
          <Button 
            variant="destructive" 
            size="sm" 
            className="w-full"
          >
            <Plus className="mr-2 h-3 w-3" />
            Emergency Appointment
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
