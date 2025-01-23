export async function convertHeicToJpeg(file: File): Promise<File> {
  if (file.type === 'image/heic' || file.type === 'image/heif') {
    try {
      // Dynamically import `heic2any` for client-side usage
      const heic2any = (await import('heic2any')).default;

      const blob = await heic2any({
        blob: file,
        toType: 'image/jpg',
        quality: 0.5,
      });

      return new File([blob as Blob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), {
        type: 'image/jpg',
      });
    } catch (error) {
      console.error('Error converting HEIC to JPG:', error);
      throw new Error('Failed to convert HEIC image');
    }
  }
  return file;
}

export function getImageFormat(file: File): string {
  if (file.type === 'image/heic' || file.type === 'image/heif') {
    return 'jpg';
  }
  return file.type.split('/')[1];
}

export const optimizeImage = async (file: File): Promise<File> => {
  try {
    // Check if the image needs compression
    if (file.size <= 500 * 1024) { // Skip if less than 500KB
      return file;
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/compress', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to compress image');
    }

    const blob = await response.blob();
    
    // Verify compression was successful
    if (blob.size >= file.size) {
      // If compressed size is larger, return original
      return file;
    }

    const compressedFile = new File([blob], file.name, { 
      type: 'image/jpeg',
      lastModified: Date.now()
    });

    console.log('Compression results:', {
      originalSize: Math.round(file.size / 1024) + 'KB',
      compressedSize: Math.round(compressedFile.size / 1024) + 'KB',
      reduction: Math.round((1 - compressedFile.size / file.size) * 100) + '%'
    });

    return compressedFile;
  } catch (error) {
    console.error('Error optimizing image:', error);
    // Return original file as fallback
    return file;
  }
};
