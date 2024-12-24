'use client';

import { useState } from 'react';
import { ShapeEditor } from './ShapeEditor';
import { TextEditor } from './TextEditor';
import { ImageEnhancer } from './ImageEnhancer';
import { Layers, Sliders, Type, Plus } from 'lucide-react';
import { useEditor } from '@/hooks/useEditor';

export function EditorTabs() {
  const [activeTab, setActiveTab] = useState('text');
  const { addTextSet, addShapeSet } = useEditor();

  return (
    <div className="space-y-4">
      <div className="flex gap-2 p-1 bg-white/5 rounded-lg">
        <button
          onClick={() => setActiveTab('text')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'text'
              ? 'bg-white/10 text-white'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Type size={16} />
          Text
        </button>
        <button
          onClick={() => setActiveTab('shapes')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'shapes'
              ? 'bg-white/10 text-white'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Layers size={16} />
          Shapes
        </button>
        <button
          onClick={() => setActiveTab('enhance')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'enhance'
              ? 'bg-white/10 text-white'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sliders size={16} />
          Enhance
        </button>
      </div>

      <div className="flex gap-2">
        {activeTab === 'text' && (
          <button
            onClick={() => addTextSet()}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-white font-medium transition-colors"
          >
            <Plus size={18} />
            Add Text Layer
          </button>
        )}
        {activeTab === 'shapes' && (
          <button
            onClick={() => addShapeSet('rectangle')}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-white font-medium transition-colors"
          >
            <Plus size={18} />
            Add Shape Layer
          </button>
        )}
      </div>

      {activeTab === 'text' && <TextEditor />}
      {activeTab === 'shapes' && <ShapeEditor />}
      {activeTab === 'enhance' && <ImageEnhancer />}
    </div>
  );
}
