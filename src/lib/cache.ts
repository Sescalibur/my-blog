import redis from './redis'

export async function cacheGet<T>(key: string): Promise<T | null> {
  const cached = await redis.get(key)
  return cached ? JSON.parse(cached) : null
}

export async function cacheSet<T>(key: string, data: T, expireSeconds = 3600) {
  await redis.set(key, JSON.stringify(data), 'EX', expireSeconds)
}

export async function cacheDelete(key: string) {
  await redis.del(key)
} 