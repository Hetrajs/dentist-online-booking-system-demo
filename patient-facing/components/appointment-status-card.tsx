'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  History,
  CreditCard,
  Star
} from 'lucide-react'

interface AppointmentStatusCardProps {
  appointment: any
  onCancel?: (appointmentId: string, reason: string) => void
  onReschedule?: (appointmentId: string) => void
  showHistory?: boolean
}

export function AppointmentStatusCard({ 
  appointment, 
  onCancel, 
  onReschedule, 
  showHistory = false 
}: AppointmentStatusCardProps) {
  const [cancelReason, setCancelReason] = useState('')
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'no_show':
        return <XCircle className="h-4 w-4 text-gray-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'no_show':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'normal':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    // Handle both old format (HH:MM:SS) and new format (HH:MM:SS-HH:MM:SS)
    if (timeString.includes('-')) {
      // New format: time range like "09:00:00-12:00:00"
      const [startTime, endTime] = timeString.split('-')
      const formatSingleTime = (time: string) => {
        return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        })
      }
      return `${formatSingleTime(startTime)} - ${formatSingleTime(endTime)}`
    } else {
      // Old format: single time like "09:00:00"
      return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    }
  }

  const handleCancel = () => {
    if (onCancel && cancelReason.trim()) {
      onCancel(appointment.id, cancelReason)
      setShowCancelDialog(false)
      setCancelReason('')
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price / 100)
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg flex items-center gap-2">
              {getStatusIcon(appointment.status)}
              {appointment.service}
            </CardTitle>
            <CardDescription className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(appointment.preferred_date)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatTime(appointment.preferred_time)}
              </span>
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2">
            <Badge className={getStatusColor(appointment.status)}>
              {appointment.status.replace('_', ' ').toUpperCase()}
            </Badge>
            {appointment.priority && appointment.priority !== 'normal' && (
              <Badge className={getPriorityColor(appointment.priority)}>
                {appointment.priority.toUpperCase()} PRIORITY
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Service Details */}
        <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
          {appointment.duration && (
            <div>
              <p className="text-sm font-medium text-gray-600">Duration</p>
              <p className="text-sm">{appointment.duration} minutes</p>
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-gray-600">Service</p>
            <p className="text-sm">{appointment.service}</p>
          </div>
          {appointment.price && (
            <div>
              <p className="text-sm font-medium text-gray-600">Price</p>
              <p className="text-sm font-semibold">{formatPrice(appointment.price)}</p>
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-gray-600">Payment</p>
            <Badge variant={(appointment.payment_status || 'unpaid') === 'paid' ? 'default' : 'secondary'}>
              {(appointment.payment_status || 'unpaid').toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-gray-500" />
            <span>{appointment.name}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-gray-500" />
            <span>{appointment.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-gray-500" />
            <span>{appointment.phone}</span>
          </div>
        </div>

        {/* Message */}
        {appointment.message && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">Message</p>
                <p className="text-sm text-blue-700">{appointment.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Notes (for staff) */}
        {appointment.notes && (
          <div className="p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-yellow-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Staff Notes</p>
                <p className="text-sm text-yellow-700">{appointment.notes}</p>
              </div>
            </div>
          </div>
        )}

        {/* Cancellation Reason */}
        {appointment.status === 'cancelled' && appointment.cancellation_reason && (
          <div className="p-3 bg-red-50 rounded-lg">
            <div className="flex items-start gap-2">
              <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">Cancellation Reason</p>
                <p className="text-sm text-red-700">{appointment.cancellation_reason}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {appointment.status === 'pending' && (
          <div className="flex gap-2 pt-2">
            <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <XCircle className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cancel Appointment</DialogTitle>
                  <DialogDescription>
                    Please provide a reason for cancelling this appointment.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="reason">Cancellation Reason</Label>
                    <Textarea
                      id="reason"
                      placeholder="Please explain why you need to cancel..."
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                    Keep Appointment
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleCancel}
                    disabled={!cancelReason.trim()}
                  >
                    Cancel Appointment
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            {onReschedule && (
              <Button variant="outline" size="sm" onClick={() => onReschedule(appointment.id)}>
                <Calendar className="h-4 w-4 mr-1" />
                Reschedule
              </Button>
            )}
          </div>
        )}

        {/* Timestamps */}
        <div className="text-xs text-gray-500 space-y-1 pt-2 border-t">
          <p>Created: {new Date(appointment.created_at).toLocaleString()}</p>
          {appointment.confirmed_at && (
            <p>Confirmed: {new Date(appointment.confirmed_at).toLocaleString()}</p>
          )}
          {appointment.completed_at && (
            <p>Completed: {new Date(appointment.completed_at).toLocaleString()}</p>
          )}
          {appointment.cancelled_at && (
            <p>Cancelled: {new Date(appointment.cancelled_at).toLocaleString()}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
