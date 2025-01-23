'use client';

import { create } from 'zustand';
import { convertHeicToJpeg } from '@/lib/image-utils';
import { SHAPES } from '@/constants/shapes';
import { uploadFile } from '@/lib/upload';
import { removeBackground } from "@imgly/background-removal";
import { supabase } from '@/lib/supabaseClient'; // Add this import
import { isSubscriptionActive } from '@/lib/utils';

interface GlowEffect {
  enabled: boolean;
  color: string;
  intensity: number;
}

interface TextSet {
  id: number;
  text: string;
  fontFamily: string;
  fontWeight: string;
  fontSize: number;
  color: string;
  position: { vertical: number; horizontal: number };
  opacity: number;
  rotation: number;
  glow?: GlowEffect;
}

interface ShapeSet {
  id: number;
  type: string;
  color: string;
  isFilled: boolean;
  position: { vertical: number; horizontal: number };
  scale: number;
  opacity: number;
  rotation: number;
  strokeWidth: number;
  glow?: GlowEffect;
}

interface ImageEnhancements {
  brightness: number;
  contrast: number;
  saturation: number;
  fade: number;
  exposure: number;
  highlights: number;
  shadows: number;
  sharpness: number;
}

interface ClonedForeground {
  id: number;
  position: {
    x: number;
    y: number;
  };
  size: number;
  rotation: number;
}

interface BackgroundImage {
  id: number;
  url: string;
  position: { vertical: number; horizontal: number };
  scale: number;
  opacity: number;
  rotation: number;
}

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

interface EditorState {
  image: {
    original: string | null;
    background: string | null;
    foreground: string | null;
  };
  textSets: TextSet[];
  isProcessing: boolean;
  isConverting: boolean;
  shapeSets: ShapeSet[];
  exportQuality: 'high' | 'medium' | 'low';
  isDownloading: boolean;
  imageEnhancements: ImageEnhancements;
  originalFileName: string | null;
  processingMessage: string;
  loadedFonts: Set<string>;
  hasTransparentBackground: boolean;
  hasChangedBackground: boolean;
  foregroundPosition: {
    x: number;
    y: number;
  };
  clonedForegrounds: ClonedForeground[];
  isBackgroundRemoved: boolean;  // Add this new state
  backgroundImages: BackgroundImage[];
  backgroundColor: string | null;
  foregroundSize: number;  // Add this line
  pendingImages: PendingImage[];  // Add this line
  isProSubscriptionActive: boolean | null;  // Add this line
}

interface EditorActions {
  addTextSet: () => void;
  updateTextSet: (id: number, updates: Partial<TextSet>) => void;
  removeTextSet: (id: number) => void;
  duplicateTextSet: (id: number) => void;
  handleImageUpload: (file: File, state?: { isConverting?: boolean; isProcessing?: boolean; isAuthenticated?: boolean; userId?: string }) => Promise<void>;
  downloadImage: (isAuthenticated: boolean) => Promise<void>;  // Remove quality parameter
  resetEditor: (clearImage?: boolean) => void;
  addShapeSet: (type: string) => void;
  updateShapeSet: (id: number, updates: Partial<ShapeSet>) => void;
  removeShapeSet: (id: number) => void;
  duplicateShapeSet: (id: number) => void;
  setExportQuality: (quality: 'high' | 'medium' | 'low') => void;
  updateImageEnhancements: (enhancements: ImageEnhancements) => void;
  setProcessingMessage: (message: string) => void;
  removeBackground: () => Promise<void>;
  resetBackground: () => void;
  changeBackground: () => Promise<void>;
  updateForegroundPosition: (position: { x: number; y: number }) => void;
  addClonedForeground: () => void;
  removeClonedForeground: (id: number) => void;
  updateClonedForegroundPosition: (id: number, position: { x: number; y: number }) => void;
  updateClonedForegroundTransform: (id: number, updates: Partial<{ position: { x: number; y: number }; size: number; rotation: number }>) => void;
  setIsProcessing: (value: boolean) => void;
  setIsConverting: (value: boolean) => void;
  addBackgroundImage: (file: File, originalSize?: { width: number; height: number } | null, id?: number) => Promise<void>;
  removeBackgroundImage: (id: number) => void;
  updateBackgroundImage: (id: number, updates: Partial<BackgroundImage>) => void;
  setBackgroundColor: (color: string | null) => void;
  updateForegroundSize: (size: number) => void;  // Add this line
  addPendingImage: (image: PendingImage) => void;
  updatePendingImage: (id: number, updates: Partial<PendingImage>) => void;
}

