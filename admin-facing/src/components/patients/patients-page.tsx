'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Search,
  Plus,
  RefreshCw,
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Users,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react'
import { api } from '@/lib/api-client'
import { type Patient } from '@/lib/supabase'
import { PatientDetailsModal } from './patient-details-modal'
import { PageLayout } from '@/components/ui/page-layout'
import { StatsCard, StatsGrid } from '@/components/ui/stats-card'

// Utility functions
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
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

interface PatientStats {
  total: number
  newThisMonth: number
  activePatients: number
  totalAppointments: number
}

export function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([])
  const [stats, setStats] = useState<PatientStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)

  useEffect(() => {
    async function loadPatients() {
      try {
        setLoading(true)
        const data = await api.getPatients()
        setPatients(data)
        setFilteredPatients(data)

        // Calculate patient statistics
        const totalPatients = data.length
        const totalAppointments = data.reduce((sum, patient) => sum + (patient.total_appointments || 0), 0)
        const newThisMonth = data.filter(patient => {
          const createdDate = new Date(patient.created_at)
          const now = new Date()
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
          return createdDate >= monthStart
        }).length
        const activePatients = data.filter(patient => {
          if (!patient.last_visit) return false
          const lastVisit = new Date(patient.last_visit)
          const threeMonthsAgo = new Date()
          threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
          return lastVisit >= threeMonthsAgo
        }).length

        setStats({
          total: totalPatients,
          newThisMonth,
          activePatients,
          totalAppointments
        })
      } catch (error) {
        console.error('Error loading patients:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPatients()
  }, [])

  useEffect(() => {
    let filtered = patients

    if (searchQuery) {
      filtered = filtered.filter(patient =>
        patient.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.phone?.includes(searchQuery)
      )
    }

    setFilteredPatients(filtered)
  }, [patients, searchQuery])

  const handleRefresh = async () => {
    try {
      setLoading(true)
      const data = await api.getPatients()
      setPatients(data)
      setFilteredPatients(data)

      // Recalculate patient statistics
      const totalPatients = data.length
      const totalAppointments = data.reduce((sum, patient) => sum + (patient.total_appointments || 0), 0)
      const newThisMonth = data.filter(patient => {
        const createdDate = new Date(patient.created_at)
        const now = new Date()
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        return createdDate >= monthStart
      }).length
      const activePatients = data.filter(patient => {
        if (!patient.last_visit) return false
        const lastVisit = new Date(patient.last_visit)
        const threeMonthsAgo = new Date()
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
        return lastVisit >= threeMonthsAgo
      }).length

      setStats({
        total: totalPatients,
        newThisMonth,
        activePatients,
        totalAppointments
      })
    } catch (error) {
      console.error('Error refreshing patients:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (patient: Patient) => {
    setSelectedPatient(patient)
    setDetailsModalOpen(true)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
            <p className="text-muted-foreground">Manage patient records and information</p>
          </div>
        </div>
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
          <p className="text-muted-foreground">
            Manage patient records and information
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Patient
          </Button>
        </div>
      </div>

      {/* Patient Statistics */}
      {stats && (
        <StatsGrid>
          <StatsCard
            title="Total Patients"
            value={stats.total}
            icon={Users}
            description="All registered patients"
          />
          <StatsCard
            title="New This Month"
            value={stats.newThisMonth}
            icon={User}
            description="Patients registered this month"
          />
          <StatsCard
            title="Active Patients"
            value={stats.activePatients}
            icon={Users}
            description="Visited in last 3 months"
          />
          <StatsCard
            title="Total Appointments"
            value={stats.totalAppointments}
            icon={Calendar}
            description="All appointments booked"
          />
        </StatsGrid>
      )}

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search Patients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Patients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Patients ({filteredPatients.length})</CardTitle>
          <CardDescription>
            All registered patients and their information
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredPatients.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No patients found</h3>
              <p className="text-muted-foreground">
                {searchQuery 
                  ? 'Try adjusting your search query' 
                  : 'No patients have been registered yet'}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Last Visit</TableHead>
                    <TableHead>Total Appointments</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={patient.avatar_url || undefined} />
                            <AvatarFallback className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                              {getInitials(patient.full_name || 'Unknown')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{patient.full_name}</div>
                            <div className="text-sm text-muted-foreground">
                              Patient #{patients.findIndex(p => p.id === patient.id) + 1}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span>{patient.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span>{patient.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {patient.date_of_birth 
                              ? `${calculateAge(patient.date_of_birth)} years`
                              : 'N/A'
                            }
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {patient.last_visit 
                            ? formatDate(patient.last_visit)
                            : 'Never'
                          }
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {patient.total_appointments || 0} appointments
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(patient)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
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

      {/* Patient Details Modal */}
      <PatientDetailsModal
        patient={selectedPatient}
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
      />
    </div>
  )
}
