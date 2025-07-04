"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, Phone } from "lucide-react"
import Link from "next/link"
import NextImage from "next/image"
import Image from "next/image"
import ServiceImage from "@/components/ui/service-image"
import { getServices } from "@/lib/actions/services"
import { getCompanyInfo } from "@/lib/actions/settings"
import { useEffect, useState } from "react"
import Script from "next/script"

// Static data that doesn't change often
const heroData = {
  title: "Güzelliğinizi Keşfedin",
  subtitle: "Profesyonel güzellik hizmetleri ile kendinizi özel hissedin",
  description:
    "Modern teknikler ve deneyimli uzmanlarımızla güzelliğinizi ortaya çıkarın. Size özel bakım programları ile mükemmel sonuçlar elde edin.",
  ctaText: "İletişime Geç",
  ctaSecondary: "Hizmetlerimizi Keşfedin",
}

const testimonialsData = [
  {
    id: 1,
    name: "Ayşe Demir",
    rating: 5,
    comment: "Harika bir deneyim yaşadım. Personel çok profesyonel ve ilgili. Kesinlikle tavsiye ederim!",
    service: "Cilt Bakımı",
  },
  {
    id: 2,
    name: "Elif Kaya",
    rating: 5,
    comment: "Saçlarım hiç bu kadar güzel görünmemişti. Çok memnun kaldım, tekrar geleceğim.",
    service: "Saç Tasarımı",
  },
  {
    id: 3,
    name: "Zeynep Özkan",
    rating: 5,
    comment: "Düğünüm için yaptırdığım makyaj mükemmeldi. Tüm gün boyunca bozulmadı.",
    service: "Makyaj",
  },
]

const statsData = [
  { label: "Mutlu Müşteri", value: "1000+" },
  { label: "Yıllık Deneyim", value: "15+" },
  { label: "Uzman Personel", value: "8" },
  { label: "Hizmet Çeşidi", value: "25+" },
]

export default function HomePage() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [companyInfo, setCompanyInfo] = useState({
    name: "Güzellik Salonu",
    phone: "+90 212 555 0123",
    image: "",
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load services
        const servicesData = await getServices()
        console.log("Homepage services loaded:", servicesData)
        setServices(servicesData)
        
        // Load company info
        const info = await getCompanyInfo()
        setCompanyInfo(info)
      } catch (error) {
        console.error("Data loading error:", error)
        // Set empty array if database is not available
        setServices([])
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  const featuredServices = services.slice(0, 4) // Show first 4 services

  // Breadcrumb structured data
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Ana Sayfa",
        "item": process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3050'
      }
    ]
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Script
        id="breadcrumb-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-background via-background to-muted py-20 lg:py-8">
        <div className="flex justify-center items-center mb-10">
          <Image
            src="/cankayaLogo.jpg"
            alt="Güzellik Salonu"
            width={500}
            height={600}
            className="rounded-2xl shadow-2xl scale-down"
          />
        </div>
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  Premium Güzellik Salonu
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">{heroData.title}</h1>
                <p className="text-xl text-muted-foreground">{heroData.subtitle}</p>
                <p className="text-muted-foreground">{heroData.description}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="text-lg px-8">
                  <Link href="/iletisim">{heroData.ctaText}</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                  <Link href="/hizmetler">{heroData.ctaSecondary}</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <NextImage
                src="/CankayaMain.jpg"
                alt="Güzellik Salonu"
                width={500}
                height={600}
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {statsData.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Hizmetlerimiz</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Size özel güzellik hizmetlerimizle kendinizi şımartın
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredServices.map((service, index) => (
              <Card key={service._id} className="group hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  {service.image ? (
                    <ServiceImage
                      serviceId={service._id}
                      serviceName={service.name}
                      priority={index === 0}
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
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="mb-2">{service.name}</CardTitle>
                  <CardDescription className="mb-4">{service.description}</CardDescription>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {service.duration} dk
                    </div>
                    <div className="font-semibold text-primary">₺{service.price}</div>
                  </div>
                  <Button className="w-full" asChild>
                    <Link href={`tel:${companyInfo.phone.replace(/\s/g, "")}`}>Randevu Al</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Müşteri Yorumları</h2>
            <p className="text-xl text-muted-foreground">Müşterilerimizin deneyimlerini keşfedin</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonialsData.map((testimonial) => (
              <Card key={testimonial.id}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.comment}"</p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.service}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-primary rounded-2xl p-12 text-center text-primary-foreground">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Randevunuzu Hemen Alın</h2>
            <p className="text-xl mb-8 opacity-90">Size özel güzellik deneyimi için bugün randevu alın</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
              >
                <Link href="/iletisim">
                  <Phone className="w-5 h-5 mr-2" />
                  Hemen Ara
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  )
}
