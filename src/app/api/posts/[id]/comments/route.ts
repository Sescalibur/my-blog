import { Comment } from "@/models/Comment"
import dbConnect from '@/lib/mongoose'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    const comments = await Comment.find({ post: params.id })
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .lean()

    return new Response(JSON.stringify(comments), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Failed to fetch comments:', error)
    return new Response('Error fetching comments', { status: 500 })
  }
} 