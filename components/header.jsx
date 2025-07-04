"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Phone, User, LogOut } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { MobileNav } from "@/components/mobile-nav"
import { useAuth } from "@/contexts/AuthContext"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getCompanyInfo } from "@/lib/actions/settings"

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

export default function Header() {
  const { user, logout } = useAuth()
  const [companyInfo, setCompanyInfo] = useState({
    name: "",
    phone: "",
    image: "",
  })

  useEffect(() => {
    const loadCompanyInfo = async () => {
      try {
        const info = await getCompanyInfo()
        setCompanyInfo(info)
      } catch (error) {
        console.error("Company info loading error:", error)
      }
    }

    loadCompanyInfo()
  }, [])

  const handleLogout = () => {
    logout()
    // Server-side logout için redirect
    window.location.href = "/login"
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            {companyInfo.image ? (
              <div className="relative h-8 mr-2">
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
              </div>
            ) : (
              <div className="w-8 h-8 bg-primary rounded-full mr-2"></div>
            )}
            <span className="font-bold text-xl">{companyInfo.name}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationData.navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="ghost" size="sm" asChild>
              <Link href={`tel:${companyInfo.phone.replace(/\s/g, "")}`}>
                <Phone className="w-4 h-4 mr-2" />
                {companyInfo.phone}
              </Link>
            </Button>

            {user ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs">
                          {user.firstName?.charAt(0)}
                          {user.lastName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:inline">
                        {user.firstName} {user.lastName}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Hesabım</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2">
                      <LogOut className="w-4 h-4" />
                      Çıkış Yap
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/login">{navigationData.cta.login}</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden flex items-center space-x-2">
            <ThemeToggle />
            <MobileNav companyInfo={companyInfo} user={user} onLogout={handleLogout} />
          </div>
        </div>
      </div>
    </header>
  )
}
