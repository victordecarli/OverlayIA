'use client';

import { useEditor } from '@/hooks/useEditor';
import {  ChevronDown, Plus } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { FONT_OPTIONS, FONT_WEIGHTS } from '@/constants/fonts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShapeEditor } from './ShapeEditor';

// Add this helper function at the top
const scrollToElement = (element: HTMLElement | null) => {
  element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

export function EditorTools() {
  const { image, addTextSet, addShapeSet } = useEditor();

  if (!image.original) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center p-6 max-w-md">
          <div className="space-y-2">
            <div className="flex justify-center text-2xl">✨</div>
            <h3 className="text-2xl font-bold text-white">
              Transform Your Images
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Add beautiful text overlays, create stunning designs, and bring your creative vision to life. Start by dropping your image here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Tabs defaultValue="text" className="w-full">
      <TabsList className="w-full mb-4 bg-white/5 border border-white/10">
        <TabsTrigger value="text" className="data-[state=active]:bg-white/10 text-gray-400 data-[state=active]:text-white flex-1">Text Layers</TabsTrigger>
        <TabsTrigger value="shapes" className="data-[state=active]:bg-white/10 text-gray-400 data-[state=active]:text-white flex-1">Shapes</TabsTrigger>
      </TabsList>
      
      <TabsContent value="text" className="mt-0">
        <button
          onClick={() => addTextSet()}
          className="w-full mb-4 p-2 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 rounded-lg text-white"
        >
          <Plus size={16} />
          Add Text Layer
        </button>
        <TextEditor />
      </TabsContent>
      
      <TabsContent value="shapes" className="mt-0">
        <button
          onClick={() => addShapeSet('square')} // Default to square
          className="w-full mb-4 p-2 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 rounded-lg text-white"
        >
          <Plus size={16} />
          Add Shape Layer
        </button>
        <ShapeEditor />
      </TabsContent>
    </Tabs>
  );
}

// Move existing text editor code to a new component
function TextEditor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { textSets, updateTextSet, removeTextSet } = useEditor();
  const [openAccordions, setOpenAccordions] = useState<Record<number, boolean>>({});

  // Auto-scroll to new text layer
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const lastElement = container.lastElementChild;
      scrollToElement(lastElement as HTMLElement);
    }
  }, [textSets.length]);

  // Auto-open new accordions
  useEffect(() => {
    const newOpenState: Record<number, boolean> = {};
    textSets.forEach(set => {
      newOpenState[set.id] = openAccordions[set.id] !== false; // Keep closed if explicitly closed
    });
    setOpenAccordions(newOpenState);
  }, [textSets.length]);

  const toggleAccordion = (id: number) => {
    setOpenAccordions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div ref={containerRef} className="space-y-3">
      {textSets.map((textSet) => (
        <div key={textSet.id} className="group bg-black/20 border border-white/5">
          {/* Accordion Header */}
          <div
            onClick={() => toggleAccordion(textSet.id)}
            className="flex items-center gap-3 p-3 cursor-pointer hover:bg-white/5"
          >
            <div className="flex-1 truncate text-white">{textSet.text || 'Text Layer'}</div>
            <ChevronDown
              size={16}
              className={`text-gray-400 transition-transform ${
                openAccordions[textSet.id] ? 'rotate-180' : ''
              }`}
            />
          </div>

          {/* Accordion Content */}
          {openAccordions[textSet.id] && (
            <div className="p-3 pt-0 space-y-4 border-t border-white/5">
              {/* Text Input */}
              <div className='mt-4'>
              <Input
                value={textSet.text}
                onChange={(e) => updateTextSet(textSet.id, { text: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
                placeholder="Enter text..."
                />
                </div>
                

              {/* Font Controls */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Font Family</label>
                  <Select
                    value={textSet.fontFamily}
                    onValueChange={(value) => updateTextSet(textSet.id, { fontFamily: value })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select font" />
                    </SelectTrigger>
                    <SelectContent>
                      {FONT_OPTIONS.map((font) => (
                        <SelectItem 
                          key={font.value} 
                          value={font.value}
                          style={{ fontFamily: font.value }}
                        >
                          {font.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Font Weight</label>
                  <Select
                    value={textSet.fontWeight}
                    onValueChange={(value) => updateTextSet(textSet.id, { fontWeight: value })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select weight" />
                    </SelectTrigger>
                    <SelectContent>
                      {FONT_WEIGHTS.map((weight) => (
                        <SelectItem key={weight.value} value={weight.value}>
                          {weight.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Color Picker */}
              <div>
                <Label className="block text-sm text-gray-400 mb-1">Color</Label>
                <input
                  type="color"
                  value={textSet.color}
                  onChange={(e) => updateTextSet(textSet.id, { color: e.target.value })}
                  className="w-full h-9 cursor-pointer rounded-md border border-white/10 bg-white/5 [&::-webkit-color-swatch-wrapper]:p-1 [&::-webkit-color-swatch]:rounded-md"
                />
              </div>

              {/* Controls */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm text-gray-400">Size</Label>
                    {/* <span className="text-sm text-gray-400">{textSet.fontSize}px</span> */}
                  </div>
                  <Slider
                    min={12}
                    max={1500}
                    step={1}
                    value={[textSet.fontSize]}
                    onValueChange={([value]) => updateTextSet(textSet.id, { fontSize: value })}
                    className="w-full"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm text-gray-400">Opacity</Label>
                    <span className="text-sm text-gray-400">{Math.round(textSet.opacity * 100)}%</span>
                  </div>
                  <Slider
                    min={0}
                    max={1}
                    step={0.01}
                    value={[textSet.opacity]}
                    onValueChange={([value]) => updateTextSet(textSet.id, { opacity: value })}
                    className="w-full"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm text-gray-400">Position X</Label>
                    <span className="text-sm text-gray-400">{textSet.position.horizontal}%</span>
                  </div>
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={[textSet.position.horizontal]}
                    onValueChange={([value]) => updateTextSet(textSet.id, {
                      position: { ...textSet.position, horizontal: value }
                    })}
                    className="w-full"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm text-gray-400">Position Y</Label>
                    <span className="text-sm text-gray-400">{textSet.position.vertical}%</span>
                  </div>
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={[textSet.position.vertical]}
                    onValueChange={([value]) => updateTextSet(textSet.id, {
                      position: { ...textSet.position, vertical: value }
                    })}
                    className="w-full"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm text-gray-400">Rotation</Label>
                    <span className="text-sm text-gray-400">{textSet.rotation}°</span>
                  </div>
                  <Slider
                    min={-180}
                    max={180}
                    step={1}
                    value={[textSet.rotation]}
                    onValueChange={([value]) => updateTextSet(textSet.id, { rotation: value })}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Delete button at the end */}
              <button
                onClick={() => removeTextSet(textSet.id)}
                className="w-full p-2 bg-red-500/10 text-red-400 rounded-md hover:bg-red-500/20"
              >
                Delete Layer
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
