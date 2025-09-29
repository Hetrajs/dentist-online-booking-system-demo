import { NextRequest, NextResponse } from 'next/server'
import { newsletterService } from '@/lib/supabase'
import { z } from 'zod'

// Validation schema for newsletter subscription
const subscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().optional(),
})

const unsubscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request data
    const validatedData = subscribeSchema.parse(body)
    
    // Subscribe to newsletter
    const subscription = await newsletterService.subscribe(validatedData.email, validatedData.name)
    
    // TODO: Send welcome email
    // TODO: Add to email marketing platform (Mailchimp, ConvertKit, etc.)
    
    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to our newsletter! 🎉',
      subscription: {
        id: subscription.id,
        email: subscription.email,
        subscribed_at: subscription.subscribed_at,
      }
    }, { status: 201 })
    
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Invalid email address provided',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      }, { status: 400 })
    }
    
    if (error instanceof Error && error.message.includes('already subscribed')) {
      return NextResponse.json({
        success: false,
        message: 'This email is already subscribed to our newsletter',
      }, { status: 409 })
    }
    
    return NextResponse.json({
      success: false,
      message: 'Failed to subscribe to newsletter. Please try again.',
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request data
    const validatedData = unsubscribeSchema.parse(body)
    
    // Unsubscribe from newsletter
    await newsletterService.unsubscribe(validatedData.email)
    
    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed from newsletter',
    })
    
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Invalid email address provided',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      }, { status: 400 })
    }
    
    return NextResponse.json({
      success: false,
      message: 'Failed to unsubscribe from newsletter. Please try again.',
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // This endpoint could be used by admin to view subscribers
    const subscribers = await newsletterService.getSubscribers()
    
    return NextResponse.json({
      success: true,
      count: subscribers.length,
      subscribers: subscribers.map(sub => ({
        id: sub.id,
        email: sub.email,
        name: sub.name,
        subscribed_at: sub.subscribed_at,
        source: sub.source,
      }))
    })
    
  } catch (error) {
    console.error('Error fetching newsletter subscribers:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch subscribers',
    }, { status: 500 })
  }
}
