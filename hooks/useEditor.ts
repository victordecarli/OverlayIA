import { create } from 'zustand';
import { removeBackground } from '@imgly/background-removal';

interface TextSet {
  id: number;
  text: string;
  fontFamily: string;
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

  addTextSet: () => set((state) => ({
    textSets: [...state.textSets, {
      id: Date.now(),
      text: 'Edit text',
      fontFamily: 'Inter',
      fontSize: 32,
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
    set({ isProcessing: true });
    
    try {
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
      set({ isProcessing: false });
    }
  },

  downloadImage: async () => {
    const { image, textSets } = get();
    if (!image.background || !image.foreground) return;

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

    // Set canvas size to match image
    canvas.width = bgImg.width;
    canvas.height = bgImg.height;

    // Draw background
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

    // Draw text layers
    textSets.forEach(textSet => {
      ctx.save();
      
      // Set text properties
      ctx.font = `${textSet.fontSize * 2}px ${textSet.fontFamily}`; // Increased font size for better quality
      ctx.fillStyle = textSet.color;
      ctx.globalAlpha = textSet.opacity;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Calculate position
      const x = (canvas.width * textSet.position.horizontal) / 100;
      const y = (canvas.height * textSet.position.vertical) / 100;

      // Apply transformations
      ctx.translate(x, y);
      ctx.rotate((textSet.rotation * Math.PI) / 180);

      // Draw text
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

    // Create download link
    try {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'text-behind-image.png';
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error creating download:', error);
    }
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
