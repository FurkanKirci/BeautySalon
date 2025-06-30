"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, User, Phone, Mail } from "lucide-react"
import { createAppointment } from "@/lib/actions/appointments"
import { getServices } from "@/lib/actions/services"
import { getSpecialists } from "@/lib/actions/specialists"

// JSON Data for Appointment Page
const appointmentData = {
  title: "Randevu Al",
  subtitle: "Size uygun tarih ve saatte randevunuzu oluşturun",
  timeSlots: [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
  ],
}

export default function RandevuPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedService, setSelectedService] = useState("")
  const [selectedSpecialist, setSelectedSpecialist] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [services, setServices] = useState([])
  const [specialists, setSpecialists] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    notes: "",
  })

  useEffect(() => {
    // Load services and specialists
    const loadData = async () => {
      try {
        const [servicesData, specialistsData] = await Promise.all([getServices(), getSpecialists()])
        setServices(servicesData)
        setSpecialists(specialistsData)
      } catch (error) {
        console.error("Error loading data:", error)
      }
    }
    loadData()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage("")

    try {
      const appointmentData = {
        serviceId: selectedService,
        specialistId: selectedSpecialist,
        appointmentDate: selectedDate.toISOString().split("T")[0],
        appointmentTime: selectedTime,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        notes: formData.notes,
      }

      const result = await createAppointment(appointmentData)

      if (result.success) {
        setSubmitMessage(result.message)
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          phone: "",
          email: "",
          notes: "",
        })
        setSelectedService("")
        setSelectedSpecialist("")
        setSelectedTime("")
      } else {
        setSubmitMessage(result.message)
      }
    } catch (error) {
      setSubmitMessage("Bir hata oluştu. Lütfen tekrar deneyin.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedServiceData = services.find((s) => s.id.toString() === selectedService)

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">{appointmentData.title}</h1>
            <p className="text-xl text-muted-foreground">{appointmentData.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Service Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Hizmet Seçimi
                  </CardTitle>
                  <CardDescription>Almak istediğiniz hizmeti seçin</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Hizmet</Label>
                    <Select value={selectedService} onValueChange={setSelectedService}>
                      <SelectTrigger>
                        <SelectValue placeholder="Hizmet seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.id} value={service.id.toString()}>
                            <div className="flex justify-between items-center w-full">
                              <span>{service.name}</span>
                              <div className="flex gap-2 ml-4">
                                <Badge variant="secondary">{service.duration} dk</Badge>
                                <Badge variant="outline">₺{service.price}</Badge>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Uzman</Label>
                    <Select value={selectedSpecialist} onValueChange={setSelectedSpecialist}>
                      <SelectTrigger>
                        <SelectValue placeholder="Uzman seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {specialists.map((specialist) => (
                          <SelectItem key={specialist.id} value={specialist.id.toString()}>
                            {specialist.name} - {specialist.speciality}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedServiceData && (
                    <div className="bg-muted/50 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Seçilen Hizmet</h4>
                      <div className="space-y-1 text-sm">
                        <p>
                          <strong>Hizmet:</strong> {selectedServiceData.name}
                        </p>
                        <p>
                          <strong>Süre:</strong> {selectedServiceData.duration} dk
                        </p>
                        <p>
                          <strong>Fiyat:</strong> ₺{selectedServiceData.price}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Date & Time Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="w-5 h-5" />
                    Tarih ve Saat
                  </CardTitle>
                  <CardDescription>Randevu tarihi ve saatini seçin</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="mb-2 block">Ay Seçin</Label>
                    <Select
                      value={selectedDate ? `${selectedDate.getFullYear()}-${selectedDate.getMonth()}` : ""}
                      onValueChange={(value) => {
                        const [year, month] = value.split("-").map(Number)
                        const newDate = new Date(year, month, 1)
                        setSelectedDate(newDate)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Ay seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => {
                          const date = new Date(new Date().getFullYear(), new Date().getMonth() + i, 1)
                          return (
                            <SelectItem key={i} value={`${date.getFullYear()}-${date.getMonth()}`}>
                              {date.toLocaleDateString("tr-TR", { month: "long", year: "numeric" })}
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedDate && (
                    <div>
                      <Label className="mb-2 block">Gün Seçin</Label>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date() || date.getDay() === 0}
                        month={selectedDate}
                        className="rounded-md border"
                      />
                    </div>
                  )}

                  {selectedDate && (
                    <div>
                      <Label className="mb-2 block">Saat</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {appointmentData.timeSlots.map((time) => (
                          <Button
                            key={time}
                            type="button"
                            variant={selectedTime === time ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedTime(time)}
                            className="text-xs"
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Kişisel Bilgiler
                </CardTitle>
                <CardDescription>İletişim bilgilerinizi girin</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Ad</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Adınız"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Soyad</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Soyadınız"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Telefon numaranız"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-posta</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="E-posta adresiniz"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <Label htmlFor="notes">Notlar (Opsiyonel)</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Özel istekleriniz veya notlarınız..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Summary & Submit */}
            <Card>
              <CardHeader>
                <CardTitle>Randevu Özeti</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Hizmet:</span>
                    <span>{selectedServiceData?.name || "Seçilmedi"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tarih:</span>
                    <span>{selectedDate?.toLocaleDateString("tr-TR") || "Seçilmedi"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saat:</span>
                    <span>{selectedTime || "Seçilmedi"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Süre:</span>
                    <span>{selectedServiceData?.duration ? `${selectedServiceData.duration} dk` : "-"}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Fiyat:</span>
                    <span>{selectedServiceData?.price ? `₺${selectedServiceData.price}` : "-"}</span>
                  </div>
                </div>

                {submitMessage && (
                  <div
                    className={`mt-4 text-center p-3 rounded-md ${
                      submitMessage.includes("başarıyla")
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    }`}
                  >
                    {submitMessage}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full mt-6"
                  disabled={
                    !selectedService ||
                    !selectedDate ||
                    !selectedTime ||
                    !formData.firstName ||
                    !formData.phone ||
                    isSubmitting
                  }
                >
                  {isSubmitting ? "Randevu oluşturuluyor..." : "Randevuyu Onayla"}
                </Button>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  )
}
