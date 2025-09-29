'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Calendar,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  RefreshCw
} from 'lucide-react'
import { api } from '@/lib/api-client'
import { type Appointment } from '@/lib/supabase'

interface CalendarDay {
  date: Date
  appointments: Appointment[]
  isCurrentMonth: boolean
  isToday: boolean
}

export function AppointmentCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [calendarData, setCalendarData] = useState<CalendarDay[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month')

  useEffect(() => {
    fetchAppointments()
  }, [])

  useEffect(() => {
    generateCalendarData()
  }, [currentDate, viewMode, appointments])

  const fetchAppointments = async () => {
    setLoading(true)
    try {
      const data = await api.getAppointments()
      setAppointments(data)
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateCalendarData = () => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    const startOfCalendar = new Date(startOfMonth)
    startOfCalendar.setDate(startOfCalendar.getDate() - startOfMonth.getDay())

    const days: CalendarDay[] = []
    const currentCalendarDate = new Date(startOfCalendar)

    // Generate 42 days (6 weeks)
    for (let i = 0; i < 42; i++) {
      const isCurrentMonth = currentCalendarDate.getMonth() === currentDate.getMonth()
      const isToday = currentCalendarDate.toDateString() === new Date().toDateString()

      // Filter appointments for this specific date
      const dayAppointments = appointments.filter(appointment => {
        const appointmentDate = appointment.appointment_date
          ? new Date(appointment.appointment_date)
          : new Date(appointment.preferred_date)

        return appointmentDate.toDateString() === currentCalendarDate.toDateString()
      })

      days.push({
        date: new Date(currentCalendarDate),
        appointments: dayAppointments.sort((a, b) => {
          return a.preferred_time.localeCompare(b.preferred_time)
        }),
        isCurrentMonth,
        isToday
      })

      currentCalendarDate.setDate(currentCalendarDate.getDate() + 1)
    }

    setCalendarData(days)
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Appointment Calendar</h1>
          <p className="text-muted-foreground">
            Visual overview of all scheduled appointments
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="day">Day</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Appointment
          </Button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-semibold">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
              Today
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day Headers */}
            {dayNames.map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
            
            {/* Calendar Days */}
            {calendarData.map((day, index) => (
              <div
                key={index}
                className={`min-h-[120px] p-2 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                  day.isToday ? 'bg-primary/10 border-primary' : 
                  !day.isCurrentMonth ? 'text-muted-foreground bg-muted/20' : 
                  'bg-background'
                } ${
                  selectedDate?.toDateString() === day.date.toDateString() ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedDate(day.date)}
              >
                <div className={`text-sm font-medium mb-1 ${
                  day.isToday ? 'text-primary' : 
                  !day.isCurrentMonth ? 'text-muted-foreground' : 
                  'text-foreground'
                }`}>
                  {day.date.getDate()}
                </div>
                
                {/* Appointments */}
                <div className="space-y-1">
                  {day.appointments.slice(0, 3).map((appointment) => (
                    <div
                      key={appointment.id}
                      className={`text-xs p-1 rounded truncate ${getStatusColor(appointment.status)}`}
                    >
                      <div className="font-medium">{appointment.preferred_time}</div>
                      <div className="truncate">{appointment.name}</div>
                    </div>
                  ))}
                  {day.appointments.length > 3 && (
                    <div className="text-xs text-muted-foreground">
                      +{day.appointments.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Details */}
      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle>
              Appointments for {selectedDate.toLocaleDateString('en-IN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const selectedDay = calendarData.find(day => 
                day.date.toDateString() === selectedDate.toDateString()
              )
              
              if (!selectedDay || selectedDay.appointments.length === 0) {
                return (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No appointments scheduled for this date</p>
                    <Button className="mt-4" size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Schedule Appointment
                    </Button>
                  </div>
                )
              }

              return (
                <div className="space-y-4">
                  {selectedDay.appointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{appointment.preferred_time}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{appointment.name}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {appointment.service} ({appointment.duration || 60} min)
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
