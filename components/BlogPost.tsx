import { Header } from './Header';
import { Footer } from './Footer';
import Link from 'next/link';

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
            className="prose prose-invert prose-lg max-w-none mb-16"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/20">
            <h2 className="text-2xl font-bold text-white mb-4">Ready to Create Your Own Stunning Designs?</h2>
            <p className="text-gray-300 mb-6">
              Create stunning text and shapes behind images, add glowing effects, and transform your visuals effortlessly with UnderlayX's easy-to-use editor.
            </p>
            <Link 
              href="/custom-editor"
              className="inline-block px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-all hover:scale-105"
            >
              Start Creating Now
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
