'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from 'react';
import { supabase } from "@/utils/supabaseClient";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  returnUrl?: string;
}

export function AuthDialog({ isOpen, onClose, returnUrl }: AuthDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  // signin with google
  const handleSubmit = async () => {
    try {
      setIsLoading(true);
       await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            queryParams: {
              access_type: 'offline',
              prompt: 'consent',
            },
            redirectTo: 'https://underlayx.com/custom-editor',
          },
        });
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md pt-8">
        <DialogHeader>
          <DialogTitle className="mt-2">Authenticate with Google</DialogTitle>
          <DialogDescription>
            To continue, please sign in with your Google account.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <form action={handleSubmit} className="flex-1">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Connecting...
                </div>
              ) : (
                "Sign in with Google"
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
