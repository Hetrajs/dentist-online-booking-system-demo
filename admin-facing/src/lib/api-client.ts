import { type Appointment, type Patient, type Service } from './supabase'

interface DashboardStats {
  totalPatients: number
  totalAppointments: number
  totalServices: number
  newMessages: number
  pendingAppointments: number
  confirmedAppointments: number
  completedAppointments: number
  inProgressAppointments: number
}

class ApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`/api${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`)
    }

    return response.json()
  }

  // Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    return this.request<DashboardStats>('/dashboard/stats')
  }

  // Appointments
  async getAppointments(): Promise<Appointment[]> {
    return this.request<Appointment[]>('/appointments')
  }

  async getAppointment(id: string): Promise<Appointment> {
    return this.request<Appointment>(`/appointments/${id}`)
  }

  async createAppointment(appointment: Partial<Appointment>): Promise<Appointment> {
    return this.request<Appointment>('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointment),
    })
  }

  async updateAppointment(id: string, updates: Partial<Appointment>): Promise<Appointment> {
    return this.request<Appointment>(`/appointments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
  }

  async getPendingAppointments(): Promise<Appointment[]> {
    return this.request<Appointment[]>('/appointments/pending')
  }

  async updatePendingAppointment(id: string, updates: Partial<Appointment>): Promise<Appointment> {
    return this.request<Appointment>(`/appointments/pending?id=${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
  }

  // Patients
  async getPatients(): Promise<Patient[]> {
    return this.request<Patient[]>('/patients')
  }

  async getPatient(id: string): Promise<Patient> {
    return this.request<Patient>(`/patients/${id}`)
  }

  async getPatientAppointments(patientId: string): Promise<any[]> {
    return this.request<any[]>(`/patients/${patientId}/appointments`)
  }

  async createPatient(patient: Partial<Patient>): Promise<Patient> {
    return this.request<Patient>('/patients', {
      method: 'POST',
      body: JSON.stringify(patient),
    })
  }

  async updatePatient(id: string, updates: Partial<Patient>): Promise<Patient> {
    return this.request<Patient>(`/patients/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
  }

  // Services
  async getServices(): Promise<Service[]> {
    return this.request<Service[]>('/services')
  }

  async getService(id: string): Promise<Service> {
    return this.request<Service>(`/services/${id}`)
  }

  async createService(service: Partial<Service>): Promise<Service> {
    return this.request<Service>('/services', {
      method: 'POST',
      body: JSON.stringify(service),
    })
  }

  async updateService(id: string, updates: Partial<Service>): Promise<Service> {
    return this.request<Service>(`/services/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
  }

  // Reports
  async getReportsData(dateRange?: string): Promise<any> {
    const params = dateRange ? `?dateRange=${dateRange}` : ''
    return this.request<any>(`/reports${params}`)
  }

  // Medical Records
  async getMedicalRecords(patientId?: string): Promise<any[]> {
    const params = patientId ? `?patientId=${patientId}` : ''
    return this.request<any[]>(`/medical-records${params}`)
  }

  async getMedicalRecord(id: string): Promise<any> {
    return this.request<any>(`/medical-records/${id}`)
  }

  async createMedicalRecord(record: any): Promise<any> {
    return this.request<any>('/medical-records', {
      method: 'POST',
      body: JSON.stringify(record),
    })
  }

  async updateMedicalRecord(id: string, updates: any): Promise<any> {
    return this.request<any>(`/medical-records/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
  }

  // Availability Slots
  async getAvailabilitySlots(): Promise<any[]> {
    return this.request<any[]>('/availability-slots')
  }

  async getAvailabilitySlot(id: string): Promise<any> {
    return this.request<any>(`/availability-slots/${id}`)
  }

  async createAvailabilitySlot(slot: any): Promise<any> {
    return this.request<any>('/availability-slots', {
      method: 'POST',
      body: JSON.stringify(slot),
    })
  }

  async updateAvailabilitySlot(id: string, updates: any): Promise<any> {
    return this.request<any>(`/availability-slots/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
  }

  async deleteAvailabilitySlot(id: string): Promise<void> {
    return this.request<void>(`/availability-slots/${id}`, {
      method: 'DELETE',
    })
  }

  async checkSlotAvailability(date: string, time?: string): Promise<any> {
    const params = time ? `?date=${date}&time=${time}` : `?date=${date}`
    return this.request<any>(`/availability-slots/check${params}`)
  }
}

export const api = new ApiClient()
