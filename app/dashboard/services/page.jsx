"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Clock, DollarSign } from "lucide-react"
import { getServices, createService, updateService, deleteService } from "@/lib/actions/services"
import { getSettings } from "@/lib/actions/settings"
import { ImageUpload } from "@/components/image-upload"
import ServiceImage from "@/components/ui/service-image"
import Image from "next/image"

export default function ServicesPage() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: "",
    price: "",
    category: "",
  })
  const [imageFile, setImageFile] = useState(null)
  const [currentImage, setCurrentImage] = useState(null)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    loadServices()
    async function fetchCategories() {
      const settings = await getSettings()
      setCategories(settings?.serviceCategories || [])
    }
    fetchCategories()
  }, [])

  const loadServices = async () => {
    try {
      const data = await getServices()
      console.log(data)
      setServices(data)
    } catch (error) {
      console.error("Services loading error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageSave = (file) => {
    setImageFile(file)
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setCurrentImage(reader.result)
      }
      reader.readAsDataURL(file)
    } else {
      setCurrentImage(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const serviceData = {
        ...formData,
        duration: Number.parseInt(formData.duration),
        price: Number.parseFloat(formData.price),
        imageFile: imageFile,
      }

      if (editingService) {
        await updateService(editingService._id, serviceData)
      } else {
        await createService(serviceData)
      }

      // Kısa bir gecikme ile cache'in temizlenmesini sağla
      setTimeout(async () => {
        await loadServices()
        resetForm()
      }, 500)
    } catch (error) {
      console.error("Service save error:", error)
    }
  }

  const handleEdit = (service) => {
    setEditingService(service)
    setFormData({
      name: service.name,
      description: service.description,
      duration: service.duration.toString(),
      price: service.price.toString(),
      category: service.category,
    })

    if (service.image) {
      // Use service ID for cache busting instead of timestamp
      const imageUrl = `/api/service-image/${service._id}?v=${service._id}`
      setCurrentImage(imageUrl)
    } else {
      setCurrentImage(null)
    }
    setImageFile(null)

    setShowForm(true)
  }

  const handleDelete = async (serviceId) => {
    if (confirm("Bu hizmeti silmek istediğinizden emin misiniz?")) {
      try {
        await deleteService(serviceId)
        await loadServices()
      } catch (error) {
        console.error("Service delete error:", error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      duration: "",
      price: "",
      category: "",
    })
    setEditingService(null)
    setShowForm(false)
    setImageFile(null)
    setCurrentImage(null)
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
            <h1 className="text-4xl font-bold mb-2">Hizmetler</h1>
            <p className="text-muted-foreground">Salon hizmetlerini yönetin</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Yeni Hizmet
          </Button>
        </div>

        {/* Service Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingService ? "Hizmet Düzenle" : "Yeni Hizmet Ekle"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Hizmet Adı</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Kategori</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Kategori seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Açıklama</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Süre (dakika)</Label>
                    <Input
                      id="duration"
                      name="duration"
                      type="number"
                      value={formData.duration}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Fiyat (₺)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    Hizmet Fotoğrafı (İsteğe bağlı)
                  </Label>
                  <ImageUpload
                    key={`${editingService?._id || 'new'}-${currentImage ? 'has-image' : 'no-image'}`}
                    onImageSave={handleImageSave}
                    currentImage={currentImage}
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit">{editingService ? "Güncelle" : "Ekle"}</Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    İptal
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Services List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service._id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <Badge variant="secondary" className="mt-1">
                      {service.category}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(service)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(service._id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  {service.image ? (
                    <ServiceImage
                      key={`${service._id}-${service.image}`}
                      serviceId={service._id}
                      serviceName={service.name}
                      className="w-full h-48 scale-down rounded-t-lg"
                    />
                  ) : (
                    <Image
                      src="/placeholder.svg"
                      alt="Güzellik Salonu"
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  )}
                </div>

                <CardDescription className="mb-4">{service.description}</CardDescription>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {service.duration} dk
                  </div>
                  <div className="flex items-center gap-1 font-semibold text-primary">
                    <DollarSign className="w-4 h-4" />₺{service.price}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {services.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">Henüz hizmet eklenmemiş</p>
              <Button className="mt-4" onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                İlk Hizmeti Ekle
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
