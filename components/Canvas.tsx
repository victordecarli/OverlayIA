'use client';

import Image from 'next/image';
import { useEditor } from '@/hooks/useEditor';
import { Upload } from 'lucide-react'; // Add this import
import { CanvasPreview } from './CanvasPreview';

export function Canvas() {
  const { image, textSets, isProcessing, isConverting, handleImageUpload } = useEditor();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
      const fileType = file.type.toLowerCase();
      
      if (validTypes.includes(fileType) || file.name.toLowerCase().match(/\.(heic|heif)$/)) {
        handleImageUpload(file);
      } else {
        alert('Please upload a valid image file (JPG, PNG, WEBP, HEIC, or HEIF)');
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
    const fileType = file.type.toLowerCase();

    if (validTypes.includes(fileType) || file.name.toLowerCase().match(/\.(heic|heif)$/)) {
      handleImageUpload(file);
    } else {
      alert('Please upload a valid image file (JPG, PNG, WEBP, HEIC, or HEIF)');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center p-4">
      {!image.original ? (
        <div 
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="w-full h-full"
        >
          <input
            id="canvas-upload"
            type="file"
            onChange={onFileChange}
            accept="image/jpeg,image/png,image.webp,image.heic,image.heif,.heic,.heif,.jpg,.jpeg,.png,.webp"
            className="hidden"
          />
          <label
            htmlFor="canvas-upload"
            className="w-full h-full flex items-center justify-center border-2 border-dashed border-gray-600/50 rounded-xl transition-all hover:border-gray-400/50 hover:bg-white/[0.02] cursor-pointer"
          >
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-gray-800/50 backdrop-blur-sm flex items-center justify-center border border-gray-700">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
              <div className="space-y-2">
                <p className="text-gray-400 font-medium">Drop image here or click to upload</p>
                <p className="text-gray-500 text-sm">Supports: JPG, PNG, WEBP, HEIC, HEIF</p>
              </div>
            </div>
          </label>
        </div>
      ) : (
        <div className="relative w-full h-full flex items-center justify-center">
          {(isProcessing || isConverting) && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                <p className="text-white text-sm">
                  {isConverting ? 'Converting image format...' : 'Processing image...'}
                </p>
              </div>
            </div>
          )}
          
          {image.original ? (
            <div className="relative w-full h-full prevent-save">
              <CanvasPreview />
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gray-400">Upload an image to get started</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
