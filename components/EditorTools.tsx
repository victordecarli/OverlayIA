'use client';

import { useEditor } from '@/hooks/useEditor';
import { Trash2, Copy, GripVertical } from 'lucide-react';

export function EditorTools({ onClose }: { onClose: () => void }) {
  const { textSets, updateTextSet, removeTextSet, duplicateTextSet } = useEditor();

  return (
    <div className="space-y-6">
      {textSets.map((textSet) => (
        <div key={textSet.id} className="group relative space-y-4">
          {/* Text Input and Quick Actions */}
          <div className="flex items-start gap-3">
            <div className="mt-2 cursor-move text-gray-500">
              <GripVertical size={16} />
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={textSet.text}
                onChange={(e) => updateTextSet(textSet.id, { text: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 rounded-lg border border-white/10 text-white"
                placeholder="Enter text..."
              />
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  onClick={() => duplicateTextSet(textSet.id)}
                  className="p-1.5 text-xs bg-violet-600/20 text-violet-400 rounded-md hover:bg-violet-600/30"
                >
                  <Copy size={14} />
                </button>
                <button
                  onClick={() => removeTextSet(textSet.id)}
                  className="p-1.5 text-xs bg-red-600/20 text-red-400 rounded-md hover:bg-red-600/30"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Simplified Controls */}
          <div className="space-y-4 px-7">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Size</label>
                <input
                  type="range"
                  min="12"
                  max="200"
                  value={textSet.fontSize}
                  onChange={(e) => updateTextSet(textSet.id, { fontSize: parseInt(e.target.value) })}
                  className="w-full accent-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Color</label>
                <input
                  type="color"
                  value={textSet.color}
                  onChange={(e) => updateTextSet(textSet.id, { color: e.target.value })}
                  className="w-full h-8 rounded-md"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Position X</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={textSet.position.horizontal}
                  onChange={(e) => updateTextSet(textSet.id, {
                    position: { ...textSet.position, horizontal: parseInt(e.target.value) }
                  })}
                  className="w-full accent-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Position Y</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={textSet.position.vertical}
                  onChange={(e) => updateTextSet(textSet.id, {
                    position: { ...textSet.position, vertical: parseInt(e.target.value) }
                  })}
                  className="w-full accent-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm text-gray-400 mb-1">Rotation</label>
              <input
                type="range"
                min="-180"
                max="180"
                value={textSet.rotation}
                onChange={(e) => updateTextSet(textSet.id, { rotation: parseInt(e.target.value) })}
                className="w-full accent-white"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
