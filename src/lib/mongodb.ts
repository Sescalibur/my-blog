import mongoose from 'mongoose'

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local')
}

const uri = process.env.MONGODB_URI as string

let clientPromise: Promise<typeof mongoose>

if (process.env.NODE_ENV === 'development') {
  // Development modunda global değişken kullan
  let globalWithMongoose = global as typeof globalThis & {
    _mongoosePromise?: Promise<typeof mongoose>
  }

  if (!globalWithMongoose._mongoosePromise) {
    globalWithMongoose._mongoosePromise = mongoose.connect(uri)
  }

  clientPromise = globalWithMongoose._mongoosePromise
} else {
  // Production modunda direkt bağlan
  clientPromise = mongoose.connect(uri)
}

export default clientPromise