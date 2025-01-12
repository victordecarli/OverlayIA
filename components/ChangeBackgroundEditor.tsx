'use client';

import { useEditor } from '@/hooks/useEditor';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Upload } from 'lucide-react';

export function ChangeBackgroundEditor() {
  const { 
    changeBackground, 
    resetBackground, 
    hasChangedBackground,
    foregroundPosition,
    updateForegroundPosition,
    isProcessing 
  } = useEditor();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Upload a new background image to replace the current one.
        </p>
        <Button
          onClick={changeBackground}
          className="w-full"
          variant={hasChangedBackground ? "secondary" : "default"}
          disabled={isProcessing}
        >
          <Upload className="w-4 h-4 mr-2" />
          {isProcessing ? 'procesing...' : hasChangedBackground ? 'Change Background' : 'Upload Background'}
        </Button>
      </div>

      {hasChangedBackground && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Horizontal Position</label>
            <Slider
              value={[foregroundPosition.x]}
              onValueChange={([value]) => updateForegroundPosition({ x: value, y: foregroundPosition.y })}
              min={-100}
              max={100}
              step={1}
            />
          </div>
          <div className="space-y-2 mb-2">
            <label className="text-sm font-medium">Vertical Position</label>
            <Slider
              value={[foregroundPosition.y]}
              onValueChange={([value]) => updateForegroundPosition({ x: foregroundPosition.x, y: value })}
              min={-100}
              max={100}
              step={1}
            />
          </div>
          <Button
          onClick={resetBackground}
          variant="outline"
          className="w-full"
          disabled={!hasChangedBackground}
        >
          Reset Background
        </Button>
        </div>
      )}
    </div>
  );
}
