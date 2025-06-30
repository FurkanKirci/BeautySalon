"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, User, Phone, Mail, Filter } from "lucide-react"
import { getAppointments, updateAppointmentStatus } from "@/lib/actions/appointments"

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    loadAppointments()
  }, [])

  const loadAppointments = async () => {
    try {
      const data = await getAppointments()
      setAppointments(data)
    } catch (error) {
      console.error("Appointments loading error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await updateAppointmentStatus(appointmentId, newStatus)
      await loadAppointments()
    } catch (error) {
      console.error("Status update error:", error)
    }
  }

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "confirmed":
        return "default"
      case "pending":
        return "secondary"
      case "completed":
        return "outline"
      case "cancelled":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "confirmed":
        return "Onaylandı"
      case "pending":
        return "Bekliyor"
      case "completed":
        return "Tamamlandı"
      case "cancelled":
        return "İptal"
      default:
        return status
    }
  }

  const filteredAppointments = appointments.filter(
    (appointment) => statusFilter === "all" || appointment.status === statusFilter,
  )

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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Randevular</h1>
            <p className="text-muted-foreground">Tüm randevuları görüntüleyin ve yönetin</p>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                <SelectItem value="pending">Bekliyor</SelectItem>
                <SelectItem value="confirmed">Onaylandı</SelectItem>
                <SelectItem value="completed">Tamamlandı</SelectItem>
                <SelectItem value="cancelled">İptal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <Card key={appointment._id}>
              <CardContent className="p-6">
                <div className="grid lg:grid-cols-4 gap-4 items-center">
                  {/* Customer Info */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">
                        {appointment.firstName} {appointment.lastName}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3" />
                        {appointment.phone}
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        {appointment.email}
                      </div>
                    </div>
                  </div>

                  {/* Service Info */}
                  <div>
                    <p className="font-medium mb-1">{appointment.service_name}</p>
                    <p className="text-sm text-muted-foreground mb-1">{appointment.specialist_name}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {appointment.duration} dk - ₺{appointment.price}
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">
                        {new Date(appointment.appointmentDate).toLocaleDateString("tr-TR")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{appointment.appointmentTime}</span>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex flex-col gap-2">
                    <Badge variant={getStatusBadgeVariant(appointment.status)}>
                      {getStatusText(appointment.status)}
                    </Badge>

                    <Select
                      value={appointment.status}
                      onValueChange={(value) => handleStatusChange(appointment._id, value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Bekliyor</SelectItem>
                        <SelectItem value="confirmed">Onayla</SelectItem>
                        <SelectItem value="completed">Tamamlandı</SelectItem>
                        <SelectItem value="cancelled">İptal Et</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Notes */}
                {appointment.notes && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm">
                      <strong>Not:</strong> {appointment.notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAppointments.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">
                {statusFilter === "all" ? "Henüz randevu bulunmuyor" : "Bu durumda randevu bulunmuyor"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
