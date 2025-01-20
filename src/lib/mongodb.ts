import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const options = {
  retryWrites: true,
  w: 'majority'
}

let client
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
  console.log('MongoDB bağlantısı başarıyla oluşturuldu')
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
  console.log('MongoDB bağlantısı başarıyla oluşturuldu')
}

export default clientPromise 