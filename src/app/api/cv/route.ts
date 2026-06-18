import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

// GET CV Details (public)
export async function GET() {
  try {
    const cv = await prisma.cvDetails.findFirst();
    if (!cv) {
      // Return a temporary structure if seed hasn't run yet
      return NextResponse.json({
        success: true,
        data: {
          id: 1,
          fullName: 'Jane Doe',
          professionalTitle: 'Full-Stack Developer & Architect',
          aboutSummary: 'Welcome to my portfolio website! Please run database migrations and seed default content to customize these details.',
          cvUrl: '#',
        },
      });
    }
    return NextResponse.json({ success: true, data: cv });
  } catch (error) {
    console.error('Fetch CV error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch CV details' },
      { status: 500 }
    );
  }
}

// PUT update CV Details (protected)
export async function PUT(request: Request) {
  try {
    const auth = await verifyAuth();
    if (!auth) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { fullName, professionalTitle, aboutSummary, cvUrl } = body;

    if (!fullName || !professionalTitle || !aboutSummary || !cvUrl) {
      return NextResponse.json(
        { success: false, error: 'All fields (fullName, professionalTitle, aboutSummary, cvUrl) are required' },
        { status: 400 }
      );
    }

    // Find first record; create if missing, otherwise update.
    let cv = await prisma.cvDetails.findFirst();
    if (!cv) {
      cv = await prisma.cvDetails.create({
        data: { fullName, professionalTitle, aboutSummary, cvUrl },
      });
    } else {
      cv = await prisma.cvDetails.update({
        where: { id: cv.id },
        data: { fullName, professionalTitle, aboutSummary, cvUrl },
      });
    }

    return NextResponse.json({ success: true, data: cv });
  } catch (error) {
    console.error('Update CV error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update CV details' },
      { status: 500 }
    );
  }
}
