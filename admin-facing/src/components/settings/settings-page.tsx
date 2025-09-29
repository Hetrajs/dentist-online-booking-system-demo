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
  Settings,
  Shield,
  Database,
  Clock,
  Save,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Calendar
} from 'lucide-react'
import { api } from '@/lib/api-client'
import { SlotManagementModal } from './slot-management-modal'
import { BulkSlotModal } from './bulk-slot-modal'
import { EnhancedSlotModal } from './enhanced-slot-modal'
import { EnhancedBulkModal } from './enhanced-bulk-modal'

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday', short: 'Sun' },
  { value: 1, label: 'Monday', short: 'Mon' },
  { value: 2, label: 'Tuesday', short: 'Tue' },
  { value: 3, label: 'Wednesday', short: 'Wed' },
  { value: 4, label: 'Thursday', short: 'Thu' },
  { value: 5, label: 'Friday', short: 'Fri' },
  { value: 6, label: 'Saturday', short: 'Sat' },
]

interface ClinicSettings {
  name: string
  address: string
  phone: string
  email: string
  website: string
  description: string
  workingHours: {
    [key: string]: { open: string; close: string; closed: boolean }
  }
}

interface AdminUser {
  id: string
  name: string
  email: string
  role: 'admin' | 'staff' | 'doctor'
  status: 'active' | 'inactive'
  lastLogin: string
}

interface AvailabilitySlot {
  id: string
  day: string
  dayOfWeek?: number
  startTime: string
  endTime: string
  maxAppointments: number
  isActive: boolean
  isRecurring?: boolean
  date?: string
  notes?: string
  currentAppointments?: number
  effectiveFrom?: string
  effectiveUntil?: string
}

