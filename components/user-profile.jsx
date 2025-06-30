"use client"

import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { User, Mail, Phone, Calendar } from "lucide-react"

export function UserProfile() {
  const { user, token, logout } = useAuth()

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            Lütfen giriş yapın
          </p>
        </CardContent>
      </Card>
    )
  }

  const handleLogout = () => {
    logout()
    window.location.href = "/login"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Kullanıcı Profili
        </CardTitle>
        <CardDescription>
          JWT Token ile giriş yapmış kullanıcı bilgileri
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarFallback className="text-lg">
              {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-semibold">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-muted-foreground">Kullanıcı ID: {user.id}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span>{user.email}</span>
          </div>
          {user.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span>{user.phone}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>Üye olma: {new Date(user.createdAt).toLocaleDateString('tr-TR')}</span>
          </div>
        </div>

        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground mb-2">
            JWT Token (ilk 50 karakter):
          </p>
          <code className="text-xs bg-muted p-2 rounded block break-all">
            {token ? `${token.substring(0, 50)}...` : 'Token bulunamadı'}
          </code>
        </div>

        <Button onClick={handleLogout} variant="destructive" className="w-full">
          Çıkış Yap
        </Button>
      </CardContent>
    </Card>
  )
} 