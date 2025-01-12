'use client';

import { useEditor } from '@/hooks/useEditor';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Upload, Download, LogIn, Loader2, Home } from 'lucide-react';
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
    isProcessing,
    isConverting 
  } = useEditor();
  const isMobile = useIsMobile();
  const { user, isLoading } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

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

  // Unified state check for all button actions
  const isActionDisabled = isProcessing || isConverting || isDownloading;

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors overflow-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-white/10">
        <div className="px-4 h-16 flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-2 text-gray-900 dark:text-white hover:opacity-80 transition-opacity">
              <span className="text-xl font-semibold hidden sm:inline">UnderlayX</span>
              <div className="flex items-center flex-col">
                <Home className="sm:hidden w-5 h-5" />
                <span className="sm:hidden text-xs mt-0.5 text-gray-600 dark:text-gray-400">Home</span>
              </div>
            </a>
          </div>

          <div className="flex items-center gap-4 sm:gap-6"> {/* Increased gap spacing */}
            {image.original && (
              <>
                <button
                  onClick={() => user ? resetEditor(true) : setShowAuthDialog(true)}
                  disabled={isActionDisabled}
                  className={cn(
                    "flex flex-col items-center px-2", // Added horizontal padding
                    isActionDisabled && "opacity-50 cursor-not-allowed"
                  )}
                  aria-disabled={isActionDisabled}
                >
                  <Upload className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  <span className="text-xs mt-0.5 text-gray-600 dark:text-gray-400">Upload</span>
                </button>
                <button
                  onClick={downloadImage}
                  disabled={isActionDisabled}
                  className={cn(
                    "flex flex-col items-center px-2", // Added horizontal padding
                    isActionDisabled && "opacity-50 cursor-not-allowed"
                  )}
                  aria-disabled={isActionDisabled}
                >
                  <Download className={cn("w-5 h-5 text-gray-700 dark:text-gray-300", isDownloading && "animate-pulse")} />
                  <span className="text-xs mt-0.5 text-gray-600 dark:text-gray-400">Save</span>
                </button>
              </>
            )}
            <div className="flex items-center gap-4 sm:gap-6"> {/* Increased gap between theme toggle and avatar */}
              <ThemeToggle />
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
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-16 sm:pt-16 flex h-[calc(100vh-4rem)]"> {/* Adjusted padding top */}
        <div className="hidden lg:block border-r border-gray-200 dark:border-white/10">
          <SideNavComponent mobile={isMobile} />
        </div>

        <main className={cn(
          "flex-1 transition-all duration-300 ease-in-out relative",
          "p-1 sm:p-4", // Reduced padding even more on mobile
          "lg:ml-[60px]",
          "lg:pl-[320px]"
        )}>
          <div className="lg:hidden mb-1"> {/* Reduced margin on mobile */}
            <SideNavComponent mobile={isMobile} />
          </div>

          <div className="flex items-start justify-center h-[calc(100vh-5rem)] sm:h-[calc(100vh-7rem)]"> {/* Adjusted height calculation for mobile */}
            <div className="w-full max-w-[800px] aspect-square lg:aspect-auto lg:h-full relative overflow-hidden">
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
