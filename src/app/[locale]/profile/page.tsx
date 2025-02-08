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
import { Metadata } from 'next/types'
import { ProfileImage } from '@/components/profile/ProfileImage'
import { TFunction } from 'next-intl'

interface SerializedUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  coverImage?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
  socialLinks?: {
    _id?: string;
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
  } | null;
}

interface SerializedPost {
  _id: string;
  title: string;
  content: string;
  author: string;
  createdAt?: string;
  updatedAt?: string;
  __v: number;
}

async function getUserWithPosts(userId: string) {
  await dbConnect();
  
  const [user, posts] = await Promise.all([
    User.findById(userId).select('-password').lean(),
    Post.find({ author: userId }).sort({ createdAt: -1 }).lean()
  ]);

  if (!user) return null;

  const serializedUser: SerializedUser = {
    ...user,
    _id: user._id.toString(),
    createdAt: user.createdAt?.toISOString(),
    updatedAt: user.updatedAt?.toISOString(),
    socialLinks: user.socialLinks ? {
      ...user.socialLinks,
      _id: user.socialLinks._id?.toString()
    } : null
  };

  const serializedPosts: SerializedPost[] = posts.map(post => ({
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
  t: TFunction 
}) {
  const data = await getUserWithPosts(userId)
  
  if (!data) {
    redirect('/auth/signin')
  }

  return (
    <div className="py-12">
      {/* Kapak Fotoğrafı */}
      
        <div className="w-full max-w-[72vw] max-h-[24vw] max-md:hidden mx-auto mb-12 relative aspect-[3/1]">
          {data.user.coverImage ? (
            <ProfileImage
              src={data.user.coverImage}
              alt="Cover"
              priority
              sizes="100vw"

              isCover
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