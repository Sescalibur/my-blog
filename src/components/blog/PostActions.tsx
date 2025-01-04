'use client'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Edit, Trash2 } from 'lucide-react'

interface PostActionsProps {
  postId: string
  locale: string
}

export function PostActions({ postId, locale }: PostActionsProps) {
  const t = useTranslations('BlogPost')
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleEdit = () => {
    router.push(`/${locale}/blog/edit/${postId}`)
  }

  const handleDelete = async () => {
    if (!window.confirm(t('deleteConfirm'))) return

    setIsDeleting(true)
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        throw new Error(t('deleteError'))
      }

      router.push(`/${locale}/blog`)
      router.refresh()
    } catch (error) {
      console.error('Failed to delete post:', error)
      alert(t('deleteError'))
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex gap-4">
      <button
        onClick={handleEdit}
        className="flex items-center gap-2 text-primary hover:text-primary/80"
      >
        <Edit size={20} />
        {t('edit')}
      </button>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="flex items-center gap-2 text-red-500 hover:text-red-600 disabled:opacity-50"
      >
        <Trash2 size={20} />
        {isDeleting ? t('deleting') : t('delete')}
      </button>
    </div>
  )
} 