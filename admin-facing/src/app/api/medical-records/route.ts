import { NextResponse } from 'next/server'
import { api } from '@/lib/supabase-server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get('patientId')
    
    const records = await api.getMedicalRecords(patientId || undefined)
    return NextResponse.json(records)
  } catch (error) {
    console.error('Error fetching medical records:', error)
    return NextResponse.json(
      { error: 'Failed to fetch medical records' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const record = await api.createMedicalRecord(body)
    return NextResponse.json(record)
  } catch (error) {
    console.error('Error creating medical record:', error)
    return NextResponse.json(
      { error: 'Failed to create medical record' },
      { status: 500 }
    )
  }
}
