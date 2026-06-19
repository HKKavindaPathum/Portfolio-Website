import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cv = await prisma.cvDetails.findFirst();
    
    if (cv && cv.cvFile) {
      const buffer = Buffer.from(cv.cvFile, 'base64');
      return new Response(buffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'inline; filename="cv.pdf"',
          'Cache-Control': 'no-store, max-age=0',
        },
      });
    }

    // Fallback to reading public/cv.pdf from disk
    const fallbackPath = path.join(process.cwd(), 'public/cv.pdf');
    if (fs.existsSync(fallbackPath)) {
      const fileBuffer = fs.readFileSync(fallbackPath);
      return new Response(fileBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'inline; filename="cv.pdf"',
          'Cache-Control': 'no-store, max-age=0',
        },
      });
    }

    return new Response('CV File not found', { status: 404 });
  } catch (error) {
    console.error('Download CV error:', error);
    return new Response('Error loading CV file', { status: 500 });
  }
}
