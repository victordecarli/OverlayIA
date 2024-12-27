'use client';

import { useEditor } from '@/hooks/useEditor';
import { Plus, Type, Shapes, Sliders } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShapeEditor } from './ShapeEditor';
import { TextEditor } from './TextEditor';
import { ImageEnhancer } from './ImageEnhancer';

export function EditorTools() {
  const { addShapeSet, addTextSet, image } = useEditor();
  const hasImage = !!image.original;

  return (
    <Tabs defaultValue="text" className="w-full">
      <TabsList className="w-full grid grid-cols-2 mb-4 bg-transparent border border-white/10">
        <TabsTrigger 
          value="text" 
          className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-400 hover:text-white/80"
        >
          <Type className="w-3 h-3 lg:w-4 lg:h-4 mr-1.5" />
          <span className="text-xs lg:text-sm">Text</span>
        </TabsTrigger>
        <TabsTrigger 
          value="shapes" 
          className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-400 hover:text-white/80"
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
            disabled={!hasImage}
            className="w-full p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            <span>{hasImage ? 'Add Shape' : 'Upload image to add shapes'}</span>
          </button>
          <ShapeEditor />
        </div>
      </TabsContent>

      <TabsContent value="text" className="mt-0">
        <div className="space-y-4">
          <button
            onClick={addTextSet}
            disabled={!hasImage}
            className="w-full p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            <span>{hasImage ? 'Add Text' : 'Upload image to add text'}</span>
          </button>
          <TextEditor />
        </div>
      </TabsContent>

      <TabsContent value="enhance" className="mt-0">
        <ImageEnhancer />
      </TabsContent>
    </Tabs>
  );
}
