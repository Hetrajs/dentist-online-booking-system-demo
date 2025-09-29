'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { 
  Clock, 
  Calendar, 
  Users, 
  Save, 
  X, 
  Copy, 
  Plus, 
  Trash2, 
  Info,
  CheckCircle,
  AlertCircle,
  Zap
} from 'lucide-react'

interface TimeSlotTemplate {
  startTime: string
  endTime: string
  maxAppointments: number
}

interface BulkSlotData {
  timeSlots: TimeSlotTemplate[]
  selectedDays: number[]
  notes?: string
  replaceExisting: boolean
}

interface EnhancedBulkModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (bulkData: BulkSlotData) => Promise<void>
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

const PRESET_SCHEDULES = [
  {
    name: 'Standard Weekdays',
    description: 'Morning and afternoon sessions',
    days: [1, 2, 3, 4, 5],
    slots: [
      { startTime: '09:00', endTime: '12:00', maxAppointments: 6 },
      { startTime: '14:00', endTime: '18:00', maxAppointments: 8 }
    ]
  },
  {
    name: 'Half Day Saturday',
    description: 'Morning session only',
    days: [6],
    slots: [
      { startTime: '09:00', endTime: '13:00', maxAppointments: 8 }
    ]
  },
  {
    name: 'Extended Hours',
    description: 'Early morning to evening',
    days: [1, 2, 3, 4, 5],
    slots: [
      { startTime: '08:00', endTime: '12:00', maxAppointments: 8 },
      { startTime: '13:00', endTime: '17:00', maxAppointments: 8 },
      { startTime: '18:00', endTime: '20:00', maxAppointments: 4 }
    ]
  }
]

