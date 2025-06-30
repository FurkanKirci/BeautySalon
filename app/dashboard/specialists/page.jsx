"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Mail, Phone, User } from "lucide-react"
import { getSpecialists, createSpecialist, updateSpecialist, deleteSpecialist } from "@/lib/actions/specialists"

export default function SpecialistsPage() {
  const [specialists, setSpecialists] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingSpecialist, setEditingSpecialist] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    speciality: "",
    email: "",
    phone: "",
    bio: "",
    experienceYears: "",
  })

  useEffect(() => {
    loadSpecialists()
  }, [])

  const loadSpecialists = async () => {
    try {
      const data = await getSpecialists()
      setSpecialists(data)
    } catch (error) {
      console.error("Specialists loading error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const specialistData = {
        ...formData,
        experienceYears: Number.parseInt(formData.experienceYears) || 0,
      }

      if (editingSpecialist) {
        await updateSpecialist(editingSpecialist._id, specialistData)
      } else {
        await createSpecialist(specialistData)
      }

      await loadSpecialists()
      resetForm()
    } catch (error) {
      console.error("Specialist save error:", error)
    }
  }

  const handleEdit = (specialist) => {
    setEditingSpecialist(specialist)
    setFormData({
      name: specialist.name,
      speciality: specialist.speciality,
      email: specialist.email || "",
      phone: specialist.phone || "",
      bio: specialist.bio || "",
      experienceYears: specialist.experienceYears?.toString() || "",
    })
    setShowForm(true)
  }

  const handleDelete = async (specialistId) => {
    if (confirm("Bu uzmanı silmek istediğinizden emin misiniz?")) {
      try {
        await deleteSpecialist(specialistId)
        await loadSpecialists()
      } catch (error) {
        console.error("Specialist delete error:", error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      speciality: "",
      email: "",
      phone: "",
      bio: "",
      experienceYears: "",
    })
    setEditingSpecialist(null)
    setShowForm(false)
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Uzmanlar</h1>
            <p className="text-muted-foreground">Salon uzmanlarını yönetin</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Yeni Uzman
          </Button>
        </div>

        {/* Specialist Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingSpecialist ? "Uzman Düzenle" : "Yeni Uzman Ekle"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Ad Soyad</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="speciality">Uzmanlık Alanı</Label>
                    <Input
                      id="speciality"
                      name="speciality"
                      value={formData.speciality}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-posta</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon</Label>
                    <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experienceYears">Deneyim (Yıl)</Label>
                  <Input
                    id="experienceYears"
                    name="experienceYears"
                    type="number"
                    value={formData.experienceYears}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Biyografi</Label>
                  <Textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} rows={3} />
                </div>

                <div className="flex gap-2">
                  <Button type="submit">{editingSpecialist ? "Güncelle" : "Ekle"}</Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    İptal
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Specialists List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialists.map((specialist) => (
            <Card key={specialist._id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{specialist.name}</CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        {specialist.speciality}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(specialist)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(specialist._id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {specialist.bio && <CardDescription className="mb-4">{specialist.bio}</CardDescription>}

                <div className="space-y-2 text-sm">
                  {specialist.email && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      {specialist.email}
                    </div>
                  )}
                  {specialist.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      {specialist.phone}
                    </div>
                  )}
                  {specialist.experienceYears && (
                    <div className="text-muted-foreground">
                      <strong>{specialist.experienceYears}</strong> yıl deneyim
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {specialists.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">Henüz uzman eklenmemiş</p>
              <Button className="mt-4" onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                İlk Uzmanı Ekle
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
