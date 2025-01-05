import { v2 as cloudinary } from 'cloudinary'

// Maksimum dosya boyutu (5MB)
export const MAX_FILE_SIZE = 5 * 1024 * 1024

// İzin verilen dosya tipleri
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif'
]

// Cloudinary konfigürasyonu
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// Resim yükleme fonksiyonu
export async function uploadImage(file: Buffer, options: { 
  folder: string,
  transformation?: any[]
}) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder,
        transformation: options.transformation,
        format: 'webp', // Her zaman webp formatına dönüştür
        quality: 'auto:good', // Otomatik kalite optimizasyonu
      },
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }
    )

    uploadStream.end(file)
  })
}

export default cloudinary 