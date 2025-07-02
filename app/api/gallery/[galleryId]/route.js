import fs from "fs"
import path from "path"

export async function GET(req, { params }) {
  const { galleryId } = await params
  const baseDir = "C:/BeautySalon/Gallery"
  const filePath = path.join(baseDir, `${galleryId}`)
  
  if (!fs.existsSync(filePath)) {
    return new Response("Not found", { status: 404 })
  }
  
  const fileBuffer = fs.readFileSync(filePath)
  const stats = fs.statSync(filePath)
  
  return new Response(fileBuffer, {
    headers: { 
      "Content-Type": "image/png",
      "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
      "Pragma": "no-cache",
      "Expires": "0",
      "Last-Modified": stats.mtime.toUTCString(),
      "ETag": `"${stats.mtime.getTime()}"`
    }
  })
} 