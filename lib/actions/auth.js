"use server"

import { getDatabase } from "@/lib/db"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { ObjectId } from "mongodb"
import { generateToken, verifyToken } from "@/lib/jwt"

export async function loginUser(data) {
  try {
    // Validate required fields
    if (!data.email || !data.password) {
      return {
        success: false,
        message: "E-posta ve şifre gereklidir.",
      }
    }

    const db = await getDatabase()
    const users = db.collection("users")

    // Find user by email
    const user = await users.findOne({ email: data.email })

    if (!user) {
      return {
        success: false,
        message: "E-posta adresi veya şifre hatalı.",
      }
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(data.password, user.passwordHash)

    if (!isValidPassword) {
      return {
        success: false,
        message: "E-posta adresi veya şifre hatalı.",
      }
    }

    // Generate JWT token
    const tokenPayload = {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    }
    
    const token = generateToken(tokenPayload)

    // Set JWT token in cookie
    cookies().set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax"
    })

    return {
      success: true,
      message: "Giriş başarılı.",
      user: {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      token: token // Client tarafında kullanmak için
    }
  } catch (error) {
    console.error("Login error:", error)
    return {
      success: false,
      message: "Sistem hatası oluştu. Lütfen daha sonra tekrar deneyin.",
    }
  }
}

export async function registerUser(data) {
  try {
    // Validate required fields
    if (!data.firstName || !data.lastName || !data.email || !data.password) {
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

    // Validate password strength
    if (data.password.length < 6) {
      return {
        success: false,
        message: "Şifre en az 6 karakter olmalıdır.",
      }
    }

    const db = await getDatabase()
    const users = db.collection("users")

    // Check if user already exists
    const existingUser = await users.findOne({ email: data.email })

    if (existingUser) {
      return {
        success: false,
        message: "Bu e-posta adresi zaten kayıtlı.",
      }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 12)

    // Create user
    const userData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone || "",
      passwordHash: passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await users.insertOne(userData)

    if (result.insertedId) {
      // Generate JWT token
      const tokenPayload = {
        id: result.insertedId.toString(),
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
      }
      
      const token = generateToken(tokenPayload)

      // Set JWT token in cookie
      cookies().set("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: "lax"
      })

      return {
        success: true,
        message: "Kayıt başarılı. Hoş geldiniz!",
        user: {
          id: result.insertedId.toString(),
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
        },
        token: token // Client tarafında kullanmak için
      }
    } else {
      return {
        success: false,
        message: "Kayıt oluşturulurken bir hata oluştu.",
      }
    }
  } catch (error) {
    console.error("Registration error:", error)
    return {
      success: false,
      message: "Sistem hatası oluştu. Lütfen daha sonra tekrar deneyin.",
    }
  }
}

export async function logoutUser() {
  cookies().delete("auth_token")
  redirect("/login")
}

export async function getCurrentUser() {
  try {
    const token = cookies().get("auth_token")?.value

    if (!token) {
      return null
    }

    // Verify JWT token
    const decoded = verifyToken(token)
    
    if (!decoded) {
      // Token geçersiz, cookie'yi temizle
      cookies().delete("auth_token")
      return null
    }

    const db = await getDatabase()
    const users = db.collection("users")

    const user = await users.findOne(
      { _id: new ObjectId(decoded.id) },
      { projection: { passwordHash: 0 } }, // Exclude password hash
    )

    if (user) {
      return {
        ...user,
        id: user._id.toString(),
        _id: user._id.toString(),
      }
    }

    return null
  } catch (error) {
    console.error("Get current user error:", error)
    return null
  }
}

// Client tarafında kullanmak için token doğrulama fonksiyonu
export async function verifyAuthToken(token) {
  try {
    const decoded = verifyToken(token)
    if (!decoded) {
      return null
    }

    const db = await getDatabase()
    const users = db.collection("users")

    const user = await users.findOne(
      { _id: new ObjectId(decoded.id) },
      { projection: { passwordHash: 0 } }
    )

    if (user) {
      return {
        ...user,
        id: user._id.toString(),
        _id: user._id.toString(),
      }
    }

    return null
  } catch (error) {
    console.error("Verify auth token error:", error)
    return null
  }
}
