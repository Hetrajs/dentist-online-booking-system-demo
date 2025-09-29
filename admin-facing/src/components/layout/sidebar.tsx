'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Calendar,
  Users,
  Stethoscope,
  MessageSquare,
  BarChart3,
  Settings,
  Bell,
  FileText,
  CreditCard,
  UserCheck,
  Clock,
  Star,
  Mail,
  Shield,
  Database,
  Activity,
  TrendingUp,
  Zap
} from 'lucide-react'

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
    description: 'Overview and analytics'
  },
  {
    name: 'Appointments',
    href: '/appointments',
    icon: Calendar,
    description: 'Manage appointments',
    children: [
      { name: 'All Appointments', href: '/appointments', icon: Calendar },
      { name: 'Calendar View', href: '/appointments/calendar', icon: Clock },
      { name: 'Pending Approval', href: '/appointments/pending', icon: UserCheck },
    ]
  },
  {
    name: 'Patients',
    href: '/patients',
    icon: Users,
    description: 'Patient management',
    children: [
      { name: 'All Patients', href: '/patients', icon: Users },
      { name: 'Medical Records', href: '/patients/records', icon: FileText },
      { name: 'Patient History', href: '/patients/history', icon: Activity },
    ]
  },
  {
    name: 'Services',
    href: '/services',
    icon: Stethoscope,
    description: 'Dental services',
    children: [
      { name: 'All Services', href: '/services', icon: Stethoscope },
      { name: 'Pricing', href: '/services/pricing', icon: CreditCard },
      { name: 'Categories', href: '/services/categories', icon: Database },
    ]
  },
  {
    name: 'Communications',
    href: '/communications',
    icon: MessageSquare,
    description: 'Messages and notifications',
    children: [
      { name: 'Contact Forms', href: '/communications/contacts', icon: MessageSquare },
      { name: 'Notifications', href: '/communications/notifications', icon: Bell },
      { name: 'Newsletter', href: '/communications/newsletter', icon: Mail },
      { name: 'Testimonials', href: '/communications/testimonials', icon: Star },
    ]
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: BarChart3,
    description: 'Analytics and reports',
    children: [
      { name: 'Revenue Analytics', href: '/reports/revenue', icon: TrendingUp },
      { name: 'Appointment Trends', href: '/reports/appointments', icon: Activity },
      { name: 'Patient Insights', href: '/reports/patients', icon: Users },
      { name: 'Service Performance', href: '/reports/services', icon: Zap },
    ]
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'System configuration',
    children: [
      { name: 'General', href: '/settings', icon: Settings },
      { name: 'Admin Users', href: '/settings/users', icon: Shield },
      { name: 'Clinic Info', href: '/settings/clinic', icon: Database },
      { name: 'Availability', href: '/settings/availability', icon: Clock },
    ]
  },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn('flex h-full w-64 flex-col bg-[#171717] border-r border-[#404040]', className)}>
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-[#404040] px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg">
            <Stethoscope className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-white">DentalCare</span>
            <span className="text-xs text-gray-400">Admin Dashboard</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4 overflow-y-auto scrollbar-thin">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

          return (
            <div key={item.name}>
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 hover:bg-[#2a2a2a] group',
                  isActive
                    ? 'bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-400 border-l-4 border-orange-500'
                    : 'text-gray-300 hover:text-white'
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 transition-colors",
                  isActive ? "text-orange-400" : "text-gray-400 group-hover:text-white"
                )} />
                <div className="flex flex-col">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-xs text-gray-500 group-hover:text-gray-400">
                    {item.description}
                  </span>
                </div>
              </Link>
              
              {/* Sub-navigation */}
              {item.children && isActive && (
                <div className="ml-8 mt-2 space-y-1">
                  {item.children.map((child) => {
                    const isChildActive = pathname === child.href
                    return (
                      <Link
                        key={child.name}
                        href={child.href}
                        className={cn(
                          'flex items-center gap-2 rounded-lg px-3 py-2 text-xs transition-all duration-200 hover:bg-[#2a2a2a] group',
                          isChildActive
                            ? 'bg-orange-500/10 text-orange-300 border-l-2 border-orange-500'
                            : 'text-gray-400 hover:text-gray-200'
                        )}
                      >
                        <child.icon className={cn(
                          "h-3 w-3",
                          isChildActive ? "text-orange-300" : "text-gray-500 group-hover:text-gray-300"
                        )} />
                        {child.name}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
            A
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Admin User</span>
            <span className="text-xs text-muted-foreground">admin@clinic.com</span>
          </div>
        </div>
      </div>
    </div>
  )
}
