'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Calendar,
  Users,
  IndianRupee,
  UserCheck,
  Clock,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  MessageSquare
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface StatsCardsProps {
  stats: {
    totalPatients: number
    totalAppointments: number
    totalServices: number
    newMessages: number
    pendingAppointments: number
    confirmedAppointments: number
    completedAppointments: number
    inProgressAppointments: number
  } | null
  loading?: boolean
}

export function StatsCards({ stats, loading = false }: StatsCardsProps) {
  if (loading || !stats) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-[#404040]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
                <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const cards = [
    {
      title: 'Total Patients',
      value: stats.totalPatients.toString(),
      description: 'Registered patients',
      icon: Users,
      trend: 0, // We'll calculate trends later
      color: 'text-blue-600'
    },
    {
      title: 'Total Appointments',
      value: stats.totalAppointments.toString(),
      description: 'All appointments',
      icon: Calendar,
      trend: 0,
      color: 'text-green-600'
    },
    {
      title: 'Pending Appointments',
      value: stats.pendingAppointments.toString(),
      description: 'Awaiting confirmation',
      icon: Clock,
      trend: 0,
      color: 'text-orange-600'
    },
    {
      title: 'New Messages',
      value: stats.newMessages.toString(),
      description: 'Unread messages',
      icon: MessageSquare,
      trend: 0,
      color: 'text-purple-600'
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon
        const isPositiveTrend = card.trend > 0
        const TrendIcon = isPositiveTrend ? ArrowUpRight : ArrowDownRight
        
        return (
          <Card
            key={index}
            className="relative overflow-hidden bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-[#404040] hover:shadow-lg transition-all duration-200 group"
          >
            {/* Gradient accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-orange-600" />

            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {card.title}
              </CardTitle>
              <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-900/20 group-hover:scale-110 transition-transform duration-200">
                <Icon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {card.value}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {card.description}
                </span>
                <div className="flex items-center gap-1">
                  <TrendIcon className={`h-3 w-3 ${
                    isPositiveTrend
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`} />
                  <span className={`text-xs font-medium ${
                    isPositiveTrend
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {Math.abs(card.trend)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
