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

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthDialog({ isOpen, onClose }: AuthDialogProps) {
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
          <form action={signInWithGoogle} className="flex-1">
            <Button type="submit" className="w-full">
              Sign in with Google
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
