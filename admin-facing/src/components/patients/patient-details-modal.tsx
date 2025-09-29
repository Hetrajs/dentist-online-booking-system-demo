'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Activity,
  FileText,
  Clock,
  Edit,
  Trash2,
  Plus
} from 'lucide-react'
import { type Patient } from '@/lib/supabase'
import { api } from '@/lib/api-client'

interface PatientDetailsModalProps {
  patient: Patient | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface PatientAppointment {
  id: string
  service_name: string
  appointment_date: string
  appointment_time: string
  status: string
  notes?: string
}

export function PatientDetailsModal({ patient, open, onOpenChange }: PatientDetailsModalProps) {
  const [appointments, setAppointments] = useState<PatientAppointment[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (patient && open) {
      fetchPatientAppointments()
    }
  }, [patient, open])

  const fetchPatientAppointments = async () => {
    if (!patient) return

    setLoading(true)
    try {
      // Fetch real appointments for this patient
      const data = await api.getPatientAppointments(patient.id)
      const formattedAppointments: PatientAppointment[] = data.map((appointment: any) => ({
        id: appointment.id,
        service_name: appointment.service,
        appointment_date: appointment.preferred_date,
        appointment_time: appointment.preferred_time,
        status: appointment.status,
        notes: appointment.notes || appointment.message || ''
      }))
      setAppointments(formattedAppointments)
    } catch (error) {
      console.error('Error fetching patient appointments:', error)
      setAppointments([])
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  if (!patient) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={patient.avatar_url || undefined} />
              <AvatarFallback className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                {getInitials(patient.full_name || 'Unknown')}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-xl font-semibold">{patient.full_name}</div>
              <div className="text-sm text-muted-foreground">Patient Profile</div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Personal Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Email</div>
                  <div className="text-sm text-muted-foreground">{patient.email}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Phone</div>
                  <div className="text-sm text-muted-foreground">{patient.phone}</div>
                </div>
              </div>

              {patient.date_of_birth && (
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Age</div>
                    <div className="text-sm text-muted-foreground">
                      {calculateAge(patient.date_of_birth)} years old
                    </div>
                  </div>
                </div>
              )}

              {patient.address && (
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Address</div>
                    <div className="text-sm text-muted-foreground">{patient.address}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Medical Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Medical Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium">Medical History</div>
                <div className="text-sm text-muted-foreground">
                  {patient.medical_history || 'No medical history recorded'}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium">Allergies</div>
                <div className="text-sm text-muted-foreground">
                  {patient.allergies || 'No known allergies'}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium">Current Medications</div>
                <div className="text-sm text-muted-foreground">
                  {patient.current_medications || 'No current medications'}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium">Previous Dental Work</div>
                <div className="text-sm text-muted-foreground">
                  {patient.previous_dental_work || 'No previous dental work recorded'}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium">Dental Concerns</div>
                <div className="text-sm text-muted-foreground">
                  {patient.dental_concerns || 'No specific concerns noted'}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium">Emergency Contact</div>
                <div className="text-sm text-muted-foreground">
                  {patient.emergency_contact ? (
                    <div>
                      <div>{patient.emergency_contact}</div>
                      {patient.emergency_contact_phone && (
                        <div className="text-xs">{patient.emergency_contact_phone}</div>
                      )}
                      {patient.emergency_contact_relationship && (
                        <div className="text-xs">({patient.emergency_contact_relationship})</div>
                      )}
                    </div>
                  ) : (
                    'Not provided'
                  )}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium">Insurance Information</div>
                <div className="text-sm text-muted-foreground">
                  {patient.has_insurance === 'yes' ? (
                    <div>
                      <div>Has Insurance: Yes</div>
                      {patient.insurance_provider && (
                        <div className="text-xs">Provider: {patient.insurance_provider}</div>
                      )}
                      {patient.insurance_policy_number && (
                        <div className="text-xs">Policy: {patient.insurance_policy_number}</div>
                      )}
                    </div>
                  ) : patient.has_insurance === 'no' ? (
                    'No insurance'
                  ) : patient.has_insurance === 'unsure' ? (
                    'Insurance status unsure'
                  ) : (
                    'Insurance information not provided'
                  )}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium">Last Visit</div>
                <div className="text-sm text-muted-foreground">
                  {patient.last_visit
                    ? new Date(patient.last_visit).toLocaleDateString()
                    : 'Never'
                  }
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Appointment History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Appointment History</span>
              </div>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Appointment
              </Button>
            </CardTitle>
            <CardDescription>
              Recent appointments and treatments
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No appointments found</p>
                <p className="text-sm">This patient hasn&apos;t had any appointments yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{appointment.service_name}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(appointment.appointment_date).toLocaleDateString()} at {appointment.appointment_time}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit Patient
          </Button>
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Medical Records
          </Button>
          <Button variant="destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Patient
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
