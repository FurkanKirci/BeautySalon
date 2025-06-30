'use client'

import Image from "next/image"
import { useState } from "react"

export default function ServiceImage({ serviceId, serviceName, className = "", priority = false }) {
  const [imageError, setImageError] = useState(false)

  if (imageError) {
    return (
      <Image
        src="/placeholder.svg"
        alt={serviceName || "Güzellik Salonu"}
        width={300}
        height={200}
        className={`w-full h-[200px] object-cover rounded-t-lg ${className}`}
        priority={priority}
      />
    )
  }

  return (
    <Image
      src={`/api/service-image/${serviceId}`}
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