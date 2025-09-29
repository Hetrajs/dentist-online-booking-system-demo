import { NextResponse } from 'next/server'
import { api } from '@/lib/supabase-server'

export async function GET() {
  try {
    const patients = await api.getPatients()
    return NextResponse.json(patients)
  } catch (error) {
    console.error('Error fetching patients:', error)
    return NextResponse.json(
      { error: 'Failed to fetch patients' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const patient = await api.createPatient(body)
    return NextResponse.json(patient)
  } catch (error) {
    console.error('Error creating patient:', error)
    return NextResponse.json(
      { error: 'Failed to create patient' },
      { status: 500 }
    )
  }
}
