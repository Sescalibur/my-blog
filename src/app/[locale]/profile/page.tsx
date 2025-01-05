import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import { ProfileForm } from '@/components/profile/ProfileForm'
import { UserPosts } from '@/components/profile/UserPosts'
import { ProfileSkeleton } from '@/components/profile/ProfileSkeleton'
import { User } from '@/models/User'
import { Post } from '@/models/Post'
import dbConnect from '@/lib/mongoose'
import Image from 'next/image'
import { Metadata } from 'next'
import { ProfileImage } from '@/components/profile/ProfileImage'

async function getUserWithPosts(userId: string) {
  await dbConnect();
  
  const [user, posts] = await Promise.all([
    User.findById(userId).select('-password').lean(),
    Post.find({ author: userId }).sort({ createdAt: -1 }).lean()
  ]);

  if (!user) return null;

  const serializedUser = {
    ...user,
    _id: user._id.toString(),
    createdAt: user.createdAt?.toISOString(),
    updatedAt: user.updatedAt?.toISOString(),
    socialLinks: user.socialLinks ? {
      ...user.socialLinks,
      _id: user.socialLinks._id?.toString()
    } : null
  };

  const serializedPosts = posts.map(post => ({
    ...post,
    _id: post._id.toString(),
    author: post.author.toString(),
    createdAt: post.createdAt?.toISOString(),
    updatedAt: post.updatedAt?.toISOString()
  }));

  return {
    user: serializedUser,
    posts: serializedPosts
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Profile')
  
  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'profile',
      images: [
        {
          url: '/images/default-profile-og.jpg', // Varsayılan OG resmi
          width: 1200,
          height: 630,
          alt: t('title')
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description')
    }
  }
}

export default async function ProfilePage() {
  const t = await getTranslations('Profile')
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileContent userId={session.user.id} t={t} />
    </Suspense>
  )
}

async function ProfileContent({ 
  userId, 
  t 
}: { 
  userId: string
  t: any 
}) {
  const data = await getUserWithPosts(userId)
  
  if (!data) {
    redirect('/auth/signin')
  }

  return (
    <div className="py-12">
      {/* Kapak Fotoğrafı */}
      <div className="relative h-[200px] md:h-[300px] -mx-4 bg-muted">
        {data.user.coverImage ? (
          <ProfileImage
            src={data.user.coverImage}
            alt="Cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            {t('noCover')}
          </div>
        )}
      </div>

      <div className="container max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
          {/* Sol Taraf - Profil Bilgileri */}
          <div className="space-y-6">
            <ProfileForm user={data.user} />
          </div>

          {/* Sağ Taraf - Blog Yazıları */}
          <div>
            <h2 className="text-2xl font-bold mb-6">{t('myPosts')}</h2>
            <UserPosts posts={data.posts} />
          </div>
        </div>
      </div>
    </div>
  )
} 