export function EnhancedBulkModal({ isOpen, onClose, onSave }: EnhancedBulkModalProps) {
  const [formData, setFormData] = useState<BulkSlotData>({
    timeSlots: [{ startTime: '09:00', endTime: '12:00', maxAppointments: 6 }],
    selectedDays: [1, 2, 3, 4, 5],
    notes: '',
    replaceExisting: false
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleDayToggle = (dayValue: number) => {
    setFormData(prev => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(dayValue)
        ? prev.selectedDays.filter(d => d !== dayValue)
        : [...prev.selectedDays, dayValue]
    }))
  }

  const handleQuickSelect = (type: 'weekdays' | 'weekend' | 'all' | 'none') => {
    let days: number[] = []
    switch (type) {
      case 'weekdays':
        days = [1, 2, 3, 4, 5]
        break
      case 'weekend':
        days = [0, 6]
        break
      case 'all':
        days = [0, 1, 2, 3, 4, 5, 6]
        break
      case 'none':
        days = []
        break
    }
    setFormData(prev => ({ ...prev, selectedDays: days }))
  }

  const addTimeSlot = () => {
    setFormData(prev => ({
      ...prev,
      timeSlots: [...prev.timeSlots, { startTime: '09:00', endTime: '10:00', maxAppointments: 2 }]
    }))
  }

  const removeTimeSlot = (index: number) => {
    if (formData.timeSlots.length > 1) {
      setFormData(prev => ({
        ...prev,
        timeSlots: prev.timeSlots.filter((_, i) => i !== index)
      }))
    }
  }

  const updateTimeSlot = (index: number, field: keyof TimeSlotTemplate, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.map((slot, i) => 
        i === index ? { ...slot, [field]: value } : slot
      )
    }))
  }

  const applyPreset = (preset: typeof PRESET_SCHEDULES[0]) => {
    setFormData(prev => ({
      ...prev,
      timeSlots: preset.slots,
      selectedDays: preset.days
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (formData.timeSlots.length === 0) {
      newErrors.timeSlots = 'At least one time slot is required'
    }

    formData.timeSlots.forEach((slot, index) => {
      if (!slot.startTime) {
        newErrors[`slot${index}StartTime`] = 'Start time is required'
      }
      if (!slot.endTime) {
        newErrors[`slot${index}EndTime`] = 'End time is required'
      }
      if (slot.startTime >= slot.endTime) {
        newErrors[`slot${index}EndTime`] = 'End time must be after start time'
      }
      if (slot.maxAppointments < 1) {
        newErrors[`slot${index}MaxAppointments`] = 'Must allow at least 1 appointment'
      }
    })

    if (formData.selectedDays.length === 0) {
      newErrors.selectedDays = 'Please select at least one day'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      await onSave(formData)
      onClose()
      // Reset form
      setFormData({
        timeSlots: [{ startTime: '09:00', endTime: '12:00', maxAppointments: 6 }],
        selectedDays: [1, 2, 3, 4, 5],
        notes: '',
        replaceExisting: false
      })
    } catch (error) {
      console.error('Error saving bulk slots:', error)
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

  const getTotalSlots = () => {
    return formData.timeSlots.length * formData.selectedDays.length
  }

  const getTotalCapacity = () => {
    return formData.timeSlots.reduce((total, slot) => total + slot.maxAppointments, 0) * formData.selectedDays.length
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Bulk Create Time Slots
          </DialogTitle>
          <DialogDescription>
            Create multiple time slots across selected days of the week.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Preset Templates */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Quick Templates</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {PRESET_SCHEDULES.map((preset, index) => (
                <div
                  key={index}
                  className="p-3 border rounded-lg cursor-pointer hover:border-primary transition-colors"
                  onClick={() => applyPreset(preset)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">{preset.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{preset.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {preset.days.map(day => (
                      <Badge key={day} variant="outline" className="text-xs">
                        {DAYS_OF_WEEK[day].short}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Day Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Select Days</Label>
            <div className="flex flex-wrap gap-2 mb-3">
              <Button size="sm" variant="outline" onClick={() => handleQuickSelect('weekdays')}>
                Weekdays
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleQuickSelect('weekend')}>
                Weekend
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleQuickSelect('all')}>
                All Days
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleQuickSelect('none')}>
                Clear All
              </Button>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {DAYS_OF_WEEK.map((day) => (
                <div key={day.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`day-${day.value}`}
                    checked={formData.selectedDays.includes(day.value)}
                    onCheckedChange={() => handleDayToggle(day.value)}
                  />
                  <Label htmlFor={`day-${day.value}`} className="text-sm">
                    {day.short}
                  </Label>
                </div>
              ))}
            </div>
            {errors.selectedDays && (
              <p className="text-sm text-red-600">{errors.selectedDays}</p>
            )}
          </div>

          {/* Time Slots */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Time Slots</Label>
              <Button size="sm" onClick={addTimeSlot}>
                <Plus className="h-4 w-4 mr-1" />
                Add Slot
              </Button>
            </div>
            <div className="space-y-3">
              {formData.timeSlots.map((slot, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-sm">Slot {index + 1}</span>
                    {formData.timeSlots.length > 1 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeTimeSlot(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label className="text-xs">Start Time</Label>
                      <Input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) => updateTimeSlot(index, 'startTime', e.target.value)}
                        className="mt-1"
                      />
                      {errors[`slot${index}StartTime`] && (
                        <p className="text-xs text-red-600 mt-1">{errors[`slot${index}StartTime`]}</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-xs">End Time</Label>
                      <Input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) => updateTimeSlot(index, 'endTime', e.target.value)}
                        className="mt-1"
                      />
                      {errors[`slot${index}EndTime`] && (
                        <p className="text-xs text-red-600 mt-1">{errors[`slot${index}EndTime`]}</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-xs">Max Appointments</Label>
                      <Input
                        type="number"
                        min="1"
                        max="20"
                        value={slot.maxAppointments}
                        onChange={(e) => updateTimeSlot(index, 'maxAppointments', parseInt(e.target.value) || 1)}
                        className="mt-1"
                      />
                      {errors[`slot${index}MaxAppointments`] && (
                        <p className="text-xs text-red-600 mt-1">{errors[`slot${index}MaxAppointments`]}</p>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {formatTime(slot.startTime)} - {formatTime(slot.endTime)} • {slot.maxAppointments} appointments
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Replace Existing Slots</Label>
                <p className="text-sm text-muted-foreground">
                  Remove existing slots for selected days before creating new ones
                </p>
              </div>
              <Switch
                checked={formData.replaceExisting}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, replaceExisting: checked }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Notes (Optional)</Label>
              <Textarea
                placeholder="Add any notes about these time slots..."
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={2}
              />
            </div>
          </div>

          {/* Summary */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-4 w-4 text-blue-500" />
              <span className="font-medium">Summary</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Total slots to create:</span>
                <span className="ml-2 font-medium">{getTotalSlots()}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Total weekly capacity:</span>
                <span className="ml-2 font-medium">{getTotalCapacity()}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Create {getTotalSlots()} Slots
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
