"use server"

import { getDatabase } from "@/lib/db"

export async function getGalleryImages(category) {
  try {
    const db = await getDatabase()
    const galleryImages = db.collection("gallery_images")

    const query = {}
    if (category) {
      query.category = category
    }

    const images = await galleryImages.find(query).sort({ isFeatured: -1, displayOrder: 1, createdAt: -1 }).toArray()

    return images.map((image) => ({
      ...image,
      id: image._id.toString(),
      _id: image._id.toString(),
    }))
  } catch (error) {
    console.error("Get gallery images error:", error)
    return []
  }
}

export async function getGalleryImagesByCategory() {
  try {
    const db = await getDatabase()
    const galleryImages = db.collection("gallery_images")

    const images = await galleryImages.find({}).sort({ category: 1, displayOrder: 1, createdAt: -1 }).toArray()

    // Group images by category
    const imagesByCategory = images.reduce((acc, image) => {
      const category = image.category || "Diğer"
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push({
        ...image,
        id: image._id.toString(),
        _id: image._id.toString(),
      })
      return acc
    }, {})

    return imagesByCategory
  } catch (error) {
    console.error("Get gallery images by category error:", error)
    return {}
  }
}

export async function getFeaturedImages() {
  try {
    const db = await getDatabase()
    const galleryImages = db.collection("gallery_images")

    const images = await galleryImages.find({ isFeatured: true }).sort({ displayOrder: 1 }).limit(6).toArray()

    return images.map((image) => ({
      ...image,
      id: image._id.toString(),
      _id: image._id.toString(),
    }))
  } catch (error) {
    console.error("Get featured images error:", error)
    return []
  }
}
