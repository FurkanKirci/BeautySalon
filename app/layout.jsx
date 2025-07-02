import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/AuthContext"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ScrollToTop from "@/components/scroll-to-top"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Güzellik Salonu - Profesyonel Güzellik Hizmetleri",
  description:
    "15 yıllık deneyimimizle güzelliğinize değer katıyoruz. Cilt bakımı, saç tasarımı, makyaj ve daha fazlası için randevu alın.",
  keywords: "güzellik salonu, cilt bakımı, saç kesimi, makyaj, nail art, İstanbul",
    generator: 'Pengona'
}

export default function RootLayout({ children }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <ScrollToTop />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
