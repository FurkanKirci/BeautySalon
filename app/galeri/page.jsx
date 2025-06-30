import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// JSON Data for Gallery
const galleryData = {
  title: "Galeri",
  subtitle: "Çalışmalarımızdan örnekler ve salon atmosferimizi keşfedin",
  categories: [
    {
      id: 1,
      name: "Saç Tasarımları",
      images: [
        {
          id: 1,
          src: "/placeholder.svg?height=400&width=300",
          alt: "Modern Bob Kesim",
          title: "Modern Bob Kesim",
          category: "Saç Kesimi",
        },
        {
          id: 2,
          src: "/placeholder.svg?height=400&width=300",
          alt: "Ombre Boyama",
          title: "Ombre Boyama",
          category: "Saç Boyama",
        },
        {
          id: 3,
          src: "/placeholder.svg?height=400&width=300",
          alt: "Keratin Uygulaması",
          title: "Keratin Uygulaması",
          category: "Saç Bakımı",
        },
      ],
    },
    {
      id: 2,
      name: "Makyaj Çalışmaları",
      images: [
        {
          id: 4,
          src: "/placeholder.svg?height=400&width=300",
          alt: "Gelin Makyajı",
          title: "Gelin Makyajı",
          category: "Özel Gün",
        },
        {
          id: 5,
          src: "/placeholder.svg?height=400&width=300",
          alt: "Gece Makyajı",
          title: "Gece Makyajı",
          category: "Gece",
        },
        {
          id: 6,
          src: "/placeholder.svg?height=400&width=300",
          alt: "Doğal Makyaj",
          title: "Doğal Makyaj",
          category: "Günlük",
        },
      ],
    },
    {
      id: 3,
      name: "Cilt Bakımı",
      images: [
        {
          id: 7,
          src: "/placeholder.svg?height=400&width=300",
          alt: "Cilt Bakım Seansı",
          title: "Cilt Bakım Seansı",
          category: "Bakım",
        },
        {
          id: 8,
          src: "/placeholder.svg?height=400&width=300",
          alt: "Anti-Aging Tedavi",
          title: "Anti-Aging Tedavi",
          category: "Tedavi",
        },
        {
          id: 9,
          src: "/placeholder.svg?height=400&width=300",
          alt: "Yüz Maskesi",
          title: "Yüz Maskesi",
          category: "Bakım",
        },
      ],
    },
    {
      id: 4,
      name: "Salon Atmosferi",
      images: [
        {
          id: 10,
          src: "/placeholder.svg?height=400&width=300",
          alt: "Resepsiyon Alanı",
          title: "Resepsiyon Alanı",
          category: "Salon",
        },
        {
          id: 11,
          src: "/placeholder.svg?height=400&width=300",
          alt: "Saç Bakım Bölümü",
          title: "Saç Bakım Bölümü",
          category: "Salon",
        },
        {
          id: 12,
          src: "/placeholder.svg?height=400&width=300",
          alt: "Cilt Bakım Odası",
          title: "Cilt Bakım Odası",
          category: "Salon",
        },
      ],
    },
  ],
}

export default function GaleriPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">{galleryData.title}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{galleryData.subtitle}</p>
        </div>

        {/* Gallery Categories */}
        {galleryData.categories.map((category) => (
          <div key={category.id} className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">{category.name}</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.images.map((image) => (
                <Card key={image.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden">
                      <Image
                        src={image.src || "/placeholder.svg"}
                        alt={image.alt}
                        width={300}
                        height={400}
                        className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                        <div className="p-4 text-white">
                          <h3 className="font-semibold text-lg mb-1">{image.title}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {image.category}
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
            <button className="bg-primary-foreground text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary-foreground/90 transition-colors">
              Randevu Al
            </button>
            <button className="border border-primary-foreground text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary-foreground hover:text-primary transition-colors">
              İletişime Geç
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
