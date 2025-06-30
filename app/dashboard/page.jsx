"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, MessageSquare, Star, Clock, Phone, Mail } from "lucide-react"
import Link from "next/link"
import { getDashboardStats } from "@/lib/actions/dashboard"
import { getRecentAppointments } from "@/lib/actions/appointments"
import { getRecentMessages } from "@/lib/actions/contact"

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [recentAppointments, setRecentAppointments] = useState([])
  const [recentMessages, setRecentMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [statsData, appointmentsData, messagesData] = await Promise.all([
          getDashboardStats(),
          getRecentAppointments(),
          getRecentMessages(),
        ])

        setStats(statsData)
        setRecentAppointments(appointmentsData)
        setRecentMessages(messagesData)
      } catch (error) {
        console.error("Dashboard data loading error:", error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Yükleniyor...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Salon yönetim paneline hoş geldiniz</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Randevu</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalAppointments || 0}</div>
              <p className="text-xs text-muted-foreground">+{stats?.newAppointmentsThisMonth || 0} bu ay</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aktif Hizmetler</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalServices || 0}</div>
              <p className="text-xs text-muted-foreground">Toplam hizmet sayısı</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Uzmanlar</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalSpecialists || 0}</div>
              <p className="text-xs text-muted-foreground">Aktif uzman sayısı</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mesajlar</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalMessages || 0}</div>
              <p className="text-xs text-muted-foreground">+{stats?.newMessagesThisWeek || 0} bu hafta</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Button asChild className="h-auto p-4">
            <Link href="/dashboard/appointments" className="flex flex-col items-center gap-2">
              <Calendar className="h-6 w-6" />
              <span>Randevular</span>
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-auto p-4 bg-transparent">
            <Link href="/dashboard/services" className="flex flex-col items-center gap-2">
              <Star className="h-6 w-6" />
              <span>Hizmetler</span>
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-auto p-4 bg-transparent">
            <Link href="/dashboard/specialists" className="flex flex-col items-center gap-2">
              <Users className="h-6 w-6" />
              <span>Uzmanlar</span>
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-auto p-4 bg-transparent">
            <Link href="/dashboard/messages" className="flex flex-col items-center gap-2">
              <MessageSquare className="h-6 w-6" />
              <span>Mesajlar</span>
            </Link>
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Appointments */}
          <Card>
            <CardHeader>
              <CardTitle>Son Randevular</CardTitle>
              <CardDescription>En son alınan randevular</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAppointments.map((appointment) => (
                  <div key={appointment._id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">
                        {appointment.firstName} {appointment.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">{appointment.service_name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(appointment.appointmentDate).toLocaleDateString("tr-TR")}
                        <Clock className="h-3 w-3 ml-2" />
                        {appointment.appointmentTime}
                      </div>
                    </div>
                    <Badge
                      variant={
                        appointment.status === "confirmed"
                          ? "default"
                          : appointment.status === "pending"
                            ? "secondary"
                            : appointment.status === "completed"
                              ? "outline"
                              : "destructive"
                      }
                    >
                      {appointment.status === "confirmed"
                        ? "Onaylandı"
                        : appointment.status === "pending"
                          ? "Bekliyor"
                          : appointment.status === "completed"
                            ? "Tamamlandı"
                            : "İptal"}
                    </Badge>
                  </div>
                ))}
                {recentAppointments.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">Henüz randevu bulunmuyor</p>
                )}
              </div>
              <div className="mt-4">
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/dashboard/appointments">Tüm Randevuları Görüntüle</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Messages */}
          <Card>
            <CardHeader>
              <CardTitle>Son Mesajlar</CardTitle>
              <CardDescription>Yeni gelen iletişim mesajları</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentMessages.map((message) => (
                  <div key={message._id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">
                        {message.firstName} {message.lastName}
                      </p>
                      <Badge variant={message.status === "new" ? "default" : "secondary"}>
                        {message.status === "new" ? "Yeni" : "Okundu"}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">{message.subject}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{message.message}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {message.email}
                      </div>
                      {message.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {message.phone}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {recentMessages.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">Henüz mesaj bulunmuyor</p>
                )}
              </div>
              <div className="mt-4">
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/dashboard/messages">Tüm Mesajları Görüntüle</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
