"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  Settings,
  LogOut,
  Plus,
  CheckCircle,
  AlertCircle,
  XCircle,
  Bell
} from "lucide-react"
import { authService, profileService, appointmentService, notificationService, type Appointment, type UserProfile } from "@/lib/supabase"
import { AppointmentStatusCard } from "@/components/appointment-status-card"
import { NotificationsPanel } from "@/components/notifications-panel"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([])
  const [pastAppointments, setPastAppointments] = useState<Appointment[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const currentUser = await authService.getCurrentUser()
      if (!currentUser) {
        router.push("/auth/login")
        return
      }
      
      setUser(currentUser)
      
      // Load user profile and appointments
      try {
        const userProfile = await profileService.getProfile(currentUser.id)
        setProfile(userProfile)
      } catch (error) {
        // Profile might not exist yet
        console.log("No profile found, user can create one")
      }
      
      try {
        // Load all appointments (both with user_id and matching email)
        const userAppointments = await appointmentService.getByUserId(currentUser.id)
        const emailAppointments = currentUser.email ?
          await appointmentService.getByEmail(currentUser.email) : []

        // Combine and deduplicate appointments
        const allAppointments = [...userAppointments, ...emailAppointments]
        const uniqueAppointments = allAppointments.filter((appointment, index, self) =>
          index === self.findIndex(a => a.id === appointment.id)
        )

        setAppointments(uniqueAppointments)

        // Filter upcoming appointments
        const today = new Date().toISOString().split('T')[0]
        const upcoming = uniqueAppointments.filter(apt =>
          ['pending', 'confirmed'].includes(apt.status) &&
          apt.preferred_date >= today
        ).sort((a, b) => new Date(a.preferred_date).getTime() - new Date(b.preferred_date).getTime())
        setUpcomingAppointments(upcoming)

        // Filter past appointments
        const past = uniqueAppointments.filter(apt =>
          ['completed', 'cancelled', 'no_show'].includes(apt.status)
        ).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        setPastAppointments(past)

        // Load notifications
        const userNotifications = await notificationService.getByUserId(currentUser.id)
        setNotifications(userNotifications)

        // Count unread notifications
        const unread = userNotifications.filter(n => !n.is_read).length
        setUnreadCount(unread)

        console.log("Loaded appointments:", {
          total: uniqueAppointments.length,
          upcoming: upcoming.length,
          past: past.length,
          notifications: userNotifications.length
        })

      } catch (error) {
        console.log("Error loading appointments:", error)
      }
      
    } catch (error) {
      console.error("Error loading user data:", error)
      router.push("/auth/login")
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await authService.signOut()
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const handleCancelAppointment = async (appointmentId: string, reason: string) => {
    try {
      console.log("Cancelling appointment:", appointmentId, "with reason:", reason)

      await appointmentService.updateStatus(appointmentId, 'cancelled', reason)

      console.log("Appointment cancelled successfully, reloading data...")

      // Reload appointments using the same logic as initial load
      if (user) {
        const userAppointments = await appointmentService.getByUserId(user.id)
        const emailAppointments = user.email ?
          await appointmentService.getByEmail(user.email) : []

        // Combine and deduplicate appointments
        const allAppointments = [...userAppointments, ...emailAppointments]
        const uniqueAppointments = allAppointments.filter((appointment, index, self) =>
          index === self.findIndex(a => a.id === appointment.id)
        )

        setAppointments(uniqueAppointments)

        // Filter upcoming appointments
        const today = new Date().toISOString().split('T')[0]
        const upcoming = uniqueAppointments.filter(apt =>
          ['pending', 'confirmed'].includes(apt.status) &&
          apt.preferred_date >= today
        ).sort((a, b) => new Date(a.preferred_date).getTime() - new Date(b.preferred_date).getTime())
        setUpcomingAppointments(upcoming)

        // Filter past appointments
        const past = uniqueAppointments.filter(apt =>
          ['completed', 'cancelled', 'no_show'].includes(apt.status)
        ).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        setPastAppointments(past)

        console.log("Appointments reloaded successfully")

        // Show success message
        alert("Appointment cancelled successfully!")
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error)
      // Show user-friendly error message
      alert("Failed to cancel appointment. Please try again or contact us directly.")
    }
  }

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId)
      // Update local state
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const markAllNotificationsAsRead = async () => {
    if (!user) return
    try {
      await notificationService.markAllAsRead(user.id)
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {user?.user_metadata?.full_name || user?.email}! 👋
            </h1>
            <p className="text-muted-foreground">
              Manage your appointments and dental health records
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.push("/book")}
              className="rounded-2xl bg-gradient-to-r from-[#6366F1] to-[#F59E0B] text-white shadow-lg hover:from-[#5a5ee0] hover:to-[#e08d0a] transition-all duration-300"
            >
              <Plus className="h-4 w-4 mr-2" />
              Book Appointment
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appointments.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pastAppointments.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Notifications</CardTitle>
              <div className="relative">
                <Bell className="h-4 w-4 text-muted-foreground" />
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">{unreadCount}</span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{notifications.length}</div>
              {unreadCount > 0 && (
                <p className="text-xs text-red-600 mt-1">{unreadCount} unread</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="appointments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="notifications" className="relative">
              Notifications
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">{unreadCount}</span>
                </div>
              )}
            </TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="records">Medical Records</TabsTrigger>
          </TabsList>
          
          <TabsContent value="appointments" className="space-y-6">
            {/* Upcoming Appointments */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Upcoming Appointments</h2>
              </div>

              {upcomingAppointments.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No upcoming appointments</h3>
                    <p className="text-muted-foreground">
                      Use the "Book Appointment" button above to schedule your next visit.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {upcomingAppointments.map((appointment) => (
                    <AppointmentStatusCard
                      key={appointment.id}
                      appointment={appointment}
                      onCancel={handleCancelAppointment}
                      onReschedule={(id) => router.push(`/book?reschedule=${id}`)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Past Appointments */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Past Appointments</h2>

              {pastAppointments.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-6">
                    <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No past appointments</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {pastAppointments.slice(0, 5).map((appointment) => (
                    <AppointmentStatusCard
                      key={appointment.id}
                      appointment={appointment}
                      showHistory={true}
                    />
                  ))}
                  {pastAppointments.length > 5 && (
                    <Card>
                      <CardContent className="text-center py-4">
                        <Button variant="outline" onClick={() => {/* Show all past appointments */}}>
                          View All Past Appointments ({pastAppointments.length - 5} more)
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <NotificationsPanel
              notifications={notifications}
              unreadCount={unreadCount}
              onMarkAsRead={markNotificationAsRead}
              onMarkAllAsRead={markAllNotificationsAsRead}
            />
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Manage your personal information and contact details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Full Name</p>
                        <p className="text-sm text-muted-foreground">
                          {profile?.full_name || user?.user_metadata?.full_name || "Not provided"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Phone</p>
                        <p className="text-sm text-muted-foreground">
                          {profile?.phone || "Not provided"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Address</p>
                        <p className="text-sm text-muted-foreground">
                          {profile?.address || "Not provided"}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="records" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Medical Records</CardTitle>
                <CardDescription>
                  Your dental history and treatment records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No medical records yet</h3>
                  <p className="text-muted-foreground">
                    Your treatment history and medical records will appear here after your appointments.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
