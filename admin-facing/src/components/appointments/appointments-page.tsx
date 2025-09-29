'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Calendar,
  Search,
  Plus,
  RefreshCw,
  Clock,
  User,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react'
import { api } from '@/lib/api-client'
import { type Appointment } from '@/lib/supabase'
import { AppointmentDetailsModal } from './appointment-details-modal'
import { PageLayout } from '@/components/ui/page-layout'
import { StatsCard, StatsGrid } from '@/components/ui/stats-card'

// Utility functions
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
    case 'in_progress':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  }
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
      return <AlertCircle className="h-4 w-4 text-purple-600" />
    default:
      return <Clock className="h-4 w-4 text-gray-600" />
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatTime = (timeString: string) => {
  // Handle both old format (HH:MM:SS) and new format (HH:MM:SS-HH:MM:SS)
  if (timeString.includes('-')) {
    // New format: time range like "09:00:00-12:00:00"
    const [startTime, endTime] = timeString.split('-')
    const formatSingleTime = (time: string) => {
      return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    }
    return `${formatSingleTime(startTime)} - ${formatSingleTime(endTime)}`
  } else {
    // Old format: single time like "09:00:00"
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }
}

interface AppointmentStats {
  total: number
  pending: number
  confirmed: number
  completed: number
  cancelled: number
}

export function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([])
  const [stats, setStats] = useState<AppointmentStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)

  useEffect(() => {
    async function loadAppointments() {
      try {
        setLoading(true)
        const data = await api.getAppointments()
        setAppointments(data)
        setFilteredAppointments(data)

        // Calculate stats
        const appointmentStats: AppointmentStats = {
          total: data.length,
          pending: data.filter(apt => apt.status === 'pending').length,
          confirmed: data.filter(apt => apt.status === 'confirmed').length,
          completed: data.filter(apt => apt.status === 'completed').length,
          cancelled: data.filter(apt => apt.status === 'cancelled').length,
        }
        setStats(appointmentStats)
      } catch (error) {
        console.error('Error loading appointments:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAppointments()
  }, [])

  useEffect(() => {
    let filtered = appointments

    if (searchQuery) {
      filtered = filtered.filter(appointment =>
        appointment.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.phone?.includes(searchQuery) ||
        appointment.service?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(appointment => appointment.status === statusFilter)
    }

    setFilteredAppointments(filtered)
  }, [appointments, searchQuery, statusFilter])

  const handleRefresh = async () => {
    try {
      setLoading(true)
      const data = await api.getAppointments()
      setAppointments(data)
      setFilteredAppointments(data)
    } catch (error) {
      console.error('Error refreshing appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setDetailsModalOpen(true)
  }



  if (loading) {
    return (
      <PageLayout
        title="Appointments"
        description="Manage patient appointments and schedules"
        icon={Calendar}
        actions={
          <Button disabled className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg">
            <Plus className="mr-2 h-4 w-4" />
            New Appointment
          </Button>
        }
        stats={
          <StatsGrid>
            <StatsCard title="Total Appointments" value="..." description="Loading..." icon={Calendar} loading />
            <StatsCard title="Pending" value="..." description="Loading..." icon={Clock} loading />
            <StatsCard title="Confirmed" value="..." description="Loading..." icon={CheckCircle} loading />
            <StatsCard title="Completed" value="..." description="Loading..." icon={CheckCircle} loading />
          </StatsGrid>
        }
      >
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto text-gray-400" />
                <p className="text-gray-500 mt-2">Loading appointments...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout
      title="Appointments"
      description="Manage patient appointments and schedules"
      icon={Calendar}
      actions={
        <div className="flex items-center gap-3">
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg">
            <Plus className="h-4 w-4 mr-2" />
            New Appointment
          </Button>
        </div>
      }
      stats={
        stats && (
          <StatsGrid>
            <StatsCard
              title="Total Appointments"
              value={stats.total}
              description="All appointments"
              icon={Calendar}
              color="blue"
            />
            <StatsCard
              title="Pending"
              value={stats.pending}
              description="Awaiting confirmation"
              icon={Clock}
              color="yellow"
            />
            <StatsCard
              title="Confirmed"
              value={stats.confirmed}
              description="Confirmed appointments"
              icon={CheckCircle}
              color="green"
            />
            <StatsCard
              title="Completed"
              value={stats.completed}
              description="Completed appointments"
              icon={CheckCircle}
              color="blue"
            />
          </StatsGrid>
        )
      }
    >

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search appointments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Appointments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Appointments ({filteredAppointments.length})</CardTitle>
          <CardDescription>
            Recent appointments and their current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No appointments found</h3>
              <p className="text-muted-foreground">
                {searchQuery || statusFilter !== 'all' 
                  ? 'Try adjusting your filters' 
                  : 'No appointments have been scheduled yet'}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{appointment.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Appointment #{appointments.findIndex(a => a.id === appointment.id) + 1}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{appointment.service}</div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {formatDate(appointment.preferred_date)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatTime(appointment.preferred_time)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(appointment.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(appointment.status)}
                            {appointment.status}
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{appointment.phone}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(appointment)}
                          >
                            <User className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Appointment Details Modal */}
      <AppointmentDetailsModal
        appointment={selectedAppointment}
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
      />
    </PageLayout>
  )
}
