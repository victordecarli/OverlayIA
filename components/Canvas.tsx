'use client';

import Image from 'next/image';
import { useEditor } from '@/hooks/useEditor';
import { Upload } from 'lucide-react'; // Add this import

export function Canvas() {
  const { image, textSets, isProcessing, handleImageUpload } = useEditor();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleImageUpload(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {!image.original ? (
        <div 
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="w-full h-full flex items-center justify-center border-2 border-dashed border-gray-600 rounded-lg transition-colors hover:border-gray-400"
        >
          <div className="text-center p-6">
            <input
              id="canvas-upload"
              type="file"
              onChange={onFileChange}
              accept="image/*"
              className="hidden"
            />
            <label
              htmlFor="canvas-upload"
              className="flex flex-col items-center gap-4 cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
              <div className="space-y-2">
                <p className="text-gray-300 text-lg font-medium">Drop your image here</p>
                <p className="text-gray-500 text-sm">or click to upload</p>
                <p className="text-gray-600 text-xs">Supports: JPG, PNG, WEBP</p>
              </div>
            </label>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-full">
          {isProcessing && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                <p className="text-white text-sm">Removing background...</p>
              </div>
            </div>
          )}
          
          {image.original ? (
            <div className="relative w-full h-full">
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={image.background!}
                  alt="Background"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              
              {/* Text Layers */}
              {textSets.map((textSet) => (
                <div
                  key={textSet.id}
                  className="absolute z-10"
                  style={{
                    top: `${textSet.position.vertical}%`,
                    left: `${textSet.position.horizontal}%`,
                    transform: `translate(-50%, -50%) rotate(${textSet.rotation}deg)`,
                    fontSize: `${textSet.fontSize}px`,
                    fontFamily: textSet.fontFamily,
                    color: textSet.color,
                    opacity: textSet.opacity,
                  }}
                >
                  {textSet.text}
                </div>
              ))}
              
              {/* Foreground Image */}
              {image.foreground && (
                <div className="absolute inset-0 z-20">
                  <Image
                    src={image.foreground}
                    alt="Foreground"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              )}
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
