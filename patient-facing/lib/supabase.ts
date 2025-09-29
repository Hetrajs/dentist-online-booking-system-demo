import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Function to get Supabase client
export const getSupabaseClient = () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_supabase_project_url') {
    throw new Error('Supabase not configured')
  }
  return createClient(supabaseUrl, supabaseAnonKey)
}

// Client for server-side operations (with fallback)
export const supabase = (() => {
  try {
    return getSupabaseClient()
  } catch {
    return createClient('https://placeholder.supabase.co', 'placeholder-key')
  }
})()

// Client for browser-side operations with auth
export const createSupabaseClient = () => {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// Types for our database tables
export interface Appointment {
  id: string
  created_at: string
  user_id?: string

  // Basic Information
  name: string
  email: string
  phone: string
  date_of_birth?: string
  address?: string

  // Appointment Details
  service: string
  preferred_date: string
  preferred_time: string
  appointment_date?: string
  message?: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'

  // Medical History
  medical_history?: string
  allergies?: string
  current_medications?: string
  previous_dental_work?: string
  dental_concerns?: string

  // Emergency Contact
  emergency_contact_name?: string
  emergency_contact_phone?: string
  emergency_contact_relationship?: string

  // Insurance Information
  has_insurance?: string
  insurance_provider?: string
  insurance_policy_number?: string
}

export interface ContactForm {
  id: string
  created_at: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  status: 'new' | 'replied' | 'resolved'
}

export interface Testimonial {
  id: string
  created_at: string
  name: string
  title: string
  quote: string
  rating: number
  avatar_url?: string
  is_featured: boolean
  is_approved: boolean
}

export interface Service {
  id: string
  created_at: string
  title: string
  description: string
  price: number
  duration: string
  benefit: string
  image_url?: string
  is_popular: boolean
  is_active: boolean
  category: string
}

export interface NewsletterSubscriber {
  id: string
  created_at: string
  email: string
  name?: string
  is_active: boolean
  subscribed_at: string
  unsubscribed_at?: string
  source: string
}

export interface UserProfile {
  id: string
  created_at: string
  email: string
  full_name?: string
  phone?: string
  date_of_birth?: string
  address?: string
  emergency_contact?: string
  medical_history?: string
  allergies?: string
  avatar_url?: string
  updated_at: string
}

// Database functions
export const appointmentService = {
  async create(appointmentData: Omit<Appointment, 'id' | 'created_at' | 'status'>) {
    // Get current user if authenticated
    const { data: { user } } = await supabase.auth.getUser()

    try {
      // First, create or update user profile with personal information
      if (appointmentData.email) {
        const profileData = {
          email: appointmentData.email,
          full_name: appointmentData.name,
          phone: appointmentData.phone,
          date_of_birth: appointmentData.date_of_birth,
          address: appointmentData.address,
          updated_at: new Date().toISOString()
        }

        // Try to find existing profile by email
        const { data: existingProfile } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('email', appointmentData.email)
          .single()

        if (existingProfile) {
          // Update existing profile
          await supabase
            .from('user_profiles')
            .update(profileData)
            .eq('id', existingProfile.id)
        } else if (user?.id) {
          // Create new profile for authenticated user
          await userProfileService.createProfile(user.id, profileData)
        }
      }

      // Prepare appointment data (excluding user profile fields)
      const appointmentInsertData = {
        name: appointmentData.name,
        email: appointmentData.email,
        phone: appointmentData.phone,
        date_of_birth: appointmentData.date_of_birth,
        address: appointmentData.address,
        service: appointmentData.service,
        preferred_date: appointmentData.preferred_date,
        preferred_time: appointmentData.preferred_time,
        message: appointmentData.message,
        medical_history: appointmentData.medical_history,
        allergies: appointmentData.allergies,
        current_medications: appointmentData.current_medications,
        previous_dental_work: appointmentData.previous_dental_work,
        dental_concerns: appointmentData.dental_concerns,
        emergency_contact_name: appointmentData.emergency_contact_name,
        emergency_contact_phone: appointmentData.emergency_contact_phone,
        emergency_contact_relationship: appointmentData.emergency_contact_relationship,
        has_insurance: appointmentData.has_insurance || 'no',
        insurance_provider: appointmentData.insurance_provider,
        insurance_policy_number: appointmentData.insurance_policy_number,
        status: 'pending',
        user_id: user?.id || null
      }

      // Insert appointment
      const { data, error } = await supabase
        .from('appointments')
        .insert([appointmentInsertData])
        .select()
        .single()

      if (error) {
        console.error('Appointment insert error:', error)
        throw error
      }

      // Create appointment history entry
      if (data && user?.id) {
        await this.createHistoryEntry(data.id, user.id, 'created', null, 'pending', 'Appointment created by patient')
      }

      return data
    } catch (error) {
      console.error('Error in appointmentService.create:', error)
      throw error
    }
  },

  async getAll() {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async getByEmail(email: string) {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getUpcoming(userId: string) {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', userId)
      .in('status', ['pending', 'confirmed'])
      .gte('preferred_date', new Date().toISOString().split('T')[0])
      .order('preferred_date', { ascending: true })

    if (error) throw error
    return data
  },

  async getPast(userId: string) {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', userId)
      .in('status', ['completed', 'cancelled', 'no_show'])
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async updateStatus(id: string, status: Appointment['status'], notes?: string) {
    try {
      console.log("Updating appointment status:", { id, status, notes })

      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      }

      // Set timestamp based on status
      if (status === 'confirmed') {
        updateData.confirmed_at = new Date().toISOString()
      } else if (status === 'completed') {
        updateData.completed_at = new Date().toISOString()
      } else if (status === 'cancelled') {
        updateData.cancelled_at = new Date().toISOString()
        if (notes) updateData.cancellation_reason = notes
      }

      // Add notes to the appointment record
      if (notes && status !== 'cancelled') {
        updateData.notes = notes
      }

      console.log("Update data:", updateData)

      const { data, error } = await supabase
        .from('appointments')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error("Error updating appointment:", error)
        throw error
      }

      console.log("Appointment updated successfully:", data)
      return data
    } catch (error) {
      console.error("Error in updateStatus:", error)
      throw error
    }
  },

  async createHistoryEntry(appointmentId: string, userId: string, action: string, oldStatus: string | null, newStatus: string | null, notes: string) {
    const { error } = await supabase
      .from('appointment_history')
      .insert([{
        appointment_id: appointmentId,
        user_id: userId,
        action,
        old_status: oldStatus,
        new_status: newStatus,
        notes,
        changed_by: 'patient'
      }])

    if (error) console.error('Error creating history entry:', error)
  },

  async getHistory(appointmentId: string) {
    const { data, error } = await supabase
      .from('appointment_history')
      .select('*')
      .eq('appointment_id', appointmentId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data
  }
}

export const contactService = {
  async create(contact: Omit<ContactForm, 'id' | 'created_at' | 'status'>) {
    const { data, error } = await supabase
      .from('contact_forms')
      .insert([{ ...contact, status: 'new' }])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getAll() {
    const { data, error } = await supabase
      .from('contact_forms')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }
}

export const testimonialService = {
  async getFeatured() {
    const client = getSupabaseClient()
    const { data, error } = await client
      .from('testimonials')
      .select('*')
      .eq('is_featured', true)
      .eq('is_approved', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async getAll() {
    const client = getSupabaseClient()
    const { data, error } = await client
      .from('testimonials')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }
}

export const serviceService = {
  async getActive() {
    const client = getSupabaseClient()
    const { data, error } = await client
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('is_popular', { ascending: false })

    if (error) throw error
    return data
  },

  async getPopular() {
    const client = getSupabaseClient()
    const { data, error } = await client
      .from('services')
      .select('*')
      .eq('is_active', true)
      .eq('is_popular', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }
}

export const newsletterService = {
  async subscribe(email: string, name?: string) {
    // Check if email already exists
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id, is_active')
      .eq('email', email)
      .single()

    if (existing) {
      if (existing.is_active) {
        throw new Error('Email is already subscribed to our newsletter')
      } else {
        // Reactivate subscription
        const { data, error } = await supabase
          .from('newsletter_subscribers')
          .update({
            is_active: true,
            subscribed_at: new Date().toISOString(),
            unsubscribed_at: null,
            name: name || null
          })
          .eq('id', existing.id)
          .select()
          .single()

        if (error) throw error
        return data
      }
    }

    // Create new subscription
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert([{
        email,
        name: name || null,
        source: 'website'
      }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async unsubscribe(email: string) {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .update({
        is_active: false,
        unsubscribed_at: new Date().toISOString()
      })
      .eq('email', email)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getSubscribers() {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }
}

export const authService = {
  async signUp(email: string, password: string, fullName?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    })

    if (error) throw error
    return data
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) throw error
  }
}

export const profileService = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  },

  async updateProfile(userId: string, updates: Partial<UserProfile>) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async createProfile(userId: string, profileData: Partial<UserProfile>) {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([{
        id: userId,
        ...profileData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getUserAppointments(userId: string) {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', userId)
      .order('appointment_date', { ascending: true })

    if (error) throw error
    return data
  }
}

export const notificationService = {
  async create(notification: {
    user_id: string
    appointment_id?: string
    type: string
    title: string
    message: string
    delivery_method?: 'in_app' | 'email' | 'sms' | 'push'
  }) {
    const { data, error } = await supabase
      .from('notifications')
      .insert([{
        ...notification,
        delivery_method: notification.delivery_method || 'in_app'
      }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getByUserId(userId: string, unreadOnly = false) {
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)

    if (unreadOnly) {
      query = query.eq('is_read', false)
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async markAsRead(notificationId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async markAllAsRead(userId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false)

    if (error) throw error
    return data
  }
}
