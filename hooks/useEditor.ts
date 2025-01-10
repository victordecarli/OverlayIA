'use client';

import { create } from 'zustand';
import { removeBackground } from '@imgly/background-removal';
import { convertHeicToJpeg } from '@/lib/image-utils';
import { SHAPES } from '@/constants/shapes';

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

    const { image, textSets, shapeSets, imageEnhancements, hasTransparentBackground, originalFileName } = get();
    if (!image.original || (!hasTransparentBackground && !image.background) || (hasTransparentBackground && !image.foreground)) return;

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Failed to get canvas context');

      // Load the correct source image based on transparency state
      const sourceImage = await loadImage(hasTransparentBackground ? image.foreground! : image.background!);
      canvas.width = sourceImage.width;
      canvas.height = sourceImage.height;

      // If transparent background, draw checkerboard pattern (optional for debugging)
      if (hasTransparentBackground) {
        // Clear the canvas to ensure transparency
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Draw the foreground image
        ctx.drawImage(sourceImage, 0, 0);
      } else {
        // Draw background with filters
        ctx.filter = filterString(imageEnhancements);
        ctx.drawImage(sourceImage, 0, 0);
      }

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

      // If not transparent, draw the foreground image last
      if (!hasTransparentBackground && image.foreground) {
        const fgImg = await loadImage(image.foreground);
        ctx.filter = 'none';
        ctx.globalAlpha = 1;
        ctx.drawImage(fgImg, 0, 0, canvas.width, canvas.height);
      }

      // Create blob and download
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          blob => blob ? resolve(blob) : reject(new Error('Failed to create blob')),
          'image/png',
          1.0
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
      hasTransparentBackground: false
    }));
  }
}));
