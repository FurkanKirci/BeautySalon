"use server"

import { writeFile, mkdir, access } from 'fs/promises'
import { join, dirname } from 'path'
import { existsSync } from 'fs'

const UPLOAD_DIR = 'C:/BeautySalon/ServicePhotos'

// Klasör yapısını oluştur (recursive)
async function ensureUploadDir() {
  try {
    // Ana klasörü kontrol et ve oluştur
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true })
      console.log(`Klasör oluşturuldu: ${UPLOAD_DIR}`)
    }
    
    // Alt klasörleri de oluştur (gerekirse)
    const subDirs = [
      join(UPLOAD_DIR, 'temp'),
      join(UPLOAD_DIR, 'backup')
    ]
    
    for (const subDir of subDirs) {
      if (!existsSync(subDir)) {
        await mkdir(subDir, { recursive: true })
        console.log(`Alt klasör oluşturuldu: ${subDir}`)
      }
    }
    
    return true
  } catch (error) {
    console.error('Klasör oluşturma hatası:', error)
    return false
  }
}

// File objesini Buffer'a çevir
async function fileToBuffer(file) {
  try {
    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer()
      return Buffer.from(arrayBuffer)
    } else if (file instanceof Buffer) {
      return file
    } else if (typeof file === 'string') {
      return Buffer.from(file, 'base64')
    } else {
      throw new Error('Desteklenmeyen dosya formatı')
    }
  } catch (error) {
    console.error('File to buffer conversion error:', error)
    throw error
  }
}

// Dosya yazma işlemi
async function writeFileSafely(filePath, fileData) {
  try {
    // Dosyanın bulunduğu klasörü oluştur
    const directory = dirname(filePath)
    if (!existsSync(directory)) {
      await mkdir(directory, { recursive: true })
    }
    
    // File objesini Buffer'a çevir
    const buffer = await fileToBuffer(fileData)
    
    // Dosyayı yaz
    await writeFile(filePath, buffer)
    return true
  } catch (error) {
    console.error('Dosya yazma hatası:', error)
    return false
  }
}

// Fotoğraf yükleme
export async function uploadServiceImage(file, serviceId) {
  try {
    // Klasör yapısını kontrol et ve oluştur
    const dirCreated = await ensureUploadDir()
    if (!dirCreated) {
      return {
        success: false,
        error: 'Klasör yapısı oluşturulamadı'
      }
    }
    
    // Dosya adını oluştur: serviceId + .png
    const fileName = `${serviceId}.png`
    const filePath = join(UPLOAD_DIR, fileName)
    
    // Dosyayı güvenli şekilde kaydet
    const writeSuccess = await writeFileSafely(filePath, file)
    
    if (!writeSuccess) {
      return {
        success: false,
        error: 'Dosya kaydedilemedi'
      }
    }
    
    console.log(`Fotoğraf başarıyla kaydedildi: ${filePath}`)
    
    return {
      success: true,
      fileName: fileName,
      filePath: filePath
    }
  } catch (error) {
    console.error('Image upload error:', error)
    return {
      success: false,
      error: 'Fotoğraf yüklenirken hata oluştu: ' + error.message
    }
  }
}

// Fotoğraf silme
export async function deleteServiceImage(serviceId) {
  try {
    const fileName = `${serviceId}.png`
    const filePath = join(UPLOAD_DIR, fileName)
    
    if (existsSync(filePath)) {
      // Dosyayı tamamen silmek yerine boş dosya yap
      await writeFile(filePath, '')
      console.log(`Fotoğraf silindi: ${filePath}`)
      return { success: true }
    }
    
    console.log(`Fotoğraf zaten mevcut değil: ${filePath}`)
    return { success: true } // Dosya zaten yok
  } catch (error) {
    console.error('Image delete error:', error)
    return {
      success: false,
      error: 'Fotoğraf silinirken hata oluştu: ' + error.message
    }
  }
}

// Fotoğraf URL'i oluştur
export async function getServiceImageUrl(serviceId) {
  return `/api/service-image/${serviceId}`
}

// Klasör durumunu kontrol et
export async function checkUploadDirectory() {
  try {
    const dirExists = existsSync(UPLOAD_DIR)
    const canWrite = await access(UPLOAD_DIR).then(() => true).catch(() => false)
    
    return {
      exists: dirExists,
      writable: canWrite,
      path: UPLOAD_DIR
    }
  } catch (error) {
    return {
      exists: false,
      writable: false,
      path: UPLOAD_DIR,
      error: error.message
    }
  }
} 