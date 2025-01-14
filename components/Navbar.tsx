'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, Type, Shapes, ImageDown, LogIn, Loader2, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { User } from '@supabase/supabase-js';
import { UserMenu } from './UserMenu';
import { AuthDialog } from './AuthDialog';
import Image from 'next/image';
import { supabase } from '@/utils/supabaseClient';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        // Set up auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (_event, session) => {
            setUser(session?.user ?? null);
          }
        );
        return () => subscription.unsubscribe();
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const navigationItems = [
    {
      href: '/text-behind-image',
      icon: Type,
      title: 'Text Behind Image',
      description: 'Add text behind your images'
    },
    {
      href: '/shape-behind-image',
      icon: Shapes,
      title: 'Shapes Behind Image',
      description: 'Add shapes behind your images'
    },
    {
      href: '/remove-background',
      icon: ImageDown,
      title: 'Remove Image Background',
      description: 'Remove the background from your image'
    },
    {
      href: '/change-background',
      icon: ImageDown,
      title: 'Change Image Background',
      description: 'Easily change the background of your image'
    },
    {
      href: '/clone-image',
      icon: ImageDown,
      title: 'Clone Image',
      description: 'Effortlessly clone and position objects in your image'
    }
  ];

  const renderNavigationItems = (isMobile = false) => (
    navigationItems.map((item) => (
      <Link 
        key={item.href}
        href={item.href}
        className={cn(
          "flex w-full items-center gap-3 p-4 hover:bg-white/10 text-white transition-colors",
          isMobile && "border-b border-white/10"
        )}
        onClick={() => {
          setIsOpen(false);
          setIsMobileMenuOpen(false);
        }}
        role="menuitem"
      >
        <item.icon className="w-5 h-5" aria-hidden="true" />
        <div className="flex flex-col text-left">
          <span className="font-medium">{item.title}</span>
          <span className="text-xs text-gray-300">{item.description}</span>
        </div>
      </Link>
    ))
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100]">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto bg-[#141414] backdrop-blur-xl border border-white/5 rounded-full shadow-xl">
          <div className="px-8 py-3 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-white hover:text-gray-200 transition-colors">
              UnderlayX
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-4">
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center gap-1.5 text-white/80 hover:text-white transition-colors"
                  onBlur={(e) => {
                    if (dropdownRef.current && !dropdownRef.current.contains(e.relatedTarget)) {
                      setIsOpen(false);
                    }
                  }}
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  aria-label="Open features menu"
                >
                  <span>Features</span>
                  <ChevronDown 
                    className={cn(
                      "w-4 h-4 transition-transform",
                      isOpen && "rotate-180"
                    )}
                    aria-hidden="true"
                  />
                </button>

                {isOpen && (
                  <div 
                    className="absolute top-full right-0 mt-2 w-72 bg-black backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-xl"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="features-menu"
                  >
                    {renderNavigationItems()}
                  </div>
                )}
              </div>

              {/* User menu, loading state, or login button */}
              {isLoading ? (
                <div className="w-8 h-8 flex items-center justify-center">
                  <Loader2 className="w-4 h-4 text-white/50 animate-spin" />
                </div>
              ) : user ? (
                <UserMenu user={user} />
              ) : (
                <button
                  onClick={() => setShowAuthDialog(true)}
                  className="flex items-center gap-1.5 text-white/80 hover:text-white transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-[85px] bg-black/95 backdrop-blur-sm">
            <div className="bg-[#141414] border-t border-white/10">
              {renderNavigationItems(true)}
              <div className="p-4 border-t border-white/10">
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-white/50 animate-spin" />
                  </div>
                ) : user ? (
                  <div className="flex items-center gap-3 text-white">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden">
                      <Image
                        src={user.user_metadata.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                        alt="User avatar"
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                        priority
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">{user.email}</span>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAuthDialog(true)}
                    className="w-full flex items-center justify-center gap-2 p-3 text-white bg-purple-600 rounded-lg"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Login</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <AuthDialog
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
      />
    </nav>
  );
}
