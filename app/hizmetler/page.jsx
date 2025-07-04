import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getServicesByCategory } from "@/lib/actions/services"
import ServiceImage from "@/components/ui/service-image"
import { getCompanyInfo } from "@/lib/actions/settings"

export default async function HizmetlerPage() {
  const servicesByCategory = await getServicesByCategory()
  const companyInfo = await getCompanyInfo()

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Hizmetlerimiz</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Profesyonel güzellik hizmetlerimizle kendinizi özel hissedin
          </p>
        </div>

        {/* Services by Category */}
        {Object.entries(servicesByCategory).map(([categoryName, services]) => (
          <div key={categoryName} className="mb-20">
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-4">{categoryName}</h2>
              <p className="text-lg text-muted-foreground">{categoryName} alanında profesyonel hizmetlerimiz</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <Card key={service.id} className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader className="p-0">
                    {service.image ? (
                      <ServiceImage
                        serviceId={service._id}
                        serviceName={service.name}
                      />
                    ) : (
                      <Image
                        src="/placeholder.svg"
                        alt="Güzellik Salonu"
                        width={300}
                        height={200}
                        className="w-full h-48 scale-down rounded-t-lg"
                      />
                    )}
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        4.9
                      </Badge>
                    </div>
                    <CardDescription className="mb-4">{service.description}</CardDescription>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-6">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {service.duration} dk
                      </div>
                      <div className="text-lg font-bold text-primary">₺{service.price}</div>
                    </div>
                    <Button className="w-full" asChild>
                    <Link href={`tel:${companyInfo.phone.replace(/\s/g, "")}`}>Randevu Al</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {Object.keys(servicesByCategory).length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">Henüz hizmet eklenmemiş.</p>
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-muted rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Size Özel Paket Önerileri</h2>
          <p className="text-lg text-muted-foreground mb-8">
            İhtiyaçlarınıza uygun özel paketler için bizimle iletişime geçin
          </p>
          <Button asChild size="lg">
            <Link href="/iletisim">İletişime Geç</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
