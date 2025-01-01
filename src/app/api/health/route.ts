import { testRedisConnection } from '@/lib/redis'

export async function GET() {
  const redisStatus = await testRedisConnection()
  
  return new Response(JSON.stringify({
    status: 'ok',
    redis: redisStatus ? 'connected' : 'disconnected'
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
} 