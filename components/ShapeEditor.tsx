'use client';

import { useEditor } from '@/hooks/useEditor';
import { Trash2, Copy, GripVertical, ChevronDown } from 'lucide-react';
import { SHAPES } from '@/constants/shapes';
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

export function ShapeEditor() {
  const { shapeSets, updateShapeSet, removeShapeSet } = useEditor();

  return (
    <div className="space-y-3">
      {shapeSets.map((shapeSet) => (
        <div key={shapeSet.id} className="group bg-black/20 rounded-lg border border-white/5 p-4">
          {/* Fill Toggle */}
          <div className="flex items-center justify-between mb-4">
            <Label className="text-sm text-gray-400">Fill Shape</Label>
            <Switch
              checked={shapeSet.isFilled}
              onCheckedChange={(checked) => 
                updateShapeSet(shapeSet.id, { isFilled: checked })
              }
            />
          </div>

          {/* Stroke Width (only show when not filled) */}
          {!shapeSet.isFilled && (
            <div className="space-y-1 mb-4">
              <div className="flex justify-between items-center">
                <Label className="text-sm text-gray-400">Stroke Width</Label>
                <span className="text-sm text-gray-400">{shapeSet.strokeWidth || 2}px</span>
              </div>
              <Slider
                min={1}
                max={20}
                step={1}
                value={[shapeSet.strokeWidth || 2]}
                onValueChange={([value]) => updateShapeSet(shapeSet.id, { strokeWidth: value })}
              />
            </div>
          )}

          {/* Shape Controls */}
          <div className="space-y-4">
            {/* Position X */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <Label className="text-sm text-gray-400">Position X</Label>
                <span className="text-sm text-gray-400">{shapeSet.position.horizontal}%</span>
              </div>
              <Slider
                min={0}
                max={100}
                value={[shapeSet.position.horizontal]}
                onValueChange={([value]) => updateShapeSet(shapeSet.id, {
                  position: { ...shapeSet.position, horizontal: value }
                })}
              />
            </div>

            {/* Position Y */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <Label className="text-sm text-gray-400">Position Y</Label>
                <span className="text-sm text-gray-400">{shapeSet.position.vertical}%</span>
              </div>
              <Slider
                min={0}
                max={100}
                value={[shapeSet.position.vertical]}
                onValueChange={([value]) => updateShapeSet(shapeSet.id, {
                  position: { ...shapeSet.position, vertical: value }
                })}
              />
            </div>

            {/* Size */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <Label className="text-sm text-gray-400">Size</Label>
                <span className="text-sm text-gray-400">{shapeSet.scale}%</span>
              </div>
              <Slider
                min={10}
                max={200}
                value={[shapeSet.scale]}
                onValueChange={([value]) => updateShapeSet(shapeSet.id, { scale: value })}
              />
            </div>

            {/* Rotation */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <Label className="text-sm text-gray-400">Rotation</Label>
                <span className="text-sm text-gray-400">{shapeSet.rotation}°</span>
              </div>
              <Slider
                min={-180}
                max={180}
                value={[shapeSet.rotation]}
                onValueChange={([value]) => updateShapeSet(shapeSet.id, { rotation: value })}
              />
            </div>

            {/* Color */}
            <div>
              <Label className="block text-sm text-gray-400 mb-1">Color</Label>
              <input
                type="color"
                value={shapeSet.color}
                onChange={(e) => updateShapeSet(shapeSet.id, { color: e.target.value })}
                className="w-full h-9 cursor-pointer rounded-md border border-white/10 bg-white/5 [&::-webkit-color-swatch-wrapper]:p-1 [&::-webkit-color-swatch]:rounded-md"
              />
            </div>

            {/* Delete Button */}
            <button
              onClick={() => removeShapeSet(shapeSet.id)}
              className="w-full p-2 bg-red-500/10 text-red-400 rounded-md hover:bg-red-500/20"
            >
              Delete Shape
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
