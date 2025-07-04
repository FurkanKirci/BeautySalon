"use server"

import { getDatabase } from "@/lib/db"
import { ObjectId } from "mongodb"
import { revalidatePath } from "next/cache"
import { uploadServiceImage, deleteServiceImage } from "@/lib/actions/upload"

export async function getServices() {
  try {
    const db = await getDatabase()
    const services = db.collection("services")

    const serviceList = await services.find({}).sort({ category: 1, name: 1 }).toArray()

    return serviceList.map((service) => ({
      ...service,
      id: service._id.toString(),
      _id: service._id.toString(),
    }))
  } catch (error) {
    console.error("Get services error:", error)
    return []
  }
}

export async function createService(data) {
  try {
    const db = await getDatabase()
    const services = db.collection("services")

    const serviceData = {
      name: data.name,
      description: data.description,
      duration: data.duration,
      price: data.price,
      category: data.category,
      image: null, // Fotoğraf adını saklayacak field
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const result = await services.insertOne(serviceData)
    // Eğer fotoğraf varsa yükle ve adını veritabanına kaydet
    if (data.imageFile) {
      const serviceId = result.insertedId.toString()
      const uploadResult = await uploadServiceImage(data.imageFile, serviceId)
      
      if (uploadResult.success) {
        // Fotoğraf adını veritabanına kaydet
        await services.updateOne(
          { _id: result.insertedId },
          { $set: { image: uploadResult.fileName } }
        )
      }
    }

    revalidatePath("/dashboard/services")
    revalidatePath("/hizmetler")

    return {
      success: true,
      id: result.insertedId.toString(),
    }
  } catch (error) {
    console.error("Create service error:", error)
    throw new Error("Hizmet oluşturulurken hata oluştu")
  }
}

export async function updateService(id, data) {
  try {
    const db = await getDatabase()
    const services = db.collection("services")

    const updateData = {
      name: data.name,
      description: data.description,
      duration: data.duration,
      price: data.price,
      category: data.category,
      updatedAt: new Date(),
    }

    // Eğer yeni fotoğraf varsa yükle ve adını güncelle
    if (data.imageFile) {
      const uploadResult = await uploadServiceImage(data.imageFile, id)
      
      if (uploadResult.success) {
        updateData.image = uploadResult.fileName
      }
    }

    await services.updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    revalidatePath("/dashboard/services")
    revalidatePath("/hizmetler")

    return { success: true }
  } catch (error) {
    console.error("Update service error:", error)
    throw new Error("Hizmet güncellenirken hata oluştu")
  }
}

export async function deleteService(id) {
  try {
    const db = await getDatabase()
    const services = db.collection("services")

    // Hard delete - tamamen sil
    await services.deleteOne({ _id: new ObjectId(id) })

    // Fotoğrafı da sil
    await deleteServiceImage(id)

    revalidatePath("/dashboard/services")
    revalidatePath("/hizmetler")

    return { success: true }
  } catch (error) {
    console.error("Delete service error:", error)
    throw new Error("Hizmet silinirken hata oluştu")
  }
}

export async function getServicesByCategory() {
  try {
    const db = await getDatabase()
    const services = db.collection("services")

    const serviceList = await services.find({}).sort({ category: 1, name: 1 }).toArray()

    // Group services by category
    const servicesByCategory = serviceList.reduce((acc, service) => {
      const category = service.category || "Diğer"
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push({
        ...service,
        id: service._id.toString(),
        _id: service._id.toString(),
      })
      return acc
    }, {})
    return servicesByCategory
  } catch (error) {
    console.error("Get services by category error:", error)
    return {}
  }
}

export async function getServiceById(id) {
  try {
    const db = await getDatabase()
    const services = db.collection("services")

    const service = await services.findOne({
      _id: new ObjectId(id),
    })

    if (service) {
      return {
        ...service,
        id: service._id.toString(),
        _id: service._id.toString(),
      }
    }

    return null
  } catch (error) {
    console.error("Get service by id error:", error)
    return null
  }
}
