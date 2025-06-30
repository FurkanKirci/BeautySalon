"use server"

import { getDatabase } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { ObjectId } from "mongodb"

export async function createAppointment(data) {
  try {
    // Validate required fields
    if (
      !data.serviceId ||
      !data.appointmentDate ||
      !data.appointmentTime ||
      !data.firstName ||
      !data.lastName ||
      !data.phone ||
      !data.email
    ) {
      return {
        success: false,
        message: "Lütfen tüm gerekli alanları doldurun.",
      }
    }

    const db = await getDatabase()
    const appointments = db.collection("appointments")

    // Check if the time slot is available
    const existingAppointment = await appointments.findOne({
      appointmentDate: data.appointmentDate,
      appointmentTime: data.appointmentTime,
      specialistId: data.specialistId,
      status: { $ne: "cancelled" },
    })

    if (existingAppointment) {
      return {
        success: false,
        message: "Bu tarih ve saat için randevu dolu. Lütfen başka bir saat seçin.",
      }
    }

    // Create the appointment
    const appointmentData = {
      serviceId: data.serviceId,
      specialistId: data.specialistId,
      appointmentDate: data.appointmentDate,
      appointmentTime: data.appointmentTime,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      email: data.email,
      notes: data.notes || "",
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await appointments.insertOne(appointmentData)

    if (result.insertedId) {
      revalidatePath("/randevu")
      return {
        success: true,
        message: "Randevunuz başarıyla oluşturuldu. En kısa sürede size dönüş yapacağız.",
        appointmentId: result.insertedId.toString(),
      }
    } else {
      return {
        success: false,
        message: "Randevu oluşturulurken bir hata oluştu.",
      }
    }
  } catch (error) {
    console.error("Appointment creation error:", error)
    return {
      success: false,
      message: "Sistem hatası oluştu. Lütfen daha sonra tekrar deneyin.",
    }
  }
}

export async function getAppointments(date) {
  try {
    const db = await getDatabase()
    const appointments = db.collection("appointments")
    const services = db.collection("services")
    const specialists = db.collection("specialists")

    const query = {}
    if (date) {
      query.appointmentDate = date
    }

    const appointmentList = await appointments
      .find(query)
      .sort({ appointmentDate: -1, appointmentTime: -1 })
      .limit(50)
      .toArray()

    // Populate service and specialist data
    const populatedAppointments = await Promise.all(
      appointmentList.map(async (appointment) => {
        const service = await services.findOne({ _id: new ObjectId(appointment.serviceId) })
        const specialist = await specialists.findOne({ _id: new ObjectId(appointment.specialistId) })

        return {
          ...appointment,
          _id: appointment._id.toString(),
          service_name: service?.name || "Unknown Service",
          duration: service?.duration || 0,
          price: service?.price || 0,
          specialist_name: specialist?.name || "Unknown Specialist",
        }
      }),
    )

    return populatedAppointments
  } catch (error) {
    console.error("Get appointments error:", error)
    return []
  }
}

export async function updateAppointmentStatus(appointmentId, status) {
  try {
    const db = await getDatabase()
    const appointments = db.collection("appointments")

    await appointments.updateOne(
      { _id: new ObjectId(appointmentId) },
      {
        $set: {
          status: status,
          updatedAt: new Date(),
        },
      },
    )

    revalidatePath("/admin/appointments")
    return { success: true }
  } catch (error) {
    console.error("Update appointment status error:", error)
    return { success: false }
  }
}

export async function getAvailableTimeSlots(date, specialistId) {
  try {
    const db = await getDatabase()
    const appointments = db.collection("appointments")

    const bookedSlots = await appointments
      .find({
        appointmentDate: date,
        specialistId: specialistId,
        status: { $ne: "cancelled" },
      })
      .toArray()

    const allSlots = [
      "09:00",
      "09:30",
      "10:00",
      "10:30",
      "11:00",
      "11:30",
      "12:00",
      "12:30",
      "14:00",
      "14:30",
      "15:00",
      "15:30",
      "16:00",
      "16:30",
      "17:00",
      "17:30",
      "18:00",
      "18:30",
    ]

    const bookedTimes = bookedSlots.map((slot) => slot.appointmentTime)
    const availableSlots = allSlots.filter((slot) => !bookedTimes.includes(slot))

    return availableSlots
  } catch (error) {
    console.error("Get available time slots error:", error)
    return []
  }
}

export async function getRecentAppointments(limit = 5) {
  try {
    const db = await getDatabase()
    const appointments = db.collection("appointments")
    const services = db.collection("services")
    const specialists = db.collection("specialists")

    const recentAppointments = await appointments
      .find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray()

    // Populate service and specialist data
    const populatedAppointments = await Promise.all(
      recentAppointments.map(async (appointment) => {
        const service = await services.findOne({ _id: new ObjectId(appointment.serviceId) })
        const specialist = await specialists.findOne({ _id: new ObjectId(appointment.specialistId) })

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
