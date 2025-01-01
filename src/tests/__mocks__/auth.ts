import mongoose from 'mongoose'

// Sabit bir ObjectId oluştur
const testUserId = new mongoose.Types.ObjectId()

export const mockSession = {
  user: {
    id: testUserId.toString(),  // ObjectId'yi string'e çevir
    email: 'test@example.com',
    role: 'user',
    name: 'Test User'
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
}

export const getServerSession = jest.fn().mockResolvedValue(mockSession) 