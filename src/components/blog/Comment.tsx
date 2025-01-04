'use client'
import { useTranslations } from 'next-intl'
import { Trash2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { tr, enUS } from 'date-fns/locale'
import { useLocale } from 'next-intl'

interface CommentProps {
  comment: {
    _id: string
    content: string
    author: {
      name: string
    }
    createdAt: string
  }
  canDelete: boolean
  onDelete: () => void
}

export function Comment({ comment, canDelete, onDelete }: CommentProps) {
  const t = useTranslations('Comments')
  const locale = useLocale()
  const dateLocale = locale === 'tr' ? tr : enUS

  const handleDelete = () => {
    if (window.confirm(t('deleteConfirm'))) {
      onDelete()
    }
  }

  return (
    <div className="border rounded-md p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className="font-medium">{comment.author.name}</span>
          <span className="text-muted-foreground text-sm ml-2">
            {formatDistanceToNow(new Date(comment.createdAt), {
              addSuffix: true,
              locale: dateLocale
            })}
          </span>
        </div>
        {canDelete && (
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-600"
            title={t('delete')}
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>
      <p className="text-foreground whitespace-pre-wrap">{comment.content}</p>
    </div>
  )
} 