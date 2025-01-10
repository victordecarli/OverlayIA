'use client';

import { ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { RemoveBackgroundEditor } from './RemoveBackgroundEditor';
import { useEditor } from '@/hooks/useEditor';

interface RemoveBackgroundNavigationProps {
  mobile?: boolean;
}

export function RemoveBackgroundNavigation({ mobile = false }: RemoveBackgroundNavigationProps) {
  const [isActive, setIsActive] = useState(true);
  const { image, isProcessing, isConverting } = useEditor();
  const canUseFeature = !!image.original && !!image.background && !isProcessing && !isConverting;

  if (mobile) {
    return (
      <>
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-950 border-t border-gray-200 dark:border-white/10 p-1.5 z-50">
          <div className="flex gap-2 max-w-md mx-auto">
            <button
              className={cn(
                "flex-1 p-2 rounded-lg flex flex-col items-center gap-0.5 transition-colors",
                "bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white"
              )}
              disabled={!canUseFeature}
            >
              <ImageIcon className="w-4 h-4" />
              <span className="text-[10px] font-medium">Remove BG</span>
            </button>
          </div>
        </div>

        <div className="fixed inset-x-0 bottom-[56px] bg-white dark:bg-zinc-950 border-gray-200 dark:border-white/10 rounded-t-xl z-40 h-[35vh] flex flex-col shadow-2xl">
          <div className="p-4">
            <RemoveBackgroundEditor />
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="fixed left-0 top-16 bottom-0 flex h-[calc(100vh-4rem)] z-50 border-r border-t border-gray-200 dark:border-white/10 w-[360px]">
      <div className="flex h-full bg-white dark:bg-zinc-950">
        <div className="w-[80px] border-r border-gray-200 dark:border-white/10 flex flex-col gap-1 p-2">
          <button
            className={cn(
              "p-3 rounded-lg flex flex-col items-center gap-2 transition-colors",
              "bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white"
            )}
            disabled={!canUseFeature}
          >
            <ImageIcon className="w-5 h-5" />
            <span className="text-xs font-medium">Remove Background</span>
          </button>
        </div>

        <div className="w-[280px] border-r border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-950 flex flex-col">
          <div className="sticky top-0 bg-white dark:bg-zinc-950 p-4 border-b border-gray-200 dark:border-white/10 z-10">
            <h3 className="text-lg font-semibold">Remove Background</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <RemoveBackgroundEditor />
          </div>
        </div>
      </div>
    </div>
  );
}
