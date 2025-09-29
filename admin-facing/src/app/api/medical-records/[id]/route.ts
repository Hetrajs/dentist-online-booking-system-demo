import { NextResponse } from 'next/server'
import { api } from '@/lib/supabase-server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const record = await api.getMedicalRecord(params.id)
    return NextResponse.json(record)
  } catch (error) {
    console.error('Error fetching medical record:', error)
    return NextResponse.json(
      { error: 'Failed to fetch medical record' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const record = await api.updateMedicalRecord(params.id, body)
    return NextResponse.json(record)
  } catch (error) {
    console.error('Error updating medical record:', error)
    return NextResponse.json(
      { error: 'Failed to update medical record' },
      { status: 500 }
    )
  }
}
