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
import { useState, useEffect } from 'react';
import { GlowEffect } from '@/types/editor';

export function ShapeEditor() {
  const { shapeSets, updateShapeSet, removeShapeSet } = useEditor();
  const [openAccordions, setOpenAccordions] = useState<Record<number, boolean>>({});

  // Auto-open new accordions
  useEffect(() => {
    const newOpenState: Record<number, boolean> = {};
    shapeSets.forEach(set => {
      newOpenState[set.id] = openAccordions[set.id] !== false;
    });
    setOpenAccordions(newOpenState);
  }, [shapeSets.length]);

  const toggleAccordion = (id: number) => {
    setOpenAccordions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-3">
      {shapeSets.map((shapeSet) => (
        <div key={shapeSet.id} className="group bg-black/20 border border-white/5">
          {/* Accordion Header */}
          <div
            onClick={() => toggleAccordion(shapeSet.id)}
            className="flex items-center gap-3 p-3 cursor-pointer hover:bg-white/5"
          >
            <div className="flex-1 truncate text-white">Shape Layer</div>
            <ChevronDown
              size={16}
              className={`text-gray-400 transition-transform ${
                openAccordions[shapeSet.id] ? 'rotate-180' : ''
              }`}
            />
          </div>

          {openAccordions[shapeSet.id] && (
            <div className="p-3 pt-0 space-y-4 border-t border-white/5">
              {/* Shape Type Selection */}
              <div className="mt-4">
                <Label className="block text-sm text-gray-400 mb-1">Shape Type</Label>
                <Select
                  value={shapeSet.type}
                  onValueChange={(value) => updateShapeSet(shapeSet.id, { type: value })}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Select shape" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/10 text-white">
                    {SHAPES.map((shape) => (
                      <SelectItem 
                        key={shape.value} 
                        value={shape.value}
                        className="focus:bg-white/10 focus:text-white"
                      >
                        {shape.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

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

              {/* Replace Size with Width and Height controls */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm text-gray-400">Width</Label>
                    <span className="text-sm text-gray-400">{shapeSet.width}px</span>
                  </div>
                  <Slider
                    min={10}
                    max={5000}
                    value={[shapeSet.width]}
                    onValueChange={([value]) => updateShapeSet(shapeSet.id, { width: value })}
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm text-gray-400">Height</Label>
                    <span className="text-sm text-gray-400">{shapeSet.height}px</span>
                  </div>
                  <Slider
                    min={10}
                    max={5000}
                    value={[shapeSet.height]}
                    onValueChange={([value]) => updateShapeSet(shapeSet.id, { height: value })}
                  />
                </div>
              </div>

              {/* Stroke Width (only show when not filled) */}
              {!shapeSet.isFilled && (
                <div className="space-y-1 mb-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm text-gray-400">Stroke Width</Label>
                    <span className="text-sm text-gray-400">{shapeSet.strokeWidth || 2}px</span>
                  </div>
                  <Slider
                    min={0.1}
                    max={20}
                    step={0.2}
                    value={[shapeSet.strokeWidth || 2]}
                    onValueChange={([value]) => updateShapeSet(shapeSet.id, { strokeWidth: value })}
                  />
                </div>
              )}

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

              {/* Glow Effect Controls */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-gray-400">Enable Glow</Label>
                  <Switch
                    checked={shapeSet.glow?.enabled ?? false}
                    onCheckedChange={(checked) => {
                      const newGlow: GlowEffect = {
                        enabled: checked,
                        color: shapeSet.glow?.color || '#ffffff',
                        intensity: shapeSet.glow?.intensity || 20
                      };
                      updateShapeSet(shapeSet.id, { glow: newGlow });
                    }}
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

                {shapeSet.glow?.enabled && (
                  <>
                    <div>
                      <Label className="block text-sm text-gray-400 mb-1">Glow Color</Label>
                      <input
                        type="color"
                        value={shapeSet.glow.color}
                        onChange={(e) => {
                          const newGlow: GlowEffect = {
                            ...shapeSet.glow!,
                            color: e.target.value
                          };
                          updateShapeSet(shapeSet.id, { glow: newGlow });
                        }}
                        className="w-full h-9 cursor-pointer rounded-md border border-white/10 bg-white/5 [&::-webkit-color-swatch-wrapper]:p-1 [&::-webkit-color-swatch]:rounded-md"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <Label className="text-sm text-gray-400">Glow Intensity</Label>
                        <span className="text-sm text-gray-400">{shapeSet.glow.intensity}</span>
                      </div>
                      <Slider
                        min={0}
                        max={50}
                        value={[shapeSet.glow.intensity]}
                        onValueChange={([value]) => {
                          const newGlow: GlowEffect = {
                            ...shapeSet.glow!,
                            intensity: value
                          };
                          updateShapeSet(shapeSet.id, { glow: newGlow });
                        }}
                      />
                    </div>
                  </>
                )}
              </div>


              {/* Delete button at the end */}
              <button
                onClick={() => removeShapeSet(shapeSet.id)}
                className="w-full p-2 bg-red-500/10 text-red-400 rounded-md hover:bg-red-500/20"
              >
                Delete Shape
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
