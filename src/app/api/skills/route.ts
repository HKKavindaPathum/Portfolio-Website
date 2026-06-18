import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

// GET all skills (public)
export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: { id: 'asc' },
    });
    return NextResponse.json({ success: true, data: skills });
  } catch (error) {
    console.error('Fetch skills error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch skills' },
      { status: 500 }
    );
  }
}

// POST create skill (protected)
export async function POST(request: Request) {
  try {
    const auth = await verifyAuth();
    if (!auth) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, category } = body;

    if (!name || !category) {
      return NextResponse.json(
        { success: false, error: 'Name and category are required' },
        { status: 400 }
      );
    }

    const skill = await prisma.skill.create({
      data: {
        name,
        category,
      },
    });

    return NextResponse.json({ success: true, data: skill });
  } catch (error) {
    console.error('Create skill error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create skill' },
      { status: 500 }
    );
  }
}

// PUT update skill (protected)
export async function PUT(request: Request) {
  try {
    const auth = await verifyAuth();
    if (!auth) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, category } = body;

    if (!id || !name || !category) {
      return NextResponse.json(
        { success: false, error: 'ID, name, and category are required' },
        { status: 400 }
      );
    }

    const skill = await prisma.skill.update({
      where: { id: Number(id) },
      data: {
        name,
        category,
      },
    });

    return NextResponse.json({ success: true, data: skill });
  } catch (error) {
    console.error('Update skill error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update skill' },
      { status: 500 }
    );
  }
}

// DELETE skill (protected)
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
        { success: false, error: 'Skill ID is required' },
        { status: 400 }
      );
    }

    const id = Number(idStr);
    await prisma.skill.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Delete skill error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete skill' },
      { status: 500 }
    );
  }
}
