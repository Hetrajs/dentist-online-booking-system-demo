import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function GET() {
  try {
    const { data: slots, error } = await supabaseAdmin
      .from('availability_slots')
      .select('*')
      .order('is_recurring', { ascending: false }) // Recurring slots first
      .order('day_of_week', { ascending: true })
      .order('date', { ascending: true })
      .order('start_time', { ascending: true })

    if (error) throw error

    return NextResponse.json(slots)
  } catch (error) {
    console.error('Error fetching availability slots:', error)
    return NextResponse.json(
      { error: 'Failed to fetch availability slots' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Prepare the slot data based on whether it's recurring or specific date
    const slotData: any = {
      start_time: body.start_time,
      end_time: body.end_time,
      is_available: body.is_available ?? true,
      max_appointments: body.max_appointments ?? 1,
      current_appointments: 0,
      notes: body.notes,
      is_recurring: body.is_recurring ?? false
    }

    // For recurring slots, use day_of_week and effective dates
    if (body.is_recurring) {
      slotData.day_of_week = body.day_of_week
      slotData.effective_from = body.effective_from || new Date().toISOString().split('T')[0]
      slotData.effective_until = body.effective_until || null
      // date should be null for recurring slots
      slotData.date = null
    } else {
      // For specific date slots
      slotData.date = body.date
      slotData.day_of_week = null
      slotData.effective_from = null
      slotData.effective_until = null
    }

    const { data: slot, error } = await supabaseAdmin
      .from('availability_slots')
      .insert(slotData)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(slot)
  } catch (error) {
    console.error('Error creating availability slot:', error)
    return NextResponse.json(
      { error: 'Failed to create availability slot' },
      { status: 500 }
    )
  }
}


