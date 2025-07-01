"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Instagram, Facebook, Twitter, Building } from "lucide-react"
import { getSettings, updateSettings } from "@/lib/actions/settings"
import { ImageUpload } from "@/components/image-upload"
import { uploadCompanyIcon } from "@/lib/actions/upload"

export default function SettingsPage() {
  const [settings, setSettings] = useState(null)
  const [currentImage, setCurrentImage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [formData, setFormData] = useState({
    // Company Info
    companyName: "",
    companyDescription: "",
    companyImage: "",

    // Contact Info
    address: "",
    phone: "",
    email: "",
    workingHours: "",
    googleMapsUrl: "",

    // Social Media
    instagramUrl: "",
    facebookUrl: "",
    twitterUrl: "",
    icon: ""
  })
  const [categories, setCategories] = useState([])
  const [newCategory, setNewCategory] = useState("")

  useEffect(() => {
    loadSettings()
  }, [])
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
  const loadSettings = async () => {
    try {
      const data = await getSettings()
      if (data) {
        setSettings(data)
        setFormData({
          companyName: data.companyName || "",
          companyDescription: data.companyDescription || "",
          companyImage: data.companyImage || "",
          address: data.address || "",
          phone: data.phone || "",
          email: data.email || "",
          workingHours: data.workingHours || "",
          googleMapsUrl: data.googleMapsUrl || "",
          instagramUrl: data.instagramUrl || "",
          facebookUrl: data.facebookUrl || "",
          twitterUrl: data.twitterUrl || "",
          icon: data.icon || ""
        })
        setCategories(data.serviceCategories || [])
      }
    } catch (error) {
      console.error("Settings loading error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory])
      setNewCategory("")
    }
  }

  const handleRemoveCategory = (cat) => {
    setCategories(categories.filter((c) => c !== cat))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage("")

    try {
      let iconUrl = formData.icon
      if (imageFile && settings?._id) {
        const uploadResult = await uploadCompanyIcon(imageFile, settings._id)
        if (uploadResult.success) {
          iconUrl = uploadResult.fileName
        }
      }
      const result = await updateSettings({ ...formData, icon: iconUrl, serviceCategories: categories })
      if (result.success) {
        setMessage("Ayarlar başarıyla güncellendi!")
        await loadSettings()
      } else {
        setMessage("Ayarlar güncellenirken bir hata oluştu.")
      }
    } catch (error) {
      console.error("Settings save error:", error)
      setMessage("Bir hata oluştu. Lütfen tekrar deneyin.")
    } finally {
      setSaving(false)
    }
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
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Uygulama Ayarları</h1>
          <p className="text-muted-foreground">Salon bilgilerini ve iletişim ayarlarını yönetin</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Şirket Bilgileri
              </CardTitle>
              <CardDescription>Salon hakkında genel bilgiler</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Şirket Adı</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="Güzellik Salonu"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyDescription">Şirket Açıklaması</Label>
                <Textarea
                  id="companyDescription"
                  name="companyDescription"
                  value={formData.companyDescription}
                  onChange={handleInputChange}
                  placeholder="15 yıllık deneyimimizle güzelliğinize değer katıyoruz..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Şirket Logosu/Fotoğrafı</Label>
                <ImageUpload
                    onImageSave={handleImageSave}
                    currentImage={currentImage}
                  />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                İletişim Bilgileri
              </CardTitle>
              <CardDescription>Müşterilerle iletişim için kullanılacak bilgiler</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+90 212 555 0123"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-posta</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="info@guzelliksalonu.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Adres</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Güzellik Caddesi No: 123, Merkez/İstanbul"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="workingHours">Çalışma Saatleri</Label>
                <Textarea
                  id="workingHours"
                  name="workingHours"
                  value={formData.workingHours}
                  onChange={handleInputChange}
                  placeholder="Pazartesi - Cumartesi: 09:00 - 19:00&#10;Pazar: 10:00 - 17:00"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="googleMapsUrl">Google Maps URL</Label>
                <Input
                  id="googleMapsUrl"
                  name="googleMapsUrl"
                  value={formData.googleMapsUrl}
                  onChange={handleInputChange}
                  placeholder="https://maps.google.com/..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Instagram className="w-5 h-5" />
                Sosyal Medya
              </CardTitle>
              <CardDescription>Sosyal medya hesap bağlantıları</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="instagramUrl" className="flex items-center gap-2">
                  <Instagram className="w-4 h-4" />
                  Instagram
                </Label>
                <Input
                  id="instagramUrl"
                  name="instagramUrl"
                  value={formData.instagramUrl}
                  onChange={handleInputChange}
                  placeholder="https://instagram.com/guzelliksalonu"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="facebookUrl" className="flex items-center gap-2">
                  <Facebook className="w-4 h-4" />
                  Facebook
                </Label>
                <Input
                  id="facebookUrl"
                  name="facebookUrl"
                  value={formData.facebookUrl}
                  onChange={handleInputChange}
                  placeholder="https://facebook.com/guzelliksalonu"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitterUrl" className="flex items-center gap-2">
                  <Twitter className="w-4 h-4" />
                  Twitter
                </Label>
                <Input
                  id="twitterUrl"
                  name="twitterUrl"
                  value={formData.twitterUrl}
                  onChange={handleInputChange}
                  placeholder="https://twitter.com/guzelliksalonu"
                />
              </div>
            </CardContent>
          </Card>

          {/* Service Categories Management */}
          <Card>
            <CardHeader>
              <CardTitle>Hizmet Kategorileri</CardTitle>
              <CardDescription>Hizmet kategorilerini ekleyin veya çıkarın</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Yeni kategori"
                />
                <Button type="button" onClick={handleAddCategory}>Ekle</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <span key={cat} className="flex items-center gap-1 bg-gray-200 px-2 py-1 rounded">
                    {cat}
                    <Button type="button" size="xs" variant="destructive" onClick={() => handleRemoveCategory(cat)}>x</Button>
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <div className="space-y-4">
              {message && (
                <div
                  className={`text-center p-3 rounded-md ${
                    message.includes("başarıyla")
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  }`}
                >
                  {message}
                </div>
              )}
              <Button type="submit" disabled={saving} className="min-w-32">
                {saving ? "Kaydediliyor..." : "Ayarları Kaydet"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
