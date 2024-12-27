'use client';

import { useEditor } from '@/hooks/useEditor';
import { Plus, Type, Shapes, Sliders } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShapeEditor } from './ShapeEditor';
import { TextEditor } from './TextEditor';
import { ImageEnhancer } from './ImageEnhancer';

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
    <Tabs defaultValue="text" className="w-full">
      <TabsList className="w-full grid grid-cols-2 mb-4 bg-transparent border border-gray-200 dark:border-white/10">
        <TabsTrigger 
          value="text" 
          className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-white/10 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white/80"
        >
          <Type className="w-3 h-3 lg:w-4 lg:h-4 mr-1.5" />
          <span className="text-xs lg:text-sm">Text</span>
        </TabsTrigger>
        <TabsTrigger 
          value="shapes" 
          className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-white/10 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white/80"
        >
          <Shapes className="w-3 h-3 lg:w-4 lg:h-4 mr-1.5" />
          <span className="text-xs lg:text-sm">Shapes</span>
        </TabsTrigger>
        {/* <TabsTrigger 
          value="enhance" 
          className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-400 hover:text-white/80"
        >
          <Sliders className="w-3 h-3 lg:w-4 lg:h-4 mr-1.5" />
          <span className="text-xs lg:text-sm">Enhance</span>
        </TabsTrigger> */}
      </TabsList>

      <TabsContent value="shapes" className="mt-0">
        <div className="space-y-4">
          <button
            onClick={() => addShapeSet('square')}
            disabled={!canAddLayers}
            className="w-full p-2 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-900 dark:text-white rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            <span>{getButtonText('shape')}</span>
          </button>
          <div className="space-y-4 text-gray-900 dark:text-white"> {/* Add text color wrapper */}
            <ShapeEditor />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="text" className="mt-0">
        <div className="space-y-4">
          <button
            onClick={addTextSet}
            disabled={!canAddLayers}
            className="w-full p-2 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-900 dark:text-white rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            <span>{getButtonText('text')}</span>
          </button>
          <div className="space-y-4 text-gray-900 dark:text-white"> {/* Add text color wrapper */}
            <TextEditor />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="enhance" className="mt-0">
        <ImageEnhancer />
      </TabsContent>
    </Tabs>
  );
}