export function SettingsPage() {
  const [clinicSettings, setClinicSettings] = useState<ClinicSettings>({
    name: "Dr. Priya Sharma's Dental Wellness Studio",
    address: "123 Connaught Place, New Delhi, 110001",
    phone: "+91 11 2334 5678",
    email: "info@dentalwellness.com",
    website: "www.dentalwellness.com",
    description: "Premier dental care with state-of-the-art technology and personalized treatment plans.",
    workingHours: {
      monday: { open: '09:00', close: '18:00', closed: false },
      tuesday: { open: '09:00', close: '18:00', closed: false },
      wednesday: { open: '09:00', close: '18:00', closed: false },
      thursday: { open: '09:00', close: '18:00', closed: false },
      friday: { open: '09:00', close: '18:00', closed: false },
      saturday: { open: '10:00', close: '16:00', closed: false },
      sunday: { open: '10:00', close: '14:00', closed: true }
    }
  })

  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([
    {
      id: '1',
      name: 'Dr. Priya Sharma',
      email: 'priya@dentalwellness.com',
      role: 'admin',
      status: 'active',
      lastLogin: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Nurse Anita',
      email: 'anita@dentalwellness.com',
      role: 'staff',
      status: 'active',
      lastLogin: new Date(Date.now() - 3600000).toISOString()
    }
  ])

  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('general')

  // Modal states
  const [showSlotModal, setShowSlotModal] = useState(false)
  const [showBulkModal, setShowBulkModal] = useState(false)
  const [showEnhancedSlotModal, setShowEnhancedSlotModal] = useState(false)
  const [showEnhancedBulkModal, setShowEnhancedBulkModal] = useState(false)
  const [editingSlot, setEditingSlot] = useState<AvailabilitySlot | null>(null)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [preselectedDay, setPreselectedDay] = useState<number | undefined>(undefined)

  // Load availability slots on component mount
  useEffect(() => {
    if (activeTab === 'availability') {
      loadAvailabilitySlots()
    }
  }, [activeTab])

  const loadAvailabilitySlots = async () => {
    try {
      setLoading(true)
      const slots = await api.getAvailabilitySlots()

      // Transform database slots to component format
      const transformedSlots = slots.map(slot => {
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

        return {
          id: slot.id,
          day: slot.is_recurring
            ? dayNames[slot.day_of_week] || 'Unknown'
            : slot.date ? new Date(slot.date).toLocaleDateString('en-US', { weekday: 'long' }) : 'Unknown',
          dayOfWeek: slot.day_of_week,
          startTime: slot.start_time,
          endTime: slot.end_time,
          maxAppointments: slot.max_appointments,
          isActive: slot.is_available,
          isRecurring: slot.is_recurring,
          date: slot.date,
          notes: slot.notes,
          currentAppointments: slot.current_appointments || 0
        }
      })

      // Sort by day of week for recurring slots, then by date for specific slots
      transformedSlots.sort((a, b) => {
        if (a.isRecurring && b.isRecurring) {
          return (a.dayOfWeek || 0) - (b.dayOfWeek || 0)
        }
        if (a.isRecurring && !b.isRecurring) return -1
        if (!a.isRecurring && b.isRecurring) return 1
        return (a.date || '').localeCompare(b.date || '')
      })

      setAvailabilitySlots(transformedSlots)
    } catch (error) {
      console.error('Error loading availability slots:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    setLoading(true)
    try {
      // Mock save operation - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Settings saved:', clinicSettings)
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setLoading(false)
    }
  }

  // Modal handlers
  const openCreateModal = () => {
    setEditingSlot(null)
    setModalMode('create')
    setShowSlotModal(true)
  }

  const openEditModal = (slot: AvailabilitySlot) => {
    setEditingSlot(slot)
    setModalMode('edit')
    setShowSlotModal(true)
  }

  const openBulkModal = () => {
    setShowBulkModal(true)
  }

  // Enhanced modal handlers
  const openEnhancedCreateModal = (dayOfWeek?: number) => {
    setEditingSlot(null)
    setModalMode('create')
    setPreselectedDay(dayOfWeek)
    setShowEnhancedSlotModal(true)
  }

  const openEnhancedEditModal = (slot: AvailabilitySlot) => {
    setEditingSlot(slot)
    setModalMode('edit')
    setPreselectedDay(undefined)
    setShowEnhancedSlotModal(true)
  }

  const openEnhancedBulkModal = () => {
    setShowEnhancedBulkModal(true)
  }

  // Slot management functions
  const handleSaveSlot = async (slotData: any) => {
    try {
      const apiData = {
        day_of_week: slotData.dayOfWeek,
        start_time: slotData.startTime,
        end_time: slotData.endTime,
        max_appointments: slotData.maxAppointments,
        is_available: slotData.isActive,
        is_recurring: true, // All slots created through admin are recurring
        notes: slotData.notes,
        effective_from: new Date().toISOString().split('T')[0]
      }

      if (modalMode === 'create') {
        await api.createAvailabilitySlot(apiData)
      } else if (editingSlot) {
        await api.updateAvailabilitySlot(editingSlot.id, apiData)
      }

      await loadAvailabilitySlots()
      setShowSlotModal(false)
    } catch (error) {
      console.error('Error saving availability slot:', error)
      throw error
    }
  }

  // Enhanced save handlers
  const handleEnhancedSaveSlot = async (slotData: any) => {
    try {
      const apiData = {
        day_of_week: slotData.dayOfWeek,
        date: slotData.date,
        start_time: slotData.startTime,
        end_time: slotData.endTime,
        max_appointments: slotData.maxAppointments,
        is_available: slotData.isActive,
        notes: slotData.notes,
        is_recurring: slotData.isRecurring,
        effective_from: slotData.effectiveFrom || new Date().toISOString().split('T')[0],
        effective_until: slotData.effectiveUntil
      }

      if (modalMode === 'create') {
        await api.createAvailabilitySlot(apiData)
      } else if (editingSlot) {
        await api.updateAvailabilitySlot(editingSlot.id, apiData)
      }

      await loadAvailabilitySlots()
      setShowEnhancedSlotModal(false)
    } catch (error) {
      console.error('Error saving availability slot:', error)
      throw error
    }
  }

  const handleEnhancedBulkSave = async (bulkData: any) => {
    try {
      // If replace existing is enabled, delete existing slots for selected days
      if (bulkData.replaceExisting) {
        for (const dayOfWeek of bulkData.selectedDays) {
          const existingSlots = availabilitySlots.filter(
            slot => slot.dayOfWeek === dayOfWeek && slot.isRecurring
          )
          for (const slot of existingSlots) {
            await api.deleteAvailabilitySlot(slot.id)
          }
        }
      }

      // Create new slots
      for (const dayOfWeek of bulkData.selectedDays) {
        for (const timeSlot of bulkData.timeSlots) {
          const apiData = {
            day_of_week: dayOfWeek,
            start_time: timeSlot.startTime,
            end_time: timeSlot.endTime,
            max_appointments: timeSlot.maxAppointments,
            is_available: true,
            is_recurring: true,
            notes: bulkData.notes,
            effective_from: new Date().toISOString().split('T')[0]
          }
          await api.createAvailabilitySlot(apiData)
        }
      }

      await loadAvailabilitySlots()
      setShowEnhancedBulkModal(false)
    } catch (error) {
      console.error('Error saving bulk slots:', error)
      throw error
    }
  }



  const handleBulkSave = async (bulkData: any) => {
    try {
      // Create multiple slots for selected days
      const promises = bulkData.selectedDays.map((dayOfWeek: number) => {
        const apiData = {
          day_of_week: dayOfWeek,
          start_time: bulkData.startTime,
          end_time: bulkData.endTime,
          max_appointments: bulkData.maxAppointments,
          is_available: true,
          is_recurring: true,
          notes: bulkData.notes,
          effective_from: new Date().toISOString().split('T')[0]
        }
        return api.createAvailabilitySlot(apiData)
      })

      await Promise.all(promises)
      await loadAvailabilitySlots()
      setShowBulkModal(false)
    } catch (error) {
      console.error('Error creating bulk slots:', error)
      throw error
    }
  }

  const handleDeleteSlot = async (id: string) => {
    if (!confirm('Are you sure you want to delete this availability slot?')) {
      return
    }

    try {
      setLoading(true)
      await api.deleteAvailabilitySlot(id)
      await loadAvailabilitySlots()
    } catch (error) {
      console.error('Error deleting availability slot:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'doctor':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'staff':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your clinic settings, users, and system configuration
          </p>
        </div>
        <Button onClick={handleSaveSettings} disabled={loading}>
          {loading ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Changes
        </Button>
      </div>

      {/* Settings Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        <Button
          variant={activeTab === 'general' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('general')}
        >
          <Settings className="mr-2 h-4 w-4" />
          General
        </Button>
        <Button
          variant={activeTab === 'users' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('users')}
        >
          <Shield className="mr-2 h-4 w-4" />
          Users
        </Button>
        <Button
          variant={activeTab === 'clinic' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('clinic')}
        >
          <Database className="mr-2 h-4 w-4" />
          Clinic Info
        </Button>
        <Button
          variant={activeTab === 'availability' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('availability')}
        >
          <Clock className="mr-2 h-4 w-4" />
          Availability
        </Button>
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>
                Basic system settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Time Zone</label>
                  <Select defaultValue="asia/kolkata">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asia/kolkata">Asia/Kolkata (IST)</SelectItem>
                      <SelectItem value="utc">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date Format</label>
                  <Select defaultValue="dd/mm/yyyy">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Currency</label>
                  <Select defaultValue="inr">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inr">Indian Rupee (₹)</SelectItem>
                      <SelectItem value="usd">US Dollar ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Language</label>
                  <Select defaultValue="en">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Admin Users */}
      {activeTab === 'users' && (
        <Card>
          <CardHeader>
            <CardTitle>Admin Users</CardTitle>
            <CardDescription>
              Manage admin users and their permissions
            </CardDescription>
            <Button size="sm" className="w-fit">
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adminUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.lastLogin).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Clinic Information */}
      {activeTab === 'clinic' && (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Clinic Information</CardTitle>
              <CardDescription>
                Update your clinic&apos;s basic information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Clinic Name</label>
                <Input
                  value={clinicSettings.name}
                  onChange={(e) => setClinicSettings({...clinicSettings, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Address</label>
                <Input
                  value={clinicSettings.address}
                  onChange={(e) => setClinicSettings({...clinicSettings, address: e.target.value})}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <Input
                    value={clinicSettings.phone}
                    onChange={(e) => setClinicSettings({...clinicSettings, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    value={clinicSettings.email}
                    onChange={(e) => setClinicSettings({...clinicSettings, email: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Website</label>
                <Input
                  value={clinicSettings.website}
                  onChange={(e) => setClinicSettings({...clinicSettings, website: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>

          {/* Working Hours */}
          <Card>
            <CardHeader>
              <CardTitle>Working Hours</CardTitle>
              <CardDescription>
                Set your clinic&apos;s operating hours for each day
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(clinicSettings.workingHours).map(([day, hours]) => (
                  <div key={day} className="flex items-center space-x-4">
                    <div className="w-20 text-sm font-medium capitalize">{day}</div>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="time"
                        value={hours.open}
                        className="w-24"
                        disabled={hours.closed}
                      />
                      <span className="text-muted-foreground">to</span>
                      <Input
                        type="time"
                        value={hours.close}
                        className="w-24"
                        disabled={hours.closed}
                      />
                      <Button
                        variant={hours.closed ? "outline" : "secondary"}
                        size="sm"
                      >
                        {hours.closed ? "Closed" : "Open"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Availability Slots */}
      {activeTab === 'availability' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Time Slot Management</CardTitle>
                  <CardDescription>
                    Configure appointment availability and capacity management for your dental practice
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {/* Action Buttons */}
                  <Button size="sm" variant="outline" onClick={openEnhancedBulkModal}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Bulk Create
                  </Button>
                  <Button size="sm" onClick={() => openEnhancedCreateModal()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Slot
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Table View */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Day/Date</TableHead>
                      <TableHead>Time Slot</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                          <p>Loading availability slots...</p>
                        </TableCell>
                      </TableRow>
                    ) : availabilitySlots.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">No availability slots configured</p>
                          <p className="text-sm text-muted-foreground">Add your first slot to get started</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      availabilitySlots.map((slot) => (
                        <TableRow key={slot.id}>
                          <TableCell className="font-medium">
                            <div className="flex flex-col">
                              <span>{slot.day}</span>
                              {slot.isRecurring && (
                                <span className="text-xs text-muted-foreground">Every week</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              {slot.startTime} - {slot.endTime}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">{slot.currentAppointments || 0} / {slot.maxAppointments}</span>
                              <span className="text-xs text-muted-foreground">
                                {slot.maxAppointments - (slot.currentAppointments || 0)} available
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {slot.isRecurring ? 'Recurring' : 'Specific'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={slot.isActive ? 'default' : 'secondary'}>
                              {slot.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEnhancedEditModal(slot)}
                                title="Edit slot"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteSlot(slot.id)}
                                title="Delete slot"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Legacy Modals */}
      <SlotManagementModal
        isOpen={showSlotModal}
        onClose={() => setShowSlotModal(false)}
        onSave={handleSaveSlot}
        editingSlot={editingSlot ? {
          id: editingSlot.id,
          dayOfWeek: editingSlot.dayOfWeek || 1,
          startTime: editingSlot.startTime,
          endTime: editingSlot.endTime,
          maxAppointments: editingSlot.maxAppointments,
          isActive: editingSlot.isActive,
          notes: editingSlot.notes
        } : null}
        mode={modalMode}
      />

      <BulkSlotModal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        onSave={handleBulkSave}
      />

      {/* Enhanced Modals */}
      <EnhancedSlotModal
        isOpen={showEnhancedSlotModal}
        onClose={() => setShowEnhancedSlotModal(false)}
        onSave={handleEnhancedSaveSlot}
        editingSlot={editingSlot ? {
          id: editingSlot.id,
          dayOfWeek: editingSlot.dayOfWeek,
          date: editingSlot.date,
          startTime: editingSlot.startTime,
          endTime: editingSlot.endTime,
          maxAppointments: editingSlot.maxAppointments,
          isActive: editingSlot.isActive,
          isRecurring: editingSlot.isRecurring || false,
          notes: editingSlot.notes,
          effectiveFrom: editingSlot.effectiveFrom,
          effectiveUntil: editingSlot.effectiveUntil
        } : null}
        mode={modalMode}
        preselectedDay={preselectedDay}
      />

      <EnhancedBulkModal
        isOpen={showEnhancedBulkModal}
        onClose={() => setShowEnhancedBulkModal(false)}
        onSave={handleEnhancedBulkSave}
      />
    </div>
  )
}
