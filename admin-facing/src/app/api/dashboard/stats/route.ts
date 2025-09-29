import { NextResponse } from 'next/server'
import { api } from '@/lib/supabase-server'

export async function GET() {
  try {
    const stats = await api.getDashboardStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}
