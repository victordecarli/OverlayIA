import { Metadata, ResolvingMetadata } from 'next';
import { BlogPost as BlogPostComponent } from '@/components/BlogPost';
import { getBlogPost } from '@/lib/blog';

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = (await params).slug;
  const post = await getBlogPost(slug);

  return {
    title: `${post.title} | UnderlayX Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: ['UnderlayX Team'],
      tags: post.tags
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description
    }
  };
}

export default async function BlogPost({ params }: Props) {
  const slug = (await params).slug;
  const post = await getBlogPost(slug);
  
  return <BlogPostComponent post={post} />;
}
