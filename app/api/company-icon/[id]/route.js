import fs from "fs"
import path from "path"

export async function GET(req, { params }) {
  const { id } = params
  const baseDir = "C:/BeautySalon/CompanyIcon"
  let filePath = path.join(baseDir, `${id}.png`)
  if (!fs.existsSync(filePath)) {
    filePath = path.join(baseDir, `${id}.jpeg`)
    if (!fs.existsSync(filePath)) {
      return new Response("Not found", { status: 404 })
    }
  }
  const fileBuffer = fs.readFileSync(filePath)
  const ext = path.extname(filePath).toLowerCase()
  const contentType = ext === ".png" ? "image/png" : "image/jpeg"
  return new Response(fileBuffer, {
    headers: { "Content-Type": contentType }
  })
} 