import { NextResponse } from 'next/server'
import { api } from '@/lib/supabase-server'

export async function GET() {
  try {
    // Fetch appointments with 'pending' status
    const appointments = await api.getPendingAppointments()
    return NextResponse.json(appointments)
  } catch (error) {
    console.error('Error fetching pending appointments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pending appointments' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const appointmentId = searchParams.get('id')
    const body = await request.json()
    
    if (!appointmentId) {
      return NextResponse.json(
        { error: 'Appointment ID is required' },
        { status: 400 }
      )
    }

    const updatedAppointment = await api.updateAppointment(appointmentId, body)
    return NextResponse.json(updatedAppointment)
  } catch (error) {
    console.error('Error updating appointment:', error)
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    )
  }
}
