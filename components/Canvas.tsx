'use client';

import { useEditor } from '@/hooks/useEditor';
import { Upload } from 'lucide-react';
import { CanvasPreview } from './CanvasPreview';
import { convertHeicToJpeg, optimizeImage } from '@/lib/image-utils';
import { ConfirmDialog } from './ConfirmDialog';
import { useState, useRef, useCallback, useEffect } from 'react'; // Add useRef, useCallback, useEffect
import { useAuth } from '@/hooks/useAuth';
import { AuthDialog } from './AuthDialog';
import { cn } from '@/lib/utils';
import { useEditorPanel } from '@/contexts/EditorPanelContext';
import { useIsMobile } from '@/hooks/useIsMobile'; // Add this import

interface CanvasProps {
  shouldAutoUpload?: boolean;
}

export function Canvas({ shouldAutoUpload }: CanvasProps) {
  const { 
    image, 
    isProcessing, 
    isConverting, 
    handleImageUpload, 
    processingMessage, 
    textSets,
    setProcessingMessage,
    setIsProcessing,
    setIsConverting
  } = useEditor();
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [showConvertDialog, setShowConvertDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null); // Add this ref
  const [hasTriedAutoUpload, setHasTriedAutoUpload] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { user } = useAuth();
  const { isPanelOpen } = useEditorPanel();
  const isMobile = useIsMobile(); // Add this hook

  // Add this function inside the Canvas component
  const preloadFonts = useCallback(async (fontFamily: string) => {
    try {
      await document.fonts.load(`400 16px "${fontFamily}"`);
      await document.fonts.load(`700 16px "${fontFamily}"`);
    } catch (error) {
      console.warn(`Failed to preload font: ${fontFamily}`, error);
    }
  }, []);

  const handleFileProcess = async (file: File) => {
    const fileName = file.name.toLowerCase();

    if (fileName.match(/\.(heic|heif)$/)) {
      setPendingFile(file);
      setShowConvertDialog(true);
    } else {
      try {
        setIsProcessing(true);
        setProcessingMessage('Processing...');
        const optimizedFile = await optimizeImage(file);
        await handleImageUpload(optimizedFile);
      } catch (error) {
        console.error('Error processing image:', error);
        alert('Error processing image. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleConvertConfirm = async () => {
    if (!pendingFile) return;

    try {
      setShowConvertDialog(false);
      setIsConverting(true);
      const convertedFile = await convertHeicToJpeg(pendingFile);
      const optimizedFile = await optimizeImage(convertedFile);
      await handleImageUpload(optimizedFile);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error processing image. Please try again.');
    } finally {
      setPendingFile(null);
      setIsConverting(false);
    }
  };

  const handleConvertCancel = () => {
    setShowConvertDialog(false);
    setPendingFile(null);
    // Reset the file input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }

    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      // Reset the input value right after getting the file
      e.target.value = '';
      
      const validTypes = ['image/jpeg', 'image/png', 'image.webp', 'image.webp', 'image.heic', 'image/heic', 'image.heif', 'image/heif'];
      const fileType = file.type.toLowerCase();
      const fileName = file.name.toLowerCase();

      if (validTypes.includes(fileType) || fileName.match(/\.(heic|heif)$/)) {
        await handleFileProcess(file);
      } else {
        alert('Please upload a valid image file (JPG, PNG, WEBP, HEIC, or HEIF)');
      }
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
    const file = e.dataTransfer.files[0];
    const validTypes = ['image/jpeg', 'image/png', 'image.webp', 'image.webp', 'image.heic', 'image.heic', 'image.heif', 'image/heif'];
    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();

    if (validTypes.includes(fileType) || fileName.match(/\.(heic|heif)$/)) {
      await handleFileProcess(file);
    } else {
      alert('Please upload a valid image file (JPG, PNG, WEBP, HEIC, or HEIF)');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const getLoadingMessage = () => {
    if (isConverting) {
      return 'Converting HEIC to JPEG format...';
    }
    if (isProcessing) {
      return processingMessage || 'processing...';
    }
    return 'Loading image...';
  };

  // Inside useEffect where you handle text changes
  useEffect(() => {
    const loadFonts = async () => {
      const fontPromises = textSets.map(textSet => 
        preloadFonts(textSet.fontFamily)
      );
      await Promise.all(fontPromises);
      // Remove render() call
    };
    
    loadFonts();
  }, [textSets, preloadFonts]);

  useEffect(() => {
    const handleAutoUpload = () => {
      if (shouldAutoUpload && !hasTriedAutoUpload && fileInputRef.current && !image.original) {
        setHasTriedAutoUpload(true);
        fileInputRef.current.click();
      }
    };

    // Small delay to ensure proper initialization
    const timeoutId = setTimeout(handleAutoUpload, 100);

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
  }, []);  // Empty dependency array - only run once on mount

  const handleUploadClick = (e: React.MouseEvent<HTMLElement>) => {
    if (!user) {
      e.preventDefault();
      setShowAuthDialog(true);
      return;
    }
  };

  return (
    <>
      <div className={cn(
        "absolute inset-0 flex items-center justify-center",
        "p-4 sm:p-6" // Add padding around canvas
      )}>
        {!image.original ? (
          <div 
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className={cn(
              "w-full transition-all duration-300",
              "relative flex items-center justify-center",
              isMobile ? "h-[60vh]" : // Mobile height
              isPanelOpen ? 
                'h-[calc(68vh-8rem)]' : 
                'h-[calc(100vh-10rem)]'
            )}
          >
            <input
              ref={fileInputRef}
              id="canvas-upload"
              type="file"
              onChange={onFileChange}
              accept="image/jpeg,image/png,image.webp,image.heic,image.heif,.heic,.heif,.jpg,.jpeg,.png,.webp"
              className="hidden"
            />
            {isMobile ? (
              <div className="flex flex-col items-center gap-4">
                <p className="text-gray-600 dark:text-gray-400 text-center">
                  Upload an image to get started
                </p>
                <label
                  htmlFor="canvas-upload"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 transition-colors"
                  onClick={handleUploadClick}
                >
                  <Upload className="w-5 h-5" />
                  <span>Upload</span>
                </label>
              </div>
            ) : (
              <label
                htmlFor="canvas-upload"
                className="absolute inset-0 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600/50 rounded-xl transition-all bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800/80 cursor-pointer"
                onClick={handleUploadClick}
              >
                <div className="text-center space-y-6">
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white/90">Upload an image to get started</h3>
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-gray-100 dark:bg-gray-800/50 backdrop-blur-sm flex items-center justify-center border border-gray-200 dark:border-gray-700 shadow-xl">
                    <Upload className="w-10 h-10 text-gray-400" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-600 font-medium dark:text-gray-400">Click here or drag & drop to upload</p>
                    <p className="text-gray-600 text-sm dark:text-gray-400">Supports: JPG, PNG, WEBP, HEIC, HEIF</p>
                  </div>
                </div>
              </label>
            )}
          </div>
        ) : (
          <div className={cn(
            "relative transition-all duration-300",
            "max-w-3xl w-full", // Set max width
            "flex items-center justify-center",
            "overflow-hidden", // Always rounded
            isMobile ? 
              "h-[calc(60vh-8rem)]" : // Reduced height on mobile
              isPanelOpen ? 
                'h-[calc(68vh-12rem)]' : // More space when panel is open
                'h-[calc(100vh-14rem)]' // More space when panel is closed
          )}>
            {(isProcessing || isConverting) && (
              <div className="absolute inset-0 flex items-center justify-center z-50">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                  <p className="text-white text-sm">{getLoadingMessage()}</p>
                </div>
              </div>
            )}
            
            {image.original && (
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute inset-0">
                  <CanvasPreview />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <ConfirmDialog
        isOpen={showConvertDialog}
        onClose={handleConvertCancel}
        onConfirm={handleConvertConfirm}
        title="Convert Image Format"
        description="This image is in HEIC/HEIF format. To ensure compatibility, it needs to be converted to JPEG. Would you like to proceed with the conversion?"
      />

      <AuthDialog
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
      />
    </>
  );
}
