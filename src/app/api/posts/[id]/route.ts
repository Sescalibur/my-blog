import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { Post } from "@/models/Post"
import { createPostSchema } from '@/schemas/post.schema'
import { z } from 'zod'
import { cacheDelete } from '@/lib/cache'
import dbConnect from '@/lib/mongoose'

const CACHE_KEY_POSTS = 'posts:all'

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    await dbConnect()
    const post = await Post.findById(params.id)
    
    if (!post) {
      return new Response('Post not found', { status: 404 })
    }

    // Yetkilendirme kontrolü
    if (post.author.toString() !== session.user.id) {
      return new Response('Forbidden', { status: 403 })
    }

    const body = await req.json()
    const validatedData = createPostSchema.parse(body)

    const updatedPost = await Post.findByIdAndUpdate(
      params.id,
      validatedData,
      { new: true }
    ).populate('author', 'name email')

    // Cache'i temizle
    await cacheDelete(CACHE_KEY_POSTS)
    await cacheDelete(`post:${params.id}`)

    return new Response(JSON.stringify(updatedPost), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Failed to update post:', error)
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ errors: error.errors }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    return new Response('Error updating post', { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    await dbConnect()
    const post = await Post.findById(params.id)
    
    if (!post) {
      return new Response('Post not found', { status: 404 })
    }

    // Yetkilendirme kontrolü
    if (post.author.toString() !== session.user.id) {
      return new Response('Forbidden', { status: 403 })
    }

    await Post.findByIdAndDelete(params.id)

    // Cache'i temizle
    await cacheDelete(CACHE_KEY_POSTS)
    await cacheDelete(`post:${params.id}`)

    return new Response(null, { status: 204 })
  } catch (error) {
    console.error('Failed to delete post:', error)
    return new Response('Error deleting post', { status: 500 })
  }
} 