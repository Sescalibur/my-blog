import { getTranslations } from 'next-intl/server';
import { notFound, redirect } from 'next/navigation';
import { Post } from '@/models/Post';
import dbConnect from '@/lib/mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { EditPostForm } from '@/components/blog/EditPostForm';

interface Props {
  params: {
    locale: string;
    id: string;
  };
}

interface Post {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    name: string;
    email: string;
  };
}

async function getPost(id: string): Promise<Post | null> {
  try {
    await dbConnect();
    const post = await Post.findById(id)
      .populate('author', 'name email')
      .lean() as Post | null;

    if (!post) return null;

    return {
      ...post,
      _id: post._id.toString(),
      author: {
        ...post.author,
        _id: post.author._id.toString()
      }
    };
  } catch (error) {
    console.error('Failed to fetch post:', error);
    return null;
  }
}

export default async function EditPostPage({ params }: Props) {
  const t = await getTranslations('Blog');
  const session = await getServerSession(authOptions);
  const post = await getPost(params.id);

  if (!post) {
    notFound();
  }

  if (!session || session.user.id !== post.author._id) {
    redirect(`/${params.locale}/blog/${params.id}`);
  }

  return (
    <div className="py-12 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">{t('editPost')}</h1>
      <EditPostForm 
        post={post} 
        locale={params.locale} 
      />
    </div>
  );
} 