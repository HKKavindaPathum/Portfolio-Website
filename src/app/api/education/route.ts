import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

// GET all education entries (public)
export async function GET() {
  try {
    const education = await prisma.education.findMany({
      orderBy: { id: 'asc' },
    });
    return NextResponse.json({ success: true, data: education });
  } catch (error) {
    console.error('Fetch education error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch education details' },
      { status: 500 }
    );
  }
}

// POST create education entry (protected)
export async function POST(request: Request) {
  try {
    const auth = await verifyAuth();
    if (!auth) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { degree, institution, period, description } = body;

    if (!degree || !institution || !period || !description) {
      return NextResponse.json(
        { success: false, error: 'Degree, institution, period, and description are required' },
        { status: 400 }
      );
    }

    const entry = await prisma.education.create({
      data: {
        degree,
        institution,
        period,
        description,
      },
    });

    return NextResponse.json({ success: true, data: entry });
  } catch (error) {
    console.error('Create education error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create education entry' },
      { status: 500 }
    );
  }
}

// PUT update education entry (protected)
export async function PUT(request: Request) {
  try {
    const auth = await verifyAuth();
    if (!auth) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, degree, institution, period, description } = body;

    if (!id || !degree || !institution || !period || !description) {
      return NextResponse.json(
        { success: false, error: 'ID, degree, institution, period, and description are required' },
        { status: 400 }
      );
    }

    const entry = await prisma.education.update({
      where: { id: Number(id) },
      data: {
        degree,
        institution,
        period,
        description,
      },
    });

    return NextResponse.json({ success: true, data: entry });
  } catch (error) {
    console.error('Update education error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update education entry' },
      { status: 500 }
    );
  }
}

// DELETE education entry (protected)
export async function DELETE(request: Request) {
  try {
    const auth = await verifyAuth();
    if (!auth) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const idStr = searchParams.get('id');

    if (!idStr) {
      return NextResponse.json(
        { success: false, error: 'Education ID is required' },
        { status: 400 }
      );
    }

    const id = Number(idStr);
    await prisma.education.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Education entry deleted successfully' });
  } catch (error) {
    console.error('Delete education error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete education entry' },
      { status: 500 }
    );
  }
}
