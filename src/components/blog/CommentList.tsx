'use client'
import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useSession } from 'next-auth/react'
import { Comment } from './Comment'

interface CommentListProps {
  postId: string
  comments: any[]
  setComments: (comments: any[]) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

export function CommentList({ 
  postId, 
  comments, 
  setComments, 
  isLoading, 
  setIsLoading 
}: CommentListProps) {
  const t = useTranslations('Comments')
  const { data: session } = useSession()

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/posts/${postId}/comments`)
        if (!res.ok) throw new Error('Failed to fetch comments')
        const data = await res.json()
        setComments(data)
      } catch (error) {
        console.error('Error fetching comments:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchComments()
  }, [postId, setComments, setIsLoading])

  const handleDelete = async (commentId: string) => {
    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE'
      })

      if (!res.ok) throw new Error('Failed to delete comment')

      setComments(prev => prev.filter(comment => comment._id !== commentId))
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }

  if (isLoading) {
    return <div className="animate-pulse space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-muted h-24 rounded-md" />
      ))}
    </div>
  }

  if (comments.length === 0) {
    return <p className="text-muted-foreground">{t('noComments')}</p>
  }

  return (
    <div className="space-y-6">
      {comments.map(comment => (
        <Comment
          key={comment._id}
          comment={comment}
          canDelete={session?.user?.id === comment.author._id}
          onDelete={() => handleDelete(comment._id)}
        />
      ))}
    </div>
  )
} 