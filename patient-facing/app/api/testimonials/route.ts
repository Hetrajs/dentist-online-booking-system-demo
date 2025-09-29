import { NextRequest, NextResponse } from 'next/server'
import { testimonialService } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_supabase_project_url') {
      return NextResponse.json({
        success: true,
        testimonials: []
      })
    }

    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')

    let testimonials
    if (featured === 'true') {
      testimonials = await testimonialService.getFeatured()
    } else {
      testimonials = await testimonialService.getAll()
    }
    
    return NextResponse.json({
      success: true,
      testimonials: testimonials.map(testimonial => ({
        id: testimonial.id,
        name: testimonial.name,
        title: testimonial.title,
        quote: testimonial.quote,
        rating: testimonial.rating,
        avatar_url: testimonial.avatar_url,
        is_featured: testimonial.is_featured,
      }))
    })
    
  } catch (error) {
    console.error('Error fetching testimonials:', error)

    return NextResponse.json({
      success: false,
      message: 'Failed to fetch testimonials',
      testimonials: []
    }, { status: 500 })
  }
}
