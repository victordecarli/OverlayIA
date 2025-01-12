'use client';

import { useState } from 'react';
import Image from 'next/image';
import { User } from '@supabase/supabase-js';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface UserMenuProps {
  user: User;
}

export function UserMenu({ user }: UserMenuProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <Popover>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/10 cursor-pointer">
                <Image
                  src={user.user_metadata.avatar_url}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
            </PopoverTrigger>
          </TooltipTrigger>

          <TooltipContent side="bottom">
            <p className="text-sm">{user.email}</p>
          </TooltipContent>

          <PopoverContent className="w-auto px-4 py-3" side="bottom" align="end">
            <p className="text-sm font-medium">{user.email}</p>
          </PopoverContent>
        </Popover>
      </Tooltip>
    </TooltipProvider>
  );
}
