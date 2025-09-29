'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
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
import { Clock, Calendar, Users, Save, X } from 'lucide-react'

interface SlotData {
  id?: string
  dayOfWeek: number // 0=Sunday, 1=Monday, ..., 6=Saturday
  startTime: string
  endTime: string
  maxAppointments: number
  isActive: boolean
  notes?: string
}

interface SlotManagementModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (slotData: SlotData) => Promise<void>
  editingSlot?: SlotData | null
  mode: 'create' | 'edit'
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
]

export function SlotManagementModal({
  isOpen,
  onClose,
  onSave,
  editingSlot,
  mode
}: SlotManagementModalProps) {
  const [formData, setFormData] = useState<SlotData>({
    dayOfWeek: 1, // Default to Monday
    startTime: '09:00',
    endTime: '10:00',
    maxAppointments: 2,
    isActive: true,
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (editingSlot && mode === 'edit') {
      setFormData({
        id: editingSlot.id,
        dayOfWeek: editingSlot.dayOfWeek,
        startTime: editingSlot.startTime,
        endTime: editingSlot.endTime,
        maxAppointments: editingSlot.maxAppointments,
        isActive: editingSlot.isActive,
        notes: editingSlot.notes || ''
      })
    } else {
      // Reset form for create mode
      setFormData({
        dayOfWeek: 1,
        startTime: '09:00',
        endTime: '10:00',
        maxAppointments: 2,
        isActive: true,
        notes: ''
      })
    }
    setErrors({})
  }, [editingSlot, mode, isOpen])

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
    if (formData.maxAppointments > 20) {
      newErrors.maxAppointments = 'Maximum 20 appointments per slot'
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
    } catch (error) {
      console.error('Error saving slot:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof SlotData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-8 bg-[#171717] border border-[#404040] rounded-xl shadow-2xl">
        <DialogHeader className="text-center space-y-4 pb-6">
          <DialogTitle className="text-3xl font-bold text-white flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            {mode === 'create' ? 'Add New Time Slot' : 'Edit Time Slot'}
          </DialogTitle>
          <DialogDescription className="text-lg text-gray-300">
            Configure availability slot settings for appointment booking with professional precision.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Day of Week */}
          <div className="space-y-3">
            <Label htmlFor="dayOfWeek" className="text-base font-semibold text-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Day of Week
            </Label>
            <Select
              value={formData.dayOfWeek.toString()}
              onValueChange={(value) => handleInputChange('dayOfWeek', parseInt(value))}
            >
              <SelectTrigger className="h-12 rounded-xl border-2 border-border hover:border-primary/50 transition-all duration-300 bg-background/50">
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-2 shadow-xl">
                {DAYS_OF_WEEK.map((day) => (
                  <SelectItem key={day.value} value={day.value.toString()} className="rounded-lg">
                    {day.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.dayOfWeek && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <span className="w-1 h-1 bg-destructive rounded-full"></span>
                {errors.dayOfWeek}
              </p>
            )}
          </div>

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
            <p className="text-sm text-muted-foreground">
              Number of appointments that can be booked in this time slot
            </p>
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="isActive">Active Status</Label>
              <p className="text-sm text-muted-foreground">
                Enable this slot for patient booking
              </p>
            </div>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => handleInputChange('isActive', checked)}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any special notes for this time slot..."
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
            />
          </div>

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
              disabled={loading}
              className="h-12 px-8 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Saving...' : mode === 'create' ? 'Create Slot' : 'Update Slot'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
