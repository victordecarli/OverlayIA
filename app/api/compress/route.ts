import { NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(request: Request) {
  let sharpInstance: sharp.Sharp | null = null;
  
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Create Sharp instance
    sharpInstance = sharp(buffer);
    
    // Get image metadata with the same instance
    const metadata = await sharpInstance.metadata();
    const width = metadata.width || 0;
    const targetWidth = Math.min(width, 800);

    // Chain operations to avoid creating multiple instances
    const compressedBuffer = await sharpInstance
      .rotate() // Auto-rotate based on EXIF
      .resize({
        width: targetWidth,
        withoutEnlargement: true,
        fit: 'inside',
        kernel: 'lanczos2',
      })
      .jpeg({
        quality: 40,
        progressive: true,
        optimizeCoding: true,
        mozjpeg: true,
        chromaSubsampling: '4:2:0',
        trellisQuantisation: true,
        overshootDeringing: true,
        optimizeScans: true,
        quantisationTable: 2
      })
      .toBuffer();

    // Clean up Sharp instance
    if (sharpInstance) {
      // @ts-ignore - Sharp doesn't expose destroy in types but it exists
      if (typeof sharpInstance.destroy === 'function') {
        sharpInstance.destroy();
      }
      sharpInstance = null;
    }

    // Clear any large buffers
    buffer.fill(0);
    
    const headers = new Headers({
      'Content-Type': 'image/jpeg',
      'Content-Length': compressedBuffer.length.toString(),
      'Cache-Control': 'public, max-age=31536000',
      // Add security headers
      'Content-Security-Policy': "default-src 'self'",
      'X-Content-Type-Options': 'nosniff'
    });
    
    return new NextResponse(compressedBuffer, {
      status: 200,
      headers
    });

  } catch (error) {
    console.error('Error compressing image:', error);
    
    // Ensure cleanup even on error
    if (sharpInstance) {
      // @ts-ignore
      if (typeof sharpInstance.destroy === 'function') {
        sharpInstance.destroy();
      }
    }

    return NextResponse.json(
      { error: 'Failed to compress image' },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
    responseLimit: '8mb',
  },
  // Add maximum duration for Vercel
  maxDuration: 10, // seconds
};
