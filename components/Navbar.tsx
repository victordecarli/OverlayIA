'use client';

import Link from 'next/link';
import { useEditor } from '@/hooks/useEditor';
import { Upload } from 'lucide-react';

export function Navbar() {
  const { image, resetEditor } = useEditor();

  const handleNewUpload = () => {
    resetEditor(); // Reset editor state first
    const fileInput = document.getElementById('canvas-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ''; // Clear the previous file selection
      fileInput.click();
    }
  };

  return (
    <nav className="border-b border-white/10 bg-black/20 backdrop-blur-md">
      <div className="container mx-auto px-4 h-[80px] flex items-center justify-between">
        <Link 
          href="/"
          onClick={(e) => {
            e.preventDefault();
            resetEditor();
          }}
          className="text-2xl font-bold text-white hover:text-gray-200 transition-colors"
        >
          UnderlayX
        </Link>
        {image.original && (
          <button
            onClick={handleNewUpload}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white"
          >
            <Upload size={20} />
            <span>Upload New</span>
          </button>
        )}
      </div>
    </nav>
  );
}
