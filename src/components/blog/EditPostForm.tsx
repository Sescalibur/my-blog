'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

interface EditPostFormProps {
  post: {
    _id: string
    title: string
    content: string
  }
  locale: string
}

export function EditPostForm({ post, locale }: EditPostFormProps) {
  const t = useTranslations('Blog')
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: post.title,
    content: post.content
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const res = await fetch(`/api/posts/${post._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) {
        const data = await res.json()
        if (Array.isArray(data.errors)) {
          const errorMessages = data.errors
            .map((err: any) => {
              if (err.path[0] === 'title') {
                return t('errorTitle')
              } else if (err.path[0] === 'content') {
                return t('errorContent')
              }
              return null
            })
            .filter(Boolean)
            .join(', ')

          throw new Error(errorMessages || t('error'))
        } else {
          throw new Error(data.message || t('error'))
        }
      }

      router.push(`/${locale}/blog/${post._id}`)
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-2">
          {t('postTitle')}
        </label>
        <input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className="w-full rounded-md border p-2"
          required
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium mb-2">
          {t('postContent')}
        </label>
        <textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
          className="w-full rounded-md border p-2 min-h-[200px]"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50"
      >
        {isSubmitting ? t('updating') : t('update')}
      </button>
    </form>
  )
} 