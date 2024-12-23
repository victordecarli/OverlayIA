'use client';

import { useEditor } from '@/hooks/useEditor';
import { Edit3, Download, RefreshCcw, Plus } from 'lucide-react';
import { Tooltip } from './Tooltip';

interface FloatingToolbarProps {
  onOpenTools: () => void;
}

export function FloatingToolbar({ onOpenTools }: FloatingToolbarProps) {
  const { addTextSet, downloadImage, resetEditor, image, isProcessing } = useEditor();

  const handleAddText = () => {
    addTextSet();
    onOpenTools();
  };

  if (!image.original) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 p-2 bg-gray-900/95 backdrop-blur-md rounded-full border border-white/10 shadow-lg">
      <Tooltip text="Add New Text">
        <button
          onClick={handleAddText}
          className="p-3 hover:bg-white/10 rounded-full text-white"
        >
          <Plus size={20} />
        </button>
      </Tooltip>
      <Tooltip text="Edit Text Layers">
        <button
          onClick={onOpenTools}
          className="p-3 hover:bg-white/10 rounded-full text-white"
        >
          <Edit3 size={20} />
        </button>
      </Tooltip>
      <Tooltip text="Download Image">
        <button
          onClick={downloadImage}
          disabled={isProcessing}
          className="p-3 hover:bg-white/10 rounded-full text-white disabled:opacity-50"
        >
          <Download size={20} />
        </button>
      </Tooltip>
      <Tooltip text="Reset All">
        <button
          onClick={resetEditor}
          disabled={isProcessing}
          className="p-3 hover:bg-white/10 rounded-full text-white disabled:opacity-50"
        >
          <RefreshCcw size={20} />
        </button>
      </Tooltip>
    </div>
  );
}
