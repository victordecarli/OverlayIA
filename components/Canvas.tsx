'use client';

import Image from 'next/image';
import { useEditor } from '@/hooks/useEditor';

export function Canvas() {
  const { image, textSets, isProcessing, handleImageUpload } = useEditor();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleImageUpload(e.target.files[0]);
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {!image.original ? (
        <div className="text-center">
          <input
            id="canvas-upload"
            type="file"
            onChange={onFileChange}
            accept="image/*"
            className="hidden"
          />
          <label
            htmlFor="canvas-upload"
            className="px-6 py-3 bg-white hover:bg-gray-100 text-gray-900 rounded-lg cursor-pointer inline-block"
          >
            Upload Image
          </label>
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
