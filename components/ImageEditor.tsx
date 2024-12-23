'use client';

import { EditorTools } from './EditorTools';
import { Canvas } from './Canvas';
import { useEditor } from '@/hooks/useEditor';
import { Download } from 'lucide-react';

export function ImageEditor() {
  const { image, isProcessing, downloadImage } = useEditor();
  const showTools = image.original && !isProcessing;

  // Prevent right-click on canvas
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  };

  return (
    <div className="relative h-screen max-h-[calc(100vh-100px)]">
      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col h-full">
        <div className="relative bg-black/20 rounded-lg overflow-hidden h-[65vh]" onContextMenu={handleContextMenu}>
          <Canvas />
          {showTools && (
            <button
              onClick={downloadImage}
              className="absolute bottom-4 right-4 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
        </div>
        
        {showTools && (
          <div className="h-[35vh] bg-gradient-to-b from-slate-900/95 to-black/95 border-t border-white/10 overflow-hidden">
            <div className="h-full overflow-y-auto no-scrollbar p-4">
              <EditorTools />
            </div>
          </div>
        )}
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block h-full">
        <div className="h-full lg:mr-[450px]">
          <div className="relative h-full bg-black/20 rounded-lg overflow-hidden" onContextMenu={handleContextMenu}>
            <Canvas />
            {showTools && (
              <button
                onClick={downloadImage}
                className="absolute bottom-4 right-4 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Download className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {showTools && (
          <div className="fixed top-[84px] bottom-[20px] right-[20px] w-[430px] bg-gradient-to-b from-slate-900/95 to-black/95 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-xl">
            <div className="h-full overflow-y-auto no-scrollbar p-4">
              <EditorTools />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}