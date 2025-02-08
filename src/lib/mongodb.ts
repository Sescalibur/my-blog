import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI as string;

// MongoDB Native client için
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // Development'da global client kullan
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // Production'da yeni client oluştur
  client = new MongoClient(MONGODB_URI);
  clientPromise = client.connect();
}

// Mongoose bağlantısını da kur
mongoose.connect(MONGODB_URI).then(() => {
  console.log('Mongoose bağlantısı başarılı');
}).catch((err) => {
  console.error('Mongoose bağlantı hatası:', err);
});

export default clientPromise; 