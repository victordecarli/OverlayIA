'use client';

import { useEditor } from '@/hooks/useEditor';
import { Trash2, Upload, Plus } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function ImageEditor() {
  const { backgroundImages, addBackgroundImage, removeBackgroundImage, updateBackgroundImage } = useEditor();
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const isAtLimit = backgroundImages.length >= 2;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await addBackgroundImage(file);
      setUploadError(null);
    } catch (error) {
      setUploadError((error as Error).message);
    }
    
    // Reset input
    e.target.value = '';
  };

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg p-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="background-image-upload"
          disabled={isAtLimit}
        />
        <label
          htmlFor="background-image-upload"
          className={cn(
            "flex items-center justify-center w-full p-2 rounded-md",
            "transition-colors",
            isAtLimit
              ? "bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-600 cursor-not-allowed"
              : "bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10"
          )}
        >
          <Plus className="w-4 h-4 mr-2" />
          <span>Upload Image</span>
        </label>
        {isAtLimit && (
          <p className="mt-2 text-sm text-amber-500 dark:text-amber-400">
            Only 1 image allowed
          </p>
        )}
        {uploadError && (
          <p className="mt-2 text-sm text-red-500">{uploadError}</p>
        )}
      </div>

      {backgroundImages.map((image) => (
        <div key={image.id} className="bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Background Image</h3>
            <button
              onClick={() => removeBackgroundImage(image.id)}
              className="text-red-500 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Position controls */}
            <div>
              <div className="flex justify-between items-center">
                <Label>Horizontal Position</Label>
                <span className="text-sm text-gray-500">{image.position.horizontal}%</span>
              </div>
              <Slider
                value={[image.position.horizontal]}
                onValueChange={([value]) => 
                  updateBackgroundImage(image.id, { 
                    position: { ...image.position, horizontal: value } 
                  })
                }
                min={0}
                max={100}
                step={1}
              />
            </div>

            <div>
              <div className="flex justify-between items-center">
                <Label>Vertical Position</Label>
                <span className="text-sm text-gray-500">{image.position.vertical}%</span>
              </div>
              <Slider
                value={[image.position.vertical]}
                onValueChange={([value]) => 
                  updateBackgroundImage(image.id, { 
                    position: { ...image.position, vertical: value } 
                  })
                }
                min={0}
                max={100}
                step={1}
              />
            </div>

            <div>
              <div className="flex justify-between items-center">
                <Label>Scale</Label>
                <span className="text-sm text-gray-500">{image.scale}%</span>
              </div>
              <Slider
                value={[image.scale]}
                onValueChange={([value]) => 
                  updateBackgroundImage(image.id, { scale: value })
                }
                min={10}
                max={200}
                step={1}
              />
            </div>

            <div>
              <div className="flex justify-between items-center">
                <Label>Rotation</Label>
                <span className="text-sm text-gray-500">{image.rotation}°</span>
              </div>
              <Slider
                value={[image.rotation]}
                onValueChange={([value]) => 
                  updateBackgroundImage(image.id, { rotation: value })
                }
                min={-180}
                max={180}
                step={1}
              />
            </div>

            <div>
              <div className="flex justify-between items-center">
                <Label>Opacity</Label>
                <span className="text-sm text-gray-500">{Math.round(image.opacity * 100)}%</span>
              </div>
              <Slider
                value={[image.opacity * 100]}
                onValueChange={([value]) => 
                  updateBackgroundImage(image.id, { opacity: value / 100 })
                }
                min={0}
                max={100}
                step={1}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

