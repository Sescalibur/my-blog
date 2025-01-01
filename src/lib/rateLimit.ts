const rateLimits = new Map<string, { count: number, timestamp: number }>()

export function rateLimit(key: string, limit = 100, window = 60000): boolean {
  const now = Date.now()
  const record = rateLimits.get(key)
  
  if (!record) {
    rateLimits.set(key, { count: 1, timestamp: now })
    return true
  }
  
  if (now - record.timestamp > window) {
    rateLimits.set(key, { count: 1, timestamp: now })
    return true
  }
  
  if (record.count >= limit) {
    return false
  }
  
  record.count++
  return true
} 