'use client'
import { useState } from 'react'
import { ImageCropper } from './ImageCropper'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Upload } from 'lucide-react'
import { toast } from 'sonner'

interface CoverUploadProps {
  currentImage?: string
  onUpload: (url: string) => void
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export function CoverUpload({ currentImage, onUpload }: CoverUploadProps) {
  const t = useTranslations('Profile')
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [previewUrl, setPreviewUrl] = useState(currentImage)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [showCropper, setShowCropper] = useState(false)

  const validateFile = (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error(t('errorFileType'))
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(t('errorFileSize'))
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      validateFile(file)
      const reader = new FileReader()
      reader.onload = () => {
        setSelectedImage(reader.result as string)
        setShowCropper(true)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unknown error')
    }
  }

  const handleCropComplete = async (croppedImage: string) => {
    setShowCropper(false)
    setUploading(true)
    
    const loadingToast = toast.loading(t('uploading'))

    try {
      const response = await fetch(croppedImage)
      const blob = await response.blob()
      
      const formData = new FormData()
      formData.append('file', blob, 'cover-image.jpg')
      formData.append('type', 'cover')
      formData.append('width', '1500')
      formData.append('height', '500')
      formData.append('quality', '90')

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!res.ok) {
        throw new Error(t('uploadError'))
      }

      const data = await res.json()
      setPreviewUrl(data.secure_url)
      onUpload(data.secure_url)
      toast.success(t('uploadSuccess'), { id: loadingToast })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload failed', { id: loadingToast })
    } finally {
      setUploading(false)
      setProgress(0)
      setSelectedImage(null)
    }
  }

  return (
    <div className="space-y-4">
      {showCropper && selectedImage && (
        <ImageCropper
          image={selectedImage}
          aspect={16/6}
          type="cover"
          onCropComplete={handleCropComplete}
          onCancel={() => {
            setShowCropper(false)
            setSelectedImage(null)
          }}
        />
      )}

      {previewUrl ? (
        <div className="relative rounded-lg" style={{ paddingBottom: `${100 / (16/6)}%` }}>
          <Image
            src={previewUrl}
            alt={t('imageAlt.cover')}
            fill
            className="object-cover"
          />
          {uploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="w-full max-w-[200px] bg-background rounded-full h-2 mx-4">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div 
          className="bg-muted flex items-center justify-center rounded-lg relative"
          style={{ paddingBottom: `${100 / (16/6)}%` }}
        >
          <Upload className="w-8 h-8 text-muted-foreground" />
        </div>
      )}
      
      <div>
        <input
          type="file"
          accept={ALLOWED_TYPES.join(',')}
          onChange={handleFileSelect}
          disabled={uploading}
          className="hidden"
          id="cover-upload"
        />
        <label
          htmlFor="cover-upload"
          className={`cursor-pointer bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50 inline-block ${
            uploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {uploading ? t('uploading') : t('changePhoto')}
        </label>
        <p className="text-sm text-muted-foreground mt-2">
          {t('imageRequirements')}
        </p>
      </div>
    </div>
  )
} 