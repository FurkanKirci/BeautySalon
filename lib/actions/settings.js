"use server"

import { getDatabase } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getSettings() {
  try {
    const db = await getDatabase()
    const settings = db.collection("settings")

    // Get the first (and should be only) settings document
    const settingsDoc = await settings.findOne({})

    if (settingsDoc) {
      return {
        ...settingsDoc,
        _id: settingsDoc._id.toString(),
        serviceCategories: settingsDoc.serviceCategories || []
      }
    }

    return null
  } catch (error) {
    console.error("Get settings error:", error)
    return null
  }
}

export async function updateSettings(data) {
  try {
    const db = await getDatabase()
    const settings = db.collection("settings")

    const settingsData = {
      companyName: data.companyName,
      companyDescription: data.companyDescription,
      address: data.address,
      phone: data.phone,
      email: data.email,
      workingHours: data.workingHours,
      googleMapsUrl: data.googleMapsUrl,
      instagramUrl: data.instagramUrl,
      facebookUrl: data.facebookUrl,
      twitterUrl: data.twitterUrl,
      updatedAt: new Date(),
      icon: data.icon || "",
      serviceCategories: data.serviceCategories || []
    }

    // Check if settings document exists
    const existingSettings = await settings.findOne({})

    if (existingSettings) {
      // Update existing settings
      await settings.updateOne({}, { $set: settingsData })
    } else {
      // Create new settings document
      settingsData.createdAt = new Date()
      await settings.insertOne(settingsData)
    }

    // Revalidate pages that use settings
    revalidatePath("/dashboard/general")
    revalidatePath("/iletisim")
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("Update settings error:", error)
    return { success: false }
  }
}

export async function getContactInfo() {
  try {
    const settings = await getSettings()

    if (settings) {
      return {
        address: settings.address || "Güzellik Caddesi No: 123, Merkez/İstanbul",
        phone: settings.phone || "+90 212 555 0123",
        email: settings.email || "info@guzelliksalonu.com",
        workingHours: settings.workingHours || "Pazartesi - Cumartesi: 09:00 - 19:00\nPazar: 10:00 - 17:00",
        googleMapsUrl: settings.googleMapsUrl || "",
        socialMedia: {
          instagram: settings.instagramUrl || "https://instagram.com/guzelliksalonu",
          facebook: settings.facebookUrl || "https://facebook.com/guzelliksalonu",
          twitter: settings.twitterUrl || "https://twitter.com/guzelliksalonu",
        },
      }
    }

    // Default values if no settings found
    return {
      address: "Güzellik Caddesi No: 123, Merkez/İstanbul",
      phone: "+90 212 555 0123",
      email: "info@guzelliksalonu.com",
      workingHours: "Pazartesi - Cumartesi: 09:00 - 19:00\nPazar: 10:00 - 17:00",
      googleMapsUrl: "",
      socialMedia: {
        instagram: "https://instagram.com/guzelliksalonu",
        facebook: "https://facebook.com/guzelliksalonu",
        twitter: "https://twitter.com/guzelliksalonu",
      },
    }
  } catch (error) {
    console.error("Get contact info error:", error)
    return {
      address: "Güzellik Caddesi No: 123, Merkez/İstanbul",
      phone: "+90 212 555 0123",
      email: "info@guzelliksalonu.com",
      workingHours: "Pazartesi - Cumartesi: 09:00 - 19:00\nPazar: 10:00 - 17:00",
      googleMapsUrl: "",
      socialMedia: {
        instagram: "https://instagram.com/guzelliksalonu",
        facebook: "https://facebook.com/guzelliksalonu",
        twitter: "https://twitter.com/guzelliksalonu",
      },
    }
  }
}

export async function getCompanyInfo() {
  try {
    const settings = await getSettings()
    if (settings) {
      return {
        name: settings.companyName || "",
        phone: settings.phone || "",
        image: settings.icon || "",
        description: settings.companyDescription || ""
      }
    }
    return {
      name: "Güzellik Salonu",
      phone: "+90 212 555 0123",
      image: "",
      description: ""
    }
  } catch (error) {
    console.error("Get company info error:", error)
    return {
      name: "Güzellik Salonu",
      phone: "+90 212 555 0123",
      image: "",
      description: ""
    }
  }
}
