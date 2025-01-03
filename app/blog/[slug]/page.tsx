import { Metadata } from 'next';
import { BlogPost as BlogPostComponent } from '@/components/BlogPost';
import { blogPosts } from '@/lib/blog';

// Make generateStaticParams async
export async function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({
    slug,
  }));
}

type Props = {
  params: Promise<{ slug: string }> | { slug: string }
}

// Make generateMetadata async and await params
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const post = blogPosts[resolvedParams.slug];

  return {
    title: `${post.title} | UnderlayX Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description
    }
  };
}

// Make page component async and await params
export default async function BlogPost({ params }: Props) {
  const resolvedParams = await params;
  const post = blogPosts[resolvedParams.slug];
  return <BlogPostComponent post={post} />;
}
