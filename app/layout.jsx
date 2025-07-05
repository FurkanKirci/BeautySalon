import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/AuthContext"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ScrollToTop from "@/components/scroll-to-top"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Çankaya Güzellik Salonu - Profesyonel Güzellik Hizmetleri",
  description:
    "15 yıllık deneyimimizle güzelliğinize değer katıyoruz. Cilt bakımı, saç tasarımı, makyaj, nail art ve daha fazlası için randevu alın. İstanbul'da güvenilir güzellik salonu.",
  keywords: "güzellik salonu, cilt bakımı, saç kesimi, makyaj, nail art, İstanbul, Çankaya, güzellik merkezi, spa, bakım",
  authors: [{ name: "Çankaya Güzellik Salonu" }],
  creator: "Çankaya Güzellik Salonu",
  publisher: "Çankaya Güzellik Salonu",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3050'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Çankaya Güzellik Salonu - Profesyonel Güzellik Hizmetleri",
    description: "15 yıllık deneyimimizle güzelliğinize değer katıyoruz. Cilt bakımı, saç tasarımı, makyaj ve daha fazlası için randevu alın.",
    url: '/',
    siteName: 'Çankaya Güzellik Salonu',
    images: [
      {
        url: '/CankayaMain.jpg',
        width: 1200,
        height: 630,
        alt: 'Çankaya Güzellik Salonu',
      },
      {
        url: '/cankayaLogo.jpg',
        width: 500,
        height: 600,
        alt: 'Çankaya Güzellik Salonu Logo',
      },
    ],
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Çankaya Güzellik Salonu - Profesyonel Güzellik Hizmetleri",
    description: "15 yıllık deneyimimizle güzelliğinize değer katıyoruz. Cilt bakımı, saç tasarımı, makyaj ve daha fazlası için randevu alın.",
    images: ['/CankayaMain.jpg'],
    creator: '@cankayaguzellik',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/cankayaLogo.jpg',
    shortcut: '/cankayaLogo.jpg',
    apple: '/cankayaLogo.jpg',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({ children }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    "name": "Çankaya Güzellik Salonu",
    "description": "15 yıllık deneyimimizle güzelliğinize değer katıyoruz. Cilt bakımı, saç tasarımı, makyaj, nail art ve daha fazlası için randevu alın.",
    "url": process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3050',
    "logo": `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3050'}/cankayaLogo.jpg`,
    "image": `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3050'}/CankayaMain.jpg`,
    "telephone": "+90 212 555 0123",
    "email": "info@cankayaguzellik.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Güzellik Caddesi No: 123",
      "addressLocality": "İstanbul",
      "addressRegion": "Çankaya",
      "postalCode": "34000",
      "addressCountry": "TR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 39.9334,
      "longitude": 32.8597
    },
    "openingHours": "Mo-Sa 09:00-19:00, Su 10:00-17:00",
    "priceRange": "₺₺",
    "currenciesAccepted": "TRY",
    "paymentAccepted": "Cash, Credit Card",
    "areaServed": "İstanbul",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Güzellik Hizmetleri",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Cilt Bakımı"
          }
        },
        {
          "@type": "Offer", 
          "itemOffered": {
            "@type": "Service",
            "name": "Saç Tasarımı"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service", 
            "name": "Makyaj"
          }
        }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "1000"
    },
    "sameAs": [
      "https://instagram.com/cankayaguzellik",
      "https://facebook.com/cankayaguzellik",
      "https://twitter.com/cankayaguzellik"
    ]
  }

  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/cankayaLogo.jpg" />
        <link rel="apple-touch-icon" href="/cankayaLogo.jpg" />
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body className={inter.className}>
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
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
