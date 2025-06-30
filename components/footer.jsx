import Link from "next/link"
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter } from "lucide-react"

// JSON Data for Footer
const footerData = {
  company: {
    name: "Güzellik Salonu",
    description:
      "15 yıllık deneyimimizle güzelliğinize değer katıyoruz. Profesyonel ekibimiz ve kaliteli hizmetlerimizle size özel çözümler sunuyoruz.",
  },
  contact: {
    address: "Güzellik Caddesi No: 123, Merkez/İstanbul",
    phone: "+90 212 555 0123",
    email: "info@guzelliksalonu.com",
    hours: "Pazartesi - Cumartesi: 09:00 - 19:00",
  },
  quickLinks: [
    { name: "Ana Sayfa", href: "/" },
    { name: "Hizmetler", href: "/hizmetler" },
    { name: "Galeri", href: "/galeri" },
    { name: "Hakkımızda", href: "/hakkimizda" },
    { name: "İletişim", href: "/iletisim" },
    { name: "Randevu Al", href: "/randevu" },
  ],
  services: [
    { name: "Cilt Bakımı", href: "/hizmetler" },
    { name: "Saç Tasarımı", href: "/hizmetler" },
    { name: "Makyaj", href: "/hizmetler" },
    { name: "Nail Art", href: "/hizmetler" },
    { name: "Keratin Bakımı", href: "/hizmetler" },
    { name: "Anti-Aging", href: "/hizmetler" },
  ],
  socialMedia: [
    { name: "Instagram", href: "https://instagram.com/guzelliksalonu", icon: Instagram },
    { name: "Facebook", href: "https://facebook.com/guzelliksalonu", icon: Facebook },
    { name: "Twitter", href: "https://twitter.com/guzelliksalonu", icon: Twitter },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full"></div>
              <span className="font-bold text-xl">{footerData.company.name}</span>
            </div>
            <p className="text-sm text-muted-foreground">{footerData.company.description}</p>
            <div className="flex space-x-4">
              {footerData.socialMedia.map((social) => {
                const IconComponent = social.icon
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <IconComponent className="w-5 h-5" />
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Hızlı Linkler</h3>
            <ul className="space-y-2">
              {footerData.quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Hizmetlerimiz</h3>
            <ul className="space-y-2">
              {footerData.services.map((service) => (
                <li key={service.name}>
                  <Link
                    href={service.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">İletişim</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">{footerData.contact.address}</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <Link
                  href={`tel:${footerData.contact.phone}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {footerData.contact.phone}
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <Link
                  href={`mailto:${footerData.contact.email}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {footerData.contact.email}
                </Link>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">{footerData.contact.hours}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">© 2024 {footerData.company.name}. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  )
}
