'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  IndianRupee,
  Activity,
  Download,
  RefreshCw,
  Filter,
  Zap
} from 'lucide-react'
import { api } from '@/lib/api-client'

interface ReportData {
  revenue: {
    total: number
    growth: number
    monthly: Array<{ month: string; amount: number }>
  }
  appointments: {
    total: number
    completed: number
    cancelled: number
    trends: Array<{ date: string; count: number }>
  }
  patients: {
    total: number
    new: number
    returning: number
    demographics: Array<{ age_group: string; count: number }>
  }
  services: {
    popular: Array<{ name: string; count: number; revenue: number }>
    performance: Array<{ service: string; rating: number; bookings: number }>
  }
}

export function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('30d')
  const [reportType, setReportType] = useState('overview')

  useEffect(() => {
    fetchReportData()
  }, [dateRange, reportType])

  const fetchReportData = async () => {
    setLoading(true)
    try {
      const data = await api.getReportsData(dateRange)
      setReportData(data)
    } catch (error) {
      console.error('Error fetching report data:', error)
      // Fallback to empty data structure
      setReportData({
        revenue: { total: 0, growth: 0, monthly: [] },
        appointments: { total: 0, completed: 0, cancelled: 0, trends: [] },
        patients: { total: 0, new: 0, returning: 0, demographics: [] },
        services: { popular: [], performance: [] }
      })
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!reportData) {
    return <div>Error loading report data</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into your dental practice performance
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={fetchReportData}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(reportData.revenue.total)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +{reportData.revenue.growth}% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.appointments.total}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Activity className="mr-1 h-3 w-3" />
              {reportData.appointments.completed} completed
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.patients.total}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              {reportData.patients.new} new this month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((reportData.appointments.completed / reportData.appointments.total) * 100)}%
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Activity className="mr-1 h-3 w-3" />
              {reportData.appointments.cancelled} cancelled
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
            <CardDescription>Monthly revenue over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.revenue.monthly.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.month}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${(item.amount / 70000) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatCurrency(item.amount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Popular Services */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Services</CardTitle>
            <CardDescription>Most booked services and their revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.services.popular.map((service, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="text-sm font-medium">{service.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{formatCurrency(service.revenue)}</div>
                    <div className="text-xs text-muted-foreground">{service.count} bookings</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patient Demographics */}
      <Card>
        <CardHeader>
          <CardTitle>Patient Demographics</CardTitle>
          <CardDescription>Age distribution of your patient base</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            {reportData.patients.demographics.map((demo, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold">{demo.count}</div>
                <div className="text-sm text-muted-foreground">{demo.age_group}</div>
                <div className="w-full bg-muted rounded-full h-2 mt-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${(demo.count / reportData.patients.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Service Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Service Performance</CardTitle>
          <CardDescription>Service ratings and booking frequency</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reportData.services.performance.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Zap className="h-8 w-8 text-primary" />
                  <div>
                    <div className="font-medium">{service.service}</div>
                    <div className="text-sm text-muted-foreground">
                      {service.bookings} bookings
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <span className="text-lg font-bold">{service.rating}</span>
                    <span className="text-yellow-500">★</span>
                  </div>
                  <Badge variant="secondary">
                    {service.rating >= 4.8 ? 'Excellent' : service.rating >= 4.5 ? 'Very Good' : 'Good'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
