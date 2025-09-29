'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Bell, 
  BellRing, 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Calendar,
  Clock,
  Mail,
  MessageSquare,
  Check,
  CheckCheck
} from 'lucide-react'

interface NotificationsPanelProps {
  notifications: any[]
  unreadCount: number
  onMarkAsRead: (notificationId: string) => void
  onMarkAllAsRead: () => void
}

export function NotificationsPanel({ 
  notifications, 
  unreadCount, 
  onMarkAsRead, 
  onMarkAllAsRead 
}: NotificationsPanelProps) {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment_confirmed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'appointment_cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'appointment_reminder':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'appointment_rescheduled':
        return <Calendar className="h-4 w-4 text-orange-500" />
      case 'payment_received':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'message':
        return <MessageSquare className="h-4 w-4 text-purple-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'appointment_confirmed':
        return 'border-l-green-500 bg-green-50'
      case 'appointment_cancelled':
        return 'border-l-red-500 bg-red-50'
      case 'appointment_reminder':
        return 'border-l-blue-500 bg-blue-50'
      case 'appointment_rescheduled':
        return 'border-l-orange-500 bg-orange-50'
      case 'payment_received':
        return 'border-l-green-500 bg-green-50'
      case 'message':
        return 'border-l-purple-500 bg-purple-50'
      default:
        return 'border-l-gray-500 bg-gray-50'
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return 'Just now'
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} hour${hours > 1 ? 's' : ''} ago`
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days} day${days > 1 ? 's' : ''} ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BellRing className="h-5 w-5" />
            <CardTitle className="text-lg">Notifications</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onMarkAllAsRead}
              className="text-xs"
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>
        <CardDescription>
          Stay updated with your appointment status and important messages
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {notifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No notifications yet</p>
            <p className="text-sm text-gray-400">We'll notify you about appointment updates</p>
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border-l-4 transition-all duration-200 ${
                    getNotificationColor(notification.type)
                  } ${
                    !notification.is_read 
                      ? 'shadow-sm border-r border-t border-b' 
                      : 'opacity-75'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`text-sm font-medium ${
                            !notification.is_read ? 'text-gray-900' : 'text-gray-600'
                          }`}>
                            {notification.title}
                          </h4>
                          {!notification.is_read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                          )}
                        </div>
                        <p className={`text-sm ${
                          !notification.is_read ? 'text-gray-700' : 'text-gray-500'
                        }`}>
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-gray-400">
                            {formatTimeAgo(notification.created_at)}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            {notification.delivery_method === 'email' && (
                              <Mail className="h-3 w-3" />
                            )}
                            <span className="capitalize">
                              {notification.delivery_method.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {!notification.is_read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onMarkAsRead(notification.id)}
                        className="ml-2 h-8 w-8 p-0 hover:bg-white/50"
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
