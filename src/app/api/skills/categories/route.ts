import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

// GET all categories (public)
export async function GET() {
  try {
    const categories = await prisma.skillCategory.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error('Fetch categories error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST create category (protected)
export async function POST(request: Request) {
  try {
    const auth = await verifyAuth();
    if (!auth) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Category name is required' },
        { status: 400 }
      );
    }

    // Get current max order
    const maxCat = await prisma.skillCategory.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true },
    });
    const order = maxCat ? maxCat.order + 1 : 0;

    const category = await prisma.skillCategory.create({
      data: {
        name: name.trim(),
        order,
      },
    });

    return NextResponse.json({ success: true, data: category });
  } catch (error: any) {
    console.error('Create category error:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'A category with this name already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    );
  }
}

// PUT update / reorder categories (protected)
export async function PUT(request: Request) {
  try {
    const auth = await verifyAuth();
    if (!auth) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Reorder action
    if (body.action === 'reorder') {
      const { ids } = body;
      if (!Array.isArray(ids)) {
        return NextResponse.json({ success: false, error: 'Invalid category IDs list' }, { status: 400 });
      }

      await prisma.$transaction(
        ids.map((id: number, idx: number) =>
          prisma.skillCategory.update({
            where: { id: Number(id) },
            data: { order: idx },
          })
        )
      );

      return NextResponse.json({ success: true, message: 'Categories reordered successfully' });
    }

    // Standard edit
    const { id, name } = body;
    if (!id || !name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Category ID and name are required' },
        { status: 400 }
      );
    }

    const category = await prisma.skillCategory.update({
      where: { id: Number(id) },
      data: {
        name: name.trim(),
      },
    });

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error('Update category error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

// DELETE category (protected)
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
        { success: false, error: 'Category ID is required' },
        { status: 400 }
      );
    }

    const id = Number(idStr);

    // RESTRICTION: Check if any skills are referencing this category
    const skillsCount = await prisma.skill.count({
      where: { categoryId: id },
    });

    if (skillsCount > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete category while it has skills. Remove all skills first.' },
        { status: 400 }
      );
    }

    await prisma.skillCategory.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}
