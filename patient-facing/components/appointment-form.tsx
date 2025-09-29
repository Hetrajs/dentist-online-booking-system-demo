"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { HydrationSafeInput as Input } from "@/components/ui/hydration-safe-input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Calendar, Clock } from "lucide-react"


interface AppointmentFormProps {
  onSuccess?: () => void
}

export function AppointmentForm({ onSuccess }: AppointmentFormProps) {
  const [formData, setFormData] = useState({
    // Basic Information
    name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    address: "",

    // Appointment Details
    service: "",
    preferred_date: "",
    preferred_time: "",
    message: "",

    // Medical History
    medical_history: "",
    allergies: "",
    current_medications: "",
    previous_dental_work: "",
    dental_concerns: "",

    // Emergency Contact
    emergency_contact_name: "",
    emergency_contact_phone: "",
    emergency_contact_relationship: "",

    // Insurance Information (Optional)
    has_insurance: "",
    insurance_provider: "",
    insurance_policy_number: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4
  const [availableTimeSlots, setAvailableTimeSlots] = useState<Array<{
    time: string
    startTime?: string
    endTime?: string
    maxAppointments: number
    currentAppointments: number
    availableSpots: number
  }>>([])
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{
    time: string
    startTime?: string
    endTime?: string
    maxAppointments: number
    currentAppointments: number
    availableSpots: number
  } | null>(null)
  const [loadingSlots, setLoadingSlots] = useState(false)

  // Helper function to format time range
  const formatTimeRange = (timeSlotId: string) => {
    // timeSlotId is in format "09:00:00-12:00:00"
    const [startTime, endTime] = timeSlotId.split('-')

    const formatSingleTime = (time: string) => {
      const [hours, minutes] = time.split(':')
      const hour = parseInt(hours)
      const ampm = hour >= 12 ? 'PM' : 'AM'
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
      return `${displayHour}:${minutes} ${ampm}`
    }

    return `${formatSingleTime(startTime)} - ${formatSingleTime(endTime)}`
  }

  // Fetch available time slots when date changes
  useEffect(() => {
    if (formData.preferred_date) {
      fetchAvailableSlots(formData.preferred_date)
    } else {
      setAvailableTimeSlots([])
    }
  }, [formData.preferred_date])

  const fetchAvailableSlots = async (date: string) => {
    setLoadingSlots(true)
    try {
      const response = await fetch(`/api/availability?date=${date}`)
      const data = await response.json()

      if (data.available && data.timeSlots) {
        // Each time slot is for one person only and already filtered for availability
        const slots = data.timeSlots.map((slot: any) => ({
          time: slot.time, // This is in format "09:00:00-12:00:00"
          startTime: slot.startTime,
          endTime: slot.endTime,
          maxAppointments: 1,
          currentAppointments: 0,
          availableSpots: 1
        }))

        setAvailableTimeSlots(slots)
      } else {
        setAvailableTimeSlots([])
      }
    } catch (error) {
      console.error('Error fetching available slots:', error)
      setAvailableTimeSlots([])
    } finally {
      setLoadingSlots(false)
    }
  }

  const services = [
    "✨ The Signature Glow",
    "⚡ Express Refresh",
    "💎 Complete Smile Makeover",
    "🦷 Clear Aligners (Premium)",
    "🔧 Root Canal Treatment",
    "👑 Dental Crowns",
    "🧽 Professional Cleaning",
    "🦷 Dental Implants",
    "Other (Please specify in message)"
  ]

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
    "6:00 PM", "7:00 PM", "8:00 PM"
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // If selecting preferred_time, also store the slot details
    if (field === 'preferred_time') {
      const slot = availableTimeSlots.find(s => s.time === value)
      setSelectedTimeSlot(slot || null)
    }
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.name && formData.email && formData.phone && formData.date_of_birth
      case 2:
        return formData.service && formData.preferred_date && formData.preferred_time
      case 3:
        return formData.emergency_contact_name && formData.emergency_contact_phone
      case 4:
        return true // Optional step
      default:
        return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      const result = await response.json()
      
      if (result.success) {
        setSubmitStatus('success')
        setFormData({
          // Basic Information
          name: "",
          email: "",
          phone: "",
          date_of_birth: "",
          address: "",

          // Appointment Details
          service: "",
          preferred_date: "",
          preferred_time: "",
          message: "",

          // Medical History
          medical_history: "",
          allergies: "",
          current_medications: "",
          previous_dental_work: "",
          dental_concerns: "",

          // Emergency Contact
          emergency_contact_name: "",
          emergency_contact_phone: "",
          emergency_contact_relationship: "",

          // Insurance Information (Optional)
          has_insurance: "",
          insurance_provider: "",
          insurance_policy_number: "",
        })
        setCurrentStep(1) // Reset to first step
        onSuccess?.()
      } else {
        setSubmitStatus('error')
        console.error('Appointment booking error:', result.message)
      }
    } catch (error) {
      setSubmitStatus('error')
      console.error('Network error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0]

  const stepTitles = [
    "Personal Information",
    "Appointment Details",
    "Medical History & Emergency Contact",
    "Insurance Information (Optional)"
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Step {currentStep} of {totalSteps}: {stepTitles[currentStep - 1]}
          </h3>
          <span className="text-sm text-muted-foreground">
            {Math.round((currentStep / totalSteps) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-[#6366F1] to-[#F59E0B] h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      {submitStatus === 'success' && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-2xl">
          <p className="text-green-800 font-medium">
            🎉 Appointment booked successfully! We will call you within 2 hours to confirm your appointment.
          </p>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
          <p className="text-red-800 font-medium">
            Sorry, there was an error booking your appointment. Please try again or call us directly at +91-11-41234567.
          </p>
        </div>
      )}

      {/* Step 1: Personal Information */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-foreground">
                Full Name *
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Your Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-foreground">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone" className="text-foreground">
                Phone Number *
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91-XXXXXXXXXX"
                value={formData.phone}
                onChange={handleChange}
                required
                className="mt-1"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="date_of_birth" className="text-foreground">
                Date of Birth *
              </Label>
              <Input
                id="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={handleChange}
                required
                className="mt-1"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address" className="text-foreground">
              Address
            </Label>
            <Textarea
              id="address"
              placeholder="Your complete address"
              value={formData.address}
              onChange={handleChange}
              className="mt-1"
              disabled={isSubmitting}
            />
          </div>
        </div>
      )}

      {/* Step 2: Appointment Details */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div>
            <Label htmlFor="service" className="text-foreground">
              Service Required *
            </Label>
            <Select onValueChange={(value) => handleSelectChange('service', value)} disabled={isSubmitting}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service, index) => (
                  <SelectItem key={index} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="preferred_date" className="text-foreground">
                <Calendar className="h-4 w-4 inline mr-1" />
                Preferred Date *
              </Label>
              <Input
                id="preferred_date"
                type="date"
                min={today}
                value={formData.preferred_date}
                onChange={handleChange}
                required
                className="mt-1"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="preferred_time" className="text-foreground">
                <Clock className="h-4 w-4 inline mr-1" />
                Preferred Time *
              </Label>
              <Select
                onValueChange={(value) => handleSelectChange('preferred_time', value)}
                disabled={isSubmitting || loadingSlots || !formData.preferred_date}
                value={formData.preferred_time}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder={
                    !formData.preferred_date
                      ? "Please select a date first"
                      : loadingSlots
                        ? "Loading available times..."
                        : availableTimeSlots.length === 0
                          ? "No availability for this date"
                          : "Select time"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {availableTimeSlots.map((slot) => (
                    <SelectItem key={slot.time} value={slot.time}>
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium">
                          {formatTimeRange(slot.time)}
                        </span>
                        <span className="text-sm text-muted-foreground ml-2">
                          Available
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formData.preferred_date && !loadingSlots && availableTimeSlots.length === 0 && (
                <p className="text-sm text-red-600 mt-1">
                  No availability for this date. Please select a different date.
                </p>
              )}

              {/* Selected Time Slot Details */}
              {selectedTimeSlot && (
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800">
                      Selected: {formatTimeRange(selectedTimeSlot.time)}
                    </span>
                    <span className="text-green-600">
                      • Available
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="message" className="text-foreground">
              Additional Message
            </Label>
            <Textarea
              id="message"
              placeholder="Any specific concerns or requirements? (Optional)"
              value={formData.message}
              onChange={handleChange}
              className="mt-1 min-h-[100px]"
              disabled={isSubmitting}
            />
          </div>
        </div>
      )}

      {/* Step 3: Medical History & Emergency Contact */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Medical History</h4>

            <div>
              <Label htmlFor="medical_history" className="text-foreground">
                Previous Medical Conditions
              </Label>
              <Textarea
                id="medical_history"
                placeholder="Please list any medical conditions, surgeries, or ongoing treatments"
                value={formData.medical_history}
                onChange={handleChange}
                className="mt-1"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="allergies" className="text-foreground">
                Allergies
              </Label>
              <Textarea
                id="allergies"
                placeholder="Please list any allergies (medications, foods, materials, etc.)"
                value={formData.allergies}
                onChange={handleChange}
                className="mt-1"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="current_medications" className="text-foreground">
                Current Medications
              </Label>
              <Textarea
                id="current_medications"
                placeholder="Please list all medications you are currently taking"
                value={formData.current_medications}
                onChange={handleChange}
                className="mt-1"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="previous_dental_work" className="text-foreground">
                Previous Dental Work
              </Label>
              <Textarea
                id="previous_dental_work"
                placeholder="Please describe any previous dental treatments or procedures"
                value={formData.previous_dental_work}
                onChange={handleChange}
                className="mt-1"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="dental_concerns" className="text-foreground">
                Current Dental Concerns
              </Label>
              <Textarea
                id="dental_concerns"
                placeholder="Please describe any current dental pain, concerns, or symptoms"
                value={formData.dental_concerns}
                onChange={handleChange}
                className="mt-1"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-4 border-t pt-6">
            <h4 className="font-semibold text-foreground">Emergency Contact *</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emergency_contact_name" className="text-foreground">
                  Contact Name *
                </Label>
                <Input
                  id="emergency_contact_name"
                  type="text"
                  placeholder="Emergency contact full name"
                  value={formData.emergency_contact_name}
                  onChange={handleChange}
                  required
                  className="mt-1"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor="emergency_contact_phone" className="text-foreground">
                  Contact Phone *
                </Label>
                <Input
                  id="emergency_contact_phone"
                  type="tel"
                  placeholder="+91-XXXXXXXXXX"
                  value={formData.emergency_contact_phone}
                  onChange={handleChange}
                  required
                  className="mt-1"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="emergency_contact_relationship" className="text-foreground">
                Relationship
              </Label>
              <Input
                id="emergency_contact_relationship"
                type="text"
                placeholder="e.g., Spouse, Parent, Sibling, Friend"
                value={formData.emergency_contact_relationship}
                onChange={handleChange}
                className="mt-1"
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Insurance Information (Optional) */}
      {currentStep === 4 && (
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Insurance Information (Optional)</h4>
            <p className="text-sm text-muted-foreground">
              This information helps us process your treatment more efficiently, but it's completely optional.
            </p>

            <div>
              <Label htmlFor="has_insurance" className="text-foreground">
                Do you have dental insurance?
              </Label>
              <Select onValueChange={(value) => handleSelectChange('has_insurance', value)} disabled={isSubmitting}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes, I have dental insurance</SelectItem>
                  <SelectItem value="no">No, I don't have insurance</SelectItem>
                  <SelectItem value="unsure">I'm not sure</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.has_insurance === 'yes' && (
              <>
                <div>
                  <Label htmlFor="insurance_provider" className="text-foreground">
                    Insurance Provider
                  </Label>
                  <Input
                    id="insurance_provider"
                    type="text"
                    placeholder="e.g., Star Health, HDFC ERGO, etc."
                    value={formData.insurance_provider}
                    onChange={handleChange}
                    className="mt-1"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label htmlFor="insurance_policy_number" className="text-foreground">
                    Policy Number
                  </Label>
                  <Input
                    id="insurance_policy_number"
                    type="text"
                    placeholder="Your insurance policy number"
                    value={formData.insurance_policy_number}
                    onChange={handleChange}
                    className="mt-1"
                    disabled={isSubmitting}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        {currentStep > 1 && (
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={isSubmitting}
            className="px-6"
          >
            Previous
          </Button>
        )}

        <div className="ml-auto">
          {currentStep < totalSteps ? (
            <Button
              type="button"
              onClick={nextStep}
              disabled={!isStepValid(currentStep) || isSubmitting}
              className="px-6 bg-gradient-to-r from-[#6366F1] to-[#F59E0B] text-white"
            >
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting || !isStepValid(currentStep)}
              className="px-8 rounded-2xl bg-gradient-to-r from-[#6366F1] to-[#F59E0B] text-white font-semibold py-3 text-lg shadow-lg hover:from-[#5a5ee0] hover:to-[#e08d0a] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Booking Appointment...
                </>
              ) : (
                'Book Appointment'
              )}
            </Button>
          )}
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground text-center">
        * We will call you within 2 hours to confirm your appointment. For urgent needs, call us directly at{' '}
        <a href="tel:+911141234567" className="text-primary hover:underline">
          +91-11-41234567
        </a>
      </p>
    </form>
  )
}
