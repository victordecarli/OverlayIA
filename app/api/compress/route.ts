import { NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(request: Request) {
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
    
    // Get image metadata
    const metadata = await sharp(buffer).metadata();
    const width = metadata.width || 0;

    // Calculate new width while maintaining aspect ratio
    const targetWidth = Math.min(width, 800); // Reduced from 1200px to 800px
    
    const compressedBuffer = await sharp(buffer)
      .resize({
        width: targetWidth,
        withoutEnlargement: true, // Don't enlarge if image is smaller
        fit: 'inside',
        kernel: 'lanczos2', // Faster than default
      })
      .jpeg({
        quality: 40,          // Reduced from 60 to 40
        progressive: true,    // Progressive loading
        optimizeCoding: true, // Optimize Huffman coding tables
        mozjpeg: true,       // Use mozjpeg optimization
        chromaSubsampling: '4:2:0', // Reduce color data
        trellisQuantisation: true, // Add trellis quantization
        overshootDeringing: true,  // Add deringing
        optimizeScans: true,       // Add scan optimization
        quantisationTable: 2       // More aggressive quantization
      })
      .toBuffer();

    // Create response headers
    const headers = new Headers();
    headers.set('Content-Type', 'image/jpeg');
    headers.set('Content-Length', compressedBuffer.length.toString());
    headers.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    
    return new NextResponse(compressedBuffer, {
      status: 200,
      headers
    });

  } catch (error) {
    console.error('Error compressing image:', error);
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
};
