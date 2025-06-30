"use server"

import { getDatabase } from "@/lib/db"
import { ObjectId } from "mongodb"
import { revalidatePath } from "next/cache"

export async function getSpecialists() {
  try {
    const db = await getDatabase()
    const specialists = db.collection("specialists")

    const specialistList = await specialists.find({ isActive: true }).sort({ name: 1 }).toArray()

    return specialistList.map((specialist) => ({
      ...specialist,
      id: specialist._id.toString(),
      _id: specialist._id.toString(),
    }))
  } catch (error) {
    console.error("Get specialists error:", error)
    return []
  }
}

export async function createSpecialist(data) {
  try {
    const db = await getDatabase()
    const specialists = db.collection("specialists")

    const specialistData = {
      name: data.name,
      speciality: data.speciality,
      email: data.email,
      phone: data.phone,
      bio: data.bio,
      experienceYears: data.experienceYears,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await specialists.insertOne(specialistData)

    revalidatePath("/dashboard/specialists")
    revalidatePath("/hakkimizda")

    return {
      success: true,
      id: result.insertedId.toString(),
    }
  } catch (error) {
    console.error("Create specialist error:", error)
    throw new Error("Uzman oluşturulurken hata oluştu")
  }
}

export async function updateSpecialist(id, data) {
  try {
    const db = await getDatabase()
    const specialists = db.collection("specialists")

    const updateData = {
      name: data.name,
      speciality: data.speciality,
      email: data.email,
      phone: data.phone,
      bio: data.bio,
      experienceYears: data.experienceYears,
      updatedAt: new Date(),
    }

    await specialists.updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    revalidatePath("/dashboard/specialists")
    revalidatePath("/hakkimizda")

    return { success: true }
  } catch (error) {
    console.error("Update specialist error:", error)
    throw new Error("Uzman güncellenirken hata oluştu")
  }
}

export async function deleteSpecialist(id) {
  try {
    const db = await getDatabase()
    const specialists = db.collection("specialists")

    // Soft delete - mark as inactive
    await specialists.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          isActive: false,
          updatedAt: new Date(),
        },
      },
    )

    revalidatePath("/dashboard/specialists")
    revalidatePath("/hakkimizda")

    return { success: true }
  } catch (error) {
    console.error("Delete specialist error:", error)
    throw new Error("Uzman silinirken hata oluştu")
  }
}

export async function getSpecialistById(id) {
  try {
    const db = await getDatabase()
    const specialists = db.collection("specialists")

    const specialist = await specialists.findOne({
      _id: new ObjectId(id),
      isActive: true,
    })

    if (specialist) {
      return {
        ...specialist,
        id: specialist._id.toString(),
        _id: specialist._id.toString(),
      }
    }

    return null
  } catch (error) {
    console.error("Get specialist by id error:", error)
    return null
  }
}

export async function getSpecialistsByService(serviceId) {
  try {
    const db = await getDatabase()
    const specialists = db.collection("specialists")

    // For now, return all specialists. In a more complex system,
    // you might have a junction collection linking specialists to services
    const specialistList = await specialists.find({ isActive: true }).sort({ name: 1 }).toArray()

    return specialistList.map((specialist) => ({
      ...specialist,
      id: specialist._id.toString(),
      _id: specialist._id.toString(),
    }))
  } catch (error) {
    console.error("Get specialists by service error:", error)
    return []
  }
}