// Add helper functions outside of the store
const createCheckerboardPattern = (): HTMLCanvasElement => {
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
};

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

const filterString = (enhancements: ImageEnhancements): string => `
  brightness(${enhancements.brightness}%)
  contrast(${enhancements.contrast}%)
  saturate(${enhancements.saturation}%)
  opacity(${100 - enhancements.fade}%)
`;

const POSITION_UPDATE_DELAY = 8; // Reduced from 16ms

const batchedPositionUpdates = new Map<number, any>();
const batchTimeout = new Map<number, NodeJS.Timeout>();

const batchUpdate = (id: number, updates: any, updateFn: (id: number, updates: any) => void) => {
  if (batchTimeout.has(id)) {
    clearTimeout(batchTimeout.get(id));
  }

  batchedPositionUpdates.set(id, {
    ...batchedPositionUpdates.get(id),
    ...updates
  });

  batchTimeout.set(id, setTimeout(() => {
    const batchedUpdates = batchedPositionUpdates.get(id);
    if (batchedUpdates) {
      requestAnimationFrame(() => {
        updateFn(id, batchedUpdates);
        batchedPositionUpdates.delete(id);
      });
    }
    batchTimeout.delete(id);
  }, POSITION_UPDATE_DELAY));
};

const cleanupImageUrls = (state: EditorState) => {
  if (state.image.original) URL.revokeObjectURL(state.image.original);
  if (state.image.background) URL.revokeObjectURL(state.image.background);
  if (state.image.foreground) URL.revokeObjectURL(state.image.foreground);
  
  state.backgroundImages.forEach(img => {
    URL.revokeObjectURL(img.url);
  });

  state.pendingImages.forEach(img => {
    if (img.url) URL.revokeObjectURL(img.url);
    if (img.processedUrl) URL.revokeObjectURL(img.processedUrl);
  });
};

