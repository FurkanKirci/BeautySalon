"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter } from "lucide-react"
import { createContactMessage } from "@/lib/actions/contact"

// JSON Data for Contact Page
const contactData = {
  title: "İletişim",
  subtitle: "Bizimle iletişime geçin, size yardımcı olmaktan mutluluk duyarız",
  info: {
    address: {
      title: "Adres",
      content: "Güzellik Caddesi No: 123, Merkez/İstanbul",
      icon: MapPin,
    },
    phone: {
      title: "Telefon",
      content: "+90 212 555 0123",
      icon: Phone,
    },
    email: {
      title: "E-posta",
      content: "info@guzelliksalonu.com",
      icon: Mail,
    },
    hours: {
      title: "Çalışma Saatleri",
      content: "Pazartesi - Cumartesi: 09:00 - 19:00\nPazar: 10:00 - 17:00",
      icon: Clock,
    },
  },
  socialMedia: [
    {
      name: "Instagram",
      url: "https://instagram.com/guzelliksalonu",
      icon: Instagram,
    },
    {
      name: "Facebook",
      url: "https://facebook.com/guzelliksalonu",
      icon: Facebook,
    },
    {
      name: "Twitter",
      url: "https://twitter.com/guzelliksalonu",
      icon: Twitter,
    },
  ],
  form: {
    title: "Mesaj Gönderin",
    description: "Sorularınız için bize mesaj gönderin, en kısa sürede size dönüş yapalım",
  },
}

export default function IletisimPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage("")

    try {
      const result = await createContactMessage(formData)

      if (result.success) {
        setSubmitMessage(result.message)
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        })
      } else {
        setSubmitMessage(result.message)
      }
    } catch (error) {
      setSubmitMessage("Bir hata oluştu. Lütfen tekrar deneyin.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">{contactData.title}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{contactData.subtitle}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">İletişim Bilgileri</h2>
              <div className="space-y-6">
                {Object.entries(contactData.info).map(([key, info]) => {
                  const IconComponent = info.icon
                  return (
                    <div key={key} className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{info.title}</h3>
                        <p className="text-muted-foreground whitespace-pre-line">{info.content}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Sosyal Medya</h3>
              <div className="flex gap-4">
                {contactData.socialMedia.map((social) => {
                  const IconComponent = social.icon
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <IconComponent className="w-6 h-6" />
                    </a>
                  )
                })}
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-muted rounded-lg h-64 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Harita Görünümü</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>{contactData.form.title}</CardTitle>
                <CardDescription>{contactData.form.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-posta</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="E-posta adresiniz"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Telefon numaranız"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Konu</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Mesaj konusu"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Mesaj</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Mesajınızı buraya yazın..."
                      rows={5}
                      required
                    />
                  </div>

                  {submitMessage && (
                    <div
                      className={`text-center p-3 rounded-md ${
                        submitMessage.includes("başarıyla")
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {submitMessage}
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Gönderiliyor..." : "Mesaj Gönder"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12">Sıkça Sorulan Sorular</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Randevu nasıl alabilirim?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Telefon, WhatsApp veya online randevu sistemimiz üzerinden kolayca randevu alabilirsiniz.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Hangi ödeme yöntemlerini kabul ediyorsunuz?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Nakit, kredi kartı ve banka kartı ile ödeme yapabilirsiniz.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Randevumu iptal edebilir miyim?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Randevunuzdan en az 24 saat önce haber vererek iptal edebilirsiniz.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ürünleriniz hangi markalardan?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Sadece kaliteli ve güvenilir markaların ürünlerini kullanıyoruz.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
