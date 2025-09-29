'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts'

// Mock data for appointment status distribution
const appointmentStatusData = [
  { name: 'Confirmed', value: 45, color: '#22c55e' },
  { name: 'Pending', value: 12, color: '#f59e0b' },
  { name: 'Completed', value: 78, color: '#3b82f6' },
  { name: 'Cancelled', value: 8, color: '#ef4444' },
]

// Mock data for weekly appointments
const weeklyAppointments = [
  { day: 'Mon', appointments: 12, completed: 10 },
  { day: 'Tue', appointments: 15, completed: 13 },
  { day: 'Wed', appointments: 8, completed: 7 },
  { day: 'Thu', appointments: 18, completed: 16 },
  { day: 'Fri', appointments: 22, completed: 20 },
  { day: 'Sat', appointments: 16, completed: 14 },
  { day: 'Sun', appointments: 6, completed: 5 },
]

export function AppointmentChart() {
  return (
    <Card className="bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-[#404040]">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">Appointment Analytics</CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Weekly trends and status distribution
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Weekly Bar Chart */}
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyAppointments}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="day" 
                  className="text-xs fill-muted-foreground"
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  className="text-xs fill-muted-foreground"
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-3 shadow-md">
                          <p className="font-medium">{label}</p>
                          <p className="text-sm text-blue-600">
                            Scheduled: {payload[0].value}
                          </p>
                          <p className="text-sm text-green-600">
                            Completed: {payload[1].value}
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar 
                  dataKey="appointments" 
                  fill="hsl(var(--primary))" 
                  radius={[2, 2, 0, 0]}
                  opacity={0.7}
                />
                <Bar 
                  dataKey="completed" 
                  fill="hsl(var(--primary))" 
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Status Distribution */}
          <div className="flex items-center justify-between">
            <div className="h-[120px] w-[120px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={appointmentStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={50}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {appointmentStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-md">
                            <p className="text-sm font-medium">
                              {payload[0].payload.name}: {payload[0].value}
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex-1 space-y-2 pl-4">
              {appointmentStatusData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="h-3 w-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-muted-foreground">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
