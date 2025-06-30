import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { NextResponse } from 'next/server'

const UPLOAD_DIR = 'C:/BeautySalon/ServicePhotos'

export async function GET(request, { params }) {
  try {
    const { serviceId } = params
    const fileName = `${serviceId}.png`
    const filePath = join(UPLOAD_DIR, fileName)
    
    if (!existsSync(filePath)) {
      // Varsayılan placeholder resim döndür
      return new NextResponse(null, { status: 404 })
    }
    
    const imageBuffer = await readFile(filePath)
    
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    })
  } catch (error) {
    console.error('Service image serve error:', error)
    return new NextResponse(null, { status: 500 })
  }
} 