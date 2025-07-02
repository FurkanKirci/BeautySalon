"use server"

import { getDatabase } from "@/lib/db"

export async function getDashboardStats() {
  try {
    const db = await getDatabase()

    // Get current date ranges
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))

    // Get total counts
    const [
      totalServices,
      totalSpecialists,
      totalMessages,
      newMessagesThisWeek,
      totalGallery,
    ] = await Promise.all([
      db.collection("services").countDocuments(),
      db.collection("specialists").countDocuments({ isActive: true }),
      db.collection("contact_messages").countDocuments(),
      db.collection("contact_messages").countDocuments({
        createdAt: { $gte: startOfWeek },
      }),
      db.collection("gallery").countDocuments(),
    ])

    return {
      totalServices,
      totalSpecialists,
      totalMessages,
      newMessagesThisWeek,
      totalGallery,
    }
  } catch (error) {
    console.error("Get dashboard stats error:", error)
    return {
      totalServices: 0,
      totalSpecialists: 0,
      totalMessages: 0,
      newMessagesThisWeek: 0,
      totalGallery: 0,
    }
  }
}

export async function getRecentMessages() {
  try {
    const db = await getDatabase()
    const messages = await db.collection("contact_messages").find({}).sort({ createdAt: -1 }).limit(5).toArray()

    return messages.map((msg) => ({
      ...msg,
      _id: msg._id.toString(),
    }))
  } catch (error) {
    console.error("Get recent messages error:", error)
    return []
  }
}
