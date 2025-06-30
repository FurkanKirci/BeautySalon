"use client"

import { createContext, useContext, useState, useEffect } from 'react'
import { verifyAuthToken } from '@/lib/actions/auth'
import { decodeToken } from '@/lib/jwt'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(null)

  // Token'ı localStorage'dan al
  const getStoredToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token')
    }
    return null
  }

  // Token'ı localStorage'a kaydet
  const setStoredToken = (token) => {
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token)
      } else {
        localStorage.removeItem('auth_token')
      }
    }
  }

  // Token'dan user bilgilerini çıkar
  const getUserFromToken = (token) => {
    if (!token) return null
    
    const decoded = decodeToken(token)
    if (!decoded) return null

    return {
      id: decoded.id,
      email: decoded.email,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
    }
  }

  // Token doğrula ve user bilgilerini güncelle
  const verifyToken = async (token) => {
    try {
      const userData = await verifyAuthToken(token)
      if (userData) {
        setUser(userData)
        return true
      } else {
        // Token geçersiz, temizle
        logout()
        return false
      }
    } catch (error) {
      console.error('Token verification error:', error)
      logout()
      return false
    }
  }

  // Login fonksiyonu
  const login = (userData, token) => {
    setUser(userData)
    setToken(token)
    setStoredToken(token)
  }

  // Logout fonksiyonu
  const logout = () => {
    setUser(null)
    setToken(null)
    setStoredToken(null)
  }

  // Sayfa yüklendiğinde token kontrolü
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = getStoredToken()
      
      if (storedToken) {
        setToken(storedToken)
        
        // Önce token'dan user bilgilerini çıkar (hızlı erişim için)
        const userFromToken = getUserFromToken(storedToken)
        if (userFromToken) {
          setUser(userFromToken)
        }
        
        // Sonra server'da doğrula
        await verifyToken(storedToken)
      }
      
      setLoading(false)
    }

    initAuth()
  }, [])

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    verifyToken,
    getUserFromToken
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 