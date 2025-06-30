"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import Link from "next/link"
import { loginUser } from "@/lib/actions/auth"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

// JSON Data for Login Page
const loginData = {
  title: "Giriş Yap",
  subtitle: "Hesabınıza giriş yaparak özel hizmetlerimizden faydalanın",
  form: {
    emailLabel: "E-posta",
    emailPlaceholder: "E-posta adresinizi girin",
    passwordLabel: "Şifre",
    passwordPlaceholder: "Şifrenizi girin",
    rememberMe: "Beni hatırla",
    forgotPassword: "Şifremi unuttum",
    loginButton: "Giriş Yap",
    noAccount: "Hesabınız yok mu?",
    signUp: "Kayıt Ol",
  },
  benefits: [
    "Online randevu alma",
    "Geçmiş randevularınızı görme",
    "Özel indirimlerden haberdar olma",
    "Kişisel bakım takviminizi oluşturma",
  ],
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")
  const router = useRouter()
  const { login } = useAuth()

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage("")

    try {
      const result = await loginUser({
        email: formData.email,
        password: formData.password,
      })

      if (result.success) {
        // JWT token'ı AuthContext'e kaydet
        login(result.user, result.token)
        setSubmitMessage(result.message)
        router.push("/")
      } else {
        setSubmitMessage(result.message)
      }
    } catch (error) {
      setSubmitMessage("Bir hata oluştu. Lütfen tekrar deneyin.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">{loginData.title}</h1>
            <p className="text-xl text-muted-foreground">{loginData.subtitle}</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Login Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Hesabınıza Giriş Yapın</CardTitle>
                <CardDescription>E-posta adresiniz ve şifrenizle giriş yapın</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">{loginData.form.emailLabel}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder={loginData.form.emailPlaceholder}
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">{loginData.form.passwordLabel}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder={loginData.form.passwordPlaceholder}
                        value={formData.password}
                        onChange={handleInputChange}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="rememberMe"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, rememberMe: checked }))}
                      />
                      <Label htmlFor="rememberMe" className="text-sm">
                        {loginData.form.rememberMe}
                      </Label>
                    </div>
                    <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                      {loginData.form.forgotPassword}
                    </Link>
                  </div>

                  {submitMessage && (
                    <div
                      className={`text-center p-3 rounded-md ${
                        submitMessage.includes("başarılı")
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {submitMessage}
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Giriş yapılıyor..." : loginData.form.loginButton}
                  </Button>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      {loginData.form.noAccount}{" "}
                      <Link href="/register" className="text-primary hover:underline">
                        {loginData.form.signUp}
                      </Link>
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Benefits */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">Üye Olmanın Avantajları</h2>
                <div className="space-y-4">
                  {loginData.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <p className="text-muted-foreground">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Card className="bg-muted/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Yeni Üye Fırsatı</h3>
                  <p className="text-sm text-muted-foreground mb-4">İlk randevunuzda %20 indirim kazanın!</p>
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href="/register">Hemen Kayıt Ol</Link>
                  </Button>
                </CardContent>
              </Card>

              <div className="bg-primary/10 rounded-lg p-6">
                <h3 className="font-semibold mb-2">Güvenli Giriş</h3>
                <p className="text-sm text-muted-foreground">
                  Bilgileriniz SSL sertifikası ile korunmaktadır. Kişisel verileriniz güvende.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
