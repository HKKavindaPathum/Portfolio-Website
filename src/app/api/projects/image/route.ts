import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idStr = searchParams.get('id');

    if (!idStr) {
      return NextResponse.json({ success: false, error: 'Project ID is required' }, { status: 400 });
    }

    const id = Number(idStr);
    const project = await prisma.project.findUnique({
      where: { id },
      select: { imageFile: true },
    });

    if (!project || !project.imageFile) {
      return NextResponse.json({ success: false, error: 'Image not found' }, { status: 404 });
    }

    // Extract content-type and base64 payload from data URL
    // Format: "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
    const match = project.imageFile.match(/^data:([^;]+);base64,(.+)$/);
    
    let contentType = 'image/jpeg';
    let base64Data = project.imageFile;

    if (match) {
      contentType = match[1];
      base64Data = match[2];
    }

    const buffer = Buffer.from(base64Data, 'base64');

    return new Response(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Fetch project image error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch project image' }, { status: 500 });
  }
}
