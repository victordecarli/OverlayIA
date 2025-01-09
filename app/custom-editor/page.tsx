'use client';

import { Navbar } from '@/components/Navbar';
import { ImageEditor } from '@/components/ImageEditor';
import { useEditor } from '@/hooks/useEditor';
import { useEffect } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Upload } from 'lucide-react';

export default function EditorPage() {
  const { resetEditor } = useEditor();

  useEffect(() => {
    resetEditor();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors">
      <nav className="border-b border-gray-200 dark:border-white/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <a 
            href="/" 
            className="text-xl font-semibold text-gray-900 dark:text-white hover:opacity-80 transition-opacity"
          >
            UnderlayX
          </a>
          <div className="flex items-center gap-4">
            <button
              onClick={() => resetEditor(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-900 dark:text-white transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span className="text-sm">Upload New</span>
            </button>
            <ThemeToggle />
          </div>
        </div>
      </nav>
      <main className="flex-1 container mx-auto px-4 py-4">
        <ImageEditor />
      </main>
    </div>
  );
}
