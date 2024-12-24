'use client';

import { Navbar } from '@/components/Navbar';
import { ImageEditor } from '@/components/ImageEditor';
import { useEditor } from '@/hooks/useEditor';
import { useEffect } from 'react';

export default function EditorPage() {
  const { resetEditor } = useEditor();

  useEffect(() => {
    // Reset editor state when page mounts
    resetEditor();
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-4">
        <ImageEditor />
      </main>
    </div>
  );
}
