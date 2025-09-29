'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { StatsCards } from './stats-cards'
import { RevenueChart } from './revenue-chart'
import { AppointmentChart } from './appointment-chart'
import { RecentAppointments } from './recent-appointments'
import { QuickActions } from './quick-actions'

// Client-side component to handle date rendering and avoid hydration mismatch
function TodayDate() {
  const [currentDate, setCurrentDate] = useState<string>('')

  useEffect(() => {
    setCurrentDate(formatDate(new Date()))
  }, [])

  return <span>{currentDate}</span>
}
import { api } from '@/lib/api-client'
import { type Appointment } from '@/lib/supabase'

interface DashboardStats {
  totalPatients: number
  totalAppointments: number
  totalServices: number
  newMessages: number
  pendingAppointments: number
  confirmedAppointments: number
  completedAppointments: number
  inProgressAppointments: number
}



export function DashboardOverview() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true)
        const [statsData, appointmentsData] = await Promise.all([
          api.getDashboardStats(),
          api.getAppointments()
        ])

        setStats(statsData)
        // Get recent appointments (last 5)
        setAppointments(appointmentsData.slice(0, 5))
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Welcome back! Here&apos;s what&apos;s happening at your dental practice today.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right bg-white dark:bg-[#1a1a1a] rounded-xl p-4 border border-gray-200 dark:border-[#404040] shadow-sm">
            <p className="text-sm text-gray-500 dark:text-gray-400">Current Time</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {currentTime.toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </p>
          </div>
          <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg px-6 py-3 h-auto">
            <Calendar className="mr-2 h-5 w-5" />
            New Appointment
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} loading={loading} />

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        <RevenueChart />
        <AppointmentChart />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Recent Appointments */}
        <div className="md:col-span-2">
          <RecentAppointments appointments={appointments} loading={loading} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <QuickActions />

          {/* Alerts & Notifications */}
          <Card className="bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-[#404040]">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-gray-900 dark:text-white">Alerts & Notifications</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Important updates and reminders
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <p>No alerts at this time</p>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                View All Notifications
              </Button>
            </CardContent>
          </Card>

          {/* Today's Schedule */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Today&apos;s Schedule</CardTitle>
              <CardDescription>
                <TodayDate />
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">9:00 AM</span>
                  <span>Priya Sharma - Checkup</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">11:30 AM</span>
                  <span>Rajesh Kumar - Root Canal</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">2:00 PM</span>
                  <span>Anita Patel - Whitening</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">4:30 PM</span>
                  <span>Vikram Singh - Implants</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                <Calendar className="mr-2 h-3 w-3" />
                View Full Calendar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
