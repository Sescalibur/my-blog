import { Post } from "../../../../models/Post"
import { postIdSchema, updatePostSchema } from '@/schemas/post.schema'
import { z } from 'zod'
import { cacheGet, cacheSet, cacheDelete } from '@/lib/cache'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const cacheKey = `post:${params.id}`
    
    // Try cache first
    const cachedPost = await cacheGet(cacheKey)
    if (cachedPost) {
      return new Response(JSON.stringify(cachedPost), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // If not in cache, get from DB
    const post = await Post.findById(params.id).populate('author', 'name email')
    if (!post) {
      return new Response('Post not found', { status: 404 })
    }

    // Cache the result
    await cacheSet(cacheKey, post, 300) // Cache for 5 minutes

    return new Response(JSON.stringify(post), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Failed to fetch post:', error)
    return new Response('Error fetching post', { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    // Validate ID
    const { id } = postIdSchema.parse({ id: params.id })
    
    // Validate body
    const body = await req.json()
    const validatedData = updatePostSchema.parse(body)
    
    // Update post...
    const updatedPost = await Post.findByIdAndUpdate(id, validatedData, { new: true })
    if (!updatedPost) {
      return new Response('Post not found', { status: 404 })
    }

    // Invalidate both single post and list caches
    await Promise.all([
      cacheDelete(`post:${id}`),
      cacheDelete('posts:all')
    ])

    return new Response(JSON.stringify(updatedPost), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ errors: error.errors }), { 
        status: 400 
      })
    }
    // ...
  }
} 