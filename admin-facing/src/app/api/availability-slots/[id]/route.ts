import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { data: slot, error } = await supabaseAdmin
      .from('availability_slots')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    return NextResponse.json(slot)
  } catch (error) {
    console.error('Error fetching availability slot:', error)
    return NextResponse.json(
      { error: 'Failed to fetch availability slot' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    // Build update object with only provided fields
    const updateData: any = {}

    // Handle the constraint: either date OR (day_of_week + is_recurring), not both
    if (body.is_recurring !== undefined) {
      updateData.is_recurring = body.is_recurring

      if (body.is_recurring) {
        // For recurring slots, clear date and set day_of_week
        updateData.date = null
        if (body.day_of_week !== undefined) updateData.day_of_week = body.day_of_week
      } else {
        // For specific date slots, clear day_of_week and set date
        updateData.day_of_week = null
        if (body.date !== undefined) updateData.date = body.date
      }
    } else {
      // If is_recurring is not being changed, handle date/day_of_week updates carefully
      if (body.date !== undefined) {
        updateData.date = body.date
        // If setting a specific date, ensure it's not recurring
        if (body.date) {
          updateData.is_recurring = false
          updateData.day_of_week = null
        }
      }
      if (body.day_of_week !== undefined) {
        updateData.day_of_week = body.day_of_week
        // If setting day_of_week, ensure it's recurring
        if (body.day_of_week !== null) {
          updateData.is_recurring = true
          updateData.date = null
        }
      }
    }

    // Handle other fields
    if (body.start_time !== undefined) updateData.start_time = body.start_time
    if (body.end_time !== undefined) updateData.end_time = body.end_time
    if (body.is_available !== undefined) updateData.is_available = body.is_available
    if (body.max_appointments !== undefined) updateData.max_appointments = body.max_appointments
    if (body.effective_from !== undefined) updateData.effective_from = body.effective_from
    if (body.effective_until !== undefined) updateData.effective_until = body.effective_until
    if (body.notes !== undefined) updateData.notes = body.notes

    const { data: slot, error } = await supabaseAdmin
      .from('availability_slots')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(slot)
  } catch (error) {
    console.error('Error updating availability slot:', error)
    return NextResponse.json(
      { error: 'Failed to update availability slot' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { error } = await supabaseAdmin
      .from('availability_slots')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting availability slot:', error)
    return NextResponse.json(
      { error: 'Failed to delete availability slot' },
      { status: 500 }
    )
  }
}
