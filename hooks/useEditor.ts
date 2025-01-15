'use client';

import { create } from 'zustand';
import { removeBackground } from '@imgly/background-removal';
import { convertHeicToJpeg } from '@/lib/image-utils';
import { SHAPES } from '@/constants/shapes';
import { uploadFile } from '@/lib/upload';  // Add this import

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
}

interface EditorActions {
  addTextSet: () => void;
  updateTextSet: (id: number, updates: Partial<TextSet>) => void;
  removeTextSet: (id: number) => void;
  duplicateTextSet: (id: number) => void;
  handleImageUpload: (file: File, state?: { isConverting?: boolean; isProcessing?: boolean }) => Promise<void>;
  downloadImage: () => Promise<void>;  // Remove quality parameter
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
}

// Add helper functions outside of the store
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
  setProcessingMessage: (message) => set({ processingMessage: message }),

  addTextSet: () => set((state) => ({
    textSets: [...state.textSets, {
      id: Date.now(),
      text: 'new text',
      fontFamily: 'Inter',
      fontWeight: '700',
      fontSize: 600,
      color: '#FFFFFF',
      position: { vertical: 50, horizontal: 50 },
      opacity: 1,
      rotation: 0
    }]
  })),

  updateTextSet: async (id, updates) => {
    const state = get();
    
    try {
      if (updates.fontFamily) {
        const weightsToLoad = ['400', '700'];
        const fontLoadPromises = weightsToLoad.map(weight => 
          document.fonts.load(`${weight} 16px ${updates.fontFamily}`)
        );

        await Promise.all(fontLoadPromises);

        if (updates.fontFamily) {
          const newLoadedFonts = new Set(state.loadedFonts);
          newLoadedFonts.add(updates.fontFamily);
          set({ loadedFonts: newLoadedFonts });
        }
      }

      set(state => ({
        textSets: state.textSets.map(set => 
          set.id === id ? { ...set, ...updates } : set
        )
      }));
    } catch (error) {
      console.warn(`Failed to update text set (ID: ${id}):`, error);
      set(state => ({
        textSets: state.textSets.map(set => 
          set.id === id ? { ...set, ...updates } : set
        )
      }));
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

  updateShapeSet: (id, updates) => set((state) => ({
    shapeSets: state.shapeSets.map(set => 
      set.id === id ? { ...set, ...updates } : set
    )
  })),

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

  handleImageUpload: async (file: File, state?: { isConverting?: boolean; isProcessing?: boolean }) => {
    if (state?.isConverting !== undefined) set({ isConverting: state.isConverting });
    if (state?.isProcessing !== undefined) set({ isProcessing: state.isProcessing });

    try {
      const fileName = file.name.replace(/\.[^/.]+$/, "");
      set({ originalFileName: fileName });

      const originalUrl = URL.createObjectURL(file);
      set(state => ({
        image: {
          ...state.image,
          original: originalUrl,
          background: originalUrl // Set both original and background
        }
      }));

      if (file.type === 'image/heic' || file.type === 'image/heif') {
        set({ 
          isConverting: true,
          processingMessage: 'Converting your photo to a compatible format...' 
        });
        file = await convertHeicToJpeg(file);
      }

      set({ isProcessing: true });

      // Process foreground with PNG format to preserve transparency
      const processedBlob = await removeBackground(originalUrl);
      // Ensure the blob is treated as PNG
      const transparentBlob = new Blob([processedBlob], { type: 'image/png' });
      const foregroundUrl = URL.createObjectURL(transparentBlob);
      
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
        processingMessage: 'Oops! Something went wrong. Please try again.',
        isProcessing: false,
        isConverting: false
      });
    } finally {
      set({ isConverting: false, isProcessing: false });
    }
  },

  downloadImage: async () => {
    set({ 
      isDownloading: true,
      processingMessage: 'Preparing your masterpiece...'
    });

    const { 
      image, 
      textSets, 
      shapeSets, 
      imageEnhancements, 
      hasTransparentBackground,
      hasChangedBackground,
      foregroundPosition,
      originalFileName 
    } = get();

    if (!image.original || (!hasTransparentBackground && !image.background) || (hasTransparentBackground && !image.foreground)) return;

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Failed to get canvas context');

      // 1. Draw background first
      const backgroundImage = await loadImage(image.background || image.original);
      canvas.width = backgroundImage.width;
      canvas.height = backgroundImage.height;

      if (!hasTransparentBackground) {
        ctx.filter = filterString(imageEnhancements);
        ctx.drawImage(backgroundImage, 0, 0);
        ctx.filter = 'none';
      }

      // 2. Draw shapes and text
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

      // 3. Draw foreground LAST and ONCE
      if (image.foreground) {
        const fgImg = await loadImage(image.foreground);
        ctx.filter = 'none';
        ctx.globalAlpha = 1;

        const scale = Math.min(
          canvas.width / fgImg.width,
          canvas.height / fgImg.height
        );
        
        const newWidth = fgImg.width * scale;
        const newHeight = fgImg.height * scale;
        
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

      // Create blob and download
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          blob => blob ? resolve(blob) : reject(new Error('Failed to create blob')),
          'image/png',
          1.0  // Always use highest quality
        );
      });

      // Download logic
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const timestamp = Math.floor(Date.now() / 1000); // Get current time in seconds
      link.download = `UnderlayX_${timestamp}.png`;  // Always use PNG extension
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      set({ 
        isDownloading: false,
        processingMessage: 'Download complete!' 
      });
      setTimeout(() => set({ processingMessage: '' }), 2000);

    } catch (error) {
      console.error('Error downloading image:', error);
      set({ 
        processingMessage: 'Download failed. Please try again.',
        isDownloading: false 
      });
    }
  },

  resetEditor: (clearImage = true) => set((state) => {
    // Clean up existing object URLs to prevent memory leaks
    if (clearImage) {
      if (state.image.original) URL.revokeObjectURL(state.image.original);
      if (state.image.background) URL.revokeObjectURL(state.image.background);
      if (state.image.foreground) URL.revokeObjectURL(state.image.foreground);
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
      image: clearImage ? {
        original: null,
        background: null,
        foreground: null
      } : state.image,
      loadedFonts: new Set()
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

    set(state => ({
      image: {
        ...state.image,
        background: image.original
      },
      hasTransparentBackground: false,
      hasChangedBackground: false,
      isBackgroundRemoved: false,
      foregroundPosition: { x: 0, y: 0 }
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
}));
