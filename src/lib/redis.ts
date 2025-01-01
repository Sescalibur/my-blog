import { Redis } from 'ioredis'

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

// Redis connection test
redis.on('connect', () => {
  console.log('Redis connected successfully')
})

redis.on('error', (err) => {
  console.error('Redis connection error:', err)
})

export async function testRedisConnection() {
  try {
    await redis.ping()
    return true
  } catch (error) {
    console.error('Redis ping failed:', error)
    return false
  }
}

export default redis 