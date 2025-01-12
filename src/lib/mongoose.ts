import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MONGODB_URI to .env.local')
}

const MONGODB_URI = process.env.MONGODB_URI;

async function dbConnect() {
  try {
    const { connection } = await mongoose.connect(MONGODB_URI);
    
    if (connection.readyState === 1) {
      console.log('MongoDB bağlantısı başarılı');
      return Promise.resolve(true);
    }
  } catch (error) {
    console.error('MongoDB bağlantı hatası:', error);
    return Promise.reject(error);
  }
}

export default dbConnect; 