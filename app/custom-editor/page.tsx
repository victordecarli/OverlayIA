'use client';

import { Navbar } from '@/components/Navbar';
import { ImageEditor } from '@/components/ImageEditor';

export default function EditorPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <ImageEditor />
      </main>
    </div>
  );
}
