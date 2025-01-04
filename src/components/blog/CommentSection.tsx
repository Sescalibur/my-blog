'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { CommentList } from './CommentList'
import { CommentForm } from './CommentForm'

interface CommentSectionProps {
  postId: string
  locale: string
}

export function CommentSection({ postId, locale }: CommentSectionProps) {
  const t = useTranslations('Comments')
  const { data: session } = useSession()
  const [comments, setComments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const handleAddComment = async (content: string) => {
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, postId })
      })

      if (!res.ok) throw new Error('Failed to add comment')

      const newComment = await res.json()
      setComments(prev => [newComment, ...prev])
    } catch (error) {
      console.error('Failed to add comment:', error)
    }
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">{t('title')}</h2>
      
      {session ? (
        <CommentForm onSubmit={handleAddComment} />
      ) : (
        <p className="text-muted-foreground mb-6">
          {t('loginToComment')}
        </p>
      )}

      <CommentList 
        postId={postId} 
        comments={comments}
        setComments={setComments}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    </div>
  )
} 