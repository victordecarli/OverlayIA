'use client';

import { useEditor } from '@/hooks/useEditor';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Copy, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CloneImageEditor() {
  const { 
    image,
    clonedForegrounds,
    addClonedForeground,
    removeClonedForeground,
    updateClonedForegroundPosition
  } = useEditor();

  if (!image.foreground) {
    return (
      <div className="p-4 text-center text-gray-500">
        Please upload an image first to use the clone feature.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button
        onClick={addClonedForeground}
        className="w-full"
        variant="default"
      >
        <Copy className="w-4 h-4 mr-2" />
        Add Clone
      </Button>

      <div className="space-y-4">
        {clonedForegrounds.map((clone, index) => (
          <div key={clone.id} className="space-y-4 p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Clone {index + 1}</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeClonedForeground(clone.id)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Horizontal Position</label>
              <Slider
                value={[clone.position.x]}
                onValueChange={([x]) => updateClonedForegroundPosition(clone.id, { x, y: clone.position.y })}
                min={-100}
                max={100}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Vertical Position</label>
              <Slider
                value={[clone.position.y]}
                onValueChange={([y]) => updateClonedForegroundPosition(clone.id, { x: clone.position.x, y })}
                min={-100}
                max={100}
                step={1}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
