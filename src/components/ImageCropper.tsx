'use client'
import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { useTranslations } from 'next-intl'
import { Dialog } from '@headlessui/react'
import { Slider } from './ui/Slider'

interface ImageCropperProps {
  image: string
  aspect: number
  type: 'avatar' | 'cover'
  onCropComplete: (croppedImage: string) => void
  onCancel: () => void
}

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { width: number; height: number; x: number; y: number },
  type: 'avatar' | 'cover'
): Promise<string> {
  const image = new Image()
  image.src = imageSrc

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('No 2d context')
  }

  await new Promise((resolve) => {
    image.onload = resolve
  })

  // Canvas boyutlarını ayarla
  canvas.width = type === 'avatar' ? 400 : 1200
  canvas.height = type === 'avatar' ? 400 : 400

  // Resmi kırp ve boyutlandır
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    canvas.width,
    canvas.height
  )

  // Avatar için yuvarlak kırpma
  if (type === 'avatar') {
    ctx.globalCompositeOperation = 'destination-in'
    ctx.beginPath()
    ctx.arc(200, 200, 200, 0, Math.PI * 2)
    ctx.fill()
  }

  return canvas.toDataURL('image/jpeg', 0.9)
}

export function ImageCropper({ image, aspect, type, onCropComplete, onCancel }: ImageCropperProps) {
  const t = useTranslations('Profile')
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)

  const onCropChange = useCallback((location: { x: number; y: number }) => {
    setCrop(location)
  }, [])

  const onZoomChange = useCallback((zoom: number) => {
    setZoom(zoom)
  }, [])

  const onCropAreaChange = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleCropComplete = useCallback(async () => {
    try {
      if (!croppedAreaPixels) return
      const croppedImage = await getCroppedImg(image, croppedAreaPixels, type)
      onCropComplete(croppedImage)
    } catch (e) {
      console.error(e)
    }
  }, [croppedAreaPixels, image, onCropComplete, type])
  console.log(type)
  return (
    <Dialog open={true} onClose={onCancel} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-3xl w-full bg-background rounded-lg shadow-xl">
          <div className={`relative h-[60vh] w-full ${type === 'avatar' ? 'rounded-full overflow-hidden' : ''}`}>
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={onCropChange}
              onZoomChange={onZoomChange}
              onCropComplete={onCropAreaChange}
              cropShape={type === 'avatar' ? 'round' : 'rect'}
              showGrid={type === 'cover'}
            />
          </div>

          <div className="p-4 space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">
                {t('zoom')}
              </label>
              <Slider
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={setZoom}
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleCropComplete}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90"
              >
                {t('apply')}
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
} 