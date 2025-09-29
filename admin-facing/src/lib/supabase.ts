import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          full_name: string | null
          phone: string | null
          date_of_birth: string | null
          address: string | null
          emergency_contact: string | null
          medical_history: string | null
          allergies: string | null
          avatar_url: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          email: string
          full_name?: string | null
          phone?: string | null
          date_of_birth?: string | null
          address?: string | null
          emergency_contact?: string | null
          medical_history?: string | null
          allergies?: string | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          date_of_birth?: string | null
          address?: string | null
          emergency_contact?: string | null
          medical_history?: string | null
          allergies?: string | null
          avatar_url?: string | null
        }
      }
      appointments: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string | null
          name: string
          email: string
          phone: string
          service: string
          preferred_date: string
          preferred_time: string
          appointment_date: string | null
          duration: number | null
          price: number | null
          message: string | null
          status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
          priority: 'low' | 'normal' | 'high' | 'urgent'
          payment_status: 'unpaid' | 'partial' | 'paid' | 'refunded'
          payment_amount: number
          notes: string | null
          reminder_sent: boolean
          confirmed_at: string | null
          completed_at: string | null
          cancelled_at: string | null
          cancellation_reason: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string | null
          name: string
          email: string
          phone: string
          service: string
          preferred_date: string
          preferred_time: string
          appointment_date?: string | null
          duration?: number | null
          price?: number | null
          message?: string | null
          status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
          priority?: 'low' | 'normal' | 'high' | 'urgent'
          payment_status?: 'unpaid' | 'partial' | 'paid' | 'refunded'
          payment_amount?: number
          notes?: string | null
          reminder_sent?: boolean
          confirmed_at?: string | null
          completed_at?: string | null
          cancelled_at?: string | null
          cancellation_reason?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string | null
          name?: string
          email?: string
          phone?: string
          service?: string
          preferred_date?: string
          preferred_time?: string
          appointment_date?: string | null
          duration?: number | null
          price?: number | null
          message?: string | null
          status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
          priority?: 'low' | 'normal' | 'high' | 'urgent'
          payment_status?: 'unpaid' | 'partial' | 'paid' | 'refunded'
          payment_amount?: number
          notes?: string | null
          reminder_sent?: boolean
          confirmed_at?: string | null
          completed_at?: string | null
          cancelled_at?: string | null
          cancellation_reason?: string | null
        }
      }
      services: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string
          price: number
          duration: string
          benefit: string
          image_url: string | null
          is_popular: boolean
          is_active: boolean
          category: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description: string
          price: number
          duration: string
          benefit: string
          image_url?: string | null
          is_popular?: boolean
          is_active?: boolean
          category: string
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string
          price?: number
          duration?: string
          benefit?: string
          image_url?: string | null
          is_popular?: boolean
          is_active?: boolean
          category?: string
        }
      }
      contact_forms: {
        Row: {
          id: string
          created_at: string
          name: string
          email: string
          phone: string | null
          subject: string
          message: string
          status: 'new' | 'replied' | 'resolved'
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          email: string
          phone?: string | null
          subject: string
          message: string
          status?: 'new' | 'replied' | 'resolved'
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          email?: string
          phone?: string | null
          subject?: string
          message?: string
          status?: 'new' | 'replied' | 'resolved'
        }
      }
      testimonials: {
        Row: {
          id: string
          created_at: string
          name: string
          title: string
          quote: string
          rating: number | null
          avatar_url: string | null
          is_featured: boolean
          is_approved: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          title: string
          quote: string
          rating?: number | null
          avatar_url?: string | null
          is_featured?: boolean
          is_approved?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          title?: string
          quote?: string
          rating?: number | null
          avatar_url?: string | null
          is_featured?: boolean
          is_approved?: boolean
        }
      }
      newsletter_subscribers: {
        Row: {
          id: string
          created_at: string
          email: string
          name: string | null
          is_active: boolean
          subscribed_at: string
          unsubscribed_at: string | null
          source: string
        }
        Insert: {
          id?: string
          created_at?: string
          email: string
          name?: string | null
          is_active?: boolean
          subscribed_at?: string
          unsubscribed_at?: string | null
          source?: string
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          name?: string | null
          is_active?: boolean
          subscribed_at?: string
          unsubscribed_at?: string | null
          source?: string
        }
      }
      medical_records: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          patient_id: string
          appointment_id: string | null
          record_type: 'consultation' | 'treatment' | 'prescription' | 'lab_result' | 'x_ray' | 'diagnosis' | 'follow_up'
          title: string
          description: string | null
          diagnosis: string | null
          treatment: string | null
          medications: any | null
          vital_signs: any | null
          notes: string | null
          attachments: any | null
          created_by: string | null
          is_confidential: boolean
          tags: string[] | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          patient_id: string
          appointment_id?: string | null
          record_type: 'consultation' | 'treatment' | 'prescription' | 'lab_result' | 'x_ray' | 'diagnosis' | 'follow_up'
          title: string
          description?: string | null
          diagnosis?: string | null
          treatment?: string | null
          medications?: any | null
          vital_signs?: any | null
          notes?: string | null
          attachments?: any | null
          created_by?: string | null
          is_confidential?: boolean
          tags?: string[] | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          patient_id?: string
          appointment_id?: string | null
          record_type?: 'consultation' | 'treatment' | 'prescription' | 'lab_result' | 'x_ray' | 'diagnosis' | 'follow_up'
          title?: string
          description?: string | null
          diagnosis?: string | null
          treatment?: string | null
          medications?: any | null
          vital_signs?: any | null
          notes?: string | null
          attachments?: any | null
          created_by?: string | null
          is_confidential?: boolean
          tags?: string[] | null
        }
      }
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']

// Type aliases for easier use
export type Patient = Tables<'user_profiles'> & {
  // Medical information from appointments
  medical_history?: string
  allergies?: string
  current_medications?: string
  previous_dental_work?: string
  dental_concerns?: string
  emergency_contact?: string
  emergency_contact_phone?: string
  emergency_contact_relationship?: string
  has_insurance?: string
  insurance_provider?: string
  insurance_policy_number?: string
  last_visit?: string

  // Appointment statistics
  total_appointments?: number
  completed_appointments?: number
  pending_appointments?: number
  confirmed_appointments?: number
  cancelled_appointments?: number
}
export type Appointment = Tables<'appointments'>
export type Service = Tables<'services'>
export type ContactForm = Tables<'contact_forms'>
export type Testimonial = Tables<'testimonials'>
export type MedicalRecord = Tables<'medical_records'>
