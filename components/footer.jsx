"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter } from "lucide-react"
import { getCompanyInfo, getContactInfo } from "@/lib/actions/settings"
import { getServices } from "@/lib/actions/services"

export default function Footer() {
  const [companyInfo, setCompanyInfo] = useState(null)
  const [contactInfo, setContactInfo] = useState(null)
  const [services, setServices] = useState([])

  useEffect(() => {
    const loadFooterData = async () => {
      try {
        const [company, contact, servicesData] = await Promise.all([getCompanyInfo(), getContactInfo(), getServices()])
        setCompanyInfo(company)
        setContactInfo(contact)
        setServices(servicesData.slice(0, 6)) // Show first 6 services
      } catch (error) {
        console.error("Footer data loading error:", error)
      }
    }
    loadFooterData()
  }, [])

  const quickLinks = [
    { name: "Ana Sayfa", href: "/" },
    { name: "Hizmetler", href: "/hizmetler" },
    { name: "Galeri", href: "/galeri" },
    { name: "Hakkımızda", href: "/hakkimizda" },
    { name: "İletişim", href: "/iletisim" },
    { name: "Randevu Al", href: "/randevu" },
  ]

  const socialMediaIcons = [
    { name: "Instagram", icon: Instagram, url: contactInfo?.socialMedia?.instagram },
    { name: "Facebook", icon: Facebook, url: contactInfo?.socialMedia?.facebook },
    { name: "Twitter", icon: Twitter, url: contactInfo?.socialMedia?.twitter },
  ]

  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              {companyInfo?.image ? (
                <Image
                  src={`/cankayaLogo.jpg`}
                  alt={companyInfo.name}
                  height={32}
                  width={0}
                  style={{
                    width: "230px",
                    height: "40px",
                  }}
                  className=""
                />
              ) : (
                <div className="w-8 h-8 bg-primary rounded-full"></div>
              )}
              <span className="font-bold text-xl">{companyInfo?.name || ""}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {companyInfo?.description ||
                "15 yıllık deneyimimizle güzelliğinize değer katıyoruz. Profesyonel ekibimiz ve kaliteli hizmetlerimizle size özel çözümler sunuyoruz."}
            </p>
            <div className="flex space-x-4">
              {socialMediaIcons.map((social) => {
                const IconComponent = social.icon
                if (!social.url) return null
                return (
                  <Link
                    key={social.name}
                    href={social.url}
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
              {quickLinks.map((link) => (
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
              {services.map((service) => (
                <li key={service.id}>
                  <Link
                    href="/hizmetler"
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
                <p className="text-sm text-muted-foreground">
                  {contactInfo?.address || "Güzellik Caddesi No: 123, Merkez/İstanbul"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <Link
                  href={`tel:${contactInfo?.phone?.replace(/\s/g, "") || "+902125550123"}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {contactInfo?.phone || "+90 212 555 0123"}
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <Link
                  href={`mailto:${contactInfo?.email || "info@guzelliksalonu.com"}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {contactInfo?.email || "info@guzelliksalonu.com"}
                </Link>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  {contactInfo?.workingHours || "Pazartesi - Cumartesi: 09:00 - 19:00"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 <Link href="https://www.pengona.com" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Pengona.com</Link> Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  )
}
