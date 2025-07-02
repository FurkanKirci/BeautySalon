import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, Users, Clock, Heart } from "lucide-react"
import Image from "next/image"
import { getSpecialists } from "@/lib/actions/specialists"

// Force dynamic rendering to avoid build-time database calls
export const dynamic = 'force-dynamic'

// Static data that doesn't change often
const aboutData = {
  hero: {
    title: "Hakkımızda",
    subtitle: "15 yıllık deneyimimizle güzelliğinize değer katıyoruz",
    description:
      "2009 yılından bu yana müşterilerimize en kaliteli güzellik hizmetlerini sunuyoruz. Deneyimli ekibimiz ve modern teknolojilerimizle size özel çözümler üretiyoruz.",
  },
  story: {
    title: "Hikayemiz",
    content:
      "Güzellik salonumuz, güzelliğin sadece dış görünüş değil, aynı zamanda kendinizi iyi hissetmek olduğu inancıyla kuruldu. Yıllar boyunca binlerce müşterimize hizmet vererek, onların güzelliklerini ortaya çıkarmalarına yardımcı olduk. Her müşterimizi özel hissettirmek ve beklentilerini aşmak bizim en büyük motivasyonumuz.",
    image: "/placeholder.svg?height=400&width=600",
  },
  values: [
    {
      id: 1,
      icon: Heart,
      title: "Müşteri Memnuniyeti",
      description: "Her müşterimizin memnuniyeti bizim için en önemli önceliktir",
    },
    {
      id: 2,
      icon: Award,
      title: "Kalite",
      description: "Sadece en kaliteli ürünler ve hizmetler sunuyoruz",
    },
    {
      id: 3,
      icon: Users,
      title: "Profesyonellik",
      description: "Deneyimli ve sertifikalı uzmanlarımızla hizmet veriyoruz",
    },
    {
      id: 4,
      icon: Clock,
      title: "Güvenilirlik",
      description: "15 yıllık deneyimimizle güvenilir hizmet sunuyoruz",
    },
  ],
  stats: [
    { label: "Yıllık Deneyim", value: "15+" },
    { label: "Mutlu Müşteri", value: "1000+" },
    { label: "Uzman Personel", value: "8" },
    { label: "Ödül", value: "5" },
  ],
}

export default async function HakkimizdaPage() {
  // Get team members from database with error handling
  let team = []
  try {
    team = await getSpecialists()
  } catch (error) {
    console.error("Error loading specialists:", error)
    // Return empty array if database is not available
    team = []
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">{aboutData.hero.title}</h1>
          <p className="text-xl text-muted-foreground mb-6">{aboutData.hero.subtitle}</p>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{aboutData.hero.description}</p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {aboutData.stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Story Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold mb-6">{aboutData.story.title}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">{aboutData.story.content}</p>
          </div>
          <div>
            <Image
              src={"/cankayaService.jpg"}
              alt="Salon Hikayesi"
              width={600}
              height={400}
              className="rounded-2xl shadow-lg"
            />
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Değerlerimiz</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {aboutData.values.map((value) => {
              const IconComponent = value.icon
              return (
                <Card key={value.id} className="text-center p-6">
                  <CardContent className="space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Ekibimiz</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member) => (
              <Card key={member.id} className="text-center">
                <CardContent className="p-6">
                  <Image
                    src="/placeholder.svg?height=300&width=300"
                    alt={member.name}
                    width={300}
                    height={300}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <p className="text-primary font-medium mb-2">{member.speciality}</p>
                  <div className="flex justify-center gap-2 mb-4">
                    {member.experienceYears && <Badge variant="secondary">{member.experienceYears} yıl</Badge>}
                    <Badge variant="outline">{member.speciality}</Badge>
                  </div>
                  {member.bio && <p className="text-sm text-muted-foreground">{member.bio}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-muted rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Bizimle Tanışın</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Salonumuzu ziyaret edin ve ekibimizle tanışın. Size özel hizmet sunmaktan mutluluk duyarız.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="border border-input bg-background px-8 py-3 rounded-lg font-semibold hover:bg-accent transition-colors">
              İletişime Geç
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
