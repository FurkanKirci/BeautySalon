'use client'

import Image from "next/image"
import { useState } from "react"

export default function AutoWidthImage({ 
  src, 
  alt, 
  height = 32, 
  className = "", 
  fallbackSrc = "/placeholder.svg",
  priority = false 
}) {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleLoad = (e) => {
    setImageLoaded(true)
  }

  const handleError = () => {
    setImageError(true)
  }

  return (
    <div className={`relative ${className}`} style={{ height: `${height}px` }}>
      <Image
        src={imageError ? fallbackSrc : src}
        alt={alt}
        width={height * 2} // Geçici genişlik, CSS ile override edilecek
        height={height}
        className="h-full w-auto object-contain"
        onLoad={handleLoad}
        onError={handleError}
        priority={priority}
      />
    </div>
  )
} 