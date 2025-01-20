import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Post } from '@/models/Post';
import { Link } from '@/i18n/routing';
import dbConnect from '@/lib/mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PostActions } from '@/components/blog/PostActions';
import { CommentSection } from '@/components/blog/CommentSection';

interface Props {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

async function getPost(slug: string) {
  try {
    await dbConnect();
    const post = await Post.findById(slug)
      .populate('author', 'name email')
      .lean();

    return post;
  } catch (error) {
    console.error('Failed to fetch post:', error);
    return null;
  }
}

export default async function BlogPostPage({ params }: Props) {
  const t = await getTranslations('BlogPost');
  const { locale, slug } = await params;
  console.log(locale, slug);
  const post = await getPost(slug);
  const session = await getServerSession(authOptions);

  if (!post) {
    notFound();
  }

  const isAuthor = session?.user?.id === post.author._id.toString();

  return (
    <article className="py-12 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Link href="/blog" className="text-primary">
          ← {t('backToBlog')}
        </Link>
        {isAuthor && (
          <PostActions 
            postId={post._id.toString()} 
            locale={params.locale}
          />
        )}
      </div>
      
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <div className="text-muted-foreground mb-8">
        {t('publishedOn')} {new Date(post.createdAt).toLocaleDateString(params.locale)}
      </div>
      <div className="prose dark:prose-invert max-w-none">
        {post.content}
      </div>
      
      <CommentSection 
        postId={post._id.toString()} 
        locale={params.locale} 
      />
    </article>
  );
} 