'use client';

import { Type, Shapes, Plus, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { TextEditor } from './TextEditor';
import { ShapeEditor } from './ShapeEditor';
import { useEditor } from '@/hooks/useEditor';
import { RemoveBackgroundNavigation } from './RemoveBackgroundNavigation';
import { RemoveBackgroundEditor } from './RemoveBackgroundEditor';

interface SideNavigationProps {
  mobile?: boolean;
  mode?: 'full' | 'text-only' | 'shapes-only';
}

export function SideNavigation({ mobile = false, mode = 'full' }: SideNavigationProps) {
  const [activeTab, setActiveTab] = useState<'text' | 'shapes' | 'remove-background' | null>(null);
  const { image, isProcessing, isConverting, addTextSet, addShapeSet } = useEditor();
  const canAddLayers = !!image.original && !!image.background && !isProcessing && !isConverting;

  const showTextButton = mode === 'full' || mode === 'text-only';
  const showShapesButton = mode === 'full' || mode === 'shapes-only';

  // Add effect to handle body class for mobile slide up
  useEffect(() => {
    if (mobile && activeTab) {
      document.body.classList.add('editor-panel-open');
    } else {
      document.body.classList.remove('editor-panel-open');
    }
    return () => document.body.classList.remove('editor-panel-open');
  }, [mobile, activeTab]);

  // Helper function to determine if we should show the "Add" button
  const shouldShowAddButton = (activeTab: string) => {
    return activeTab !== 'remove-background' && canAddLayers;
  };

  if (mobile) {
    return (
      <>
        {/* Fixed Bottom Navigation Bar - Reduced height */}
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-950 border-t border-gray-200 dark:border-white/10 p-1.5 z-50">
          <div className="flex gap-2 max-w-md mx-auto">
            {showTextButton && (
              <button
                onClick={() => setActiveTab(activeTab === 'text' ? null : 'text')}
                className={cn(
                  "flex-1 p-2 rounded-lg flex flex-col items-center gap-0.5 transition-colors",
                  activeTab === 'text' 
                    ? "bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white"
                    : "text-gray-500 dark:text-gray-400"
                )}
                disabled={!canAddLayers}
              >
                <Type className="w-4 h-4" />
                <span className="text-[10px] font-medium">Text</span>
              </button>
            )}
            {showShapesButton && (
              <button
                onClick={() => setActiveTab(activeTab === 'shapes' ? null : 'shapes')}
                className={cn(
                  "flex-1 p-2 rounded-lg flex flex-col items-center gap-0.5 transition-colors",
                  activeTab === 'shapes'
                    ? "bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white"
                    : "text-gray-500 dark:text-gray-400"
                )}
                disabled={!canAddLayers}
              >
                <Shapes className="w-4 h-4" />
                <span className="text-[10px] font-medium">Shapes</span>
              </button>
            )}
            {mode === 'full' && (
              <button
                onClick={() => setActiveTab(activeTab === 'remove-background' ? null : 'remove-background')}
                className={cn(
                  "flex-1 p-2 rounded-lg flex flex-col items-center gap-0.5 transition-colors",
                  activeTab === 'remove-background'
                    ? "bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white"
                    : "text-gray-500 dark:text-gray-400"
                )}
                disabled={!canAddLayers}
              >
                <ImageIcon className="w-4 h-4" />
                <span className="text-[10px] font-medium">Remove BG</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Slide-up Editor Panel */}
        {activeTab && (
          <div className="fixed inset-x-0 bottom-[56px] bg-white dark:bg-zinc-950 border-gray-200 dark:border-white/10 rounded-t-xl z-40 h-[35vh] flex flex-col shadow-2xl">
            <div className="sticky top-0 bg-white dark:bg-zinc-950 p-3 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
                 {(activeTab === 'text' || activeTab === 'shapes') ? (
                   <button
                   onClick={() => activeTab === 'text' ? addTextSet() : addShapeSet('square')}
                   disabled={!canAddLayers}
                   className="flex-1 p-2 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-900 dark:text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                 >
                   <Plus className="w-4 h-4" />
                   <span>Add {activeTab === 'text' ? 'Text' : 'Shape'}</span>
                 </button>
                ) : (<h3 className="text-lg font-semibold">Remove Background</h3>)
              }
               
              {/* Add close button */}
              <button
                onClick={() => setActiveTab(null)}
                className="ml-3 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-900 dark:text-white text-right"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'text' && <TextEditor />}
              {activeTab === 'shapes' && <ShapeEditor />}
              {activeTab === 'remove-background' && <RemoveBackgroundEditor />}
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className={cn(
      "fixed left-0 top-16 bottom-0 flex h-[calc(100vh-4rem)] z-50 border-r border-t border-gray-200 dark:border-white/10",
      // Increase the width of the expanded panel
      activeTab ? "w-[360px]" : "w-[80px]"
    )}>
      {/* Side Navigation Bar */}
      <div className="flex h-full bg-white dark:bg-zinc-950">
        {/* Increase the width of the navigation buttons */}
        <div className="w-[80px] border-r border-gray-200 dark:border-white/10 flex flex-col gap-1 p-2">
          {showTextButton && (
            <button
              onClick={() => {
                setActiveTab(activeTab === 'text' ? null : 'text');
              }}
              className={cn(
                "p-3 rounded-lg flex flex-col items-center gap-2 transition-colors",
                activeTab === 'text'
                  ? "bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              )}
              disabled={!canAddLayers}
            >
              <Type className="w-5 h-5" />
              <span className="text-xs font-medium">Text</span>
            </button>
          )}
          {showShapesButton && (
            <button
              onClick={() => {
                setActiveTab(activeTab === 'shapes' ? null : 'shapes');
              }}
              className={cn(
                "p-3 rounded-lg flex flex-col items-center gap-2 transition-colors",
                activeTab === 'shapes'
                  ? "bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              )}
              disabled={!canAddLayers}
            >
              <Shapes className="w-5 h-5" />
              <span className="text-xs font-medium">Shapes</span>
            </button>
          )}
          {mode === 'full' && (
            <button
              onClick={() => setActiveTab(activeTab === 'remove-background' ? null : 'remove-background')}
              className={cn(
                "p-3 rounded-lg flex flex-col items-center gap-2 transition-colors",
                activeTab === 'remove-background'
                  ? "bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              )}
              disabled={!canAddLayers}
            >
              <ImageIcon className="w-5 h-5" />
              <span className="text-xs font-medium">Remove BG</span>
            </button>
          )}
        </div>

        {/* Editor Content with border */}
        {activeTab && (
          <div className="w-[280px] border-r border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-950 flex flex-col">
            <div className="sticky top-0 bg-white dark:bg-zinc-950 p-4 border-b border-gray-200 dark:border-white/10 z-10">
             {(activeTab === 'text' || activeTab === 'shapes') ? (
              <button
                onClick={() => activeTab === 'text' ? addTextSet() : addShapeSet('square')}
                disabled={!canAddLayers}
                className="w-full p-2 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-900 dark:text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add {activeTab === 'text' ? 'Text' : 'Shape'}</span>
              </button>
             ) : 
             (
                <h3 className="text-lg font-semibold">Remove Background</h3>
              )
             }

            </div>
            <div className="flex-1 overflow-y-auto p-4 h-full">
              {activeTab === 'text' && <TextEditor />}
              {activeTab === 'shapes' && <ShapeEditor />}
              {activeTab === 'remove-background' && <RemoveBackgroundEditor />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
