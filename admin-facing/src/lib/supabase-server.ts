import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { type Database } from './supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Admin client with service role key (server-side only)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Server-side client for SSR
export const createServerSupabaseClient = async () => {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}

// Type aliases for easier use
export type Patient = Database['public']['Tables']['user_profiles']['Row']
export type Appointment = Database['public']['Tables']['appointments']['Row']
export type Service = Database['public']['Tables']['services']['Row']
export type ContactForm = Database['public']['Tables']['contact_forms']['Row']
export type Testimonial = Database['public']['Tables']['testimonials']['Row']

// API functions for admin dashboard
export const api = {
  // Patients
  async getPatients() {
    // Get all user profiles
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (profilesError) throw profilesError

    // For each profile, get their appointment data and counts
    const patientsWithAppointmentData = await Promise.all(
      profiles.map(async (profile) => {
        // Get all appointments for this patient
        const { data: appointments, error: appointmentsError } = await supabaseAdmin
          .from('appointments')
          .select('*')
          .eq('user_id', profile.id)
          .order('created_at', { ascending: false })

        if (appointmentsError) {
          console.error('Error fetching appointments for patient:', profile.id, appointmentsError)
        }

        const patientAppointments = appointments || []

        // Get the latest appointment for medical info
        const latestAppointment = patientAppointments[0]

        // Calculate appointment statistics
        const totalAppointments = patientAppointments.length
        const completedAppointments = patientAppointments.filter(apt => apt.status === 'completed').length
        const pendingAppointments = patientAppointments.filter(apt => apt.status === 'pending').length
        const confirmedAppointments = patientAppointments.filter(apt => apt.status === 'confirmed').length
        const cancelledAppointments = patientAppointments.filter(apt => apt.status === 'cancelled').length

        // Find the most recent completed appointment for last visit date
        const lastCompletedAppointment = patientAppointments.find(apt => apt.status === 'completed')
        const lastVisitDate = lastCompletedAppointment?.preferred_date || latestAppointment?.preferred_date

        return {
          ...profile,
          // Medical information from latest appointment
          medical_history: latestAppointment?.medical_history || profile.medical_history,
          allergies: latestAppointment?.allergies || profile.allergies,
          current_medications: latestAppointment?.current_medications,
          previous_dental_work: latestAppointment?.previous_dental_work,
          dental_concerns: latestAppointment?.dental_concerns,
          emergency_contact: latestAppointment?.emergency_contact_name || profile.emergency_contact,
          emergency_contact_phone: latestAppointment?.emergency_contact_phone,
          emergency_contact_relationship: latestAppointment?.emergency_contact_relationship,
          has_insurance: latestAppointment?.has_insurance,
          insurance_provider: latestAppointment?.insurance_provider,
          insurance_policy_number: latestAppointment?.insurance_policy_number,

          // Appointment statistics
          total_appointments: totalAppointments,
          completed_appointments: completedAppointments,
          pending_appointments: pendingAppointments,
          confirmed_appointments: confirmedAppointments,
          cancelled_appointments: cancelledAppointments,
          last_visit: lastVisitDate,

          // Additional patient info
          date_of_birth: latestAppointment?.date_of_birth || profile.date_of_birth,
          address: latestAppointment?.address || profile.address,
          phone: latestAppointment?.phone || profile.phone
        }
      })
    )

    return patientsWithAppointmentData as Patient[]
  },

  async getPatient(id: string) {
    // Get user profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (profileError) throw profileError

    // Get latest appointment with medical information
    const { data: latestAppointment } = await supabaseAdmin
      .from('appointments')
      .select('*')
      .eq('user_id', id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    // Merge profile with medical information from latest appointment
    const patientData = {
      ...profile,
      medical_history: latestAppointment?.medical_history || profile.medical_history,
      allergies: latestAppointment?.allergies || profile.allergies,
      current_medications: latestAppointment?.current_medications || profile.current_medications,
      previous_dental_work: latestAppointment?.previous_dental_work || profile.previous_dental_work,
      dental_concerns: latestAppointment?.dental_concerns || profile.dental_concerns,
      emergency_contact: latestAppointment?.emergency_contact_name || profile.emergency_contact,
      emergency_contact_phone: latestAppointment?.emergency_contact_phone || profile.emergency_contact_phone,
      emergency_contact_relationship: latestAppointment?.emergency_contact_relationship || profile.emergency_contact_relationship,
      has_insurance: latestAppointment?.has_insurance || profile.has_insurance,
      insurance_provider: latestAppointment?.insurance_provider || profile.insurance_provider,
      insurance_policy_number: latestAppointment?.insurance_policy_number || profile.insurance_policy_number,
      last_visit: latestAppointment?.preferred_date || profile.last_visit
    }

    return patientData as Patient
  },

  async createPatient(patient: Database['public']['Tables']['user_profiles']['Insert']) {
    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .insert(patient)
      .select()
      .single()
    
    if (error) throw error
    return data as Patient
  },

  async updatePatient(id: string, updates: Database['public']['Tables']['user_profiles']['Update']) {
    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Patient
  },

  async getPatientAppointments(patientId: string) {
    const { data, error } = await supabaseAdmin
      .from('appointments')
      .select('*')
      .eq('user_id', patientId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Appointments
  async getAppointments() {
    const { data, error } = await supabaseAdmin
      .from('appointments')
      .select('*')
      .order('preferred_date', { ascending: true })

    if (error) throw error
    return data as Appointment[]
  },

  async getPendingAppointments() {
    const { data, error } = await supabaseAdmin
      .from('appointments')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Appointment[]
  },

  async getAppointment(id: string) {
    const { data, error } = await supabaseAdmin
      .from('appointments')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Appointment
  },

  async createAppointment(appointment: any) {
    const { data, error } = await supabaseAdmin
      .from('appointments')
      .insert(appointment)
      .select()
      .single()

    if (error) throw error
    return data as Appointment
  },

  async updateAppointment(id: string, updates: any) {
    const { data, error } = await supabaseAdmin
      .from('appointments')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as Appointment
  },

  // Services
  async getServices() {
    const { data, error } = await supabaseAdmin
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('title', { ascending: true })
    
    if (error) throw error
    return data as Service[]
  },

  async getAllServices() {
    const { data, error } = await supabaseAdmin
      .from('services')
      .select('*')
      .order('title', { ascending: true })
    
    if (error) throw error
    return data as Service[]
  },

  async getService(id: string) {
    const { data, error } = await supabaseAdmin
      .from('services')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as Service
  },

  async createService(service: any) {
    const { data, error } = await supabaseAdmin
      .from('services')
      .insert(service)
      .select()
      .single()

    if (error) throw error
    return data as Service
  },

  async updateService(id: string, updates: any) {
    const { data, error } = await supabaseAdmin
      .from('services')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as Service
  },

  // Contact Forms
  async getContactForms() {
    const { data, error } = await supabaseAdmin
      .from('contact_forms')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as ContactForm[]
  },

  async updateContactForm(id: string, updates: any) {
    const { data, error } = await supabaseAdmin
      .from('contact_forms')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as ContactForm
  },

  // Medical Records
  async getMedicalRecords(patientId?: string) {
    // Get traditional medical records
    let medicalRecordsQuery = supabaseAdmin
      .from('medical_records')
      .select(`
        *,
        user_profiles!patient_id (
          id,
          full_name,
          email,
          phone
        ),
        appointments (
          id,
          service,
          preferred_date,
          preferred_time
        )
      `)
      .order('created_at', { ascending: false })

    if (patientId) {
      medicalRecordsQuery = medicalRecordsQuery.eq('patient_id', patientId)
    }

    // Get appointments with medical information
    let appointmentsQuery = supabaseAdmin
      .from('appointments')
      .select(`
        id,
        created_at,
        user_id,
        name,
        email,
        phone,
        service,
        preferred_date,
        preferred_time,
        status,
        medical_history,
        allergies,
        current_medications,
        previous_dental_work,
        dental_concerns,
        emergency_contact_name,
        emergency_contact_phone,
        emergency_contact_relationship,
        has_insurance,
        insurance_provider,
        insurance_policy_number
      `)
      .not('medical_history', 'is', null)
      .order('created_at', { ascending: false })

    if (patientId) {
      appointmentsQuery = appointmentsQuery.eq('user_id', patientId)
    }

    const [medicalRecordsResult, appointmentsResult] = await Promise.all([
      medicalRecordsQuery,
      appointmentsQuery
    ])

    if (medicalRecordsResult.error) throw medicalRecordsResult.error
    if (appointmentsResult.error) throw appointmentsResult.error

    // Combine and format the data
    const medicalRecords = medicalRecordsResult.data || []
    const appointmentRecords = (appointmentsResult.data || []).map(appointment => ({
      id: appointment.id,
      created_at: appointment.created_at,
      patient_id: appointment.user_id,
      record_type: 'appointment_intake',
      title: `Medical Intake - ${appointment.service}`,
      description: `Medical information collected during appointment booking for ${appointment.service}`,
      content: {
        service: appointment.service,
        appointment_date: appointment.preferred_date,
        appointment_time: appointment.preferred_time,
        medical_history: appointment.medical_history,
        allergies: appointment.allergies,
        current_medications: appointment.current_medications,
        previous_dental_work: appointment.previous_dental_work,
        dental_concerns: appointment.dental_concerns,
        emergency_contact: {
          name: appointment.emergency_contact_name,
          phone: appointment.emergency_contact_phone,
          relationship: appointment.emergency_contact_relationship
        },
        insurance: {
          has_insurance: appointment.has_insurance,
          provider: appointment.insurance_provider,
          policy_number: appointment.insurance_policy_number
        }
      },
      user_profiles: {
        id: appointment.user_id,
        full_name: appointment.name,
        email: appointment.email,
        phone: appointment.phone
      },
      appointments: null
    }))

    // Combine and sort all records
    const allRecords = [...medicalRecords, ...appointmentRecords]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    return allRecords
  },

  async getMedicalRecord(id: string) {
    const { data, error } = await supabaseAdmin
      .from('medical_records')
      .select(`
        *,
        user_profiles!patient_id (
          id,
          full_name,
          email,
          phone,
          date_of_birth,
          medical_history,
          allergies
        ),
        appointments (
          id,
          service,
          preferred_date,
          preferred_time
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async createMedicalRecord(record: any) {
    const { data, error } = await supabaseAdmin
      .from('medical_records')
      .insert(record)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateMedicalRecord(id: string, updates: any) {
    const { data, error } = await supabaseAdmin
      .from('medical_records')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Availability Slots
  async getAvailabilitySlots() {
    const { data, error } = await supabaseAdmin
      .from('availability_slots')
      .select('*')
      .order('date', { ascending: true })
      .order('start_time', { ascending: true })

    if (error) throw error
    return data
  },

  async createAvailabilitySlot(slot: any) {
    const { data, error } = await supabaseAdmin
      .from('availability_slots')
      .insert({
        date: slot.date,
        start_time: slot.start_time,
        end_time: slot.end_time,
        is_available: slot.is_available ?? true,
        max_appointments: slot.max_appointments ?? 1,
        current_appointments: 0,
        notes: slot.notes
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateAvailabilitySlot(id: string, updates: any) {
    const { data, error } = await supabaseAdmin
      .from('availability_slots')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteAvailabilitySlot(id: string) {
    const { error } = await supabaseAdmin
      .from('availability_slots')
      .delete()
      .eq('id', id)

    if (error) throw error
    return { success: true }
  },

  async checkSlotAvailability(date: string, time?: string) {
    // Get availability slots for the date
    const { data: slots, error: slotsError } = await supabaseAdmin
      .from('availability_slots')
      .select('*')
      .eq('date', date)
      .eq('is_available', true)

    if (slotsError) throw slotsError

    // Get existing appointments for the date
    const { data: appointments, error: appointmentsError } = await supabaseAdmin
      .from('appointments')
      .select('preferred_time, status')
      .eq('preferred_date', date)
      .in('status', ['pending', 'confirmed', 'in_progress'])

    if (appointmentsError) throw appointmentsError

    if (time) {
      // Check specific time slot
      const timeSlot = slots.find(slot => {
        return time >= slot.start_time && time <= slot.end_time
      })

      if (!timeSlot) {
        return {
          available: false,
          reason: 'No availability slot configured for this time'
        }
      }

      const appointmentsAtTime = appointments.filter(apt => apt.preferred_time === time).length
      const available = appointmentsAtTime < timeSlot.max_appointments

      return {
        available,
        reason: available ? null : 'Time slot is fully booked',
        maxAppointments: timeSlot.max_appointments,
        currentAppointments: appointmentsAtTime
      }
    }

    // Return all slots with availability info
    const slotsWithAvailability = slots.map(slot => {
      const appointmentsInSlot = appointments.filter(apt => {
        return apt.preferred_time >= slot.start_time && apt.preferred_time <= slot.end_time
      }).length

      return {
        ...slot,
        current_appointments: appointmentsInSlot,
        available: appointmentsInSlot < slot.max_appointments
      }
    })

    return {
      date,
      slots: slotsWithAvailability
    }
  },

  // Analytics
  async getDashboardStats() {
    const [patientsResult, appointmentsResult, servicesResult, contactFormsResult] = await Promise.all([
      supabaseAdmin.from('user_profiles').select('id', { count: 'exact' }),
      supabaseAdmin.from('appointments').select('id, status', { count: 'exact' }),
      supabaseAdmin.from('services').select('id', { count: 'exact' }).eq('is_active', true),
      supabaseAdmin.from('contact_forms').select('id', { count: 'exact' }).eq('status', 'new')
    ])

    const totalPatients = patientsResult.count || 0
    const totalAppointments = appointmentsResult.count || 0
    const totalServices = servicesResult.count || 0
    const newMessages = contactFormsResult.count || 0

    // Calculate appointment stats
    const appointments = appointmentsResult.data || []
    const pendingAppointments = appointments.filter(a => a.status === 'pending').length
    const confirmedAppointments = appointments.filter(a => a.status === 'confirmed').length
    const completedAppointments = appointments.filter(a => a.status === 'completed').length
    const inProgressAppointments = appointments.filter(a => a.status === 'in_progress').length

    return {
      totalPatients,
      totalAppointments,
      totalServices,
      newMessages,
      pendingAppointments,
      confirmedAppointments,
      completedAppointments,
      inProgressAppointments
    }
  }
}
