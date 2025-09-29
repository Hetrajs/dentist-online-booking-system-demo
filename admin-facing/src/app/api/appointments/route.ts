import { NextResponse } from 'next/server'
import { api } from '@/lib/supabase-server'

export async function GET() {
  try {
    const appointments = await api.getAppointments()
    return NextResponse.json(appointments)
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const appointment = await api.createAppointment(body)
    return NextResponse.json(appointment)
  } catch (error) {
    console.error('Error creating appointment:', error)
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    )
  }
}
