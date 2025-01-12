'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/lib/auth.actions";
import { useState } from 'react';

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  returnUrl?: string;
}

export function AuthDialog({ isOpen, onClose, returnUrl }: AuthDialogProps) {
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    try {
      setIsLoading(true);
      formData.set('returnUrl', returnUrl || currentPath);
      const response = await signInWithGoogle(formData);
      
      if (response.url) {
        window.location.href = response.url;
      }
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Authenticate with Google</DialogTitle>
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
