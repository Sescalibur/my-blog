'use client'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { formatDistanceToNow } from 'date-fns'
import { tr, enUS } from 'date-fns/locale'
import { useLocale } from 'next-intl'

interface Post {
  _id: string
  title: string
  content: string
  createdAt: string
}

interface UserPostsProps {
  posts: Post[]
}

export function UserPosts({ posts }: UserPostsProps) {
  const t = useTranslations('Profile')
  const locale = useLocale()
  const dateLocale = locale === 'tr' ? tr : enUS

  if (posts.length === 0) {
    return (
      <div className="text-muted-foreground">
        {t('noPosts')}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {posts.map(post => (
        <article key={post._id} className="border rounded-lg p-6">
          <Link href={`/blog/${post._id}`} className="block group">
            <h3 className="text-xl font-semibold group-hover:text-primary">
              {post.title}
            </h3>
            <p className="text-muted-foreground mt-2">
              {post.content.substring(0, 150)}...
            </p>
            <div className="text-sm text-muted-foreground mt-4">
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
                locale: dateLocale
              })}
            </div>
          </Link>
        </article>
      ))}
    </div>
  )
} 