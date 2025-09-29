import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const date = searchParams.get('date')
    const time = searchParams.get('time')

    if (!date) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      )
    }

    // Get availability slots for the date
    const { data: slots, error: slotsError } = await supabaseAdmin
      .from('availability_slots')
      .select('*')
      .eq('date', date)
      .eq('is_available', true)

    if (slotsError) throw slotsError

    // Get existing appointments for the date
    const { data: appointments, error: appointmentsError } = await supabaseAdmin
      .from('appointments')
      .select('preferred_time, status')
      .eq('preferred_date', date)
      .in('status', ['pending', 'confirmed', 'in_progress'])

    if (appointmentsError) throw appointmentsError

    // If specific time is requested, check availability for that time
    if (time) {
      const timeSlot = slots.find(slot => {
        const slotStart = slot.start_time
        const slotEnd = slot.end_time
        return time >= slotStart && time <= slotEnd
      })

      if (!timeSlot) {
        return NextResponse.json({
          available: false,
          reason: 'No availability slot configured for this time'
        })
      }

      const appointmentsAtTime = appointments.filter(apt => apt.preferred_time === time).length
      const available = appointmentsAtTime < timeSlot.max_appointments

      return NextResponse.json({
        available,
        reason: available ? null : 'Time slot is fully booked',
        maxAppointments: timeSlot.max_appointments,
        currentAppointments: appointmentsAtTime
      })
    }

    // Return all available time slots for the date
    const availableSlots = slots.map(slot => {
      const appointmentsInSlot = appointments.filter(apt => {
        const aptTime = apt.preferred_time
        return aptTime >= slot.start_time && aptTime <= slot.end_time
      }).length

      return {
        ...slot,
        current_appointments: appointmentsInSlot,
        available: appointmentsInSlot < slot.max_appointments
      }
    })

    return NextResponse.json({
      date,
      slots: availableSlots
    })

  } catch (error) {
    console.error('Error checking availability:', error)
    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    )
  }
}
