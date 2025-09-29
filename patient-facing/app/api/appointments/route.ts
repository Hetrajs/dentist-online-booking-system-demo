import { NextRequest, NextResponse } from 'next/server'
import { appointmentService } from '@/lib/supabase'
import { z } from 'zod'

// Validation schema for appointment data
const appointmentSchema = z.object({
  // Basic Information
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  address: z.string().optional(),

  // Appointment Details
  service: z.string().min(1, 'Please select a service'),
  preferred_date: z.string().min(1, 'Please select a date'),
  preferred_time: z.string().min(1, 'Please select a time'),
  message: z.string().optional(),

  // Medical History
  medical_history: z.string().optional(),
  allergies: z.string().optional(),
  current_medications: z.string().optional(),
  previous_dental_work: z.string().optional(),
  dental_concerns: z.string().optional(),

  // Emergency Contact
  emergency_contact_name: z.string().min(2, 'Emergency contact name is required'),
  emergency_contact_phone: z.string().min(10, 'Emergency contact phone is required'),
  emergency_contact_relationship: z.string().optional(),

  // Insurance Information (Optional)
  has_insurance: z.enum(['yes', 'no', 'unsure']).optional(),
  insurance_provider: z.string().optional(),
  insurance_policy_number: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate the request data
    const validatedData = appointmentSchema.parse(body)

    // Check slot availability before creating appointment
    const availabilityResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3003'}/api/availability?date=${validatedData.preferred_date}&time=${validatedData.preferred_time}`,
      { method: 'GET' }
    )

    if (availabilityResponse.ok) {
      const availabilityData = await availabilityResponse.json()
      if (!availabilityData.available) {
        return NextResponse.json({
          success: false,
          message: availabilityData.reason || 'Selected time slot is not available. Please choose a different time.',
        }, { status: 409 }) // Conflict status
      }
    }

    // Create appointment in Supabase
    const appointment = await appointmentService.create(validatedData)

    // TODO: Send confirmation email to patient
    // TODO: Send notification to clinic staff
    // TODO: Add to calendar system

    return NextResponse.json({
      success: true,
      message: 'Appointment booked successfully!',
      appointment: {
        id: appointment.id,
        name: appointment.name,
        service: appointment.service,
        preferred_date: appointment.preferred_date,
        preferred_time: appointment.preferred_time,
        status: appointment.status,
      }
    }, { status: 201 })
    
  } catch (error) {
    console.error('Appointment booking error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Invalid data provided',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      }, { status: 400 })
    }
    
    return NextResponse.json({
      success: false,
      message: 'Failed to book appointment. Please try again or call us directly.',
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // This endpoint could be used by admin to view appointments
    // For now, we'll return a simple response
    const appointments = await appointmentService.getAll()
    
    return NextResponse.json({
      success: true,
      appointments: appointments.map(apt => ({
        id: apt.id,
        name: apt.name,
        service: apt.service,
        preferred_date: apt.preferred_date,
        preferred_time: apt.preferred_time,
        status: apt.status,
        created_at: apt.created_at,
      }))
    })
    
  } catch (error) {
    console.error('Error fetching appointments:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch appointments',
    }, { status: 500 })
  }
}
