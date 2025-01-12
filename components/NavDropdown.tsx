'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, Type, Shapes, ImageDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export function NavDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
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
          <Link 
            href="/text-behind-image"
            className="flex w-full items-center gap-3 p-4 hover:bg-white/10 text-white transition-colors"
            onClick={() => setIsOpen(false)}
            role="menuitem"
          >
            <Type className="w-5 h-5" aria-hidden="true" />
            <div className="flex flex-col text-left">
              <span className="font-medium">Text Behind Image</span>
              <span className="text-xs text-gray-300">Add text behind your images</span>
            </div>
          </Link>
          
          <Link 
            href="/shape-behind-image"
            className="flex w-full items-center gap-3 p-4 hover:bg-white/10 text-white transition-colors"
            onClick={() => setIsOpen(false)}
            role="menuitem"
          >
            <Shapes className="w-5 h-5" aria-hidden="true" />
            <div className="flex flex-col text-left">
              <span className="font-medium">Shapes Behind Image</span>
              <span className="text-xs text-gray-300">Add shapes behind your images</span>
            </div>
          </Link>

          <Link 
            href="/remove-background"
            className="flex w-full items-center gap-3 p-4 hover:bg-white/10 text-white transition-colors"
            onClick={() => setIsOpen(false)}
            role="menuitem"
          >
            <ImageDown className="w-5 h-5" aria-hidden="true" />
            <div className="flex flex-col text-left">
              <span className="font-medium">Remove Image Background</span>
              <span className="text-xs text-gray-300">Remove the background from your image</span>
            </div>
          </Link>

          <Link 
            href="/change-background"
            className="flex w-full items-center gap-3 p-4 hover:bg-white/10 text-white transition-colors"
            onClick={() => setIsOpen(false)}
            role="menuitem"
          >
            <ImageDown className="w-5 h-5" aria-hidden="true" />
            <div className="flex flex-col text-left">
              <span className="font-medium">Change Image Background</span>
              <span className="text-xs text-gray-300">Easily change the background of your image</span>
            </div>
          </Link>

          <Link 
            href="/clone-image"
            className="flex w-full items-center gap-3 p-4 hover:bg-white/10 text-white transition-colors"
            onClick={() => setIsOpen(false)}
            role="menuitem"
          >
            <ImageDown className="w-5 h-5" aria-hidden="true" />
            <div className="flex flex-col text-left">
              <span className="font-medium">Clone Image</span>
              <span className="text-xs text-gray-300">Effortlessly clone and position objects in your image</span>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
