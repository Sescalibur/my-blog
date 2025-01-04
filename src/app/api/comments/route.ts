import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import { Comment } from "@/models/Comment"
import { z } from 'zod'
import dbConnect from '@/lib/mongoose'

const createCommentSchema = z.object({
  content: z.string().min(1).max(1000),
  postId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid post ID')
})

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    await dbConnect()
    const body = await req.json()
    const validatedData = createCommentSchema.parse(body)

    const comment = await Comment.create({
      content: validatedData.content,
      post: validatedData.postId,
      author: session.user.id
    })

    await comment.populate('author', 'name')

    return new Response(JSON.stringify(comment), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Failed to create comment:', error)
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ errors: error.errors }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    return new Response('Error creating comment', { status: 500 })
  }
} 