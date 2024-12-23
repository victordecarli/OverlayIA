'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { removeBackground } from '@imgly/background-removal';
import { Upload, Download, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { HexColorPicker } from 'react-colorful';
import Link from 'next/link';

export default function ImageEditor() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [foregroundImage, setForegroundImage] = useState<string | null>(null);
  const [backgroundText, setBackgroundText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [textPosition, setTextPosition] = useState({ x: 50, y: 50 });
  const [fontSize, setFontSize] = useState(32);
  const [textColor, setTextColor] = useState('#FFFFFF'); // Default to white
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [isUploading, setIsUploading] = useState(false);
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const fgCanvasRef = useRef<HTMLCanvasElement>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const imageCache = useRef<{ bg?: HTMLImageElement; fg?: HTMLImageElement }>({});

  // Add click outside handler for color picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setIsProcessing(true);
    try {
      const originalUrl = URL.createObjectURL(file);
      
      // Pre-load background image
      const bgImg = new Image();
      await new Promise((resolve) => {
        bgImg.onload = resolve;
        bgImg.src = originalUrl;
      });
      imageCache.current.bg = bgImg;
      
      setOriginalImage(originalUrl);
      setBackgroundImage(originalUrl);
      setIsUploading(false);

      const blob = await removeBackground(originalUrl);
      const processedUrl = URL.createObjectURL(blob);
      
      // Pre-load foreground image
      const fgImg = new Image();
      await new Promise((resolve) => {
        fgImg.onload = resolve;
        fgImg.src = processedUrl;
      });
      imageCache.current.fg = fgImg;
      
      setForegroundImage(processedUrl);
    } catch (error) {
      console.error('Error processing image:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTextPositionChange = (axis: 'x' | 'y', value: number) => {
    setTextPosition(prev => ({
      ...prev,
      [axis]: Math.max(0, Math.min(100, value))
    }));
  };

  const renderCanvases = useCallback(() => {
    if (!bgCanvasRef.current || !fgCanvasRef.current || !backgroundImage) return;
    
    const bgCanvas = bgCanvasRef.current;
    const fgCanvas = fgCanvasRef.current;
    const bgCtx = bgCanvas.getContext('2d');
    const fgCtx = fgCanvas.getContext('2d');
    
    if (!bgCtx || !fgCtx) return;

    // Use cached images if available
    const renderBackground = () => {
      if (!imageCache.current.bg) {
        const bgImg = new Image();
        bgImg.onload = () => {
          imageCache.current.bg = bgImg;
          renderLayers();
        };
        bgImg.src = backgroundImage;
      } else {
        renderLayers();
      }
    };

    const renderLayers = () => {
      const bgImg = imageCache.current.bg;
      if (!bgImg) return;

      // Set canvas dimensions only if they've changed
      if (bgCanvas.width !== bgImg.width || bgCanvas.height !== bgImg.height) {
        const width = bgImg.width;
        const height = bgImg.height;
        bgCanvas.width = width;
        bgCanvas.height = height;
        fgCanvas.width = width;
        fgCanvas.height = height;
        setCanvasSize({ width, height });
      }

      // Clear canvases
      bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
      fgCtx.clearRect(0, 0, fgCanvas.width, fgCanvas.height);
      
      // Draw background
      bgCtx.drawImage(bgImg, 0, 0);
      
      // Draw text
      if (backgroundText) {
        const scaledFontSize = (fontSize / 100) * (bgCanvas.height * 0.25);
        bgCtx.fillStyle = textColor;
        bgCtx.font = `${scaledFontSize}px Arial`;
        bgCtx.textAlign = 'center';
        bgCtx.textBaseline = 'middle';
        
        const textX = (textPosition.x / 100) * bgCanvas.width;
        const textY = (textPosition.y / 100) * bgCanvas.height;
        
        bgCtx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        bgCtx.lineWidth = Math.max(1, scaledFontSize / 20);
        bgCtx.strokeText(backgroundText, textX, textY);
        bgCtx.fillText(backgroundText, textX, textY);
      }

      // Draw foreground
      if (imageCache.current.fg) {
        fgCtx.drawImage(imageCache.current.fg, 0, 0);
      }
    };

    renderBackground();
  }, [backgroundImage, foregroundImage, backgroundText, textPosition, fontSize, textColor]);

  // Use RAF for smooth rendering
  useEffect(() => {
    let frameId: number;
    const animate = () => {
      renderCanvases();
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [renderCanvases]);

  const generateFinalImage = () => {
    if (!bgCanvasRef.current || !fgCanvasRef.current) return;
    
    const finalCanvas = document.createElement('canvas');
    const ctx = finalCanvas.getContext('2d');
    if (!ctx) return;

    finalCanvas.width = canvasSize.width;
    finalCanvas.height = canvasSize.height;

    // Composite the layers
    ctx.drawImage(bgCanvasRef.current, 0, 0);
    ctx.drawImage(fgCanvasRef.current, 0, 0);

    const link = document.createElement('a');
    link.download = 'text-behind-image.png';
    link.href = finalCanvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black p-4">
      <div className="max-w-7xl mx-auto">
        <Link href="/" className="inline-flex items-center text-white mb-8">
          <ArrowLeft className="mr-2" /> Back to Home
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6 bg-black/20 backdrop-blur-sm border-0">
            {!originalImage ? (
              <div className="aspect-video flex items-center justify-center border-2 border-dashed border-white/30 rounded-lg">
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Label
                  htmlFor="image-upload"
                  className="flex flex-col items-center cursor-pointer"
                >
                  <Upload className="w-12 h-12 text-white/70 mb-4" />
                  <span className="text-white/70">Upload Image</span>
                </Label>
              </div>
            ) : (
              <div className="relative aspect-video">
                {(isUploading || isProcessing) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg z-50">
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2" />
                      <span className="text-white text-sm">
                        {isUploading ? 'Uploading...' : 'Processing image...'}
                      </span>
                    </div>
                  </div>
                )}
                <div className="relative w-full h-full">
                  <canvas 
                    ref={bgCanvasRef}
                    className="absolute inset-0 w-full h-full object-contain rounded-lg"
                    style={{
                      aspectRatio: canvasSize.width ? canvasSize.width / canvasSize.height : undefined
                    }}
                  />
                  <canvas 
                    ref={fgCanvasRef}
                    className="absolute inset-0 w-full h-full object-contain rounded-lg"
                    style={{
                      aspectRatio: canvasSize.width ? canvasSize.width / canvasSize.height : undefined
                    }}
                  />
                </div>
              </div>
            )}
          </Card>

          <Card className="p-6 bg-black/20 backdrop-blur-sm border-0">
            <div className="space-y-6">
              {/* Text Input */}
              <div>
                <Label className="text-white">Background Text</Label>
                <Input
                  value={backgroundText}
                  onChange={(e) => setBackgroundText(e.target.value)}
                  className="bg-white/10 border-0 text-white"
                  placeholder="Enter text"
                />
              </div>

              {/* Font Size Slider */}
              <div>
                <Label className="text-white">Font Size</Label>
                <Slider
                  value={[fontSize]}
                  onValueChange={(value) => setFontSize(value[0])}
                  min={12}
                  max={100}
                  step={1}
                  className="my-4"
                />
              </div>

              {/* Position Controls */}
              <div>
                <Label className="text-white">Text Position</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white/70">X Position</Label>
                    <Slider
                      value={[textPosition.x]}
                      onValueChange={(value) => handleTextPositionChange('x', value[0])}
                      min={0}
                      max={100}
                      step={1}
                      className="my-2"
                    />
                  </div>
                  <div>
                    <Label className="text-white/70">Y Position</Label>
                    <Slider
                      value={[textPosition.y]}
                      onValueChange={(value) => handleTextPositionChange('y', value[0])}
                      min={0}
                      max={100}
                      step={1}
                      className="my-2"
                    />
                  </div>
                </div>
              </div>

              {/* Color Picker */}
              <div>
                <Label className="text-white">Text Color</Label>
                <div className="relative" ref={colorPickerRef}>
                  <Button
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="w-full mt-2"
                    style={{ backgroundColor: textColor }}
                  >
                    {textColor}
                  </Button>
                  {showColorPicker && (
                    <div className="absolute z-10 mt-2">
                      <HexColorPicker color={textColor} onChange={setTextColor} />
                    </div>
                  )}
                </div>
              </div>

              {/* Download Button */}
              {foregroundImage && (
                <Button
                  onClick={generateFinalImage}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Image
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
