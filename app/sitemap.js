export default function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  // Projedeki gerçek sayfalar
  const pages = [
    { path: "", changeFrequency: "weekly", priority: 1.0 }, // Ana sayfa
    { path: "/hizmetler", changeFrequency: "weekly", priority: 0.9 }, // Hizmetler
    { path: "/galeri", changeFrequency: "daily", priority: 0.8 }, // Galeri
    { path: "/hakkimizda", changeFrequency: "monthly", priority: 0.7 }, // Hakkımızda
    { path: "/iletisim", changeFrequency: "monthly", priority: 0.8 }, // İletişim
  ];

  // Statik fotoğraflar
  const staticImages = [
    { path: "/CankayaMain.jpg", alt: "Çankaya Güzellik Salonu Ana Görsel" },
    { path: "/cankayaLogo.jpg", alt: "Çankaya Güzellik Salonu Logo" },
    { path: "/CankayaService.jpg", alt: "Çankaya Güzellik Salonu Hizmet Görseli" },
  ];

  // Önemli dosyalar
  const importantFiles = [
    { path: "/manifest.json", changeFrequency: "yearly", priority: 0.1 },
    { path: "/robots.txt", changeFrequency: "yearly", priority: 0.1 },
    { path: "/sitemap.xml", changeFrequency: "daily", priority: 0.1 },
  ];

  // Sitemap array'ini oluştur
  const sitemap = [
    // Sayfalar
    ...pages.map((page) => ({
      url: `${baseUrl}${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    
    // Statik fotoğraflar
    ...staticImages.map((image) => ({
      url: `${baseUrl}${image.path}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    })),

    // Önemli dosyalar
    ...importantFiles.map((file) => ({
      url: `${baseUrl}${file.path}`,
      lastModified: new Date(),
      changeFrequency: file.changeFrequency,
      priority: file.priority,
    })),
  ];

  return sitemap;
}