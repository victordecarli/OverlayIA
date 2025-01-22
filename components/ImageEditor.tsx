'use client';

import { useEditor } from '@/hooks/useEditor';
import { Trash2, Plus, ImageOff, ArrowRight, RotateCcw } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect, useRef } from 'react';
import { cn, isSubscriptionActive } from '@/lib/utils';
import { Button } from './ui/button';
import { useAuth } from '@/hooks/useAuth';
import { getFreshUserProfile, incrementGenerationCount } from '@/lib/supabase-utils';
import { ProPlanDialog } from './ProPlanDialog';
import { useToast } from '@/hooks/use-toast';
import { ProUpgradeButton } from './ProUpgradeButton';
import { removeBackground } from "@imgly/background-removal"; // Add this import
import { supabase } from '@/lib/supabaseClient';

interface PendingImage {
  id: number;
  file: File;
  url: string;
  processedUrl: string | null;
  isProcessing: boolean;
  isInEditor: boolean;
  originalSize: {
    width: number;
    height: number;
  } | null;
}

export function ImageEditor() {
  const { 
    backgroundImages, 
    addBackgroundImage, 
    removeBackgroundImage, 
    updateBackgroundImage,
    pendingImages,
    addPendingImage,
    updatePendingImage,
    resetBackground  // Add this
  } = useEditor();
  const { user } = useAuth();
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showProDialog, setShowProDialog] = useState(false);
  const { toast } = useToast();

  // Add imageCache ref to store processed URLs
  const imageCache = useRef<Map<number, string>>(new Map());

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (pendingImages.length >= 2) {
      setUploadError("Maximum of 2 images allowed");
      return;
    }

    try {
      const url = URL.createObjectURL(file);
      const img = new Image();
      const dimensions = await new Promise<{ width: number; height: number }>((resolve) => {
        img.onload = () => {
          resolve({
            width: img.naturalWidth,
            height: img.naturalHeight
          });
        };
        img.src = url;
      });
      
      const newPendingImage = {
        id: Date.now(),
        file,
        url,
        processedUrl: null,
        isProcessing: false,
        isInEditor: false,
        originalSize: dimensions
      };

      addPendingImage(newPendingImage);
      setUploadError(null);
    } catch (error) {
      setUploadError((error as Error).message);
    }
    
    e.target.value = '';
  };

  // Modify handleRemoveBackground to cache the processed URL
  const handleRemoveBackground = async (pendingImage: PendingImage) => {
    if (pendingImage.processedUrl) {
      if (!confirm('Background has already been removed. Do you want to process again?')) {
        return;
      }
      URL.revokeObjectURL(pendingImage.processedUrl);
    }

    try {
      updatePendingImage(pendingImage.id, { isProcessing: true });

      let processedUrl;
      
      // Check cache first
      if (imageCache.current.has(pendingImage.id)) {
        processedUrl = imageCache.current.get(pendingImage.id);
      } else {
        if (user) {
          // Check if subscription is active
          const { data } = await supabase
            .from('profiles')
            .select('expires_at')
            .eq('id', user.id)
            .single();

          const isProActive = data?.expires_at && isSubscriptionActive(data.expires_at);

          if (isProActive) {
            // Pro users with active subscription: Use API endpoint
            // ...existing pro API code...
          } else {
            // Expired subscription or free user: Use client-side removal
            const imageUrl = URL.createObjectURL(pendingImage.file);
            const imageBlob = await removeBackground(imageUrl);
            processedUrl = URL.createObjectURL(imageBlob);
            URL.revokeObjectURL(imageUrl);
          }
        } else {
          // Unauthenticated users: Use client-side removal
          try {
            const imageUrl = URL.createObjectURL(pendingImage.file);
            const imageBlob = await removeBackground(imageUrl);
            processedUrl = URL.createObjectURL(imageBlob);
            // Clean up the temporary URL
            URL.revokeObjectURL(imageUrl);
          } catch (error) {
            console.error('Client-side background removal failed:', error);
            throw new Error('Failed to remove background. Please try again.');
          }
        }

        // Cache the processed URL
        imageCache.current.set(pendingImage.id, processedUrl);
      }

      // Increment generation count only for authenticated users
      if (user) {
        await incrementGenerationCount(user);
      }

      updatePendingImage(pendingImage.id, { 
        processedUrl, 
        isProcessing: false 
      });

    } catch (error) {
      console.error('Error removing background:', error);
      updatePendingImage(pendingImage.id, { isProcessing: false });
      toast({
        variant: 'destructive',
        title: 'Background removal failed',
        description: 'Something went wrong while processing your image. Please try again.'
      });
    }
  };

  const handleMoveToEditor = async (pendingImage: PendingImage) => {
    if (pendingImage.isProcessing) return;

    try {
      const finalUrl = pendingImage.processedUrl || pendingImage.url;
      const response = await fetch(finalUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }

      const blob = await response.blob();
      const file = new File([blob], pendingImage.file.name, { type: blob.type });
      
      const newImageId = pendingImage.id; // Use the same ID for consistency
      await addBackgroundImage(file, pendingImage.originalSize, newImageId); // Pass the ID
      updatePendingImage(pendingImage.id, { isInEditor: true });
    } catch (error) {
      console.error('Error moving image to editor:', error);
      toast({
        variant: 'destructive',
        title: 'Unable to move to editor',
        description: 'Failed to prepare image for editing. Please try again or upload a new image.'
      });
    }
  };

  const handleReset = (pendingImageId: number) => {
    const pendingImage = pendingImages.find(img => img.id === pendingImageId);
    if (!pendingImage) return;

    // First remove from background images
    removeBackgroundImage(pendingImage.id);

    // Then update the pending image state
    updatePendingImage(pendingImageId, {
      processedUrl: null,
      isInEditor: false
    });

    // If this was the last background image, reset the background state
    if (backgroundImages.length <= 1) {
      resetBackground();
    }
  };

  const handleRemove = (pendingImageId: number) => {
    const pendingImage = pendingImages.find(img => img.id === pendingImageId);
    if (!pendingImage) return;

    // Remove from background images
    removeBackgroundImage(pendingImage.id);

    // If this was the last background image, reset the background state
    if (backgroundImages.length <= 1) {
      resetBackground();
    }
  };

  // Cleanup URLs when component unmounts
  useEffect(() => {
    return () => {
      pendingImages.forEach(pendingImage => {
        URL.revokeObjectURL(pendingImage.url);
        if (pendingImage.processedUrl) {
          URL.revokeObjectURL(pendingImage.processedUrl);
        }
        imageCache.current.delete(pendingImage.id);
      });
      imageCache.current.clear();
    };
  }, [pendingImages]);

  return (
    <>
      <div className="space-y-4 max-w-2xl mx-auto"> {/* Added max-w-2xl and mx-auto */}
        {/* Upload Section - Always show if less than 2 images */}
        {pendingImages.length < 2 && (
          <div className="bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg p-3">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="background-image-upload"
            />
            <label
              htmlFor="background-image-upload"
              className="flex items-center justify-center w-full p-2 rounded-md bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10"
            >
              <Plus className="w-4 h-4 mr-2" />
              <span>Add Image {pendingImages.length > 0 ? `(${2 - pendingImages.length} remaining)` : ''}</span>
            </label>
            {uploadError && (
              <p className="mt-2 text-sm text-red-500">{uploadError}</p>
            )}
          </div>
        )}

        {/* Image Editor Section - Show for each pending image */}
        {pendingImages.map((pendingImage) => (
          <div key={pendingImage.id} className="bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg overflow-hidden">
            {/* Preview - Increased height and width */}
            <div className="relative w-full pt-[75%]"> {/* Changed from pt-[56.25%] to pt-[75%] for 4:3 ratio */}
              <div className="absolute inset-0 p-4"> {/* Changed padding from p-2 to p-4 */}
                <img
                  src={pendingImage.processedUrl || pendingImage.url}
                  alt="Preview"
                  className="w-full h-full object-contain rounded-md"
                />
                {pendingImage.isProcessing && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
                  </div>
                )}
              </div>
            </div>
            
            {/* Controls - Vertically stacked buttons */}
            <div className="p-3 space-y-3 border-t border-gray-200 dark:border-white/10">
              {!pendingImage.isInEditor ? (
                <div className="flex flex-col gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleRemoveBackground(pendingImage)}
                    disabled={pendingImage.isProcessing}
                    className="w-full h-8"
                  >
                    <ImageOff className="w-4 h-4 mr-2" />
                    Remove Background
                  </Button>
                  
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleMoveToEditor(pendingImage)}
                    disabled={pendingImage.isProcessing}
                    className="w-full h-8"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Move to Editor
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemove(pendingImage.id)}
                    disabled={pendingImage.isProcessing}
                    className="w-full h-8"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove Image
                  </Button>
                </div>
              ) : (
                // Editor Controls - Same as before but ensure it only affects this image
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Image Settings</h3>
                    {/* Removed reset button, keeping only delete button */}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemove(pendingImage.id)}
                      className="h-7 px-2"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>

                  {/* Modified editor controls section */}
                  {backgroundImages.length > 0 && (
                    <div className="space-y-3">
                      <div className="space-y-2">
                        {/* X Position */}
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Position X</span>
                            <span>{Math.round(backgroundImages[0].position.horizontal)}%</span>
                          </div>
                          <Slider
                            value={[backgroundImages[0].position.horizontal]}
                            onValueChange={([value]) => 
                              updateBackgroundImage(pendingImage.id, { 
                                position: { 
                                  ...backgroundImages[0].position, 
                                  horizontal: value 
                                } 
                              })
                            }
                            min={0}
                            max={100}
                            step={1}
                            className="my-0.5"
                          />
                        </div>

                        {/* Y Position */}
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Position Y</span>
                            <span>{Math.round(backgroundImages[0].position.vertical)}%</span>
                          </div>
                          <Slider
                            value={[backgroundImages[0].position.vertical]}
                            onValueChange={([value]) => 
                              updateBackgroundImage(pendingImage.id, { 
                                position: { 
                                  ...backgroundImages[0].position, 
                                  vertical: value 
                                } 
                              })
                            }
                            min={0}
                            max={100}
                            step={1}
                            className="my-0.5"
                          />
                        </div>

                        {/* Scale */}
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Scale</span>
                            <span>{Math.round(backgroundImages[0].scale)}%</span>
                          </div>
                          <Slider
                            value={[backgroundImages[0].scale]}
                            onValueChange={([value]) => 
                              updateBackgroundImage(pendingImage.id, { scale: value })
                            }
                            min={10}
                            max={200}
                            step={1}
                            className="my-0.5"
                          />
                        </div>

                        {/* Rotation */}
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Rotation</span>
                            <span>{Math.round(backgroundImages[0].rotation)}°</span>
                          </div>
                          <Slider
                            value={[backgroundImages[0].rotation]}
                            onValueChange={([value]) => 
                              updateBackgroundImage(pendingImage.id, { rotation: value })
                            }
                            min={-180}
                            max={180}
                            step={1}
                            className="my-0.5"
                          />
                        </div>

                        {/* Opacity */}
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Opacity</span>
                            <span>{Math.round(backgroundImages[0].opacity * 100)}%</span>
                          </div>
                          <Slider
                            value={[backgroundImages[0].opacity * 100]}
                            onValueChange={([value]) => 
                              updateBackgroundImage(pendingImage.id, { opacity: value / 100 })
                            }
                            min={0}
                            max={100}                            step={1}                            className="my-0.5"                          />                        </div>                      </div>                    </div>                  )}                </div>              )}
            </div>
          </div>
        ))}
      </div>
      
      <ProPlanDialog
        isOpen={showProDialog}
        onClose={() => setShowProDialog(false)}
      />
    </>
  );
}

