'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  XCircle,
  Users,
  IndianRupee,
  TrendingUp
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface Appointment {
  id: string
  status: string
  priority: string
  price: number
  preferred_date: string
}

interface AppointmentStatsProps {
  appointments: Appointment[]
}

export function AppointmentStats({ appointments }: AppointmentStatsProps) {
  // Calculate stats
  const totalAppointments = appointments.length
  const pendingAppointments = appointments.filter(a => a.status === 'pending').length
  const confirmedAppointments = appointments.filter(a => a.status === 'confirmed').length
  const completedAppointments = appointments.filter(a => a.status === 'completed').length
  const cancelledAppointments = appointments.filter(a => a.status === 'cancelled').length
  const inProgressAppointments = appointments.filter(a => a.status === 'in_progress').length
  
  const urgentAppointments = appointments.filter(a => a.priority === 'urgent').length
  const highPriorityAppointments = appointments.filter(a => a.priority === 'high').length
  
  const totalRevenue = appointments
    .filter(a => a.status === 'completed')
    .reduce((sum, a) => sum + a.price, 0)
  
  const pendingRevenue = appointments
    .filter(a => a.status === 'confirmed' || a.status === 'in_progress')
    .reduce((sum, a) => sum + a.price, 0)

  // Today's appointments
  const today = new Date().toISOString().split('T')[0]
  const todayAppointments = appointments.filter(a => a.preferred_date === today).length

  const stats = [
    {
      title: 'Total Appointments',
      value: totalAppointments.toString(),
      description: 'All time',
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900'
    },
    {
      title: 'Today\'s Appointments',
      value: todayAppointments.toString(),
      description: 'Scheduled for today',
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900'
    },
    {
      title: 'Pending Approval',
      value: pendingAppointments.toString(),
      description: 'Awaiting confirmation',
      icon: AlertCircle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900'
    },
    {
      title: 'Confirmed',
      value: confirmedAppointments.toString(),
      description: 'Ready to proceed',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900'
    },
    {
      title: 'In Progress',
      value: inProgressAppointments.toString(),
      description: 'Currently active',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900'
    },
    {
      title: 'Completed',
      value: completedAppointments.toString(),
      description: 'Successfully finished',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900'
    },
    {
      title: 'Revenue Earned',
      value: formatCurrency(totalRevenue),
      description: 'From completed appointments',
      icon: IndianRupee,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900'
    },
    {
      title: 'Pending Revenue',
      value: formatCurrency(pendingRevenue),
      description: 'From confirmed appointments',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900'
    },
  ]

  return (
    <div className="space-y-4">
      {/* Main Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Priority Alerts */}
      {(urgentAppointments > 0 || highPriorityAppointments > 0) && (
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-orange-800 dark:text-orange-200">
              Priority Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              {urgentAppointments > 0 && (
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">
                    {urgentAppointments} Urgent
                  </Badge>
                  <span className="text-sm text-orange-700 dark:text-orange-300">
                    Require immediate attention
                  </span>
                </div>
              )}
              {highPriorityAppointments > 0 && (
                <div className="flex items-center gap-2">
                  <Badge className="bg-orange-500 hover:bg-orange-600">
                    {highPriorityAppointments} High Priority
                  </Badge>
                  <span className="text-sm text-orange-700 dark:text-orange-300">
                    Need prompt scheduling
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {pendingAppointments}
              </div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {confirmedAppointments}
              </div>
              <div className="text-sm text-muted-foreground">Confirmed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {inProgressAppointments}
              </div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {completedAppointments}
              </div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {cancelledAppointments}
              </div>
              <div className="text-sm text-muted-foreground">Cancelled</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
