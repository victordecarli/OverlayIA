'use client';

import { EditorTools } from './EditorTools';
import { Canvas } from './Canvas';
import { useEditor } from '@/hooks/useEditor';
import { Loader2, RotateCcw, Download, Upload } from 'lucide-react';

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
      className="flex-1 px-2 py-1.5 lg:px-4 lg:py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors font-medium disabled:opacity-50 text-xs lg:text-sm flex items-center justify-center gap-2"
    >
      {isDownloading ? (
        <>
          <Loader2 className="h-3 w-3 lg:h-4 lg:w-4 animate-spin" />
          <span>Downloading...</span>
        </>
      ) : (
        <>
          <Download className="h-3 w-3 lg:h-4 lg:h-4" />
          <span>Download</span>
        </>
      )}
    </button>
  );

  return (
    <div className="relative h-[calc(100vh-100px)]">
      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col h-full">
        <div className="flex flex-col h-[55vh]">
          {/* <h2 className="text-gray-800 dark:text-white/80 font-medium text-xs mb-2">Preview</h2> */}
          <div className="relative bg-white dark:bg-black/20 rounded-xl border border-gray-100 dark:border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.05)] dark:shadow-[0_0_15px_rgba(0,0,0,0.2)] overflow-hidden flex-1" onContextMenu={handleContextMenu}>
            <Canvas />
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => resetEditor(false)}
              disabled={isDownloading}
              className="flex-1 px-2 py-1.5 lg:px-4 lg:py-2.5 bg-gray-900 hover:bg-gray-800 dark:bg-white/5 dark:hover:bg-white/10 text-white rounded-lg transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
            <DownloadButton />
          </div>
        </div>
        
        <div className="flex-1 mt-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-xl shadow-lg overflow-hidden">
          <div className="h-full overflow-y-auto no-scrollbar">
            <div className="p-4"> {/* Add padding wrapper */}
              <EditorTools />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block h-full">
        <div className="h-full lg:mr-[500px]">
          <div className="flex flex-col gap-4 h-full">
            <div className="flex-1">
              <div className="relative h-[calc(100%-50px)] bg-white dark:bg-black/20 rounded-xl border border-gray-100 dark:border-white/10 shadow-[0_0_25px_rgba(0,0,0,0.05)] dark:shadow-[0_0_25px_rgba(0,0,0,0.3)] overflow-hidden" onContextMenu={handleContextMenu}>
                <Canvas />
              </div>
            </div>
            <div className="flex gap-3 py-2">
              <button
                onClick={() => resetEditor(false)}
                disabled={isDownloading}
                className="flex-1 px-2 py-1.5 lg:px-4 lg:py-2.5 bg-gray-900 hover:bg-gray-800 dark:bg-white/5 dark:hover:bg-white/10 text-white rounded-lg transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
              <DownloadButton />
            </div>
          </div>
        </div>

        <div className="fixed top-[84px] bottom-[20px] right-[20px] w-[480px] bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <div className="h-full overflow-y-auto no-scrollbar p-4">
            <div className="space-y-4 [&_input]:bg-gray-100 dark:[&_input]:bg-zinc-800 [&_label]:text-gray-700 dark:[&_label]:text-gray-200">
              <EditorTools />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}