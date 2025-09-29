'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  UserCheck,
  Clock,
  Search,
  RefreshCw,
  Check,
  X,
  Eye,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  Filter
} from 'lucide-react'
import { api } from '@/lib/api-client'
import { type Appointment } from '@/lib/supabase'

export function PendingAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchPendingAppointments()
  }, [])

  const fetchPendingAppointments = async () => {
    setLoading(true)
    try {
      const data = await api.getPendingAppointments()
      setAppointments(data)
    } catch (error) {
      console.error('Error fetching pending appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (appointmentId: string) => {
    setProcessingIds(prev => new Set(prev).add(appointmentId))
    try {
      await api.updatePendingAppointment(appointmentId, {
        status: 'confirmed',
        confirmed_at: new Date().toISOString()
      })

      setAppointments(prev => prev.filter(apt => apt.id !== appointmentId))
      console.log('Appointment approved:', appointmentId)
    } catch (error) {
      console.error('Error approving appointment:', error)
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(appointmentId)
        return newSet
      })
    }
  }

  const handleReject = async (appointmentId: string) => {
    setProcessingIds(prev => new Set(prev).add(appointmentId))
    try {
      await api.updatePendingAppointment(appointmentId, {
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        cancellation_reason: 'Rejected by admin'
      })

      setAppointments(prev => prev.filter(apt => apt.id !== appointmentId))
      console.log('Appointment rejected:', appointmentId)
    } catch (error) {
      console.error('Error rejecting appointment:', error)
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(appointmentId)
        return newSet
      })
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'normal':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }



  const filteredAppointments = appointments.filter(appointment =>
    appointment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.service.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const urgentCount = appointments.filter(apt => apt.priority === 'urgent').length
  const todayCount = appointments.filter(apt => 
    new Date(apt.preferred_date).toDateString() === new Date().toDateString()
  ).length

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
          <h1 className="text-3xl font-bold tracking-tight">Pending Appointments</h1>
          <p className="text-muted-foreground">
            Review and approve appointment requests from patients
          </p>
        </div>
        <Button onClick={fetchPendingAppointments}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pending</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointments.length}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{urgentCount}</div>
            <p className="text-xs text-muted-foreground">
              High priority requests
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayCount}</div>
            <p className="text-xs text-muted-foreground">
              Requested for today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.5h</div>
            <p className="text-xs text-muted-foreground">
              Average response time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Appointments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Appointment Requests</CardTitle>
          <CardDescription>
            Review patient appointment requests and take action
          </CardDescription>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Preferred Date & Time</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Requested</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{appointment.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center space-x-2">
                        <Mail className="h-3 w-3" />
                        <span>{appointment.email}</span>
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center space-x-2">
                        <Phone className="h-3 w-3" />
                        <span>{appointment.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{appointment.service}</div>
                    {appointment.message && (
                      <div className="text-sm text-muted-foreground max-w-[200px] truncate">
                        {appointment.message}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">
                          {new Date(appointment.preferred_date).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {appointment.preferred_time}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(appointment.priority)}>
                      {appointment.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                      Online
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(appointment.created_at).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(appointment.created_at).toLocaleTimeString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleApprove(appointment.id)}
                        disabled={processingIds.has(appointment.id)}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        {processingIds.has(appointment.id) ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleReject(appointment.id)}
                        disabled={processingIds.has(appointment.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        {processingIds.has(appointment.id) ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredAppointments.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <UserCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No pending appointments found</p>
              {searchTerm && (
                <p className="text-sm">Try adjusting your search criteria</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
