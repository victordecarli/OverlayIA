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


// Add new interfaces for shapes
interface ShapeSet {
  id: number;
  type: string;
  color: string;
  isFilled: boolean;
  position: { vertical: number; horizontal: number };
  scale: number;
  opacity: number;
  rotation: number;
  strokeWidth: number;  // Add this new property
  glow?: GlowEffect;
}

interface EditorState {
  image: {
    original: string | null;
    background: string | null;
    foreground: string | null;
  };
  textSets: TextSet[];
  isProcessing: boolean;
  isConverting: boolean; // Add this new state
  shapeSets: ShapeSet[];
  exportQuality: 'high' | 'medium' | 'low';
  isDownloading: boolean; // Add this new state
}

interface EditorActions {
  addTextSet: () => void;
  updateTextSet: (id: number, updates: Partial<TextSet>) => void;
  removeTextSet: (id: number) => void;
  duplicateTextSet: (id: number) => void;
  handleImageUpload: (file: File) => Promise<void>;
  downloadImage: () => Promise<void>;
  resetEditor: (clearImage?: boolean) => void;
  addShapeSet: (type: string) => void;
  updateShapeSet: (id: number, updates: Partial<ShapeSet>) => void;
  removeShapeSet: (id: number) => void;
  duplicateShapeSet: (id: number) => void;
  setExportQuality: (quality: 'high' | 'medium' | 'low') => void;
}

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

  addTextSet: () => set((state) => ({
    textSets: [...state.textSets, {
      id: Date.now(),
      text: 'edit text',
      fontFamily: 'Inter', // Changed from var(--font-inter)
      fontWeight: '800', // Changed from '400' to '700'
      fontSize: 600,
      color: '#FFFFFF',
      position: { vertical: 50, horizontal: 50 },
      opacity: 1,
      rotation: 0
    }]
  })),

  updateTextSet: (id, updates) => set((state) => ({
    textSets: state.textSets.map(set => 
      set.id === id ? { ...set, ...updates } : set
    )
  })),

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
      strokeWidth: 5,  // Add default stroke width
      position: { vertical: 50, horizontal: 50 },
      scale: 2000, // Default scale
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

  handleImageUpload: async (file: File) => {
    if (!file) return;
    
    try {
      // Check if conversion is needed
      if (file.type === 'image/heic' || file.type === 'image/heif') {
        set({ isConverting: true });
        file = await convertHeicToJpeg(file);
      }

      set({ isProcessing: true });
      const originalUrl = URL.createObjectURL(file);
      
      set(state => ({
        image: {
          ...state.image,
          original: originalUrl,
          background: originalUrl
        }
      }));

      const blob = await removeBackground(originalUrl);
      const processedUrl = URL.createObjectURL(blob);
      
      set(state => ({
        image: {
          ...state.image,
          foreground: processedUrl
        }
      }));

    } catch (error) {
      console.error('Error processing image:', error);
      
    } finally {
      set({ isConverting: false, isProcessing: false });
    }
  },

  // Update downloadImage function to include shapes
  downloadImage: async () => {
    const { image, textSets, shapeSets, exportQuality } = get();
    if (!image.background || !image.foreground) return;

    set({ isDownloading: true });
    try {
      // Load all fonts used in text sets
      const fontPromises = textSets.map(textSet => 
        document.fonts.load(`${textSet.fontWeight} 1rem ${textSet.fontFamily}`)
      );
      await Promise.all(fontPromises);

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Load and draw background image
      const bgImg = new Image();
      bgImg.crossOrigin = "anonymous";
      await new Promise((resolve, reject) => {
        bgImg.onload = resolve;
        bgImg.onerror = reject;
        bgImg.src = image.background!;
      });

      // Set canvas size to match display size
      canvas.width = bgImg.width;
      canvas.height = bgImg.height;

      // Draw background
      ctx.drawImage(bgImg, 0, 0);

      // Draw shapes with updated logic
      shapeSets.forEach(shapeSet => {
        ctx.save();
        
        const x = (canvas.width * shapeSet.position.horizontal) / 100;
        const y = (canvas.height * shapeSet.position.vertical) / 100;
        
        // Move to position and apply transformations
        ctx.translate(x, y);
        ctx.rotate((shapeSet.rotation * Math.PI) / 180);
        
        // Add glow effect if enabled
        if (shapeSet.glow?.enabled) {
          ctx.shadowColor = shapeSet.glow.color;
          ctx.shadowBlur = shapeSet.glow.intensity;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
        }

        // Scale based on width and height
        // const scaleX = shapeSet.width / 100;
        // const scaleY = shapeSet.height / 100;
        // ctx.scale(scaleX, scaleY);

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

      // Draw text layers with updated glow effect
      textSets.forEach(textSet => {
        ctx.save();
        
        ctx.font = `${textSet.fontWeight} ${textSet.fontSize}px ${textSet.fontFamily}`;
        ctx.fillStyle = textSet.color;
        ctx.globalAlpha = textSet.opacity;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const x = (canvas.width * textSet.position.horizontal) / 100;
        const y = (canvas.height * textSet.position.vertical) / 100;

        ctx.translate(x, y);
        ctx.rotate((textSet.rotation * Math.PI) / 180);

        // Add glow effect if enabled
        if (textSet.glow?.enabled) {
          ctx.shadowColor = textSet.glow.color;
          ctx.shadowBlur = textSet.glow.intensity;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
        }

        ctx.fillText(textSet.text, 0, 0);
        
        ctx.restore();
      });

      // Draw foreground image
      const fgImg = new Image();
      fgImg.crossOrigin = "anonymous";
      await new Promise((resolve, reject) => {
        fgImg.onload = resolve;
        fgImg.onerror = reject;
        fgImg.src = image.foreground!;
      });
      
      ctx.drawImage(fgImg, 0, 0, canvas.width, canvas.height);

      // Convert to blob and download
      const qualityValue = exportQuality === 'high' ? 1.0 : 
                          exportQuality === 'medium' ? 0.8 : 0.6;

      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Failed to generate image');
          return;
        }
        
        const now = new Date();
        const timestamp = [
          now.getDate().toString().padStart(2, '0'),
          (now.getMonth() + 1).toString().padStart(2, '0'),
          now.getSeconds().toString().padStart(2, '0')
        ].join('_');
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `UnderlayXAI_${timestamp}.png`;
        link.href = url;
        link.click();
        
        // Clean up
        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 100);
      }, 'image/png', qualityValue);
    } catch (error) {
      console.error('Error downloading image:', error);
    } finally {
      set({ isDownloading: false });
    }
  },

  resetEditor: (clearImage = true) => set((state) => ({
    textSets: [],
    shapeSets: [],
    image: clearImage ? {
      original: null,
      background: null,
      foreground: null
    } : state.image
  })),
  setExportQuality: (quality) => set({ exportQuality: quality })
}));
