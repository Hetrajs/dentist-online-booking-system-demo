'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
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
  AlertCircle
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

interface BulkSlotModalProps {
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
    days: [1, 2, 3, 4, 5],
    slots: [
      { startTime: '09:00', endTime: '12:00', maxAppointments: 6 },
      { startTime: '14:00', endTime: '18:00', maxAppointments: 8 }
    ]
  },
  {
    name: 'Half Day Saturday',
    days: [6],
    slots: [
      { startTime: '09:00', endTime: '13:00', maxAppointments: 8 }
    ]
  },
  {
    name: 'Extended Hours',
    days: [1, 2, 3, 4, 5],
    slots: [
      { startTime: '08:00', endTime: '12:00', maxAppointments: 8 },
      { startTime: '13:00', endTime: '17:00', maxAppointments: 8 },
      { startTime: '18:00', endTime: '20:00', maxAppointments: 4 }
    ]
  }
]

export function BulkSlotModal({ isOpen, onClose, onSave }: BulkSlotModalProps) {
  const [formData, setFormData] = useState<BulkSlotData>({
    timeSlots: [{ startTime: '09:00', endTime: '12:00', maxAppointments: 6 }],
    selectedDays: [1, 2, 3, 4, 5], // Default to weekdays
    notes: '',
    replaceExisting: false
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required'
    }
    if (!formData.endTime) {
      newErrors.endTime = 'End time is required'
    }
    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      newErrors.endTime = 'End time must be after start time'
    }
    if (formData.maxAppointments < 1) {
      newErrors.maxAppointments = 'Must allow at least 1 appointment'
    }
    if (formData.selectedDays.length === 0) {
      newErrors.selectedDays = 'Please select at least one day'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      await onSave(formData)
      onClose()
      // Reset form
      setFormData({
        startTime: '09:00',
        endTime: '10:00',
        maxAppointments: 2,
        selectedDays: [1, 2, 3, 4, 5],
        notes: ''
      })
    } catch (error) {
      console.error('Error saving bulk slots:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof BulkSlotData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleDayToggle = (dayValue: number, checked: boolean) => {
    const newSelectedDays = checked
      ? [...formData.selectedDays, dayValue]
      : formData.selectedDays.filter(day => day !== dayValue)
    
    handleInputChange('selectedDays', newSelectedDays)
  }

  const selectWeekdays = () => {
    handleInputChange('selectedDays', [1, 2, 3, 4, 5])
  }

  const selectWeekend = () => {
    handleInputChange('selectedDays', [0, 6])
  }

  const selectAllDays = () => {
    handleInputChange('selectedDays', [0, 1, 2, 3, 4, 5, 6])
  }

  const clearAllDays = () => {
    handleInputChange('selectedDays', [])
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-8 bg-[#171717] border border-[#404040] rounded-xl shadow-2xl">
        <DialogHeader className="text-center space-y-4 pb-6">
          <DialogTitle className="text-3xl font-bold text-white flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
              <Copy className="h-6 w-6 text-white" />
            </div>
            Bulk Create Time Slots
          </DialogTitle>
          <DialogDescription className="text-lg text-gray-300">
            Create the same time slot for multiple days at once with professional efficiency.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Time Range */}
          <div className="space-y-4">
            <Label className="text-base font-semibold text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-400" />
              Time Range
            </Label>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="startTime" className="text-sm font-medium text-gray-300">Start Time</Label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                    className="h-12 pl-12 rounded-xl border-2 border-[#404040] hover:border-orange-500/50 focus:border-orange-500 transition-all duration-300 bg-[#2a2a2a] text-white"
                  />
                </div>
                {errors.startTime && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <span className="w-1 h-1 bg-destructive rounded-full"></span>
                    {errors.startTime}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="endTime" className="text-sm font-medium text-muted-foreground">End Time</Label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => handleInputChange('endTime', e.target.value)}
                    className="h-12 pl-12 rounded-xl border-2 border-border hover:border-primary/50 focus:border-primary transition-all duration-300 bg-background/50"
                  />
                </div>
                {errors.endTime && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <span className="w-1 h-1 bg-destructive rounded-full"></span>
                    {errors.endTime}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Max Appointments */}
          <div className="space-y-2">
            <Label htmlFor="maxAppointments">Maximum Appointments</Label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="maxAppointments"
                type="number"
                min="1"
                max="20"
                value={formData.maxAppointments}
                onChange={(e) => handleInputChange('maxAppointments', parseInt(e.target.value) || 1)}
                className="pl-10"
              />
            </div>
            {errors.maxAppointments && (
              <p className="text-sm text-red-600">{errors.maxAppointments}</p>
            )}
          </div>

          {/* Day Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Select Days</Label>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={selectWeekdays}>
                  Weekdays
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={selectWeekend}>
                  Weekend
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={selectAllDays}>
                  All
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={clearAllDays}>
                  Clear
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {DAYS_OF_WEEK.map((day) => (
                <div key={day.value} className="flex flex-col items-center space-y-2">
                  <Label htmlFor={`day-${day.value}`} className="text-sm font-medium">
                    {day.short}
                  </Label>
                  <Checkbox
                    id={`day-${day.value}`}
                    checked={formData.selectedDays.includes(day.value)}
                    onCheckedChange={(checked) => handleDayToggle(day.value, checked as boolean)}
                  />
                </div>
              ))}
            </div>
            {errors.selectedDays && (
              <p className="text-sm text-red-600">{errors.selectedDays}</p>
            )}
          </div>

          {/* Selected Days Preview */}
          {formData.selectedDays.length > 0 && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium mb-2">Creating slots for:</p>
              <div className="flex flex-wrap gap-2">
                {formData.selectedDays
                  .sort((a, b) => a - b)
                  .map(dayValue => {
                    const day = DAYS_OF_WEEK.find(d => d.value === dayValue)
                    return (
                      <span key={dayValue} className="px-2 py-1 bg-primary/10 text-primary rounded text-sm">
                        {day?.label}
                      </span>
                    )
                  })}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Time: {formData.startTime} - {formData.endTime} | 
                Capacity: {formData.maxAppointments} appointments each
              </p>
            </div>
          )}

          <DialogFooter className="pt-8 gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-12 px-8 rounded-xl border-2 border-[#404040] text-gray-300 hover:bg-[#2a2a2a] hover:text-white hover:border-gray-300 transition-all duration-300"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || formData.selectedDays.length === 0}
              className="h-12 px-8 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Creating...' : `Create ${formData.selectedDays.length} Slots`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
