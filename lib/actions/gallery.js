"use server"

import { getDatabase } from "@/lib/db"
import { ObjectId } from "mongodb"
import { uploadGalleryImage, deleteGalleryImage as deleteGalleryImageFile } from './upload'

export async function getGalleryImages(category) {
  try {
    const db = await getDatabase()
    const galleryImages = db.collection("gallery")

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
    const galleryImages = db.collection("gallery")

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
    const galleryImages = db.collection("gallery")

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

export async function getGallery() {
  const db = await getDatabase()
  const gallery = db.collection("gallery")
  const items = await gallery.find({}).sort({ createdAt: -1 }).toArray()
  return items.map(item => ({
    ...item,
    id: item._id.toString(),
    _id: item._id.toString(),
  }))
}

export async function addGalleryImage({ title, category, imageFile, description }) {
  const db = await getDatabase()
  const gallery = db.collection("gallery")
  const doc = {
    title,
    category,
    description,
    createdAt: new Date(),
    picture: ""
  }
  const result = await gallery.insertOne(doc)
  let pictureName = ""
  if (imageFile) {
    console.log(imageFile)
    const uploadResult = await uploadGalleryImage(imageFile, result.insertedId.toString())
    if (uploadResult.success) {
      pictureName = uploadResult.fileName
      await gallery.updateOne({ _id: result.insertedId }, { $set: { picture: pictureName } })
    }
  }
  return { success: true }
}

export async function deleteGalleryImage(id) {
  const db = await getDatabase()
  const gallery = db.collection("gallery")
  await gallery.deleteOne({ _id: new ObjectId(id) })
  await deleteGalleryImageFile(id) // Fotoğrafı da sil
  return { success: true }
}

export async function updateGalleryImage(id, { title, category, description, imageFile }) {
  try {
    const db = await getDatabase()
    const gallery = db.collection("gallery")
    
    const updateData = {
      title,
      category,
      description,
      updatedAt: new Date()
    }

    // Eğer yeni resim yüklendiyse
    if (imageFile) {
      const uploadResult = await uploadGalleryImage(imageFile, id)
      if (uploadResult.success) {
        updateData.picture = uploadResult.fileName
      }
    }

    await gallery.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )

    return { success: true }
  } catch (error) {
    console.error("Update gallery image error:", error)
    return { success: false, error: error.message }
  }
}

export async function toggleFeaturedImage(id, isFeatured) {
  try {
    const db = await getDatabase()
    const gallery = db.collection("gallery")
    
    await gallery.updateOne(
      { _id: new ObjectId(id) },
      { $set: { isFeatured, updatedAt: new Date() } }
    )

    return { success: true }
  } catch (error) {
    console.error("Toggle featured image error:", error)
    return { success: false, error: error.message }
  }
}
