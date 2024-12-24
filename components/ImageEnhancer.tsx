'use client';

import { useCallback } from 'react';
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useEditor } from '@/hooks/useEditor';
import { useDebounce } from '@/hooks/useDebounce';

export function ImageEnhancer() {
  const { imageEnhancements, updateImageEnhancements } = useEditor();

  const debouncedUpdate = useDebounce((newEnhancements) => {
    updateImageEnhancements(newEnhancements);
  }, 16); // Roughly one frame at 60fps

  const handleChange = useCallback((type: string, value: number) => {
    const newEnhancements = {
      ...imageEnhancements,
      [type]: value
    };
    debouncedUpdate(newEnhancements);
  }, [imageEnhancements, debouncedUpdate]);

  const enhancementControls = [
    { name: 'Brightness', key: 'brightness', min: 0, max: 200 },
    { name: 'Contrast', key: 'contrast', min: 0, max: 200 },
    { name: 'Saturation', key: 'saturation', min: 0, max: 200 },
    { name: 'Fade', key: 'fade', min: 0, max: 100 },
    { name: 'Exposure', key: 'exposure', min: -100, max: 100 },
    { name: 'Highlights', key: 'highlights', min: -100, max: 100 },
    { name: 'Shadows', key: 'shadows', min: -100, max: 100 },
    { name: 'Sharpness', key: 'sharpness', min: 0, max: 100 },
  ];

  return (
    <div className="space-y-6">
      {enhancementControls.map(control => (
        <div key={control.key} className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-sm text-gray-400">{control.name}</Label>
            <span className="text-sm text-gray-400">
              {imageEnhancements[control.key as keyof typeof imageEnhancements]}
            </span>
          </div>
          <Slider
            min={control.min}
            max={control.max}
            value={[imageEnhancements[control.key as keyof typeof imageEnhancements]]}
            onValueChange={([value]) => handleChange(control.key, value)}
            className="w-full"
          />
        </div>
      ))}
    </div>
  );
}
