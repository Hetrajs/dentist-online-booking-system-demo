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
  FileText,
  Search,
  RefreshCw,
  Eye,
  Download,
  Plus,
  Filter,
  User,
  Calendar,
  Activity,
  AlertTriangle,
  Heart,
  Pill
} from 'lucide-react'
import { api } from '@/lib/api-client'
import { type MedicalRecord } from '@/lib/supabase'

export function PatientRecordsPage() {
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [recordTypeFilter, setRecordTypeFilter] = useState<string>('all')

  useEffect(() => {
    fetchMedicalRecords()
  }, [])

  const fetchMedicalRecords = async () => {
    setLoading(true)
    try {
      const data = await api.getMedicalRecords()
      setRecords(data)
    } catch (error) {
      console.error('Error fetching medical records:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRecordTypeColor = (type: string) => {
    switch (type) {
      case 'consultation':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'treatment':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'prescription':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
      case 'lab_result':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'x_ray':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'appointment_intake':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getRecordTypeIcon = (type: string) => {
    switch (type) {
      case 'consultation':
        return <User className="h-4 w-4" />
      case 'treatment':
        return <Activity className="h-4 w-4" />
      case 'prescription':
        return <Pill className="h-4 w-4" />
      case 'lab_result':
        return <FileText className="h-4 w-4" />
      case 'x_ray':
        return <FileText className="h-4 w-4" />
      case 'appointment_intake':
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const filteredRecords = records.filter(record => {
    const patientName = record.user_profiles?.full_name || 'Unknown Patient'
    const matchesSearch = patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (record.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = recordTypeFilter === 'all' || record.record_type === recordTypeFilter
    return matchesSearch && matchesType
  })

  const recordTypeCounts = {
    consultation: records.filter(r => r.recordType === 'consultation').length,
    treatment: records.filter(r => r.recordType === 'treatment').length,
    prescription: records.filter(r => r.recordType === 'prescription').length,
    lab_result: records.filter(r => r.recordType === 'lab_result').length,
    x_ray: records.filter(r => r.recordType === 'x_ray').length,
  }

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
          <h1 className="text-3xl font-bold tracking-tight">Medical Records</h1>
          <p className="text-muted-foreground">
            Comprehensive patient medical records and treatment history
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Record
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{records.length}</div>
            <p className="text-xs text-muted-foreground">
              All medical records
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consultations</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recordTypeCounts.consultation}</div>
            <p className="text-xs text-muted-foreground">
              Patient consultations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Treatments</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recordTypeCounts.treatment}</div>
            <p className="text-xs text-muted-foreground">
              Treatment records
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prescriptions</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recordTypeCounts.prescription}</div>
            <p className="text-xs text-muted-foreground">
              Medication records
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">X-Rays</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recordTypeCounts.x_ray}</div>
            <p className="text-xs text-muted-foreground">
              Radiographic records
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Patient Medical Records</CardTitle>
          <CardDescription>
            Detailed medical records for all patients
          </CardDescription>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm" onClick={fetchMedicalRecords}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Record Type</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Diagnosis</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {(record.user_profiles?.full_name || 'U').split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{record.user_profiles?.full_name || 'Unknown Patient'}</div>
                        <div className="text-sm text-muted-foreground">{record.user_profiles?.email || 'No email'}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRecordTypeColor(record.record_type)}>
                      <div className="flex items-center space-x-1">
                        {getRecordTypeIcon(record.record_type)}
                        <span className="capitalize">{record.record_type.replace('_', ' ')}</span>
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{record.title}</div>
                    <div className="text-sm text-muted-foreground max-w-[200px] truncate">
                      {record.description || 'No description'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[200px] truncate">
                      {record.diagnosis || 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{record.created_by || 'Unknown'}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(record.created_at).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(record.created_at).toLocaleTimeString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {record.attachments && record.attachments.length > 0 && (
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredRecords.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No medical records found</p>
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
