'use client';

import { useEffect, useRef } from 'react';
import { useEditor } from '@/hooks/useEditor';

export function CanvasPreview() {
  const { image, textSets } = useEditor();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgImageRef = useRef<HTMLImageElement | null>(null);
  const fgImageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!image.background) return;

    // Load background image
    const bgImg = new Image();
    bgImg.src = image.background;
    bgImg.onload = () => {
      bgImageRef.current = bgImg;
      render();
    };

    // Load foreground image if exists
    if (image.foreground) {
      const fgImg = new Image();
      fgImg.src = image.foreground;
      fgImg.onload = () => {
        fgImageRef.current = fgImg;
        render();
      };
    }
  }, [image.background, image.foreground]);

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

  const render = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !bgImageRef.current) return;

    // Set canvas size to match background image
    canvas.width = bgImageRef.current.width;
    canvas.height = bgImageRef.current.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.drawImage(bgImageRef.current, 0, 0);

    // Draw text layers with font family and weight
    textSets.forEach(textSet => {
      ctx.save();
      
      // Create proper font string for rendering
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

    // Draw foreground
    if (fgImageRef.current) {
      ctx.drawImage(fgImageRef.current, 0, 0);
    }
  };

  // Re-render on text changes
  useEffect(() => {
    render();
  }, [textSets]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full object-contain"
    />
  );
}
