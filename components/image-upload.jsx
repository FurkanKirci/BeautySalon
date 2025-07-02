"use client"

import { useState, useCallback, useRef } from "react"
import { useDropzone } from "react-dropzone"
import ReactCrop from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, Crop, Save } from "lucide-react"

export function ImageUpload({ onImageSave, currentImage }) {
  const [uploadedImage, setUploadedImage] = useState(null)
  const [originalImageSrc, setOriginalImageSrc] = useState(null)
  const [croppedImageSrc, setCroppedImageSrc] = useState(currentImage || null)
  const [crop, setCrop] = useState({
    unit: "%",
    width: 50,
    x: 25,
    y: 25,
  })
  const [completedCrop, setCompletedCrop] = useState(null)
  const [showCrop, setShowCrop] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const imgRef = useRef(null)
  const canvasRef = useRef(null)

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result
        if (result) {
          setOriginalImageSrc(result)
          setCroppedImageSrc(null)
          setUploadedImage(file)
          setShowCrop(true)
          setCompletedCrop(null)
          // Reset crop
          setCrop({
            unit: "%",
            width: 50,
            x: 25,
            y: 25,
          })
        }
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    multiple: false,
  })

  const handleCropChange = (newCrop) => {
    setCrop(newCrop)
  }

  const handleCropComplete = (crop) => {
    setCompletedCrop(crop)
  }

  const cropImage = async () => {
    const image = imgRef.current
    const canvas = canvasRef.current

    if (!image || !canvas || !completedCrop) {
      console.log("Missing requirements:", { image: !!image, canvas: !!canvas, completedCrop: !!completedCrop })
      return null
    }

    const ctx = canvas.getContext("2d")
    if (!ctx) {
      console.log("No canvas context")
      return null
    }

    // Canvas boyutunu ayarla
    canvas.width = 512
    canvas.height = 512

    // Görüntülenen image boyutları
    const displayedWidth = image.width
    const displayedHeight = image.height

    // Gerçek image boyutları
    const naturalWidth = image.naturalWidth
    const naturalHeight = image.naturalHeight

    // Ölçek faktörlerini hesapla
    const scaleX = naturalWidth / displayedWidth
    const scaleY = naturalHeight / displayedHeight

    // Crop koordinatlarını gerçek image boyutuna çevir
    let sourceX, sourceY, sourceWidth, sourceHeight

    if (completedCrop.unit === "%") {
      // Yüzde tabanlı crop
      sourceX = (completedCrop.x / 100) * naturalWidth
      sourceY = (completedCrop.y / 100) * naturalHeight
      sourceWidth = (completedCrop.width / 100) * naturalWidth
      sourceHeight = (completedCrop.height / 100) * naturalHeight
    } else {
      // Piksel tabanlı crop - ölçeklendir
      sourceX = completedCrop.x * scaleX
      sourceY = completedCrop.y * scaleY
      sourceWidth = completedCrop.width * scaleX
      sourceHeight = completedCrop.height * scaleY
    }

    console.log("Image dimensions:", {
      displayed: { width: displayedWidth, height: displayedHeight },
      natural: { width: naturalWidth, height: naturalHeight },
      scale: { x: scaleX, y: scaleY },
    })

    console.log("Crop info:", {
      original: completedCrop,
      calculated: { sourceX, sourceY, sourceWidth, sourceHeight },
    })

    try {
      // Canvas'ı temizle
      ctx.fillStyle = "white"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Kırpılmış alanı çiz
      ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, 512, 512)

      return new Promise((resolve) => {
        canvas.toBlob(resolve, "image/jpeg", 0.9)
      })
    } catch (error) {
      console.error("Canvas drawing error:", error)
      return null
    }
  }

  const handleSaveCrop = async () => {
    if (!completedCrop || !imgRef.current || !uploadedImage) {
      console.log("Save crop - missing requirements")
      return
    }

    setIsProcessing(true)

    try {
      const blob = await cropImage()

      if (blob) {
        const croppedFile = new File([blob], uploadedImage.name, {
          type: "image/jpeg",
          lastModified: Date.now(),
        })

        const croppedUrl = URL.createObjectURL(croppedFile)
        setCroppedImageSrc(croppedUrl)

        onImageSave(croppedFile)
        setShowCrop(false)
        console.log("Crop saved successfully")
      } else {
        console.log("Failed to create blob")
      }
    } catch (error) {
      console.error("Crop error:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRemoveImage = () => {
    if (croppedImageSrc && croppedImageSrc.startsWith("blob:")) {
      URL.revokeObjectURL(croppedImageSrc)
    }

    setOriginalImageSrc(null)
    setCroppedImageSrc(null)
    setUploadedImage(null)
    setShowCrop(false)
    setCompletedCrop(null)
    onImageSave(null)
  }

  const handleEditCrop = () => {
    setShowCrop(true)
    setCompletedCrop(null)
    setCrop({
      unit: "%",
      width: 50,
      x: 25,
      y: 25,
    })
  }

  if (showCrop && originalImageSrc) {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Fotoğrafı Kırp</h3>
            <Button variant="outline" size="sm" onClick={() => setShowCrop(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <div className="max-w-md w-full">
              <ReactCrop
                crop={crop}
                onChange={handleCropChange}
                onComplete={handleCropComplete}
                minWidth={10}
                minHeight={10}
                keepSelection={true}
              >
                <img
                  ref={imgRef}
                  src={originalImageSrc || "/placeholder.svg"}
                  alt="Crop"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    display: "block",
                  }}
                  onLoad={() => {
                    setCrop({
                      unit: "%",
                      width: 50,
                      aspect: 1,
                      x: 25,
                      y: 25,
                    })
                  }}
                />
              </ReactCrop>
            </div>

            {/* Gizli canvas */}
            <canvas ref={canvasRef} style={{ display: "none" }} />

            <div className="flex gap-2">
              <Button
                onClick={handleSaveCrop}
                type="button"
                className="flex items-center gap-2"
                disabled={!completedCrop || isProcessing}
              >
                <Save className="w-4 h-4" />
                {isProcessing ? "İşleniyor..." : "Kaydet"}
              </Button>
              <Button variant="outline" type="button" onClick={() => setShowCrop(false)}>
                İptal
              </Button>
            </div>

            {/* Debug bilgileri */}
            {completedCrop && imgRef.current && (
              <div className="text-xs text-gray-500 text-center space-y-1">
                <p>
                  Crop (%): x={completedCrop.x.toFixed(1)}, y={completedCrop.y.toFixed(1)}
                </p>
                <p>
                  Size (%): {completedCrop.width.toFixed(1)} x {completedCrop.height.toFixed(1)}
                </p>
                <p>
                  Image: {imgRef.current.width} x {imgRef.current.height} (displayed)
                </p>
                <p>
                  Natural: {imgRef.current.naturalWidth} x {imgRef.current.naturalHeight}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="space-y-4">
          {originalImageSrc || croppedImageSrc ? (
            <div className="relative inline-block">
              <img
                src={croppedImageSrc || originalImageSrc || "/placeholder.svg"}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg mx-auto block"
              />
              <Button variant="destructive" size="sm" className="absolute -top-2 -right-2" onClick={handleRemoveImage}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
              {isDragActive ? (
                <p className="text-primary font-medium">Fotoğrafı buraya bırakın...</p>
              ) : (
                <div>
                  <p className="font-medium mb-2">Fotoğraf Yükle</p>
                  <p className="text-sm text-muted-foreground">Sürükle bırak yapın veya tıklayarak seçin</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF, WEBP (Max: 5MB)</p>
                </div>
              )}
            </div>
          )}

          {(originalImageSrc || croppedImageSrc) && !showCrop && (
            <div className="flex justify-center gap-2">
              <Button onClick={handleEditCrop} className="flex items-center gap-2">
                <Crop className="w-4 h-4" />
                {croppedImageSrc ? "Tekrar Kırp" : "Fotoğrafı Kırp"}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
