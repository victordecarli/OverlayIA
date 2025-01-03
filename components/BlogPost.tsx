import { Header } from './Header';
import { Footer } from './Footer';

interface BlogPostProps {
  post: {
    title: string;
    content: string;
    date: string;
    description: string;
  }
}

export function BlogPost({ post }: BlogPostProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0A]">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16">
        <article className="max-w-3xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{post.title}</h1>
            <p className="text-gray-400 text-lg mb-4">{post.description}</p>
            <time className="text-gray-500">{post.date}</time>
          </header>
          <div 
            className="prose prose-invert prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>
      <Footer />
    </div>
  );
}
