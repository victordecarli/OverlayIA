'use client';

import { useEditor } from '@/hooks/useEditor';
import { Trash2, Plus, ImageOff, ArrowRight, RotateCcw } from 'lucide-react';
import { Slider } from "@/components/ui/slider";
import { useState, useEffect, useRef, useCallback } from 'react';
import { isSubscriptionActive } from '@/lib/utils';
import { Button } from './ui/button';
import { useAuth } from '@/hooks/useAuth';
import {  incrementGenerationCount } from '@/lib/supabase-utils';
import { ProPlanDialog } from './ProPlanDialog';
import { useToast } from '@/hooks/use-toast';
import { removeBackground } from "@imgly/background-removal"; // Add this import
import { supabase } from '@/lib/supabaseClient';

// Add URL cache using WeakMap to automatically cleanup when files are garbage collected
const processedImageCache = new WeakMap<File, string>();

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

  // Add cached subscription status
  const [userSubscriptionStatus, setUserSubscriptionStatus] = useState<{
    isProActive: boolean;
    expiresAt: string | null;
  } | null>(null);

  // Add useEffect to fetch subscription status once when component mounts
  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (user) {
        try {
          const { data } = await supabase
            .from('profiles')
            .select('expires_at')
            .eq('id', user.id)
            .single();
          
          const isProActive = !!(data?.expires_at && isSubscriptionActive(data.expires_at));
          setUserSubscriptionStatus({
            isProActive,
            expiresAt: data?.expires_at || null
          });
        } catch (error) {
          console.error('Error fetching subscription status:', error);
          setUserSubscriptionStatus({
            isProActive: false,
            expiresAt: null
          });
        }
      }
    };

    fetchSubscriptionStatus();
  }, [user]);

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
        file, // Use original file directly
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

  // Add cleanup function for URLs
  const cleanupImageUrls = useCallback((pendingImage: PendingImage) => {
    if (pendingImage.url) {
      URL.revokeObjectURL(pendingImage.url);
    }
    if (pendingImage.processedUrl) {
      URL.revokeObjectURL(pendingImage.processedUrl);
    }
  }, []);

  // Modify handleRemoveBackground to cache the processed URL
  const handleRemoveBackground = async (pendingImage: PendingImage) => {
    // Check cache first
    const cachedUrl = processedImageCache.get(pendingImage.file);
    if (cachedUrl) {
      updatePendingImage(pendingImage.id, { 
        processedUrl: cachedUrl,
        isProcessing: false 
      });
      return;
    }

    if (pendingImage.processedUrl) {
      URL.revokeObjectURL(pendingImage.processedUrl);
    }

    try {
      updatePendingImage(pendingImage.id, { isProcessing: true });

      let processedUrl;

      if (user && userSubscriptionStatus?.isProActive) {
        // Pro user path - use API
        console.log('Using pro API endpoint for background removal');
        const formData = new FormData();
        formData.append('file', pendingImage.file);
        formData.append('isAuthenticated', 'true');

        const response = await fetch('/api/remove-background', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error('Failed to remove background');
        }

        const responseData = await response.json();
        const processedImageResponse = await fetch(responseData.url);
        if (!processedImageResponse.ok) {
          throw new Error('Failed to fetch processed image');
        }
  
        const processedBlob = await processedImageResponse.blob();
        processedUrl = URL.createObjectURL(processedBlob);
      } else {
        // Free user path
        console.log('Using client-side background removal');
        const imageUrl = URL.createObjectURL(pendingImage.file);
        const imageBlob = await removeBackground(imageUrl);
        processedUrl = URL.createObjectURL(imageBlob);
        URL.revokeObjectURL(imageUrl);
      }

      // Cache the processed URL
      processedImageCache.set(pendingImage.file, processedUrl);

      updatePendingImage(pendingImage.id, { 
        processedUrl, 
        isProcessing: false 
      });

      if (user) {
        await incrementGenerationCount(user);
      }

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
      
      // Create a new blob from the image URL
      const response = await fetch(finalUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }

      const blob = await response.blob();
      const file = new File([blob], pendingImage.file.name, { type: blob.type });

      await addBackgroundImage(file, pendingImage.originalSize, pendingImage.id);
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
    // Only cleanup when component fully unmounts
    return () => {
      // Only cleanup images that aren't in editor
      pendingImages.forEach(image => {
        if (!image.isInEditor) {
          cleanupImageUrls(image);
          removeBackgroundImage(image.id);
        }
      });
    };
  }, []); // Empty dependency array for unmount only

  const getRemoveBackgroundButtonText = (pendingImage: PendingImage) => {
    if (pendingImage.processedUrl) {
      return (
        <>
          <ImageOff className="w-4 h-4 mr-2" />
          Reprocess Background
        </>
      );
    }
    return (
      <>
        <ImageOff className="w-4 h-4 mr-2" />
        Remove Background
      </>
    );
  };

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
                    disabled={pendingImage.isProcessing || pendingImage.processedUrl !== null}
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

