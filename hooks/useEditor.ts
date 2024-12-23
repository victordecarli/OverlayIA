import { create } from 'zustand';
import { removeBackground } from '@imgly/background-removal';
import { convertHeicToJpeg } from '@/lib/image-utils';

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
}

interface EditorActions {
  addTextSet: () => void;
  updateTextSet: (id: number, updates: Partial<TextSet>) => void;
  removeTextSet: (id: number) => void;
  duplicateTextSet: (id: number) => void;
  handleImageUpload: (file: File) => Promise<void>;
  downloadImage: () => Promise<void>;
  resetEditor: () => void;
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

  addTextSet: () => set((state) => ({
    textSets: [...state.textSets, {
      id: Date.now(),
      text: 'Edit text',
      fontFamily: 'Inter', // Changed from var(--font-inter)
      fontWeight: '500', // Changed from '400' to '700'
      fontSize: 150,
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

  downloadImage: async () => {
    const { image, textSets } = get();
    if (!image.background || !image.foreground) return;

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
    const displayWidth = bgImg.width;
    const displayHeight = bgImg.height;
    canvas.width = displayWidth;
    canvas.height = displayHeight;

    // Draw background
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

    // Draw text layers with font family and weight
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

      ctx.fillText(textSet.text, 0, 0);
      
      ctx.restore();
    });

    // Load and draw foreground image
    const fgImg = new Image();
    fgImg.crossOrigin = "anonymous";
    await new Promise((resolve, reject) => {
      fgImg.onload = resolve;
      fgImg.onerror = reject;
      fgImg.src = image.foreground!;
    });
    
    ctx.drawImage(fgImg, 0, 0, canvas.width, canvas.height);

    // Convert to blob and download
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
      link.download = `UnderlayX_${timestamp}.png`;
      link.href = url;
      link.click();
      
      // Clean up
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);
    }, 'image/png', 1.0);
  },

  resetEditor: () => set(() => ({
    textSets: [],
    image: {
      original: null,
      background: null,
      foreground: null
    }
  }))
}));
