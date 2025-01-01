import redis from '@/lib/redis'

export async function rateLimit(ip: string, limit = 10, window = 60) {
  const key = `rate_limit:${ip}`
  
  const requests = await redis.incr(key)
  
  if (requests === 1) {
    await redis.expire(key, window)
  }
  
  if (requests > limit) {
    return false
  }
  
  return true
} 