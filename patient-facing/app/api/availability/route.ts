import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

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

    // Get availability slots for the date using the RPC function with fallback
    let slots, slotsError

    try {
      // Try to use the RPC function first
      const rpcResult = await supabase
        .rpc('get_available_slots_for_date', { target_date: date })

      slots = rpcResult.data
      slotsError = rpcResult.error
    } catch (rpcError) {
      console.log('RPC function not available, using fallback query')

      // Fallback to direct table query if RPC function is not available
      // First try with new columns, then fall back to basic query
      try {
        const dayOfWeek = new Date(date).getDay()
        const fallbackResult = await supabase
          .from('availability_slots')
          .select('*')
          .or(`and(date.eq.${date},is_recurring.eq.false),and(day_of_week.eq.${dayOfWeek},is_recurring.eq.true)`)
          .eq('is_available', true)
          .order('start_time')

        slots = fallbackResult.data
        slotsError = fallbackResult.error
      } catch (fallbackError) {
        console.log('Enhanced fallback failed, using basic query')

        // Basic fallback for tables without new columns
        const basicResult = await supabase
          .from('availability_slots')
          .select('*')
          .eq('date', date)
          .eq('is_available', true)
          .order('start_time')

        slots = basicResult.data
        slotsError = basicResult.error
      }
    }

    if (slotsError) throw slotsError

    if (!slots || slots.length === 0) {
      return NextResponse.json({
        available: false,
        message: 'No availability slots configured for this date',
        timeSlots: []
      })
    }

    // Get existing appointments for the date
    const { data: appointments, error: appointmentsError } = await supabase
      .from('appointments')
      .select('preferred_time, status')
      .eq('preferred_date', date)
      .in('status', ['pending', 'confirmed', 'in_progress'])

    if (appointmentsError) throw appointmentsError

    // If specific time is requested, check availability for that time
    if (time) {
      // Time should be in format "start_time-end_time" (e.g., "09:00:00-12:00:00")
      const timeSlot = slots.find(slot => {
        const timeSlotId = `${slot.start_time}-${slot.end_time}`
        return time === timeSlotId
      })

      if (!timeSlot) {
        return NextResponse.json({
          available: false,
          reason: 'No availability slot configured for this time'
        })
      }

      // Check if this exact time slot is already booked (each slot is for one person only)
      const appointmentsAtTime = appointments.filter(apt => apt.preferred_time === time).length
      const available = appointmentsAtTime === 0

      return NextResponse.json({
        available,
        reason: available ? null : 'Time slot is already booked',
        maxAppointments: 1,
        currentAppointments: appointmentsAtTime
      })
    }

    // Return actual time slots from database (each slot is for one person only)
    const availableTimeSlots = []

    for (const slot of slots) {
      // Create a unique identifier for this time slot using start and end time
      const timeSlotId = `${slot.start_time}-${slot.end_time}`

      // Check if this exact time slot is already booked
      const appointmentsForSlot = appointments.filter(apt =>
        apt.preferred_time === timeSlotId
      ).length

      // Each time slot is for one person only
      const isAvailable = appointmentsForSlot === 0

      if (isAvailable) {
        availableTimeSlots.push({
          time: timeSlotId,
          startTime: slot.start_time,
          endTime: slot.end_time,
          available: true,
          maxAppointments: 1,
          currentAppointments: appointmentsForSlot
        })
      }
    }

    return NextResponse.json({
      available: availableTimeSlots.length > 0,
      date,
      timeSlots: availableTimeSlots,
      message: availableTimeSlots.length === 0 ? 'No available time slots for this date' : undefined
    })

  } catch (error) {
    console.error('Error checking availability:', error)
    return NextResponse.json({
      available: false,
      message: 'Failed to check availability'
    }, { status: 500 })
  }
}
