'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, Type, Shapes } from 'lucide-react';
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
        className="flex items-center gap-2 px-6 py-2.5 bg-white/10 hover:bg-white/15 rounded-full text-white font-medium transition-all hover:scale-[1.02] border border-white/20 backdrop-blur-sm"
        onBlur={(e) => {
          // Only close if focus didn't move to the dropdown
          if (dropdownRef.current && !dropdownRef.current.contains(e.relatedTarget)) {
            setIsOpen(false);
          }
        }}
      >
        <span>Features</span>
        <ChevronDown className={cn(
          "w-4 h-4 transition-transform",
          isOpen && "rotate-180"
        )} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-black backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-xl">
          <Link 
            href="/text-behind-image"
            className="flex w-full items-center gap-3 p-4 hover:bg-white/10 text-white transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <Type className="w-5 h-5" />
            <div className="flex flex-col text-left">
              <span className="font-medium">Text Behind Image</span>
              <span className="text-xs text-gray-300">Add text behind your images</span>
            </div>
          </Link>
          
          <Link 
            href="/shape-behind-image"
            className="flex w-full items-center gap-3 p-4 hover:bg-white/10 text-white transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <Shapes className="w-5 h-5" />
            <div className="flex flex-col text-left">
              <span className="font-medium">Shapes Behind Image</span>
              <span className="text-xs text-gray-300">Add shapes behind your images</span>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
