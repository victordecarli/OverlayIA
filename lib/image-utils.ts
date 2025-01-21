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
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);

      // Set maximum width or height to resize the image
      const maxDimension = 800; // Adjust this value to suit your needs
      const width = img.width;
      const height = img.height;

      // Calculate the aspect ratio and resize the image proportionally
      let newWidth = width;
      let newHeight = height;
      
      if (width > height) {
        if (width > maxDimension) {
          newWidth = maxDimension;
          newHeight = (maxDimension / width) * height;
        }
      } else {
        if (height > maxDimension) {
          newHeight = maxDimension;
          newWidth = (maxDimension / height) * width;
        }
      }

      // Create a canvas and resize the image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      canvas.width = newWidth;
      canvas.height = newHeight;
      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      // Compress and convert to Blob with low quality
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(new File([blob], file.name, { type: 'image/jpeg' }));
          } else {
            reject(new Error('Failed to optimize image'));
          }
        },
        'image/jpeg',
        0.4 // Ensure this is set to low quality for compression
      );
    };

    img.onerror = reject;
    img.src = url;
  });
};
