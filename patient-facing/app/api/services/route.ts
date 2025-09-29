import { NextRequest, NextResponse } from 'next/server'
import { serviceService } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_supabase_project_url') {
      return NextResponse.json({
        success: true,
        services: []
      })
    }

    const { searchParams } = new URL(request.url)
    const popular = searchParams.get('popular')

    let services
    if (popular === 'true') {
      services = await serviceService.getPopular()
    } else {
      services = await serviceService.getActive()
    }
    
    return NextResponse.json({
      success: true,
      services: services.map(service => ({
        id: service.id,
        title: service.title,
        description: service.description,
        price: service.price,
        duration: service.duration,
        benefit: service.benefit,
        image_url: service.image_url,
        is_popular: service.is_popular,
        category: service.category,
      }))
    })
    
  } catch (error) {
    console.error('Error fetching services:', error)

    return NextResponse.json({
      success: false,
      message: 'Failed to fetch services',
      services: []
    }, { status: 500 })
  }
}
