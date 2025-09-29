import { NextRequest, NextResponse } from 'next/server'
import { contactService } from '@/lib/supabase'
import { z } from 'zod'

// Validation schema for contact form data
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request data
    const validatedData = contactSchema.parse(body)
    
    // Create contact form entry in Supabase
    const contact = await contactService.create(validatedData)
    
    // TODO: Send confirmation email to user
    // TODO: Send notification to clinic staff
    // TODO: Integrate with CRM system
    
    return NextResponse.json({
      success: true,
      message: 'Thank you for your message! We will get back to you within 24 hours.',
      contact: {
        id: contact.id,
        name: contact.name,
        subject: contact.subject,
        status: contact.status,
      }
    }, { status: 201 })
    
  } catch (error) {
    console.error('Contact form submission error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Invalid data provided',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      }, { status: 400 })
    }
    
    return NextResponse.json({
      success: false,
      message: 'Failed to send message. Please try again or call us directly.',
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // This endpoint could be used by admin to view contact forms
    const contacts = await contactService.getAll()
    
    return NextResponse.json({
      success: true,
      contacts: contacts.map(contact => ({
        id: contact.id,
        name: contact.name,
        email: contact.email,
        subject: contact.subject,
        status: contact.status,
        created_at: contact.created_at,
      }))
    })
    
  } catch (error) {
    console.error('Error fetching contacts:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch contacts',
    }, { status: 500 })
  }
}
