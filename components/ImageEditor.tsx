'use client';

import { EditorTools } from './EditorTools';
import { Canvas } from './Canvas';
import { useEditor } from '@/hooks/useEditor';

export function ImageEditor() {
  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Fixed Image Area */}
      <div className="relative h-[calc(100vh-120px)] flex items-center justify-center bg-black/20 rounded-lg">
        <Canvas />
      </div>

      {/* Tools Column */}
      <div className="h-[calc(100vh-120px)] flex flex-col">
        {/* Fixed Controls */}
        <div className="bg-white/5 rounded-lg p-4 mb-4">
          <EditorTools />
        </div>
      </div>
    </div>
  );
}