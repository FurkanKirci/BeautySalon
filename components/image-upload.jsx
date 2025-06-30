"use client"

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, X, Crop, Save } from 'lucide-react'

export function ImageUpload({ onImageSave, currentImage }) {
  const [uploadedImage, setUploadedImage] = useState(null)
  const [crop, setCrop] = useState({
    unit: '%',
    width: 100,
    height: 100,
    x: 0,
    y: 0
  })
  const [showCrop, setShowCrop] = useState(false)
  const [imageSrc, setImageSrc] = useState(currentImage || null)

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setImageSrc(reader.result)
        setUploadedImage(file)
        setShowCrop(true)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: false
  })

  const handleCropComplete = (crop) => {
    setCrop(crop)
  }

  const handleSaveCrop = () => {
    if (uploadedImage && imageSrc) {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        const scaleX = img.naturalWidth / img.width
        const scaleY = img.naturalHeight / img.height
        
        canvas.width = 512
        canvas.height = 512
        
        ctx.drawImage(
          img,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          512,
          512
        )
        
        canvas.toBlob((blob) => {
          const croppedFile = new File([blob], uploadedImage.name, {
            type: uploadedImage.type,
            lastModified: Date.now()
          })
          
          onImageSave(croppedFile)
          setShowCrop(false)
          setUploadedImage(null)
        }, 'image/jpeg', 0.9)
      }
      
      img.src = imageSrc
    }
  }

  const handleRemoveImage = () => {
    setImageSrc(null)
    setUploadedImage(null)
    setShowCrop(false)
    onImageSave(null)
  }

  if (showCrop && imageSrc) {
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
            <div className="max-w-md">
              <ReactCrop
                crop={crop}
                onChange={handleCropComplete}
                aspect={1}
                circularCrop={false}
              >
                <img src={imageSrc} alt="Crop" style={{ maxWidth: '100%', height: 'auto' }} />
              </ReactCrop>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleSaveCrop} type='button' className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Kaydet
              </Button>
              <Button variant="outline" type='button' onClick={() => setShowCrop(false)}>
                İptal
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="space-y-4">
          {imageSrc ? (
            <div className="relative">
              <img
                src={imageSrc}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg mx-auto"
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={handleRemoveImage}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
              {isDragActive ? (
                <p className="text-primary font-medium">Fotoğrafı buraya bırakın...</p>
              ) : (
                <div>
                  <p className="font-medium mb-2">Fotoğraf Yükle</p>
                  <p className="text-sm text-muted-foreground">
                    Sürükle bırak yapın veya tıklayarak seçin
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, GIF, WEBP (Max: 5MB)
                  </p>
                </div>
              )}
            </div>
          )}
          
          {imageSrc && !showCrop && (
            <div className="flex justify-center">
              <Button onClick={() => setShowCrop(true)} className="flex items-center gap-2">
                <Crop className="w-4 h-4" />
                Fotoğrafı Kırp
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 