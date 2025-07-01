import fs from "fs"
import path from "path"

export async function GET(req, { params }) {
  const { galleryId } = params
  const baseDir = "C:/BeautySalon/Gallery"
  const filePath = path.join(baseDir, `${galleryId}`)
  if (!fs.existsSync(filePath)) {
    return new Response("Not found", { status: 404 })
  }
  const fileBuffer = fs.readFileSync(filePath)
  return new Response(fileBuffer, {
    headers: { "Content-Type": "image/png" }
  })
} 