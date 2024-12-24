'use client';

import { EditorTools } from './EditorTools';
import { Canvas } from './Canvas';
import { useEditor } from '@/hooks/useEditor';
import { Loader2 } from 'lucide-react';

export function ImageEditor() {
  const { image, isProcessing, isDownloading, downloadImage, resetEditor } = useEditor();
  const showTools = image.original && !isProcessing;

  // Prevent right-click on canvas
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  };

  const DownloadButton = () => (
    <button
      onClick={downloadImage}
      disabled={isDownloading}
      className="flex-1 px-4 py-2.5 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isDownloading ? (
        <span className="flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Downloading...
        </span>
      ) : (
        'Download Image'
      )}
    </button>
  );

  return (
    <div className="relative h-screen max-h-[calc(100vh-100px)]">
      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col h-full">
        <div className="flex flex-col h-[60vh]">
          <h2 className="text-white/80 font-medium mb-3">Preview Canvas</h2>
          <div className="relative bg-black/20 rounded-xl border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.2)] overflow-hidden flex-1" onContextMenu={handleContextMenu}>
            <Canvas />
          </div>
          {showTools && (
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => resetEditor(false)} // false to keep the image
                disabled={isDownloading}
                className="flex-1 px-4 py-2.5 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors font-medium disabled:opacity-50"
              >
                Reset Edits
              </button>
              <DownloadButton />
            </div>
          )}
        </div>
        
        {showTools && (
          <div className="h-[40vh] mt-4 bg-gradient-to-b from-black/95 to-black/98 border border-white/10 rounded-xl shadow-lg backdrop-blur-xl overflow-hidden">
            <div className="p-4 border-b border-white/10">
              <h2 className="text-white/80 font-medium">Editing Tools</h2>
              <p className="text-sm text-white/50">Customize your image with shapes and text</p>
            </div>
            <div className="h-[calc(100%-65px)] overflow-y-auto no-scrollbar p-4">
              <EditorTools />
            </div>
          </div>
        )}
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block h-full">
        <div className="h-full lg:mr-[500px]">
          <div className="flex flex-col gap-4">
            <div className="space-y-3">
              <h2 className="text-white/80 font-medium">Preview Canvas</h2>
              <div className="relative h-[calc(100vh-180px)] bg-black/20 rounded-xl border border-white/10 shadow-[0_0_25px_rgba(0,0,0,0.3)] overflow-hidden" onContextMenu={handleContextMenu}>
                <Canvas />
              </div>
            </div>
            {showTools && (
              <div className="flex gap-3">
                <button
                  onClick={() => resetEditor(false)} // false to keep the image
                  disabled={isDownloading}
                  className="flex-1 px-4 py-2.5 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors font-medium disabled:opacity-50"
                >
                  Reset Edits
                </button>
                <DownloadButton />
              </div>
            )}
          </div>
        </div>

        {showTools && (
          <div className="fixed top-[84px] bottom-[20px] right-[20px] w-[480px] bg-gradient-to-b from-black/95 to-black/98 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <div className="p-4 border-b border-white/10">
              <h2 className="text-white/80 font-medium">Editing Tools</h2>
              <p className="text-sm text-white/50">Customize your image with shapes and text</p>
            </div>
            <div className="h-[calc(100%-65px)] overflow-y-auto no-scrollbar p-4">
              <EditorTools />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}