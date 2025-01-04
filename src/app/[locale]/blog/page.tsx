import { getTranslations } from 'next-intl/server';
import { BlogCard } from '@/components/blog/BlogCard';
import { Post } from '@/models/Post';
import dbConnect from '@/lib/mongoose';

async function getPosts() {
  try {
    await dbConnect();
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('author', 'name')
      .lean();

    return posts;
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return [];
  }
}

export default async function BlogPage({ params }: { params: { locale: string } }) {
  const t = await getTranslations('Blog');
  const posts = await getPosts();

  return (
    <div className="py-12">
      <h1 className="text-4xl font-bold mb-8">{t('title')}</h1>
      {posts.length === 0 ? (
        <p className="text-muted-foreground">{t('noPosts')}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard
              key={post._id.toString()}
              title={post.title}
              excerpt={post.content.substring(0, 150) + '...'}
              slug={post._id.toString()}
              date={new Date(post.createdAt).toLocaleDateString()}
              locale={params.locale}
            />
          ))}
        </div>
      )}
    </div>
  );
} 