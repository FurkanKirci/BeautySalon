"use server"

import { getDatabase } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { ObjectId } from "mongodb"

export async function createContactMessage(data) {
  try {
    // Validate required fields
    if (!data.firstName || !data.lastName || !data.email || !data.subject || !data.message) {
      return {
        success: false,
        message: "Lütfen tüm gerekli alanları doldurun.",
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return {
        success: false,
        message: "Lütfen geçerli bir e-posta adresi girin.",
      }
    }

    const db = await getDatabase()
    const contactMessages = db.collection("contact_messages")

    // Create the contact message
    const messageData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone || "",
      subject: data.subject,
      message: data.message,
      status: "new",
      createdAt: new Date(),
    }

    const result = await contactMessages.insertOne(messageData)

    if (result.insertedId) {
      revalidatePath("/iletisim")
      return {
        success: true,
        message: "Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.",
        messageId: result.insertedId.toString(),
      }
    } else {
      return {
        success: false,
        message: "Mesaj gönderilirken bir hata oluştu.",
      }
    }
  } catch (error) {
    console.error("Contact message creation error:", error)
    return {
      success: false,
      message: "Sistem hatası oluştu. Lütfen daha sonra tekrar deneyin.",
    }
  }
}

export async function getContactMessages(status) {
  try {
    const db = await getDatabase()
    const contactMessages = db.collection("contact_messages")

    const query = {}
    if (status) {
      query.status = status
    }

    const messages = await contactMessages.find(query).sort({ createdAt: -1 }).limit(50).toArray()

    return messages.map((msg) => ({
      ...msg,
      _id: msg._id.toString(),
    }))
  } catch (error) {
    console.error("Get contact messages error:", error)
    return []
  }
}

export async function updateContactMessageStatus(messageId, status) {
  try {
    const db = await getDatabase()
    const contactMessages = db.collection("contact_messages")

    await contactMessages.updateOne({ _id: new ObjectId(messageId) }, { $set: { status: status } })

    revalidatePath("/admin/messages")
    return { success: true }
  } catch (error) {
    console.error("Update contact message status error:", error)
    return { success: false }
  }
}

export async function getRecentMessages(limit = 5) {
  try {
    const db = await getDatabase()
    const contactMessages = db.collection("contact_messages")

    const recentMessages = await contactMessages
      .find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray()

    return recentMessages.map((msg) => ({
      ...msg,
      _id: msg._id.toString(),
    }))
  } catch (error) {
    console.error("Get recent messages error:", error)
    return []
  }
}
