'use client';

import { useEditor } from '@/hooks/useEditor';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Upload, Download, LogIn, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Canvas } from '@/components/Canvas';
import { useIsMobile } from '@/hooks/useIsMobile'; // Add this hook
import { useAuth } from '@/hooks/useAuth';
import { AuthDialog } from '@/components/AuthDialog';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface EditorLayoutProps {
  SideNavComponent: React.ComponentType<{ mobile?: boolean }>;
}

export function EditorLayout({ SideNavComponent }: EditorLayoutProps) {
  const { 
    resetEditor, 
    downloadImage, 
    isDownloading, 
    image,
    isProcessing, // Add this
    isConverting  // Add this
  } = useEditor();
  const isMobile = useIsMobile();
  const { user, isLoading } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const isActionDisabled = isProcessing || isConverting || isDownloading;

  // Add click outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors overflow-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-white/10">
        <div className="px-4 h-16 flex items-center justify-between max-w-7xl mx-auto">
          <a href="/" className="text-xl font-semibold text-gray-900 dark:text-white hover:opacity-80 transition-opacity">
            UnderlayX
          </a>
          <div className="flex items-center gap-2 sm:gap-4">
            {isLoading ? (
              <div className="w-8 h-8 flex items-center justify-center">
                <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
              </div>
            ) : user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="relative flex items-center"
                >
                  <div className="w-8 h-8 relative rounded-full overflow-hidden">
                    <Image
                      src={user.user_metadata.avatar_url}
                      alt="User avatar"
                      fill
                      sizes="32px"
                      className="cursor-pointer hover:opacity-80 transition-opacity object-cover"
                      priority
                    />
                  </div>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-zinc-900 rounded-lg shadow-lg border border-gray-200 dark:border-white/10">
                    <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-white/10">
                      {user.email}
                    </div>
                  </div>
                )}
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

          {/* Editor Controls - Only show when needed */}
          {image.original && (
            <div className="mb-4 flex items-center justify-between max-w-[800px] mx-auto">
              <button
                onClick={() => user ? resetEditor(true) : setShowAuthDialog(true)}
                disabled={isActionDisabled}
                className={cn(
                  "p-3 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-900 dark:text-white transition-colors flex items-center gap-2",
                  isActionDisabled && "opacity-50 cursor-not-allowed hover:bg-gray-100 dark:hover:bg-white/5"
                )}
              >
                <Upload className="w-4 h-4" />
                <span className="text-sm">New Image</span>
              </button>
              <button
                onClick={downloadImage}
                disabled={isActionDisabled}
                className={cn(
                  "p-3 rounded-lg bg-white hover:bg-gray-50 dark:bg-white/10 dark:hover:bg-white/20 text-gray-900 dark:text-white transition-colors flex items-center gap-2",
                  isActionDisabled && "opacity-50 cursor-not-allowed hover:bg-white dark:hover:bg-white/10"
                )}
              >
                <Download className="w-4 h-4" />
                <span className="text-sm">Download</span>
              </button>
            </div>
          )}

          <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
            <div className="w-full max-w-[800px] aspect-square lg:aspect-auto lg:h-full relative rounded-lg overflow-hidden bg-gray-50 dark:bg-zinc-900 mobile-canvas-container">
              <Canvas />
            </div>
          </div>
        </main>
      </div>

      <AuthDialog
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        returnUrl={typeof window !== 'undefined' ? window.location.pathname : ''}
      />
    </div>
  );
}
