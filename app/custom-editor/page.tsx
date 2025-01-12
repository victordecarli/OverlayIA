'use client';

import { useEditor } from '@/hooks/useEditor';
import { useEffect } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Upload, Download, RefreshCw } from 'lucide-react';
import { SideNavigation } from '@/components/SideNavigation';
import { cn } from '@/lib/utils';
import { Canvas } from '@/components/Canvas';
import { useSearchParams } from 'next/navigation';

export default function EditorPage() {
  const { resetEditor, downloadImage, isDownloading } = useEditor();
  const searchParams = useSearchParams();
  const shouldAutoUpload = false;

  useEffect(() => {
    resetEditor();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors overflow-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-white/10">
        <div className="px-4 h-16 flex items-center justify-between max-w-7xl mx-auto">
          <a 
            href="/" 
            className="text-xl font-semibold text-gray-900 dark:text-white hover:opacity-80 transition-opacity"
          >
            UnderlayX
          </a>
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => resetEditor(true)}
              className="p-2 sm:px-4 sm:py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-900 dark:text-white transition-colors flex items-center gap-2"
              title="Upload New Image"
              aria-label="Upload New Image"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Upload</span>
            </button>
            <button
              onClick={downloadImage}
              disabled={isDownloading}
              className="p-2 sm:px-4 sm:py-2 rounded-lg bg-gray-900 hover:bg-gray-800 dark:bg-white/10 dark:hover:bg-white/20 text-white transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Download Image"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Download</span>
            </button>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <div className="pt-16 flex h-[calc(100vh-4rem)]">
        {/* Side Navigation - Hidden on mobile */}
        <div className="hidden lg:block border-r border-gray-200 dark:border-white/10">
          <SideNavigation />
        </div>

        {/* Main Content */}
        <main className={cn(
          "flex-1 transition-all duration-300 ease-in-out relative",
          "p-4", // Adjusted padding
          "lg:ml-[60px]", // Base margin for collapsed state
          "lg:pl-[320px]" // Reduced space for expanded navigation
        )}>
          {/* Mobile Tabs - Visible only on mobile */}
          <div className="lg:hidden mb-2">
            <SideNavigation mobile />
          </div>

          {/* Editor Content */}
          <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
            <div className="w-full max-w-[800px] aspect-square lg:aspect-auto lg:h-full relative rounded-lg overflow-hidden bg-gray-50 dark:bg-zinc-900 mobile-canvas-container">
              <Canvas shouldAutoUpload={shouldAutoUpload} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
