'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Clock, 
  Calendar, 
  Users, 
  Save, 
  X, 
  AlertCircle, 
  Info, 
  CheckCircle,
  Repeat,
  CalendarDays
} from 'lucide-react'

interface SlotData {
  id?: string
  dayOfWeek?: number // 0=Sunday, 1=Monday, ..., 6=Saturday
  date?: string // For specific date slots
  startTime: string
  endTime: string
  maxAppointments: number
  isActive: boolean
  isRecurring: boolean
  notes?: string
  effectiveFrom?: string
  effectiveUntil?: string
}

interface EnhancedSlotModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (slotData: SlotData) => Promise<void>
  editingSlot?: SlotData | null
  mode: 'create' | 'edit'
  preselectedDay?: number
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday', short: 'Sun' },
  { value: 1, label: 'Monday', short: 'Mon' },
  { value: 2, label: 'Tuesday', short: 'Tue' },
  { value: 3, label: 'Wednesday', short: 'Wed' },
  { value: 4, label: 'Thursday', short: 'Thu' },
  { value: 5, label: 'Friday', short: 'Fri' },
  { value: 6, label: 'Saturday', short: 'Sat' },
]

const CLINIC_HOURS = { start: '09:00', end: '18:00' }

export function EnhancedSlotModal({
  isOpen,
  onClose,
  onSave,
  editingSlot,
  mode,
  preselectedDay
}: EnhancedSlotModalProps) {
  const [formData, setFormData] = useState<SlotData>({
    dayOfWeek: preselectedDay || 1,
    startTime: '09:00',
    endTime: '10:00',
    maxAppointments: 2,
    isActive: true,
    isRecurring: true,
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (editingSlot && mode === 'edit') {
      setFormData({
        id: editingSlot.id,
        dayOfWeek: editingSlot.dayOfWeek,
        date: editingSlot.date,
        startTime: editingSlot.startTime,
        endTime: editingSlot.endTime,
        maxAppointments: editingSlot.maxAppointments,
        isActive: editingSlot.isActive,
        isRecurring: editingSlot.isRecurring,
        notes: editingSlot.notes || '',
        effectiveFrom: editingSlot.effectiveFrom,
        effectiveUntil: editingSlot.effectiveUntil
      })
    } else {
      setFormData({
        dayOfWeek: preselectedDay || 1,
        startTime: '09:00',
        endTime: '10:00',
        maxAppointments: 2,
        isActive: true,
        isRecurring: true,
        notes: ''
      })
    }
    setErrors({})
  }, [editingSlot, mode, isOpen, preselectedDay])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required'
    }
    if (!formData.endTime) {
      newErrors.endTime = 'End time is required'
    }
    if (formData.startTime >= formData.endTime) {
      newErrors.endTime = 'End time must be after start time'
    }
    if (formData.maxAppointments < 1) {
      newErrors.maxAppointments = 'Must allow at least 1 appointment'
    }
    if (formData.maxAppointments > 20) {
      newErrors.maxAppointments = 'Maximum 20 appointments per slot'
    }
    if (formData.isRecurring && formData.dayOfWeek === undefined) {
      newErrors.dayOfWeek = 'Day of week is required for recurring slots'
    }
    if (!formData.isRecurring && !formData.date) {
      newErrors.date = 'Date is required for specific date slots'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      console.error('Error saving slot:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    return `${displayHour}:${minutes} ${ampm}`
  }

  const getDuration = () => {
    if (!formData.startTime || !formData.endTime) return 0
    const start = new Date(`2000-01-01T${formData.startTime}`)
    const end = new Date(`2000-01-01T${formData.endTime}`)
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60)
  }

  const isWithinClinicHours = () => {
    return formData.startTime >= CLINIC_HOURS.start && formData.endTime <= CLINIC_HOURS.end
  }

  const getEstimatedSlots = () => {
    const duration = getDuration()
    if (duration <= 0) return 0
    return Math.floor(duration * 2) // 30-minute intervals
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {mode === 'create' ? 'Add New Time Slot' : 'Edit Time Slot'}
          </DialogTitle>
          <DialogDescription>
            Configure availability slot settings for appointment booking.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Slot Type Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Slot Type</Label>
            <div className="flex gap-4">
              <div 
                className={`flex-1 p-3 border rounded-lg cursor-pointer transition-colors ${
                  formData.isRecurring 
                    ? 'border-primary bg-primary/5' 
                    : 'border-muted hover:border-muted-foreground/50'
                }`}
                onClick={() => setFormData(prev => ({ ...prev, isRecurring: true, date: undefined }))}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Repeat className="h-4 w-4" />
                  <span className="font-medium">Recurring Weekly</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Repeats every week on the same day
                </p>
              </div>
              <div 
                className={`flex-1 p-3 border rounded-lg cursor-pointer transition-colors ${
                  !formData.isRecurring 
                    ? 'border-primary bg-primary/5' 
                    : 'border-muted hover:border-muted-foreground/50'
                }`}
                onClick={() => setFormData(prev => ({ ...prev, isRecurring: false, dayOfWeek: undefined }))}
              >
                <div className="flex items-center gap-2 mb-1">
                  <CalendarDays className="h-4 w-4" />
                  <span className="font-medium">Specific Date</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  One-time slot for a specific date
                </p>
              </div>
            </div>
          </div>

          {/* Day/Date Selection */}
          {formData.isRecurring ? (
            <div className="space-y-2">
              <Label htmlFor="dayOfWeek">Day of Week *</Label>
              <Select
                value={formData.dayOfWeek?.toString()}
                onValueChange={(value) => setFormData(prev => ({ ...prev, dayOfWeek: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {DAYS_OF_WEEK.map((day) => (
                    <SelectItem key={day.value} value={day.value.toString()}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.dayOfWeek && (
                <p className="text-sm text-red-600">{errors.dayOfWeek}</p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="date">Specific Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.date && (
                <p className="text-sm text-red-600">{errors.date}</p>
              )}
            </div>
          )}

          {/* Time Configuration */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time *</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                min={CLINIC_HOURS.start}
                max={CLINIC_HOURS.end}
              />
              {errors.startTime && (
                <p className="text-sm text-red-600">{errors.startTime}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time *</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                min={formData.startTime}
                max={CLINIC_HOURS.end}
              />
              {errors.endTime && (
                <p className="text-sm text-red-600">{errors.endTime}</p>
              )}
            </div>
          </div>

          {/* Slot Preview */}
          {formData.startTime && formData.endTime && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-4 w-4 text-blue-500" />
                <span className="font-medium">Slot Preview</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Time:</span>
                  <span className="ml-2">{formatTime(formData.startTime)} - {formatTime(formData.endTime)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="ml-2">{getDuration()} hours</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Estimated 30-min slots:</span>
                  <span className="ml-2">{getEstimatedSlots()}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Within clinic hours:</span>
                  <Badge variant={isWithinClinicHours() ? "default" : "secondary"} className="ml-2">
                    {isWithinClinicHours() ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {/* Capacity Configuration */}
          <div className="space-y-2">
            <Label htmlFor="maxAppointments">Maximum Appointments *</Label>
            <div className="flex items-center gap-2">
              <Input
                id="maxAppointments"
                type="number"
                min="1"
                max="20"
                value={formData.maxAppointments}
                onChange={(e) => setFormData(prev => ({ ...prev, maxAppointments: parseInt(e.target.value) || 1 }))}
                className="w-24"
              />
              <span className="text-sm text-muted-foreground">
                appointments per slot
              </span>
            </div>
            {errors.maxAppointments && (
              <p className="text-sm text-red-600">{errors.maxAppointments}</p>
            )}
          </div>

          {/* Status Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="isActive" className="font-medium">Slot Status</Label>
              <p className="text-sm text-muted-foreground">
                Enable this slot for patient booking
              </p>
            </div>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about this time slot..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {mode === 'create' ? 'Create Slot' : 'Update Slot'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
