import { NextResponse } from 'next/server'
import { api } from '@/lib/supabase-server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const appointments = await api.getPatientAppointments(params.id)
    return NextResponse.json(appointments)
  } catch (error) {
    console.error('Error fetching patient appointments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch patient appointments' },
      { status: 500 }
    )
  }
}
