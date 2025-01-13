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
  const { downloadImage } = useEditor();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const handleSave = (quality: 'standard' | 'hd') => {
    if (quality === 'hd' && !user) {
      setShowAuthDialog(true);
      return;
    }
    downloadImage(quality === 'hd' ? 1.0 : 0.1);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            className={cn(
              "flex flex-col items-center px-2 h-auto bg-transparent hover:bg-transparent",
              "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            )}
          >
            <Save className="w-5 h-5" />
            <span className="text-xs mt-0 text-gray-600 dark:text-gray-400">Save</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => handleSave('standard')}>
            Save (Standard Quality)
          </DropdownMenuItem>
          <DropdownMenuItem 
            onSelect={() => handleSave('hd')}
            className="relative"
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
