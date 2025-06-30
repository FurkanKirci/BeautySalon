"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, Phone, Calendar, X, User, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/AuthContext"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// JSON Data for Navigation
const navigationData = {
  navigation: [
    { name: "Ana Sayfa", href: "/" },
    { name: "Hizmetler", href: "/hizmetler" },
    { name: "Galeri", href: "/galeri" },
    { name: "Hakkımızda", href: "/hakkimizda" },
    { name: "İletişim", href: "/iletisim" },
  ],
  phone: "+90 212 555 0123",
  cta: {
    login: "Giriş Yap",
  },
}

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    setIsOpen(false)
    // Server-side logout için redirect
    window.location.href = "/login"
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
          "fixed inset-0 z-50 bg-black transition-opacity lg:hidden",
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
          <h2 className="text-lg font-semibold">Menü</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex flex-col p-4 space-y-4 bg-white dark:bg-black">
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

            {user ? (
              <>
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-sm">
                      {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.firstName} {user.lastName}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Link>
                </Button>

                <Button variant="ghost" className="w-full text-red-600 hover:text-red-700" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Çıkış Yap
                </Button>
              </>
            ) : (
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  {navigationData.cta.login}
                </Link>
              </Button>
            )}

            <Button variant="ghost" className="w-full" asChild>
              <Link href="tel:+902125550123" onClick={() => setIsOpen(false)}>
                <Phone className="w-4 h-4 mr-2" />
                {navigationData.phone}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
