import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import { uploadImage, MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from '@/lib/cloudinary-config'
import { rateLimit } from '@/lib/rateLimit'

// Her kullanıcı için saatlik yükleme limiti
const HOURLY_LIMIT = 10

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new Response('Unauthorized', { status: 401 })
    }

    // Rate limiting kontrolü
    const identifier = `upload_${session.user.id}`
    const isAllowed = await rateLimit(identifier, HOURLY_LIMIT, 3600)
    if (!isAllowed) {
      return new Response('Too many uploads. Please try again later.', { 
        status: 429 
      })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string || 'avatar' // avatar veya cover
    
    if (!file) {
      return new Response('No file provided', { status: 400 })
    }

    // Dosya tipi kontrolü
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return new Response('Invalid file type', { status: 400 })
    }

    // Dosya boyutu kontrolü
    if (file.size > MAX_FILE_SIZE) {
      return new Response('File too large. Maximum size is 5MB', { status: 400 })
    }

    // File'ı buffer'a çevir
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Resim tipine göre transformasyon ayarları
    const transformations = type === 'cover' 
      ? [{ width: 1200, height: 400, crop: 'fill' }]
      : [{ width: 400, height: 400, crop: 'fill', radius: 'max' }]

    // Cloudinary'ye yükle
    const result = await uploadImage(buffer, {
      folder: `blog-${type}s`,
      transformation: transformations
    })

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Upload error:', error)
    return new Response('Error uploading file', { status: 500 })
  }
} 