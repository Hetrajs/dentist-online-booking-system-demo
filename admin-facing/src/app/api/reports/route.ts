import { NextResponse } from 'next/server'
import { api } from '@/lib/supabase-server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const dateRange = searchParams.get('dateRange') || '30d'
    
    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    
    switch (dateRange) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7)
        break
      case '30d':
        startDate.setDate(endDate.getDate() - 30)
        break
      case '90d':
        startDate.setDate(endDate.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(endDate.getFullYear() - 1)
        break
      default:
        startDate.setDate(endDate.getDate() - 30)
    }

    // Fetch real data from Supabase
    const [appointments, patients, services] = await Promise.all([
      api.getAppointments(),
      api.getPatients(),
      api.getServices()
    ])

    // Filter appointments by date range
    const filteredAppointments = appointments.filter(apt => {
      const aptDate = new Date(apt.appointment_date)
      return aptDate >= startDate && aptDate <= endDate
    })

    // Calculate revenue from completed appointments
    const completedAppointments = filteredAppointments.filter(apt => apt.status === 'completed')
    const totalRevenue = completedAppointments.reduce((sum, apt) => {
      const service = services.find(s => s.id === apt.service_id)
      return sum + (service?.price || 0)
    }, 0)

    // Calculate monthly revenue for the last 6 months
    const monthlyRevenue = []
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date()
      monthStart.setMonth(monthStart.getMonth() - i)
      monthStart.setDate(1)
      monthStart.setHours(0, 0, 0, 0)
      
      const monthEnd = new Date(monthStart)
      monthEnd.setMonth(monthEnd.getMonth() + 1)
      monthEnd.setDate(0)
      monthEnd.setHours(23, 59, 59, 999)

      const monthAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.appointment_date)
        return aptDate >= monthStart && aptDate <= monthEnd && apt.status === 'completed'
      })

      const monthRevenue = monthAppointments.reduce((sum, apt) => {
        const service = services.find(s => s.id === apt.service_id)
        return sum + (service?.price || 0)
      }, 0)

      monthlyRevenue.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short' }),
        amount: monthRevenue
      })
    }

    // Calculate growth (comparing current month to previous month)
    const currentMonthRevenue = monthlyRevenue[monthlyRevenue.length - 1]?.amount || 0
    const previousMonthRevenue = monthlyRevenue[monthlyRevenue.length - 2]?.amount || 0
    const growth = previousMonthRevenue > 0 
      ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100 
      : 0

    // Calculate appointment statistics
    const appointmentStats = {
      total: filteredAppointments.length,
      completed: filteredAppointments.filter(apt => apt.status === 'completed').length,
      cancelled: filteredAppointments.filter(apt => apt.status === 'cancelled').length,
      trends: [] // Could add daily trends here
    }

    // Calculate patient demographics
    const patientDemographics = []
    const ageGroups = ['18-25', '26-35', '36-45', '46-55', '55+']
    
    for (const ageGroup of ageGroups) {
      const [minAge, maxAge] = ageGroup === '55+' 
        ? [55, 150] 
        : ageGroup.split('-').map(Number)
      
      const count = patients.filter(patient => {
        if (!patient.date_of_birth) return false
        const age = new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear()
        return age >= minAge && (maxAge === 150 || age <= maxAge)
      }).length

      patientDemographics.push({
        age_group: ageGroup,
        count
      })
    }

    // Calculate service popularity
    const serviceStats = services.map(service => {
      const serviceAppointments = completedAppointments.filter(apt => apt.service_id === service.id)
      return {
        name: service.name,
        count: serviceAppointments.length,
        revenue: serviceAppointments.length * (service.price || 0)
      }
    }).sort((a, b) => b.count - a.count)

    // Calculate service performance (with mock ratings for now)
    const servicePerformance = services.map(service => {
      const serviceAppointments = completedAppointments.filter(apt => apt.service_id === service.id)
      return {
        service: service.name,
        rating: 4.5 + Math.random() * 0.5, // Mock rating between 4.5-5.0
        bookings: serviceAppointments.length
      }
    }).sort((a, b) => b.rating - a.rating)

    const reportData = {
      revenue: {
        total: totalRevenue,
        growth: Math.round(growth * 10) / 10,
        monthly: monthlyRevenue
      },
      appointments: appointmentStats,
      patients: {
        total: patients.length,
        new: patients.filter(p => {
          const createdDate = new Date(p.created_at || '')
          return createdDate >= startDate && createdDate <= endDate
        }).length,
        returning: patients.filter(p => (p.total_appointments || 0) > 1).length,
        demographics: patientDemographics
      },
      services: {
        popular: serviceStats.slice(0, 5),
        performance: servicePerformance.slice(0, 5)
      }
    }

    return NextResponse.json(reportData)
  } catch (error) {
    console.error('Error fetching reports data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reports data' },
      { status: 500 }
    )
  }
}
