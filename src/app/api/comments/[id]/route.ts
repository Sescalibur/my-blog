import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { Comment } from "@/models/Comment"
import dbConnect from '@/lib/mongoose'

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
    const comment = await Comment.findById(params.id)
    
    if (!comment) {
      return new Response('Comment not found', { status: 404 })
    }

    // Yetkilendirme kontrolü
    if (comment.author.toString() !== session.user.id) {
      return new Response('Forbidden', { status: 403 })
    }

    await Comment.findByIdAndDelete(params.id)

    return new Response(null, { status: 204 })
  } catch (error) {
    console.error('Failed to delete comment:', error)
    return new Response('Error deleting comment', { status: 500 })
  }
} 