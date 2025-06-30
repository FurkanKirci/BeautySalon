"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, MessageSquare, Star, Clock, Phone, Mail, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import { getDashboardStats } from "@/lib/actions/dashboard"
import { getRecentAppointments } from "@/lib/actions/appointments"
import { getRecentMessages } from "@/lib/actions/contact"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/image-upload"

const GALLERY_CATEGORIES = [
  "Saç Tasarımları",
  "Makyaj Çalışmaları",
  "Cilt Bakımı",
  "Salon Atmosferi",
]

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [recentAppointments, setRecentAppointments] = useState([])
  const [recentMessages, setRecentMessages] = useState([])
  const [loading, setLoading] = useState(true)

  // Galeri ekleme modalı için state
  const [galleryModalOpen, setGalleryModalOpen] = useState(false)
  const [galleryImages, setGalleryImages] = useState([])
  const [galleryForm, setGalleryForm] = useState({
    category: GALLERY_CATEGORIES[0],
    title: "",
    description: "",
    image: null,
  })
  const [galleryFormLoading, setGalleryFormLoading] = useState(false)

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

  const handleGalleryFormChange = (e) => {
    const { name, value } = e.target
    setGalleryForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleGalleryImageSave = (file) => {
    setGalleryForm((prev) => ({ ...prev, image: file }))
  }

  const handleGalleryFormSubmit = async (e) => {
    e.preventDefault()
    setGalleryFormLoading(true)
    // Burada backend'e gönderme işlemi yapılabilir
    setTimeout(() => {
      setGalleryImages((prev) => [
        {
          ...galleryForm,
          id: Date.now(),
          imageUrl: galleryForm.image ? URL.createObjectURL(galleryForm.image) : null,
        },
        ...prev,
      ])
      setGalleryForm({
        category: GALLERY_CATEGORIES[0],
        title: "",
        description: "",
        image: null,
      })
      setGalleryModalOpen(false)
      setGalleryFormLoading(false)
    }, 1000)
  }

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
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Salon yönetim paneline hoş geldiniz</p>
          </div>
        </div>

        {/* Galeriye eklenen fotoğraflar */}
        {galleryImages.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Galeri (Yeni Eklenenler)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {galleryImages.map((img) => (
                <Card key={img.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    {img.imageUrl && (
                      <img src={img.imageUrl} alt={img.title} className="w-full h-48 object-cover" />
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-1">{img.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{img.description}</p>
                      <Badge variant="secondary">{img.category}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-black dark:bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white dark:text-black">Toplam Galeri</CardTitle>
              <ImageIcon className="h-4 w-4 text-gray-400 dark:text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white dark:text-black">{stats?.totalGallery || 0}</div>
              <p className="text-xs text-gray-400 dark:text-gray-600">Toplam galeri fotoğrafı</p>
            </CardContent>
          </Card>

          <Card className="bg-black dark:bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white dark:text-black">Aktif Hizmetler</CardTitle>
              <Star className="h-4 w-4 text-gray-400 dark:text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white dark:text-black">{stats?.totalServices || 0}</div>
              <p className="text-xs text-gray-400 dark:text-gray-600">Toplam hizmet sayısı</p>
            </CardContent>
          </Card>

          <Card className="bg-black dark:bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white dark:text-black">Uzmanlar</CardTitle>
              <Users className="h-4 w-4 text-gray-400 dark:text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white dark:text-black">{stats?.totalSpecialists || 0}</div>
              <p className="text-xs text-gray-400 dark:text-gray-600">Aktif uzman sayısı</p>
            </CardContent>
          </Card>

          <Card className="bg-black dark:bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white dark:text-black">Mesajlar</CardTitle>
              <MessageSquare className="h-4 w-4 text-gray-400 dark:text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white dark:text-black">{stats?.totalMessages || 0}</div>
              <p className="text-xs text-gray-400 dark:text-gray-600">+{stats?.newMessagesThisWeek || 0} bu hafta</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Button asChild variant="outline" className="h-auto p-4 bg-transparent">
            <Link href="/galeri" className="flex flex-col items-center gap-2">
              <ImageIcon className="h-6 w-6" />
              <span>Galeri</span>
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
