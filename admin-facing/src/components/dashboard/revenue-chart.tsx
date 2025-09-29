'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts'
import { formatCurrency } from '@/lib/utils'

// Mock data for revenue chart
const revenueData = [
  { month: 'Jan', revenue: 185000, appointments: 45 },
  { month: 'Feb', revenue: 220000, appointments: 52 },
  { month: 'Mar', revenue: 195000, appointments: 48 },
  { month: 'Apr', revenue: 275000, appointments: 65 },
  { month: 'May', revenue: 310000, appointments: 72 },
  { month: 'Jun', revenue: 285000, appointments: 68 },
  { month: 'Jul', revenue: 245000, appointments: 58 },
]

export function RevenueChart() {
  return (
    <Card className="bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-[#404040]">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">Revenue Overview</CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Monthly revenue and appointment trends
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="month" 
                className="text-xs fill-muted-foreground"
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                className="text-xs fill-muted-foreground"
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-3 shadow-md">
                        <p className="font-medium">{label}</p>
                        <p className="text-sm text-muted-foreground">
                          Revenue: {formatCurrency(payload[0].value as number)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Appointments: {payload[0].payload.appointments}
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Summary Stats */}
        <div className="mt-4 grid grid-cols-3 gap-4 border-t pt-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(revenueData.reduce((sum, item) => sum + item.revenue, 0))}
            </p>
            <p className="text-xs text-muted-foreground">Total Revenue</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(revenueData[revenueData.length - 1].revenue)}
            </p>
            <p className="text-xs text-muted-foreground">This Month</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {formatCurrency(
                revenueData.reduce((sum, item) => sum + item.revenue, 0) / revenueData.length
              )}
            </p>
            <p className="text-xs text-muted-foreground">Average</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
