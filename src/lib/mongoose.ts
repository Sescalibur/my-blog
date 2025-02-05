import mongoose from 'mongoose';


const MONGODB_URI = process.env.MONGODB_URI as string;

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