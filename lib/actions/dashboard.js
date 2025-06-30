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
      totalAppointments,
      totalServices,
      totalSpecialists,
      totalMessages,
      newAppointmentsThisMonth,
      newMessagesThisWeek,
      totalGallery,
    ] = await Promise.all([
      db.collection("appointments").countDocuments(),
      db.collection("services").countDocuments({ isActive: true }),
      db.collection("specialists").countDocuments({ isActive: true }),
      db.collection("contact_messages").countDocuments(),
      db.collection("appointments").countDocuments({
        createdAt: { $gte: startOfMonth },
      }),
      db.collection("contact_messages").countDocuments({
        createdAt: { $gte: startOfWeek },
      }),
      db.collection("gallery_images").countDocuments(),
    ])

    return {
      totalAppointments,
      totalServices,
      totalSpecialists,
      totalMessages,
      newAppointmentsThisMonth,
      newMessagesThisWeek,
      totalGallery,
    }
  } catch (error) {
    console.error("Get dashboard stats error:", error)
    return {
      totalAppointments: 0,
      totalServices: 0,
      totalSpecialists: 0,
      totalMessages: 0,
      newAppointmentsThisMonth: 0,
      newMessagesThisWeek: 0,
      totalGallery: 0,
    }
  }
}

export async function getRecentAppointments() {
  try {
    const db = await getDatabase()
    const appointments = db.collection("appointments")
    const services = db.collection("services")
    const specialists = db.collection("specialists")

    const recentAppointments = await appointments.find({}).sort({ createdAt: -1 }).limit(5).toArray()

    // Populate service and specialist data
    const populatedAppointments = await Promise.all(
      recentAppointments.map(async (appointment) => {
        const service = await services.findOne({ _id: appointment.serviceId })
        const specialist = await specialists.findOne({ _id: appointment.specialistId })

        return {
          ...appointment,
          _id: appointment._id.toString(),
          service_name: service?.name || "Unknown Service",
          specialist_name: specialist?.name || "Unknown Specialist",
        }
      }),
    )

    return populatedAppointments
  } catch (error) {
    console.error("Get recent appointments error:", error)
    return []
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
