"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getGallery } from "@/lib/actions/gallery"
import Link from "next/link"

export default function GaleriPage() {
  const [categories, setCategories] = useState({})
  // Kategorilere göre grupla
  
  useEffect(() => {
    const fetchGallery = async () => {
      const galleryData = await getGallery()
      const categoriesData = {}
      for (const item of galleryData) {
        if (!categoriesData[item.category]) categoriesData[item.category] = []
        categoriesData[item.category].push(item)
      }
      setCategories(categoriesData)
    }
    fetchGallery()
    
  }, [])
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Galeri</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Çalışmalarımızdan örnekler ve salon atmosferimizi keşfedin</p>
        </div>

        {/* Gallery Categories */}
        {Object.entries(categories).map(([catName, images]) => (
          <div key={catName} className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">{catName}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((item) => (
                <Card key={item.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden">
                      <Image
                        key={`${item.id}-${item.picture}`}
                        src={`/api/gallery/${item._id}?t=${item.updatedAt || item.createdAt}` || "/placeholder.svg"}
                        alt={item.title}
                        width={100}
                        height={100}
                        className="w-full aspect-square scale-down group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                        <div className="p-4 text-white">
                          <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {item.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {/* CTA Section */}
        <div className="bg-primary rounded-2xl p-12 text-center text-primary-foreground">
          <h2 className="text-3xl font-bold mb-4">Siz de Bu Güzelliği Yaşayın</h2>
          <p className="text-lg mb-8 opacity-90">
            Profesyonel ekibimizle size özel güzellik deneyimi için randevu alın
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="border border-primary-foreground text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary-foreground hover:text-primary transition-colors">
              <Link href={`/iletisim`}>İletişime Geç</Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