export const useEditor = create<EditorState & EditorActions>()((set, get) => ({
  image: {
    original: null,
    background: null,
    foreground: null,
  },
  textSets: [],
  isProcessing: false,
  isConverting: false,
  shapeSets: [],
  exportQuality: 'high',
  isDownloading: false,
  imageEnhancements: {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    fade: 0,
    exposure: 0,
    highlights: 0,
    shadows: 0,
    sharpness: 0,
  },
  originalFileName: null,
  processingMessage: '',
  loadedFonts: new Set(),
  hasTransparentBackground: false,
  hasChangedBackground: false,
  foregroundPosition: {
    x: 0,
    y: 0
  },
  clonedForegrounds: [],
  isBackgroundRemoved: false,  // Initialize the new state
  backgroundImages: [],
  backgroundColor: null,
  foregroundSize: 100,  // Default size is 100%
  pendingImages: [],  // Initialize the new state
  isProSubscriptionActive: null,  // Add this line
  setProcessingMessage: (message) => set({ processingMessage: message }),

  addTextSet: () => set((state) => ({
    textSets: [...state.textSets, {
      id: Date.now(),
      text: 'new text',
      fontFamily: 'Inter',
      fontWeight: '700',
      fontSize: 600,
      color: '#FFFFFF',
      position: { 
        vertical: 50, 
        horizontal: 50 
      },
      opacity: 1,
      rotation: 0
    }]
  })),

  updateTextSet: async (id, updates) => {
    const state = get();
    
    try {
      if (updates.position) {
        // Ensure position updates include both properties
        const currentText = state.textSets.find(set => set.id === id);
        if (!currentText) return;

        const newPosition = {
          vertical: updates.position.vertical ?? currentText.position.vertical,
          horizontal: updates.position.horizontal ?? currentText.position.horizontal
        };

        // Batch position updates
        batchUpdate(id, { position: newPosition }, (id, batchedUpdates) => {
          set(state => ({
            textSets: state.textSets.map(set => 
              set.id === id ? { ...set, ...batchedUpdates } : set
            )
          }));
        });
        return;
      }

      if (updates.fontFamily) {
        // Load fonts in parallel
        const weightsToLoad = ['400', '700'];
        await Promise.all(
          weightsToLoad.map(weight => 
            document.fonts.load(`${weight} 16px ${updates.fontFamily}`)
          )
        );

        const newLoadedFonts = new Set(state.loadedFonts);
        newLoadedFonts.add(updates.fontFamily);
        set({ loadedFonts: newLoadedFonts });
      }

      // Use RAF for visual updates
      requestAnimationFrame(() => {
        set(state => ({
          textSets: state.textSets.map(set => 
            set.id === id ? { ...set, ...updates } : set
          )
        }));
      });
    } catch (error) {
      console.warn(`Failed to update text set (ID: ${id}):`, error);
    }
  },

  removeTextSet: (id) => set((state) => ({
    textSets: state.textSets.filter(set => set.id !== id)
  })),

  duplicateTextSet: (id) => set((state) => {
    const textSet = state.textSets.find(set => set.id === id);
    if (!textSet) return state;
    return {
      textSets: [...state.textSets, { ...textSet, id: Date.now() }]
    };
  }),

  addShapeSet: (type: string) => set((state) => ({
    shapeSets: [...state.shapeSets, {
      id: Date.now(),
      type,
      color: '#FFFFFF',
      isFilled: false,
      strokeWidth: 5,
      position: { vertical: 50, horizontal: 50 },
      scale: 500, // Changed initial scale to be 50
      opacity: 1,
      rotation: 0
    }]
  })),

  updateShapeSet: (id, updates) => {
    if (updates.position) {
      // Batch position updates
      batchUpdate(id, { position: updates.position }, (id, batchedUpdates) => {
        set(state => ({
          shapeSets: state.shapeSets.map(set => 
            set.id === id ? { ...set, ...batchedUpdates } : set
          )
        }));
      });
      return;
    }

    // Use RAF for visual updates
    requestAnimationFrame(() => {
      set(state => ({
        shapeSets: state.shapeSets.map(set => 
          set.id === id ? { ...set, ...updates } : set
        )
      }));
    });
  },

  removeShapeSet: (id) => set((state) => ({
    shapeSets: state.shapeSets.filter(set => set.id !== id)
  })),

  duplicateShapeSet: (id) => set((state) => {
    const shapeSet = state.shapeSets.find(set => set.id === id);
    if (!shapeSet) return state;
    return {
      shapeSets: [...state.shapeSets, { ...shapeSet, id: Date.now() }]
    };
  }),

  handleImageUpload: async (file: File, state?: { isConverting?: boolean; isProcessing?: boolean; isAuthenticated?: boolean; userId?: string }) => {
    // First, reset the editor state while preserving certain flags
    set(state => ({
      ...state,
      textSets: [],
      shapeSets: [],
      imageEnhancements: {
        brightness: 100,
        contrast: 100,
        saturation: 100,
        fade: 0,
        exposure: 0,
        highlights: 0,
        shadows: 0,
        sharpness: 0,
      },
      clonedForegrounds: [],
      hasTransparentBackground: false,
      hasChangedBackground: false,
      isBackgroundRemoved: false,
      foregroundPosition: { x: 0, y: 0 },
      backgroundImages: [],
      backgroundColor: null,
      foregroundSize: 100,
    }));

    if (state?.isConverting !== undefined) set({ isConverting: state.isConverting });
    if (state?.isProcessing !== undefined) set({ isProcessing: state.isProcessing });

    try {
      const fileName = file.name.replace(/\.[^/.]+$/, "");
      set({ originalFileName: fileName });

      // Clean up previous object URLs
      const currentState = get();
      if (currentState.image.original) URL.revokeObjectURL(currentState.image.original);
      if (currentState.image.background) URL.revokeObjectURL(currentState.image.background);
      if (currentState.image.foreground) URL.revokeObjectURL(currentState.image.foreground);

      const originalUrl = URL.createObjectURL(file);
      set(state => ({
        image: {
          ...state.image,
          original: originalUrl,
          background: originalUrl
        }
      }));

      if (file.type === 'image/heic' || file.type === 'image/heif') {
        set({ 
          isConverting: true,
          processingMessage: 'Converting your photo to a compatible format...' 
        });
        file = await convertHeicToJpeg(file);
      }

      // Remove optimization step - use original file
      const fileToUpload = file;

      set({ isProcessing: true });

      // Different processing based on authentication status and subscription
      let foregroundUrl;
      
      if (state?.isAuthenticated && state.userId) {  // Add userId check
        // Check if subscription is active before using API
        const profile = await supabase
          .from('profiles')
          .select('expires_at')
          .eq('id', state.userId)  // Use userId from state
          .single();

        const isProActive = profile.data?.expires_at && isSubscriptionActive(profile.data.expires_at);
        set({ isProSubscriptionActive: isProActive });

        if (isProActive) {
          // Pro users with active subscription: Use API endpoint
          const formData = new FormData();
          formData.append('file', fileToUpload);
          formData.append('isAuthenticated', 'true');
    
          const response = await fetch('/api/remove-background', {
            method: 'POST',
            body: formData
          });
    
          const data = await response.json();
    
          if (!response.ok) {
            throw new Error(data.error || 'Failed to remove background');
          }
    
          // Fetch the processed image
          const processedImageResponse = await fetch(data.url);
          if (!processedImageResponse.ok) {
            throw new Error('Failed to fetch processed image');
          }
    
          const processedBlob = await processedImageResponse.blob();
          foregroundUrl = URL.createObjectURL(processedBlob);
        } else {
          // Expired subscription: Use client-side removal
          const imageUrl = URL.createObjectURL(fileToUpload);
          const imageBlob = await removeBackground(imageUrl);
          foregroundUrl = URL.createObjectURL(imageBlob);
          URL.revokeObjectURL(imageUrl);
        }
      } else {
        // Free users: Use client-side removal
        const imageUrl = URL.createObjectURL(fileToUpload);
        const imageBlob = await removeBackground(imageUrl);
        foregroundUrl = URL.createObjectURL(imageBlob);
        URL.revokeObjectURL(imageUrl);
      }
  
      set(state => ({
        image: {
          ...state.image,
          foreground: foregroundUrl
        },
        processingMessage: 'All set! Let\'s create something beautiful!'
      }));
  
      setTimeout(() => set({ processingMessage: '' }), 2000);
  
    } catch (error) {
      console.error('Error processing image:', error);
      set({ 
        processingMessage: error instanceof Error ? error.message : 'Oops! Something went wrong. Please try again.',
        isProcessing: false,
        isConverting: false
      });
    } finally {
      set({ isConverting: false, isProcessing: false });
    }
  },

  downloadImage: async (isAuthenticated: boolean) => {
    try {
      const state = get();
      if (state.isDownloading) return; // Prevent multiple downloads

      set({ 
        isDownloading: true,
        processingMessage: 'Preparing your masterpiece...'
      });

      // Add delay to ensure dialog appears before any processing
      await new Promise(resolve => setTimeout(resolve, 100));

      const { 
        image, 
        backgroundColor,
        textSets, 
        shapeSets, 
        imageEnhancements, 
        hasTransparentBackground,
        hasChangedBackground,
        foregroundPosition,
        backgroundImages,
        foregroundSize
      } = get();

      // Modified validation check to allow downloads with backgroundColor
      if (!image.foreground || (!image.background && !backgroundColor && !hasTransparentBackground)) {
        throw new Error('No image to download');
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Failed to get canvas context');

      // Set canvas dimensions from foreground image
      const fgImg = await loadImage(image.foreground);
      canvas.width = fgImg.width;
      canvas.height = fgImg.height;

      // Clear canvas with transparency
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Only draw background if it's not meant to be transparent
      if (!hasTransparentBackground) {
        if (backgroundColor) {
          // Fill with background color
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else if (image.background) {
          // Draw background image with filters
          const bgImg = await loadImage(image.background);
          ctx.filter = filterString(imageEnhancements);
          ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
          ctx.filter = 'none';
        }
      }

      // 2. Draw background images
      for (const bgImage of backgroundImages) {
        const img = await loadImage(bgImage.url);
        
        ctx.save();
        
        const x = (canvas.width * bgImage.position.horizontal) / 100;
        const y = (canvas.height * bgImage.position.vertical) / 100;
        
        ctx.translate(x, y);
        ctx.rotate((bgImage.rotation * Math.PI) / 180);
        ctx.globalAlpha = bgImage.opacity;

        const baseSize = Math.min(canvas.width, canvas.height);
        const scale = (baseSize * bgImage.scale) / 100;
        
        ctx.drawImage(
          img,
          -scale / 2,
          -scale / 2,
          scale,
          scale
        );
        
        ctx.restore();
      }

      // 3. Draw shapes and text
      // Draw shapes
      shapeSets.forEach(shapeSet => {
        ctx.save();
        
        const x = (canvas.width * shapeSet.position.horizontal) / 100;
        const y = (canvas.height * shapeSet.position.vertical) / 100;
        
        ctx.translate(x, y);
        ctx.rotate((shapeSet.rotation * Math.PI) / 180);

        const baseSize = Math.min(canvas.width, canvas.height);
        const scale = (baseSize * (shapeSet.scale / 100)) / 1000;
        
        ctx.translate(-0.5, -0.5);
        ctx.scale(scale, scale);
        ctx.translate(0.5, 0.5);

        if (shapeSet.glow?.enabled) {
          ctx.shadowColor = shapeSet.glow.color;
          ctx.shadowBlur = shapeSet.glow.intensity;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
        }

        ctx.globalAlpha = shapeSet.opacity;

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

      // Draw text
      textSets.forEach(textSet => {
        ctx.save();
        
        ctx.font = `${textSet.fontWeight} ${textSet.fontSize}px "${textSet.fontFamily}"`;
        ctx.fillStyle = textSet.color;
        ctx.globalAlpha = textSet.opacity;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const x = (canvas.width * textSet.position.horizontal) / 100;
        const y = (canvas.height * textSet.position.vertical) / 100;

        ctx.translate(x, y);
        ctx.rotate((textSet.rotation * Math.PI) / 180);

        if (textSet.glow?.enabled) {
          ctx.shadowColor = textSet.glow.color;
          ctx.shadowBlur = textSet.glow.intensity;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
        }

        ctx.fillText(textSet.text, 0, 0);
        
        ctx.restore();
      });

      // 4. Draw foreground LAST and ONCE
      if (image.foreground) {
        const fgImg = await loadImage(image.foreground);
        ctx.filter = 'none';
        ctx.globalAlpha = 1;

        const scale = Math.min(
          canvas.width / fgImg.width,
          canvas.height / fgImg.height
        );
        
        const sizeMultiplier = foregroundSize / 100;
        const newWidth = fgImg.width * scale * sizeMultiplier;
        const newHeight = fgImg.height * scale * sizeMultiplier;
        
        const x = (canvas.width - newWidth) / 2;
        const y = (canvas.height - newHeight) / 2;

        // Apply offset if background is changed or transparent
        if (hasTransparentBackground || hasChangedBackground) {
          const offsetX = (canvas.width * foregroundPosition.x) / 100;
          const offsetY = (canvas.height * foregroundPosition.y) / 100;
          ctx.drawImage(fgImg, x + offsetX, y + offsetY, newWidth, newHeight);
        } else {
          ctx.drawImage(fgImg, x, y, newWidth, newHeight);
        }

        // Draw cloned foregrounds
        for (const clone of get().clonedForegrounds) {
          const fgImg = await loadImage(image.foreground);
          const scale = Math.min(
            canvas.width / fgImg.width,
            canvas.height / fgImg.height
          );
          
          const newWidth = fgImg.width * scale * (clone.size / 100);
          const newHeight = fgImg.height * scale * (clone.size / 100);
          
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
            fgImg, 
            -newWidth / 2, 
            -newHeight / 2, 
            newWidth, 
            newHeight
          );

          // Restore context state
          ctx.restore();
        }
      }

      // Check subscription status
      let imageFormat = 'image/jpeg';
      let imageQuality = 0.4;
      
      if (isAuthenticated && get().isProSubscriptionActive) {
        imageFormat = 'image/png';
        imageQuality = 1;
      }

      // Create blob with appropriate format
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          blob => blob ? resolve(blob) : reject(new Error('Failed to create image')),
          imageFormat,
          imageQuality
        );
      });

      // Create download link and trigger download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const timestamp = Math.floor(Date.now() / 1000);
      const extension = imageFormat === 'image/png' ? 'png' : 'jpg';
      const filename = `UnderlayXAI_${timestamp}.${extension}`;
      
      link.download = filename;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // After successful download, log to Supabase
      try {
        const { error } = await supabase
          .from('downloads')
          .insert([
            { 
              file_format: extension.toUpperCase(),
            }
          ]);

        if (error) {
          console.error('Failed to log download:', error);
        }
      } catch (error) {
        console.error('Error logging download:', error);
      }

      set({ isDownloading: false });
    } catch (error) {
      console.error('Download error:', error);
      set({ 
        isDownloading: false,
        processingMessage: 'Download failed. Please try again.' 
      });
    } finally {
      set({ isDownloading: false });
    }
  },

  resetEditor: (clearImage = true) => set((state) => {
    // Clean up existing object URLs to prevent memory leaks
    if (clearImage) {
      cleanupImageUrls(state);
    }

    return {
      textSets: [],
      shapeSets: [],
      imageEnhancements: {
        brightness: 100,
        contrast: 100,
        saturation: 100,
        fade: 0,
        exposure: 0,
        highlights: 0,
        shadows: 0,
        sharpness: 0,
      },
      clonedForegrounds: [],
      hasTransparentBackground: false,
      hasChangedBackground: false,
      isBackgroundRemoved: false,
      foregroundPosition: { x: 0, y: 0 },
      processingMessage: '',
      isProcessing: false,
      isConverting: false,
      isDownloading: false,
      backgroundImages: [], // Add this line to clear background images
      image: clearImage ? {
        original: null,
        background: null,
        foreground: null
      } : state.image,
      loadedFonts: new Set(),
      isProSubscriptionActive: null,  // Add this line
    };
  }),

  setExportQuality: (quality) => set({ exportQuality: quality }),
  updateImageEnhancements: (enhancements) => set({ imageEnhancements: enhancements }),
  removeBackground: async () => {
    const { image } = get();
    if (!image.foreground) return;

    set(state => ({
      image: {
        ...state.image,
        background: null
      },
      hasTransparentBackground: true,
      isBackgroundRemoved: true,
      processingMessage: 'Background removed!'
    }));

    setTimeout(() => set({ processingMessage: '' }), 1000);
  },

  resetBackground: () => {
    const { image } = get();
    if (!image.original) return;

    // Clean up background image URLs before resetting
    const state = get();
    state.backgroundImages.forEach(img => {
      URL.revokeObjectURL(img.url);
    });

    set(state => ({
      image: {
        ...state.image,
        background: image.original
      },
      hasTransparentBackground: false,
      hasChangedBackground: false,
      isBackgroundRemoved: false,
      foregroundPosition: { x: 0, y: 0 },
      backgroundImages: [],
      backgroundColor: null,  // Reset background color
      foregroundSize: 100
    }));
  },

  changeBackground: async () => {
    try {
      const file = await uploadFile();
      if (!file) return;

      set({ 
        isProcessing: true,
        processingMessage: 'Changing background...'
      });

      const backgroundUrl = URL.createObjectURL(file);
      await loadImage(backgroundUrl); // Ensure image loads successfully

      set(state => ({
        image: {
          ...state.image,
          background: backgroundUrl
        },
        hasTransparentBackground: false, // Important: Set this to false
        hasChangedBackground: true,
        isBackgroundRemoved: false,
        isProcessing: false,
        processingMessage: 'Background changed successfully!'
      }));

      setTimeout(() => set({ processingMessage: '' }), 2000);
    } catch (error) {
      console.error('Error changing background:', error);
      set({ 
        processingMessage: 'Failed to change background. Please try again.',
        isProcessing: false
      });
    }
  },

  updateForegroundPosition: ({ x, y }) => {
    set({ foregroundPosition: { x, y } });
  },

  addClonedForeground: () => {
    const { image } = get();
    if (!image.foreground) return;

    set((state) => ({
      clonedForegrounds: [
        ...state.clonedForegrounds,
        {
          id: Date.now(),
          position: { x: 5, y: 0 },
          size: 100,
          rotation: 0
        }
      ]
    }));
  },

  removeClonedForeground: (id) => set((state) => ({
    clonedForegrounds: state.clonedForegrounds.filter(clone => clone.id !== id)
  })),

  updateClonedForegroundPosition: (id, position) => set((state) => ({
    clonedForegrounds: state.clonedForegrounds.map(clone =>
      clone.id === id ? { ...clone, position } : clone
    )
  })),

  updateClonedForegroundTransform: (id, updates) => set((state) => ({
    clonedForegrounds: state.clonedForegrounds.map(clone =>
      clone.id === id ? { ...clone, ...updates } : clone
    )
  })),
  setIsProcessing: (value: boolean) => set({ isProcessing: value }),
  setIsConverting: (value: boolean) => set({ isConverting: value }),
  addBackgroundImage: async (file: File, originalSize?: { width: number; height: number } | null, id?: number) => {
    try {
      const { backgroundImages } = get();
      if (backgroundImages.length >= 2) {
        throw new Error('Maximum of 2 background images allowed');
      }

      const url = URL.createObjectURL(file);
      
      // Calculate scale that preserves aspect ratio
      let initialScale = 50;
      if (originalSize) {
        const aspectRatio = originalSize.width / originalSize.height;
        initialScale = aspectRatio > 1 ? 100 : 100 * aspectRatio;
      }

      set((state) => ({
        backgroundImages: [
          ...state.backgroundImages,
          {
            id: id || Date.now(),
            url,
            position: { vertical: 50, horizontal: 50 },
            scale: initialScale,
            opacity: 1,
            rotation: 0
          }
        ]
      }));
    } catch (error) {
      console.error('Error adding background image:', error);
      throw error; // Re-throw to handle in the component
    }
  },

  removeBackgroundImage: (id) => set((state) => {
    // Find the image to clean up its URL
    const imageToRemove = state.backgroundImages.find(img => img.id === id);
    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.url);
    }

    // Remove from both pendingImages and backgroundImages arrays
    const filteredBackgroundImages = state.backgroundImages.filter(img => img.id !== id);
    const filteredPendingImages = state.pendingImages.filter(img => img.id !== id);

    // If all background images are removed, reset related states
    const shouldResetBackground = filteredBackgroundImages.length === 0;

    return {
      backgroundImages: filteredBackgroundImages,
      pendingImages: filteredPendingImages,
      ...(shouldResetBackground && {
        hasChangedBackground: false,
        hasTransparentBackground: false,
        backgroundColor: null,
        image: {
          ...state.image,
          background: state.image.original
        }
      })
    };
  }),

  updateBackgroundImage: (id, updates) => set((state) => ({
    backgroundImages: state.backgroundImages.map(img =>
      img.id === id ? { ...img, ...updates } : img
    )
  })),
  setBackgroundColor: (color) => {
    const { image } = get();
    
    set(state => ({
      backgroundColor: color,
      // Reset background image if color is selected
      image: {
        ...state.image,
        background: color ? null : image.original
      },
      hasChangedBackground: true
    }));
  },
  
  updateForegroundSize: (size) => set({ foregroundSize: size }),

  addPendingImage: (image: PendingImage) => set(state => ({
    pendingImages: [...state.pendingImages, image]
  })),

  updatePendingImage: (id: number, updates: Partial<PendingImage>) => set(state => ({
    pendingImages: state.pendingImages.map(img =>
      img.id === id ? { ...img, ...updates } : img
    )
  })),
}));
