'use client';

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEditor } from "@/hooks/useEditor";
import { useAuth } from "@/hooks/useAuth";
import { Save, Lock } from "lucide-react";
import { useState } from "react";
import { AuthDialog } from "./AuthDialog";
import { cn } from "@/lib/utils";

export function SaveDropdown() {
  const { user } = useAuth();
  const { downloadImage, isDownloading, isProcessing, isConverting, image } = useEditor();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  // Check if we can enable the save button
  const isDisabled = !image.original || isDownloading || isProcessing || isConverting;

  const handleSave = (quality: 'standard' | 'hd') => {
    if (isDisabled) return;
    if (quality === 'hd' && !user) {
      setShowAuthDialog(true);
      return;
    }
    downloadImage(quality === 'hd' ? 1.0 : 0.2);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            className={cn(
              "flex flex-col items-center px-2 h-auto bg-transparent hover:bg-transparent",
              "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white",
              isDisabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={isDisabled}
          >
            <Save className="w-5 h-5" />
            <span className="text-xs mt-0 text-gray-600 dark:text-gray-400">
              {isDownloading ? 'Saving...' : 'Save'}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem 
            onSelect={() => handleSave('standard')}
            className={cn(
              isDisabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={isDisabled}
          >
            Save (Standard Quality)
          </DropdownMenuItem>
          <DropdownMenuItem 
            onSelect={() => handleSave('hd')}
            className={cn(
              "relative",
              (isDisabled) && "opacity-50 cursor-not-allowed"
            )}
            disabled={isDisabled}
          >
            Save (HD Quality)
            {!user && <Lock className="w-3 h-3 ml-2 opacity-50" />}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AuthDialog 
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
      />
    </>
  );
}
