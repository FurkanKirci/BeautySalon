import fs from "fs"
import path from "path"

export async function GET(req, { params }) {
  const { galleryId } = await params
  
  // Environment variables for upload paths
  const UPLOAD_BASE_DIR = process.env.UPLOAD_BASE_DIR || 'uploads'
  const GALLERY_DIR = process.env.GALLERY_DIR || 'gallery'
  
  // Get base directory
  const baseDir = path.join(UPLOAD_BASE_DIR, GALLERY_DIR)
  
  // Try different file extensions
  const extensions = ['png', 'jpeg', 'jpg']
  let filePath = null
  
  for (const ext of extensions) {
    const testPath = path.join(baseDir, `${galleryId}.${ext}`)
    if (fs.existsSync(testPath)) {
      filePath = testPath
      break
    }
  }
  
  if (!filePath) {
    return new Response("Not found", { status: 404 })
  }
  
  const fileBuffer = fs.readFileSync(filePath)
  const stats = fs.statSync(filePath)
  const ext = path.extname(filePath).toLowerCase()
  const contentType = ext === ".png" ? "image/png" : "image/jpeg"
  
  return new Response(fileBuffer, {
    headers: { 
      "Content-Type": contentType,
      "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
      "Pragma": "no-cache",
      "Expires": "0",
      "Last-Modified": stats.mtime.toUTCString(),
      "ETag": `"${stats.mtime.getTime()}"`
    }
  })
} 