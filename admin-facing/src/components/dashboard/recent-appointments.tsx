'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Calendar,
  Clock,
  Phone,
  User,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Eye,
} from 'lucide-react'
import { getStatusColor, formatTime } from '@/lib/utils'
import { type Appointment } from '@/lib/supabase'

interface RecentAppointmentsProps {
  appointments: Appointment[]
  loading?: boolean
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'confirmed':
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case 'pending':
      return <Clock className="h-4 w-4 text-yellow-600" />
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-blue-600" />
    case 'cancelled':
      return <XCircle className="h-4 w-4 text-red-600" />
    case 'in_progress':
      return <Clock className="h-4 w-4 text-purple-600" />
    default:
      return <Clock className="h-4 w-4 text-gray-600" />
  }
}

export function RecentAppointments({ appointments, loading = false }: RecentAppointmentsProps) {
  return (
    <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Recent Appointments
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Latest scheduled appointments
            </CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">No appointments</h3>
            <p className="text-muted-foreground">
              No recent appointments to display.
            </p>
            <Button className="mt-4">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Appointment
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.slice(0, 5).map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-4 w-4 text-primary" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{appointment.full_name}</p>
                      <Badge
                        variant="outline"
                        className={getStatusColor(appointment.status)}
                      >
                        {appointment.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {appointment.service_type}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(appointment.preferred_date).toLocaleDateString('en-IN')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(appointment.preferred_time)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {appointment.phone}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(appointment.status)}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Confirm
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Calendar className="mr-2 h-4 w-4" />
                        Reschedule
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Phone className="mr-2 h-4 w-4" />
                        Call Patient
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <XCircle className="mr-2 h-4 w-4" />
                        Cancel
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
