"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Instagram, Facebook, Twitter, Building, X, Plus } from "lucide-react"
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
    icon: "",
  })
  const [categories, setCategories] = useState(["Saç Bakımı", "Cilt Bakımı", "Makyaj", "Nail Art", "Masaj"])
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
          icon: data.icon || "",
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
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()])
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
                <ImageUpload onImageSave={handleImageSave} currentImage={currentImage} />
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

          {/* Service Categories Management - İYİLEŞTİRİLMİŞ BÖLÜM */}
          <Card>
            <CardHeader>
              <CardTitle>Hizmet Kategorileri</CardTitle>
              <CardDescription>Hizmet kategorilerini ekleyin veya çıkarın</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Kategori Ekleme Formu */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Yeni kategori adı girin..."
                    className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCategory())}
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleAddCategory}
                  className="px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200"
                  disabled={!newCategory.trim()}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ekle
                </Button>
              </div>

              {/* Kategoriler Listesi */}
              {categories.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground font-medium">Mevcut Kategoriler ({categories.length})</p>
                  <div className="flex flex-wrap gap-3">
                    {categories.map((cat, index) => {
                      // Her kategori için farklı renk teması
                      const colorThemes = [
                        "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border-blue-200 hover:from-blue-100 hover:to-blue-150",
                        "bg-gradient-to-r from-purple-50 to-purple-100 text-purple-800 border-purple-200 hover:from-purple-100 hover:to-purple-150",
                        "bg-gradient-to-r from-green-50 to-green-100 text-green-800 border-green-200 hover:from-green-100 hover:to-green-150",
                        "bg-gradient-to-r from-pink-50 to-pink-100 text-pink-800 border-pink-200 hover:from-pink-100 hover:to-pink-150",
                        "bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-800 border-indigo-200 hover:from-indigo-100 hover:to-indigo-150",
                        "bg-gradient-to-r from-orange-50 to-orange-100 text-orange-800 border-orange-200 hover:from-orange-100 hover:to-orange-150",
                        "bg-gradient-to-r from-teal-50 to-teal-100 text-teal-800 border-teal-200 hover:from-teal-100 hover:to-teal-150",
                      ]

                      return (
                        <div
                          key={cat}
                          className={`group relative inline-flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg ${colorThemes[index % colorThemes.length]}`}
                        >
                          <span className="text-sm font-semibold select-none leading-none">{cat}</span>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 rounded-full hover:bg-red-100 hover:text-red-600 text-current opacity-60 hover:opacity-100 transition-all duration-200 group-hover:opacity-80"
                            onClick={() => handleRemoveCategory(cat)}
                            title={`${cat} kategorisini kaldır`}
                          >
                            <X className="h-3.5 w-3.5" />
                            <span className="sr-only">{cat} kategorisini kaldır</span>
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Building className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-sm">Henüz kategori eklenmemiş</p>
                  <p className="text-xs mt-1">Yukarıdaki formu kullanarak kategori ekleyebilirsiniz</p>
                </div>
              )}
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
