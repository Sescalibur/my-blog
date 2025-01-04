'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>
  parentId?: string
  initialContent?: string
  onCancel?: () => void
}

export function CommentForm({ 
  onSubmit, 
  parentId, 
  initialContent = '', 
  onCancel 
}: CommentFormProps) {
  const t = useTranslations('Comments')
  const [content, setContent] = useState(initialContent)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await onSubmit(content)
      setContent('')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full rounded-md border p-2 min-h-[100px]"
        placeholder={t('placeholder')}
        required
      />
      <div className="flex gap-2 mt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50"
        >
          {isSubmitting ? t('commenting') : t('comment')}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-muted-foreground hover:text-foreground"
          >
            {t('cancel')}
          </button>
        )}
      </div>
    </form>
  )
} 