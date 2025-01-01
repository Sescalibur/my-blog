import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { Post } from "../../../models/Post"
import mongoose from 'mongoose'
import { createPostSchema, type CreatePostInput } from '@/schemas/post.schema'
import { z } from 'zod'
import { rateLimit } from '@/lib/rateLimit'
import { testRedisConnection } from '@/lib/redis'
import { cacheGet, cacheSet, cacheDelete } from '@/lib/cache'

// Add this for testing
export const createPost = async (data: CreatePostInput, userId: string) => {
  return await Post.create({
    ...data,
    author: userId
  })
}

const CACHE_KEY_POSTS = 'posts:all'

export async function POST(req: Request) {
  // Redis connection test
  const redisConnected = await testRedisConnection()
  if (!redisConnected) {
    console.warn('Redis not connected, falling back to in-memory rate limiting')
    // Fallback to in-memory rate limiting
    const ip = req.headers.get('x-real-ip')?.toString() || 
              req.headers.get('x-forwarded-for')?.toString() || 'unknown'
    const allowed = rateLimit(ip)  // Using in-memory rateLimit
    if (!allowed) {
      return new Response('Too many requests', { status: 429 })
    }
  } else {
    // Use Redis rate limiting
    // Rate limiting
    const ip = req.headers.get('x-real-ip')?.toString() || 
              req.headers.get('x-forwarded-for')?.toString() || 'unknown'
    const allowed = await rateLimit(ip)
    if (!allowed) {
      return new Response('Too many requests', { status: 429 })
    }
  }
  
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const body = await req.json()
    const validatedData = createPostSchema.parse(body)
    const post = await createPost(validatedData, session.user.id)
    
    // Invalidate cache when new post is created
    await cacheDelete(CACHE_KEY_POSTS)
    
    return new Response(JSON.stringify(post), { 
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ errors: error.errors }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    console.error('Failed to create post:', error)
    if (error instanceof mongoose.Error.ValidationError) {
      return new Response('Invalid data', { status: 400 })
    }
    return new Response('Error creating post', { status: 500 })
  }
}

export async function GET() {
  try {
    // Try to get from cache first
    const cachedPosts = await cacheGet(CACHE_KEY_POSTS)
    if (cachedPosts) {
      return new Response(JSON.stringify(cachedPosts), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // If not in cache, get from DB
    const posts = await Post.find().populate('author', 'name email')
    
    // Cache the results
    await cacheSet(CACHE_KEY_POSTS, posts, 300) // Cache for 5 minutes

    return new Response(JSON.stringify(posts), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    return new Response('Error fetching posts', { status: 500 })
  }
} 