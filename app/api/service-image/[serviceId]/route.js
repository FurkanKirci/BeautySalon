import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { NextResponse } from 'next/server'

const UPLOAD_DIR = 'C:/BeautySalon/ServicePhotos'

export async function GET(request, { params }) {
  try {
    const { serviceId } = await params
    const fileName = `${serviceId}.png`
    const filePath = join(UPLOAD_DIR, fileName)
    
    if (!existsSync(filePath)) {
      // Dosya yoksa 404 döndür
      return new NextResponse(null, { status: 404 })
    }
    
    const imageBuffer = await readFile(filePath)
    const stats = require('fs').statSync(filePath)
    
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Last-Modified': stats.mtime.toUTCString(),
        'ETag': `"${stats.mtime.getTime()}"`
      }
    })
  } catch (error) {
    console.error('Service image serve error:', error)
    return new NextResponse(null, { status: 500 })
  }
} 