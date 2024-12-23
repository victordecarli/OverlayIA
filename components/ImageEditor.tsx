'use client';

import { EditorTools } from './EditorTools';
import { Canvas } from './Canvas';
import { FloatingToolbar } from './FloatingToolbar';
import { useState } from 'react';
import { useEditor } from '@/hooks/useEditor';

export function ImageEditor() {
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const { image } = useEditor();

  return (
    <div className="relative h-screen max-h-[calc(100vh-100px)]">
      {/* Main Canvas Area */}
      <div className="h-full lg:mr-[340px]">
        <div className="relative h-full bg-black/20 rounded-lg overflow-hidden">
          <Canvas />
          <FloatingToolbar onOpenTools={() => setIsToolsOpen(true)} />
        </div>
      </div>

      {/* Editor Panel */}
      <div
        className={`
          fixed top-auto bottom-0 left-0 right-0 
          lg:bottom-[20px] lg:right-[20px] lg:top-[84px] lg:left-auto
          h-[80vh] lg:h-[calc(100vh-124px)] w-full lg:w-[320px]
          bg-slate-900/95 backdrop-blur-md
          transform transition-transform duration-300
          ${isToolsOpen ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'}
          border border-white/10 lg:rounded-xl z-50 overflow-hidden
        `}
      >
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-white font-medium">Edit Text</h2>
          <button
            onClick={() => setIsToolsOpen(false)}
            className="p-2 hover:bg-white/10 rounded-lg text-white"
          >
            ✕
          </button>
        </div>

        {/* Empty State or Editor Tools */}
        {!image.original ? (
          <div className="h-full flex items-center justify-center p-6 text-center">
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="text-2xl">✨</div>
              </div>
              <h3 className="text-lg font-medium text-white">Start Creating</h3>
              <p className="text-sm text-gray-400 max-w-[240px]">
                Upload an image to begin adding beautiful text overlays to your creation
              </p>
            </div>
          </div>
        ) : (
          <div className="h-full overflow-hidden">
            <div className="p-4 h-full overflow-y-auto no-scrollbar">
              <EditorTools onClose={() => setIsToolsOpen(false)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}