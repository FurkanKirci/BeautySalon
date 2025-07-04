"use server"

import { writeFile, mkdir, access, unlink } from 'fs/promises'
import { join, dirname } from 'path'
import { existsSync } from 'fs'

// Environment variables for upload paths
const UPLOAD_BASE_DIR = process.env.UPLOAD_BASE_DIR || 'uploads'
const SERVICE_PHOTOS_DIR = process.env.SERVICE_PHOTOS_DIR || 'service-photos'
const COMPANY_ICON_DIR_NAME = process.env.COMPANY_ICON_DIR || 'company-icon'
const GALLERY_DIR_NAME = process.env.GALLERY_DIR || 'gallery'

// Cross-platform upload directories
const getUploadDirectories = () => {
  return {
    servicePhotos: join(UPLOAD_BASE_DIR, SERVICE_PHOTOS_DIR),
    companyIcon: join(UPLOAD_BASE_DIR, COMPANY_ICON_DIR_NAME),
    gallery: join(UPLOAD_BASE_DIR, GALLERY_DIR_NAME)
  }
}

const UPLOAD_DIR = getUploadDirectories().servicePhotos
const COMPANY_ICON_DIR = getUploadDirectories().companyIcon
const GALLERY_IMAGE_DIR = getUploadDirectories().gallery

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
    
    // Dosya uzantısını belirle
    let ext = ".png"
    if (file?.type === "image/jpeg" || file?.name?.endsWith(".jpg") || file?.name?.endsWith(".jpeg")) {
      ext = ".jpeg"
    }
    
    // Dosya adını oluştur: serviceId + uzantı
    const fileName = `${serviceId}${ext}`
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
    // Farklı uzantıları kontrol et
    const extensions = ['.png', '.jpeg', '.jpg']
    
    for (const ext of extensions) {
      const fileName = `${serviceId}${ext}`
      const filePath = join(UPLOAD_DIR, fileName)
      
      if (existsSync(filePath)) {
        // Dosyayı tamamen sil
        await unlink(filePath)
        console.log(`Fotoğraf tamamen silindi: ${filePath}`)
        return { success: true }
      }
    }
    
    console.log(`Fotoğraf bulunamadı: ${serviceId}`)
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

export async function uploadCompanyIcon(file, companyId) {
  try {
    // Klasörü oluştur
    if (!existsSync(COMPANY_ICON_DIR)) {
      await mkdir(COMPANY_ICON_DIR, { recursive: true })
    }

    // Dosya uzantısını belirle
    let ext = ".png"
    if (file?.type === "image/jpeg" || file?.name?.endsWith(".jpg") || file?.name?.endsWith(".jpeg")) {
      ext = ".jpeg"
    }

    const fileName = `${companyId}${ext}`
    const filePath = join(COMPANY_ICON_DIR, fileName)

    const buffer = await fileToBuffer(file)
    await writeFile(filePath, buffer)

    return {
      success: true,
      fileName,
      filePath,
      url: `/api/company-icon/${companyId}` // Eğer public erişim gerekiyorsa
    }
  } catch (error) {
    console.error('Company icon upload error:', error)
    return {
      success: false,
      error: 'Şirket ikonu yüklenirken hata oluştu: ' + error.message
    }
  }
}

export async function deleteCompanyIcon(companyId) {
  try {
    // Farklı uzantıları kontrol et
    const extensions = ['.png', '.jpeg', '.jpg']
    
    for (const ext of extensions) {
      const fileName = `${companyId}${ext}`
      const filePath = join(COMPANY_ICON_DIR, fileName)
      
      if (existsSync(filePath)) {
        // Dosyayı tamamen sil
        await unlink(filePath)
        console.log(`Şirket ikonu tamamen silindi: ${filePath}`)
        return { success: true }
      }
    }
    
    console.log(`Şirket ikonu bulunamadı: ${companyId}`)
    return { success: true }
  } catch (error) {
    console.error('Company icon delete error:', error)
    return {
      success: false,
      error: 'Şirket ikonu silinirken hata oluştu: ' + error.message
    }
  }
}

export async function uploadGalleryImage(file, galleryId) {
  try {
    // Klasörü oluştur
    if (!existsSync(GALLERY_IMAGE_DIR)) {
      await mkdir(GALLERY_IMAGE_DIR, { recursive: true })
    }
    
    // Dosya uzantısını belirle
    let ext = ".png"
    if (file?.type === "image/jpeg" || file?.name?.endsWith(".jpg") || file?.name?.endsWith(".jpeg")) {
      ext = ".jpeg"
    }
    
    const fileName = `${galleryId}${ext}`
    const filePath = join(GALLERY_IMAGE_DIR, fileName)
    console.log(filePath)
    console.log(fileName)
    console.log(file)
    const writeSuccess = await writeFileSafely(filePath, file)
    if (!writeSuccess) {
      return {
        success: false,
        error: 'Galeri fotoğrafı kaydedilemedi'
      }
    }
    return {
      success: true,
      fileName,
      filePath
    }
  } catch (error) {
    console.error('Gallery image upload error:', error)
    return {
      success: false,
      error: 'Galeri fotoğrafı yüklenirken hata oluştu: ' + error.message
    }
  }
}

export async function deleteGalleryImage(galleryId) {
  try {
    // Farklı uzantıları kontrol et
    const extensions = ['.png', '.jpeg', '.jpg']
    
    for (const ext of extensions) {
      const fileName = `${galleryId}${ext}`
      const filePath = join(GALLERY_IMAGE_DIR, fileName)
      
      if (existsSync(filePath)) {
        // Dosyayı tamamen sil
        await unlink(filePath)
        console.log(`Galeri fotoğrafı tamamen silindi: ${filePath}`)
        return { success: true }
      }
    }
    
    console.log(`Galeri fotoğrafı bulunamadı: ${galleryId}`)
    return { success: true }
  } catch (error) {
    console.error('Gallery image delete error:', error)
    return {
      success: false,
      error: 'Galeri fotoğrafı silinirken hata oluştu: ' + error.message
    }
  }
}