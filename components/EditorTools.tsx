'use client';

import { useEditor } from '@/hooks/useEditor';
import { Plus } from 'lucide-react';

export function EditorTools() {
  const { addShapeSet, addTextSet, image, isProcessing, isConverting } = useEditor();
  const isImageUploaded = !!image.original;
  const isImageProcessed = !!image.background;
  const canAddLayers = isImageUploaded && isImageProcessed;

  const getButtonText = (type: 'text' | 'shape') => {
    if (!isImageUploaded) {
      return `Upload an image to add ${type}`;
    }
    if (isConverting) {
      return 'Converting HEIC to JPEG...';
    }
    if (isProcessing) {
      return 'Processing image...';
    }
    return `Add ${type}`;
  };

  return (
    <div className="space-y-4">
      <button
        onClick={addTextSet}
        disabled={!canAddLayers}
        className="w-full p-2 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-900 dark:text-white rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus className="w-4 h-4" />
        <span>{getButtonText('text')}</span>
      </button>

      <button
        onClick={() => addShapeSet('square')}
        disabled={!canAddLayers}
        className="w-full p-2 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-900 dark:text-white rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus className="w-4 h-4" />
        <span>{getButtonText('shape')}</span>
      </button>
    </div>
  );
}
