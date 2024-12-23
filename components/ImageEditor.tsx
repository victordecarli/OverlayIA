'use client';

import { EditorTools } from './EditorTools';
import { Canvas } from './Canvas';
import { FloatingToolbar } from './FloatingToolbar';
import { useEditor } from '@/hooks/useEditor';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export function ImageEditor() {
  const { image, isProcessing } = useEditor();
  const showTools = image.original && !isProcessing;
  const [isEditorVisible, setIsEditorVisible] = useState(true);

  return (
    <div className="relative h-screen max-h-[calc(100vh-100px)]">
      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col h-full">
        {/* Canvas Section */}
        <div className={`relative bg-black/20 rounded-lg overflow-hidden transition-all duration-300 ${
          showTools && isEditorVisible ? 'h-[65vh]' : 'h-full'
        }`}>
          <Canvas />
          {showTools && (
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              <button
                onClick={() => setIsEditorVisible(!isEditorVisible)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-black/90 border border-white/10 backdrop-blur-sm"
              >
                {isEditorVisible ? (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                )}
              </button>
              <FloatingToolbar />
            </div>
          )}
        </div>
        
        {/* Collapsible Editor Tools Section */}
        {showTools && (
          <div className={`
            transform transition-all duration-300 bg-gradient-to-b from-slate-900/95 to-black/95 
            border-t border-white/10 overflow-hidden
            ${isEditorVisible ? 'h-[35vh]' : 'h-0'}
          `}>
            <div className="h-full overflow-y-auto no-scrollbar p-4">
              <EditorTools />
            </div>
          </div>
        )}
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block h-full">
        <div className="h-full lg:mr-[400px]">
          <div className="relative h-full bg-black/20 rounded-lg overflow-hidden">
            <Canvas />
            {showTools && <FloatingToolbar />}
          </div>
        </div>

        {showTools && (
          <div className="fixed top-[84px] bottom-[20px] right-[20px] w-[380px] bg-gradient-to-b from-slate-900/95 to-black/95 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-xl">
            <div className="h-full overflow-y-auto no-scrollbar p-4">
              <EditorTools />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}