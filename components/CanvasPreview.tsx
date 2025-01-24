'use client';

import { useEffect, useRef, useMemo, useCallback, useState } from 'react';
import { useEditor, roundRect } from '@/hooks/useEditor';  // Add this import
import { SHAPES } from '@/constants/shapes';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export function CanvasPreview() {
  const { 
    image, 
    textSets, 
    shapeSets, 
    imageEnhancements, 
    hasTransparentBackground, 
    foregroundPosition, 
    hasChangedBackground, 
    clonedForegrounds,
    backgroundImages,  // Add this line
    backgroundColor,
    foregroundSize,
    downloadImage // Keep this
  } = useEditor();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgImageRef = useRef<HTMLImageElement | null>(null);
  const fgImageRef = useRef<HTMLImageElement | null>(null);
  const bgImagesRef = useRef<Map<number, HTMLImageElement>>(new Map()); // Add this line
  const renderRequestRef = useRef<number | undefined>(undefined);
  const { toast } = useToast();
  const { user } = useAuth();

  // Memoize the filter string
  const filterString = useMemo(() => `
    brightness(${imageEnhancements.brightness}%)
    contrast(${imageEnhancements.contrast}%)
    saturate(${imageEnhancements.saturation}%)
    opacity(${100 - imageEnhancements.fade}%)
  `, [imageEnhancements]);

  // Add this new function to handle background image loading
  const loadBackgroundImage = useCallback((url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = url;
    });
  }, []);

  // Add this effect to handle background images loading
  useEffect(() => {
    const loadImages = async () => {
      const newBgImages = new Map();
      
      for (const bgImage of backgroundImages) {
        if (!bgImagesRef.current.has(bgImage.id)) {
          const img = await loadBackgroundImage(bgImage.url);
          newBgImages.set(bgImage.id, img);
        } else {
          newBgImages.set(bgImage.id, bgImagesRef.current.get(bgImage.id)!);
        }
      }
      
      bgImagesRef.current = newBgImages;
      render();
    };

    loadImages();
  }, [backgroundImages, loadBackgroundImage]);

  // Memoize expensive calculations
  const calculateScale = useCallback((img: HTMLImageElement, canvas: HTMLCanvasElement) => {
    return Math.min(
      canvas.width / img.width,
      canvas.height / img.height
    );
  }, []);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { alpha: true });
    if (!canvas || !ctx || !bgImageRef.current) return;

    // Cancel any pending render
    if (renderRequestRef.current) {
      cancelAnimationFrame(renderRequestRef.current);
    }

    // Schedule next render with high priority
    renderRequestRef.current = requestAnimationFrame(() => {
      // Reset canvas transform and clear
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Set canvas size to match background image
      canvas.width = bgImageRef.current!.width;
      canvas.height = bgImageRef.current!.height;

      // Clear canvas with transparency
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // First, handle background color if set
      if (backgroundColor) {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (hasTransparentBackground) {
        const pattern = ctx.createPattern(createCheckerboardPattern(), 'repeat');
        if (pattern) {
          ctx.fillStyle = pattern;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      } else if (image.background) {
        // Draw background image only if no color is set
        ctx.filter = filterString;
        ctx.drawImage(bgImageRef.current!, 0, 0);
        ctx.filter = 'none';
      }

      // Draw background images
      for (const bgImage of backgroundImages) {
        const img = bgImagesRef.current.get(bgImage.id);
        if (!img) continue;
        
        ctx.save();
        
        const x = (canvas.width * bgImage.position.horizontal) / 100;
        const y = (canvas.height * bgImage.position.vertical) / 100;
        
        ctx.translate(x, y);
        ctx.rotate((bgImage.rotation * Math.PI) / 180);
        ctx.globalAlpha = bgImage.opacity;

        const baseSize = Math.min(canvas.width, canvas.height);
        const scale = (baseSize * bgImage.scale) / 100;

        // Create a temporary canvas for the image with effects
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) continue;

        // Set temp canvas size to accommodate glow
        const padding = bgImage.glow.intensity * 2;
        tempCanvas.width = scale + padding * 2;
        tempCanvas.height = scale + padding * 2;

        // First draw the image
        tempCtx.drawImage(
          img,
          padding,
          padding,
          scale,
          scale
        );

        // Apply rounded corners if needed
        if (bgImage.borderRadius > 0) {
          const radius = (bgImage.borderRadius / 100) * (scale / 2);
          // Create another temp canvas for the rounded shape
          const roundedCanvas = document.createElement('canvas');
          roundedCanvas.width = tempCanvas.width;
          roundedCanvas.height = tempCanvas.height;
          const roundedCtx = roundedCanvas.getContext('2d');
          if (!roundedCtx) continue;

          roundRect(
            roundedCtx,
            padding,
            padding,
            scale,
            scale,
            radius
          );
          roundedCtx.clip();
          roundedCtx.drawImage(tempCanvas, 0, 0);
          
          // Copy back to main temp canvas
          tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
          tempCtx.drawImage(roundedCanvas, 0, 0);
        }

        // Apply glow if intensity > 0
        if (bgImage.glow.intensity > 0) {
          tempCtx.shadowColor = '#ffffff'; // Always white glow
          tempCtx.shadowBlur = bgImage.glow.intensity;
          tempCtx.shadowOffsetX = 0;
          tempCtx.shadowOffsetY = 0;
          
          // Create another temp canvas to apply glow
          const glowCanvas = document.createElement('canvas');
          glowCanvas.width = tempCanvas.width;
          glowCanvas.height = tempCanvas.height;
          const glowCtx = glowCanvas.getContext('2d');
          if (!glowCtx) continue;
          
          glowCtx.drawImage(tempCanvas, 0, 0);
          tempCtx.drawImage(glowCanvas, 0, 0);
        }

        // Draw the temp canvas onto the main canvas
        ctx.drawImage(
          tempCanvas,
          -scale / 2 - padding,
          -scale / 2 - padding,
          scale + padding * 2,
          scale + padding * 2
        );
        
        ctx.restore();
      }

      // Draw shapes with consistent scaling
      shapeSets.forEach(shapeSet => {
        ctx.save();
        
        const x = (canvas.width * shapeSet.position.horizontal) / 100;
        const y = (canvas.height * shapeSet.position.vertical) / 100;
        
        // Move to position
        ctx.translate(x, y);
        
        // Apply rotation
        ctx.rotate((shapeSet.rotation * Math.PI) / 180);

        // Calculate scale
        const baseSize = Math.min(canvas.width, canvas.height);
        const scale = (baseSize * (shapeSet.scale / 100)) / 1000;
        
        // Move to center, scale, then move back
        ctx.translate(-0.5, -0.5);  // Move to center of shape path
        ctx.scale(scale, scale);    // Apply scaling
        ctx.translate(0.5, 0.5);    // Move back

        // Add glow effect if enabled
        if (shapeSet.glow?.enabled) {
          ctx.shadowColor = shapeSet.glow.color;
          ctx.shadowBlur = shapeSet.glow.intensity;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
        }

        // Set opacity
        ctx.globalAlpha = shapeSet.opacity;

        // Find shape path and draw
        const shape = SHAPES.find(s => s.value === shapeSet.type);
        if (shape) {
          const path = new Path2D(shape.path);
          
          if (shapeSet.isFilled) {
            ctx.fillStyle = shapeSet.color;
            ctx.fill(path);
          } else {
            ctx.strokeStyle = shapeSet.color;
            ctx.lineWidth = shapeSet.strokeWidth || 2;
            ctx.stroke(path);
          }
        }
        
        ctx.restore();
      });

      // Draw text layers with font family and weight
      textSets.forEach(textSet => {
        ctx.save();
        
        try {
          // Create proper font string
          const fontString = `${textSet.fontWeight} ${textSet.fontSize}px "${textSet.fontFamily}"`;
          
          // Set the font
          ctx.font = fontString;
          ctx.fillStyle = textSet.color;
          ctx.globalAlpha = textSet.opacity;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
  
          const x = (canvas.width * textSet.position.horizontal) / 100;
          const y = (canvas.height * textSet.position.vertical) / 100;
  
          ctx.translate(x, y);
          ctx.rotate((textSet.rotation * Math.PI) / 180);
  
          // Add glow effect if enabled
          if (textSet.glow?.enabled && textSet.glow.color && textSet.glow.intensity > 0) {
            ctx.shadowColor = textSet.glow.color;
            ctx.shadowBlur = textSet.glow.intensity;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
          }
  
          ctx.fillText(textSet.text, 0, 0);
        } catch (error) {
          toast({variant:'destructive', title: "Something went wrong. Please try again."});
          console.warn(`Failed to render text: ${textSet.text}`, error);
        } finally {
          ctx.restore();
        }
      });

      // Draw original foreground
      if (fgImageRef.current) {
        ctx.filter = 'none';
        ctx.globalAlpha = 1;

        const scale = Math.min(
          canvas.width / fgImageRef.current.width,
          canvas.height / fgImageRef.current.height
        );
        
        const sizeMultiplier = foregroundSize / 100;
        const newWidth = fgImageRef.current.width * scale * sizeMultiplier;
        const newHeight = fgImageRef.current.height * scale * sizeMultiplier;
        
        const x = (canvas.width - newWidth) / 2;
        const y = (canvas.height - newHeight) / 2;

        if (hasTransparentBackground || hasChangedBackground) {
          const offsetX = (canvas.width * foregroundPosition.x) / 100;
          const offsetY = (canvas.height * foregroundPosition.y) / 100;
          ctx.drawImage(fgImageRef.current, x + offsetX, y + offsetY, newWidth, newHeight);
        } else {
          ctx.drawImage(fgImageRef.current, x, y, newWidth, newHeight);
        }

        // Draw cloned foregrounds
        clonedForegrounds.forEach(clone => {
          const scale = Math.min(
            canvas.width / fgImageRef.current!.width,
            canvas.height / fgImageRef.current!.height
          );
          
          const newWidth = fgImageRef.current!.width * scale * (clone.size / 100);
          const newHeight = fgImageRef.current!.height * scale * (clone.size / 100);
          
          const x = (canvas.width - newWidth) / 2;
          const y = (canvas.height - newHeight) / 2;
          
          const offsetX = (canvas.width * clone.position.x) / 100;
          const offsetY = (canvas.height * clone.position.y) / 100;

          // Save context state before transformations
          ctx.save();

          // Move to center of where we want to draw the image
          ctx.translate(x + offsetX + newWidth / 2, y + offsetY + newHeight / 2);
          
          // Rotate around the center
          ctx.rotate((clone.rotation * Math.PI) / 180);
          
          // Draw image centered at origin
          ctx.drawImage(
            fgImageRef.current!, 
            -newWidth / 2, 
            -newHeight / 2, 
            newWidth, 
            newHeight
          );

          // Restore context state
          ctx.restore();
        });
      }
    });
  }, [textSets, shapeSets, filterString, hasTransparentBackground, hasChangedBackground, foregroundPosition, clonedForegrounds, backgroundImages, backgroundColor, foregroundSize]);

  // Cleanup on unmount
  useEffect(() => {
    const currentRenderRequest = renderRequestRef.current;
    const loadedBgImages = new Set([...bgImagesRef.current.values()]);

    return () => {
      if (currentRenderRequest) {
        cancelAnimationFrame(currentRenderRequest);
      }
      // Clean up image references
      loadedBgImages.clear();
      bgImagesRef.current.clear();
      bgImageRef.current = null;
      fgImageRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!hasTransparentBackground && !image.background) return;
    if (hasTransparentBackground && !image.foreground) return;

    // Load appropriate image based on transparency state
    const img = new Image();
    img.src = hasTransparentBackground ? image.foreground! : image.background!;
    img.onload = () => {
      bgImageRef.current = img;
      render();
    };

    // Load foreground image if not in transparent mode
    if (!hasTransparentBackground && image.foreground) {
      const fgImg = new Image();
      fgImg.src = image.foreground;
      fgImg.onload = () => {
        fgImageRef.current = fgImg;
        render();
      };
    }
  }, [image.background, image.foreground, hasTransparentBackground, foregroundPosition, foregroundSize]); // Add foregroundSize here

  useEffect(() => {
    // Load all fonts used in text sets
    const loadFonts = async () => {
      const fontPromises = textSets.map(textSet => {
        // Create proper font string for loading
        const fontString = `${textSet.fontWeight} ${textSet.fontSize}px ${textSet.fontFamily}`;
        return document.fonts.load(fontString);
      });
      await Promise.all(fontPromises);
      render();
    };
    
    loadFonts();
  }, [textSets]);

  // Re-render on text, shape, imageEnhancements, and foregroundPosition changes
  useEffect(() => {
    render();
  }, [
    textSets, 
    shapeSets, 
    imageEnhancements, 
    foregroundPosition, 
    clonedForegrounds, 
    hasChangedBackground, 
    backgroundColor,
    foregroundSize  // Add foregroundSize here
  ]);

  const handleClick = () => {
    downloadImage(true);
  };

  return (
    <div className="relative w-full h-full">
      <div className={cn(
        "absolute inset-0",
        "flex items-center justify-center",
        "overflow-hidden"
      )}>
        <canvas
          ref={canvasRef}
          className={cn(
            "max-w-full max-h-full",
            "object-contain",
            "rounded-xl" // Rounded corners for canvas
          )}
        />
      </div>
    </div>
  );
}

// Add helper function for transparency visualization
function createCheckerboardPattern() {
  const size = 16;
  const canvas = document.createElement('canvas');
  canvas.width = size * 2;
  canvas.height = size * 2;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size * 2, size * 2);
  ctx.fillStyle = '#e5e5e5';
  ctx.fillRect(0, 0, size, size);
  ctx.fillRect(size, size, size, size);

  return canvas;
}
