import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

// Mongoose bağlantı ayarları
const options = {
  bufferCommands: true,
  autoIndex: true,
  autoCreate: true
};

async function dbConnect() {
  try {
    if (mongoose.connection.readyState === 1) {
      return true;
    }

    await mongoose.connect(MONGODB_URI, options);
    console.log('MongoDB bağlantısı başarılı');
    return true;
  } catch (error) {
    console.error('MongoDB bağlantı hatası:', error);
    return false;
  }
}

export default dbConnect; 