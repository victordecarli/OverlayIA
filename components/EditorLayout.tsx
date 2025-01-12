'use client';

import { useEditor } from '@/hooks/useEditor';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Upload, Download, LogIn, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Canvas } from '@/components/Canvas';
import { useIsMobile } from '@/hooks/useIsMobile'; // Add this hook
import { useAuth } from '@/hooks/useAuth';
import { AuthDialog } from '@/components/AuthDialog';
import { useState } from 'react';

interface EditorLayoutProps {
  SideNavComponent: React.ComponentType<{ mobile?: boolean }>;
}

export function EditorLayout({ SideNavComponent }: EditorLayoutProps) {
  const { resetEditor, downloadImage, isDownloading } = useEditor();
  const isMobile = useIsMobile();
  const { user, isLoading } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors overflow-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-white/10">
        <div className="px-4 h-16 flex items-center justify-between max-w-7xl mx-auto">
          <a href="/" className="text-xl font-semibold text-gray-900 dark:text-white hover:opacity-80 transition-opacity">
            UnderlayX
          </a>
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => user ? resetEditor(true) : setShowAuthDialog(true)}
              className="p-2 sm:px-4 sm:py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-900 dark:text-white transition-colors flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Upload</span>
            </button>
            <button
              onClick={downloadImage}
              disabled={isDownloading}
              className="p-2 sm:px-4 sm:py-2 rounded-lg bg-gray-900 hover:bg-gray-800 dark:bg-white/10 dark:hover:bg-white/20 text-white transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span className="sm:inline text-sm">Download</span>
            </button>

            {isLoading ? (
              <div className="w-8 h-8 flex items-center justify-center">
                <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
              </div>
            ) : user ? (
              <div className="flex items-center gap-2">
                <img
                  src={user.user_metadata.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                  alt="User avatar"
                  className="w-8 h-8 rounded-full"
                />
                <span className="hidden sm:block text-sm text-gray-700 dark:text-gray-300">
                  {user.email}
                </span>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthDialog(true)}
                className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </button>
            )}
            
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <div className="pt-16 flex h-[calc(100vh-4rem)]">
        <div className="hidden lg:block border-r border-gray-200 dark:border-white/10">
          <SideNavComponent mobile={isMobile} />
        </div>

        <main className={cn(
          "flex-1 transition-all duration-300 ease-in-out relative",
          "p-4",
          "lg:ml-[60px]",
          "lg:pl-[320px]"
        )}>
          <div className="lg:hidden mb-2">
            <SideNavComponent mobile={isMobile} />
          </div>

          <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
            <div className="w-full max-w-[800px] aspect-square lg:aspect-auto lg:h-full relative rounded-lg overflow-hidden bg-gray-50 dark:bg-zinc-900 mobile-canvas-container">
              <Canvas />
            </div>
          </div>
        </main>
      </div>

      <AuthDialog
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
      />
    </div>
  );
}
