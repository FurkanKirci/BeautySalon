import fs from "fs"
import path from "path"

export async function GET(req, { params }) {
  const { serviceId } = await params
  const baseDir = "C:/BeautySalon/ServicePhotos"
  let filePath = path.join(baseDir, `${serviceId}.png`)
  
  if (!fs.existsSync(filePath)) {
    filePath = path.join(baseDir, `${serviceId}.jpeg`)
    if (!fs.existsSync(filePath)) {
      filePath = path.join(baseDir, `${serviceId}.jpg`)
      if (!fs.existsSync(filePath)) {
        return new Response("Not found", { status: 404 })
      }
    }
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