'use client'

import Image from "next/image"
import { useState, useEffect } from "react"

// Simple hash function to create a stable cache buster
function simpleHash(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36)
}

export default function ServiceImage({ serviceId, serviceName, className = "", priority = false }) {
  const [imageError, setImageError] = useState(false)

  // Reset error state when serviceId changes
  useEffect(() => {
    setImageError(false)
  }, [serviceId])

  if (imageError) {
    return (
      <Image
        src="/placeholder.svg"
        alt={serviceName || "Güzellik Salonu"}
        width={300}
        height={200}
        className={`w-full h-[200px] scale-down rounded-t-lg ${className}`}
        priority={priority}
      />
    )
  }

  // Use serviceId-based hash for cache busting - this will be consistent between server and client
  const cacheBuster = simpleHash(serviceId)

  return (
    <Image
      key={`${serviceId}-${cacheBuster}`}
      src={`/api/service-image/${serviceId}?v=${cacheBuster}`}
      alt={serviceName || "Güzellik Salonu"}
      width={300}
      height={200}
      className={`w-full h-[200px] object-cover group-hover:scale-105 transition-transform duration-300 rounded-t-lg ${className}`}
      onError={() => setImageError(true)}
      priority={priority}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
    />
  )
} 