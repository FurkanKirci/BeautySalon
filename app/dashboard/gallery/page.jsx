"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Star, StarOff, ImageIcon } from "lucide-react"
import {
  getGallery,
  addGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  toggleFeaturedImage,
} from "@/lib/actions/gallery"
import { ImageUpload } from "@/components/image-upload"
import Image from "next/image"

const categories = ["Saç Tasarımları", "Makyaj Çalışmaları", "Cilt Bakımı", "Salon Atmosferi", "Tırnak Bakımı", "Diğer"]

export default function GalleryDashboardPage() {
  const [gallery, setGallery] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingImage, setEditingImage] = useState(null)
  const [currentImage, setCurrentImage] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [imageVersion, setImageVersion] = useState(0)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    imageUrl: "",
  })

  useEffect(() => {
    loadGallery()
  }, [])

  const loadGallery = async () => {
    try {
      const data = await getGallery()
      // Force re-render by creating new array
      setGallery([...data])
    } catch (error) {
      console.error("Gallery loading error:", error)
    } finally {
      setLoading(false)
    }
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
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (editingImage) {
        await updateGalleryImage(editingImage._id, { ...formData, imageFile })
      } else {
        await addGalleryImage({ ...formData, imageFile })
      }

      // Daha uzun bir gecikme ve force reload
      setTimeout(async () => {
        setImageVersion(prev => prev + 1) // Force image refresh with increment
        await loadGallery()
        resetForm()
      }, 500)
    } catch (error) {
      console.error("Gallery save error:", error)
    }
  }

  const handleEdit = (image) => {
    setEditingImage(image)
    console.log(image)
    if (image.picture) {
      const imageUrl = `/api/gallery/${image._id}?v=${image._id}`
      setCurrentImage(imageUrl)
    } else {
      setCurrentImage(null)
    }
    setFormData({
      title: image.title,
      description: image.description || "",
      category: image.category,
      imageUrl: image.imageUrl,
    })
    setShowForm(true)
  }

  const handleDelete = async (imageId) => {
    if (confirm("Bu fotoğrafı silmek istediğinizden emin misiniz?")) {
      try {
        await deleteGalleryImage(imageId)
        await loadGallery()
      } catch (error) {
        console.error("Gallery delete error:", error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      imageUrl: "",
    })
    setImageFile(null)
    setCurrentImage(null)
    setEditingImage(null)
    setShowForm(false)
    
    // Force re-render of gallery items to show updated images
    setTimeout(() => {
      loadGallery()
    }, 200)
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
            <h1 className="text-4xl font-bold mb-2">Galeri Yönetimi</h1>
            <p className="text-muted-foreground">Salon fotoğraflarını yönetin</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Yeni Fotoğraf
          </Button>
        </div>

        {/* Gallery Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingImage ? "Fotoğraf Düzenle" : "Yeni Fotoğraf Ekle"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Başlık</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Fotoğraf başlığı"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Kategori</Label>
                    <Input
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      placeholder="Kategori"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Açıklama (Opsiyonel)</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Fotoğraf açıklaması"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Fotoğraf</Label>
                  <ImageUpload
                    onImageSave={handleImageSave}
                    currentImage={currentImage}
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit">{editingImage ? "Güncelle" : "Ekle"}</Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    İptal
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.map((image) => (
            <Card key={image._id} className="group overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  <Image
                    key={`${image._id}-${image.picture}-${imageVersion}`}
                    src={`/api/gallery/${image._id}?v=${imageVersion}` || "/placeholder.svg"}
                    alt={image.title}
                    width={300}
                    height={400}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                    <Button size="sm" variant="secondary" onClick={() => handleEdit(image)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(image._id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg truncate">{image.title}</h3>
                  </div>
                  <Badge variant="secondary" className="text-xs mb-2">
                    {image.category}
                  </Badge>
                  {image.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{image.description}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {gallery.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Henüz fotoğraf yok</h3>
              <p className="text-muted-foreground mb-6">Galerinize ilk fotoğrafı ekleyerek başlayın</p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                İlk Fotoğrafı Ekle
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
