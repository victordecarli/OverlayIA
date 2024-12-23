'use client';

import { useEditor } from '@/hooks/useEditor';
import { Download, Plus } from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger,
  TooltipProvider 
} from './ui/tooltip';
import { SHAPES } from '@/constants/shapes';

export function FloatingToolbar() {
  const { addTextSet, downloadImage, addShapeSet } = useEditor();

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2 p-2 bg-black/90 backdrop-blur-sm border border-white/10 rounded-full">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => addTextSet()}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10"
            >
              <Plus className="w-5 h-5 text-gray-400" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Add Text</TooltipContent>
        </Tooltip>

        {/* Shape Options */}
        {SHAPES.map((shape) => (
          <Tooltip key={shape.value}>
            <TooltipTrigger asChild>
              <button
                onClick={() => addShapeSet(shape.value)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10"
              >
                <svg className="w-5 h-5 text-gray-400" viewBox="0 0 100 100">
                  <path d={shape.path} fill="currentColor" />
                </svg>
              </button>
            </TooltipTrigger>
            <TooltipContent>Add {shape.name}</TooltipContent>
          </Tooltip>
        ))}

        <div className="w-px h-6 bg-white/10" />

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={downloadImage}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10"
            >
              <Download className="w-5 h-5 text-gray-400" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Download</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
