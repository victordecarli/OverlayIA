'use client';

import { useEditor } from '@/hooks/useEditor';
import { Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShapeEditor } from './ShapeEditor';
import { TextEditor } from './TextEditor';
import { ImageEnhancer } from './ImageEnhancer';

export function EditorTools() {
  const { addShapeSet, addTextSet } = useEditor();

  return (
    <Tabs defaultValue="shapes" className="w-full">
      <TabsList className="w-full grid grid-cols-3 mb-4 bg-transparent border border-white/10">
        <TabsTrigger 
          value="text" 
          className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-400 hover:text-white/80"
        >
          Text
        </TabsTrigger>
        <TabsTrigger 
          value="shapes" 
          className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-400 hover:text-white/80"
        >
          Shapes
        </TabsTrigger>
        <TabsTrigger 
          value="enhance" 
          className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-400 hover:text-white/80"
        >
          Enhance
        </TabsTrigger>
      </TabsList>

      <TabsContent value="shapes" className="mt-0">
        <div className="space-y-4">
          <button
            onClick={() => addShapeSet('square')}
            className="w-full p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Shape</span>
          </button>
          <ShapeEditor />
        </div>
      </TabsContent>

      <TabsContent value="text" className="mt-0">
        <div className="space-y-4">
          <button
            onClick={addTextSet}
            className="w-full p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Text</span>
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
