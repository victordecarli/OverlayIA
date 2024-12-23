'use client';

import { useEditor } from '@/hooks/useEditor';

export function EditorTools() {
  const { 
    addTextSet,
    updateTextSet,
    removeTextSet,
    duplicateTextSet,
    resetEditor, 
    downloadImage, 
    image,
    textSets,
    isProcessing
  } = useEditor();

  return (
    <div className="flex flex-col h-full">
      {/* Fixed Controls - Always Visible */}
      {image.original && (
        <div className="flex gap-3 mb-4">
          <button
            onClick={downloadImage}
            disabled={isProcessing}
            className={`flex-1 px-4 py-2 ${
              isProcessing
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-white hover:bg-gray-100'
            } text-gray-900 rounded-lg text-sm font-medium`}
          >
            Download
          </button>
          <button
            onClick={resetEditor}
            disabled={isProcessing}
            className={`flex-1 px-4 py-2 ${
              isProcessing
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gray-600 hover:bg-gray-700'
            } text-white rounded-lg text-sm font-medium`}
          >
            Reset
          </button>
        </div>
      )}

      {/* Message when no image is uploaded */}
      {!image.original && (
        <div className="text-center p-6">
          <p className="text-gray-400 text-lg">
            ✨ Upload an image to begin your creative journey!
          </p>
          <p className="text-gray-500 mt-2">
            Transform your photos with custom text and shapes overlays
          </p>
        </div>
      )}

      {/* Scrollable Text Controls */}
      <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {image.original && (
          <div className="space-y-4">
            <button
              onClick={addTextSet}
              className="w-full px-4 py-2 bg-white hover:bg-gray-100 text-gray-900 rounded-lg text-sm font-medium"
            >
              Add New Text
            </button>

            {textSets.map((textSet) => (
              <div key={textSet.id} className="p-3 bg-white/5 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-white">Text Layer</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => duplicateTextSet(textSet.id)}
                      className="p-2 bg-violet-600 hover:bg-violet-700 text-white rounded"
                    >
                      Duplicate
                    </button>
                    <button
                      onClick={() => removeTextSet(textSet.id)}
                      className="p-2 bg-red-600 hover:bg-red-700 text-white rounded"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm text-gray-400">Text Content</label>
                  <input
                    type="text"
                    value={textSet.text}
                    onChange={(e) => updateTextSet(textSet.id, { text: e.target.value })}
                    className="w-full px-3 py-2 bg-black/20 rounded border border-white/10 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm text-gray-400">Font Size: {textSet.fontSize}px</label>
                  <input
                    type="range"
                    min="12"
                    max="200"
                    value={textSet.fontSize}
                    onChange={(e) => updateTextSet(textSet.id, { fontSize: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm text-gray-400">Color</label>
                  <input
                    type="color"
                    value={textSet.color}
                    onChange={(e) => updateTextSet(textSet.id, { color: e.target.value })}
                    className="block w-full h-10 rounded"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm text-gray-400">Opacity: {textSet.opacity}</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={textSet.opacity}
                    onChange={(e) => updateTextSet(textSet.id, { opacity: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="block text-sm text-gray-400">Horizontal: {textSet.position.horizontal}%</label>
                    <input
                      type="range"
                      min="0"
                      max="150"
                      value={textSet.position.horizontal}
                      onChange={(e) => updateTextSet(textSet.id, { 
                        position: { ...textSet.position, horizontal: parseInt(e.target.value) }
                      })}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm text-gray-400">Y: {textSet.position.vertical}%</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={textSet.position.vertical}
                      onChange={(e) => updateTextSet(textSet.id, {
                        position: { ...textSet.position, vertical: parseInt(e.target.value) }
                      })}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm text-gray-400">Rotation: {textSet.rotation}°</label>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    value={textSet.rotation}
                    onChange={(e) => updateTextSet(textSet.id, { rotation: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
