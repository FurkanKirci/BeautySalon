"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, Phone, Calendar, X, User, LogOut } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

// Static navigation data
const navigationData = {
  navigation: [
    { name: "Ana Sayfa", href: "/" },
    { name: "Hizmetler", href: "/hizmetler" },
    { name: "Galeri", href: "/galeri" },
    { name: "Hakkımızda", href: "/hakkimizda" },
    { name: "İletişim", href: "/iletisim" },
  ],
  cta: {
    login: "Giriş Yap",
  },
}

export function MobileNav({ companyInfo, user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    setIsOpen(false)
    onLogout()
  }

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/50 transition-opacity lg:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-80 bg-background border-l shadow-lg transition-transform lg:hidden",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            {companyInfo?.image ? (
              <Image
              src={companyInfo.image ? `/api/company-icon/${companyInfo.image.replace(/\.(png|jpeg)$/i, '')}` : "/placeholder.svg"}
              alt={companyInfo.name}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover"
            />
            ) : (
              <div className="w-6 h-6 bg-primary rounded-full"></div>
            )}
            <h2 className="text-lg font-semibold">{companyInfo?.name || "Menü"}</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex flex-col p-4 space-y-4">
          {/* User Info Section */}
          {user && (
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Avatar className="w-10 h-10">
                <AvatarFallback>
                  {user.firstName?.charAt(0)}
                  {user.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          {navigationData.navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-lg font-medium transition-colors hover:text-primary py-2"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}

          <div className="border-t pt-4 space-y-4">

            {/* User Actions */}
            {user ? (
              <div className="space-y-2">
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Link>
                </Button>
                <Button variant="outline" className="w-full bg-transparent" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Çıkış Yap
                </Button>
              </div>
            ) : (
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  {navigationData.cta.login}
                </Link>
              </Button>
            )}

            {/* Phone Button */}
            <Button variant="ghost" className="w-full" asChild>
              <Link href={`tel:${companyInfo?.phone?.replace(/\s/g, "") || ""}`} onClick={() => setIsOpen(false)}>
                <Phone className="w-4 h-4 mr-2" />
                {companyInfo?.phone || "+90 212 555 0123"}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
