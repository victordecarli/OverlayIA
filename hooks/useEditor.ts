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
}

interface EditorActions {
  addTextSet: () => void;
  updateTextSet: (id: number, updates: Partial<TextSet>) => void;
  removeTextSet: (id: number) => void;
  duplicateTextSet: (id: number) => void;
  handleImageUpload: (file: File, state?: { isConverting?: boolean; isProcessing?: boolean }) => Promise<void>;
  downloadImage: () => Promise<void>;
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

export const useEditor = create<EditorState & EditorActions>((set, get) => ({
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
  setProcessingMessage: (message) => set({ processingMessage: message }),

  addTextSet: () => set((state) => ({
    textSets: [...state.textSets, {
      id: Date.now(),
      text: 'new text',
      fontFamily: 'Inter',
      fontWeight: '700',
      fontSize: 350,
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
          original: originalUrl
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

      // Set background image
      const backgroundUrl = URL.createObjectURL(file);
      set(state => ({
        image: {
          ...state.image,
          background: backgroundUrl
        }
      }));

      // Process foreground
      const processedBlob = await removeBackground(backgroundUrl);
      const foregroundUrl = URL.createObjectURL(processedBlob);
      
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
          
          const newWidth = fgImg.width * scale;
          const newHeight = fgImg.height * scale;
          
          const x = (canvas.width - newWidth) / 2;
          const y = (canvas.height - newHeight) / 2;

          const offsetX = (canvas.width * clone.position.x) / 100;
          const offsetY = (canvas.height * clone.position.y) / 100;
          
          ctx.drawImage(fgImg, x + offsetX, y + offsetY, newWidth, newHeight);
        }
      }

      // Create blob and download
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          blob => blob ? resolve(blob) : reject(new Error('Failed to create blob')),
          'image/png',
          0.3
        );
      });

      // Download logic
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `${originalFileName || 'UnderlayX'}.png`;
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

  resetEditor: (clearImage = true) => set((state) => ({
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
    clonedForegrounds: [], // Clear clones on reset
    image: clearImage ? {
      original: null,
      background: null,
      foreground: null
    } : state.image
  })),
  setExportQuality: (quality) => set({ exportQuality: quality }),
  updateImageEnhancements: (enhancements) => set({ imageEnhancements: enhancements }),
  removeBackground: async () => {
    const { image } = get();
    if (!image.foreground) return;

    // Simply update the state to show only foreground
    set(state => ({
      image: {
        ...state.image,
        background: null
      },
      hasTransparentBackground: true,
      processingMessage: 'Background removed!'
    }));

    // Clear message after a brief moment
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
      foregroundPosition: { x: 0, y: 0 }
    }));
  },

  changeBackground: async () => {
    try {
      set({ isProcessing: true });
      const file = await uploadFile();
      if (!file) {
        return;
      }

      // Create URL for the file first
      const backgroundUrl = URL.createObjectURL(file);
      
      // Load image to ensure it's valid
      await loadImage(backgroundUrl);

      set(state => ({
        image: {
          ...state.image,
          background: backgroundUrl
        },
        hasChangedBackground: true,
        processingMessage: 'Background changed successfully!'
      }));

      setTimeout(() => set({ processingMessage: '' }), 2000);
    } catch (error) {
      console.error('Error changing background:', error);
      set({ 
        processingMessage: 'Failed to change background. Please try again.',
      });
    } finally {
      set({ isProcessing: false });
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
          position: { x: 0, y: 0 }
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
}));
