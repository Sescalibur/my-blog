'use client'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'

interface BlogCardProps {
  title: string
  excerpt: string
  slug: string
  date: string
  locale: string
}

export function BlogCard({ title, excerpt, slug, date, locale }: BlogCardProps) {
  const t = useTranslations('Blog')

  return (
    <div className="border rounded-lg p-6 hover:border-primary transition-colors">
      <Link href={`/blog/${slug}`} className="block">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-muted-foreground mb-4">{excerpt}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">{date}</span>
          <span className="text-primary">{t('readMore')} →</span>
        </div>
      </Link>
    </div>
  )
} 