'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  UserPlus, 
  Activity,
  AlertTriangle,
  Calendar,
  TrendingUp,
  Heart,
  Clock
} from 'lucide-react'
import { getRelativeTime } from '@/lib/utils'

interface Patient {
  id: string
  full_name: string
  created_at: string
  last_visit: string
  total_appointments: number
  medical_history: string
  allergies: string
}

interface PatientStatsProps {
  patients: Patient[]
}

export function PatientStats({ patients }: PatientStatsProps) {
  // Calculate stats
  const totalPatients = patients.length
  const newPatientsThisMonth = patients.filter(p => {
    const createdDate = new Date(p.created_at)
    const now = new Date()
    const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1)
    return createdDate >= monthAgo
  }).length

  const activePatients = patients.filter(p => {
    const lastVisit = new Date(p.last_visit)
    const now = new Date()
    const threeMonthsAgo = new Date(now.setMonth(now.getMonth() - 3))
    return lastVisit >= threeMonthsAgo
  }).length

  const patientsWithAlerts = patients.filter(p => 
    p.medical_history !== 'None' || p.allergies !== 'None'
  ).length

  const totalAppointments = patients.reduce((sum, p) => sum + p.total_appointments, 0)
  const averageAppointments = totalPatients > 0 ? (totalAppointments / totalPatients).toFixed(1) : '0'

  // Recent patients (last 30 days)
  const recentPatients = patients
    .filter(p => {
      const createdDate = new Date(p.created_at)
      const now = new Date()
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30))
      return createdDate >= thirtyDaysAgo
    })
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)

  const stats = [
    {
      title: 'Total Patients',
      value: totalPatients.toString(),
      description: 'Registered patients',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900'
    },
    {
      title: 'New This Month',
      value: newPatientsThisMonth.toString(),
      description: 'Recently registered',
      icon: UserPlus,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900'
    },
    {
      title: 'Active Patients',
      value: activePatients.toString(),
      description: 'Visited in last 3 months',
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900'
    },
    {
      title: 'Medical Alerts',
      value: patientsWithAlerts.toString(),
      description: 'Patients with conditions/allergies',
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900'
    },
    {
      title: 'Total Appointments',
      value: totalAppointments.toString(),
      description: 'All time appointments',
      icon: Calendar,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900'
    },
    {
      title: 'Avg Appointments',
      value: averageAppointments,
      description: 'Per patient',
      icon: TrendingUp,
      color: 'text-teal-600',
      bgColor: 'bg-teal-100 dark:bg-teal-900'
    },
  ]

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card
              key={index}
              className="relative overflow-hidden bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-[#404040] hover:shadow-lg transition-all duration-200 group"
            >
              {/* Gradient accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-orange-600" />

              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </CardTitle>
                <div className={`p-2.5 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Patients */}
      {recentPatients.length > 0 && (
        <Card className="bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-[#404040]">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900 dark:text-white">Recent Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                      {patient.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{patient.full_name}</p>
                      <p className="text-xs text-muted-foreground">
                        Registered {getRelativeTime(patient.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {patient.total_appointments} visits
                    </Badge>
                    {(patient.medical_history !== 'None' || patient.allergies !== 'None') && (
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alert Summary */}
      {patientsWithAlerts > 0 && (
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-orange-800 dark:text-orange-200 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Medical Alerts Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {patients.filter(p => p.medical_history !== 'None').length}
                </div>
                <div className="text-sm text-orange-700 dark:text-orange-300 flex items-center justify-center gap-1">
                  <Heart className="h-3 w-3" />
                  Medical Conditions
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {patients.filter(p => p.allergies !== 'None').length}
                </div>
                <div className="text-sm text-orange-700 dark:text-orange-300 flex items-center justify-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Known Allergies
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
