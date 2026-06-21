import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

// GET all skills (public)
export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      include: {
        category: true,
      },
      orderBy: [
        { category: { order: 'asc' } },
        { order: 'asc' },
        { id: 'asc' }
      ],
    });

    const mappedSkills = skills.map((s) => ({
      id: s.id,
      name: s.name,
      categoryId: s.categoryId,
      category: s.category?.name || 'Uncategorized',
      order: s.order,
    }));

    return NextResponse.json({ success: true, data: mappedSkills });
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
    const { name, categoryId } = body;

    if (!name || !categoryId) {
      return NextResponse.json(
        { success: false, error: 'Name and categoryId are required' },
        { status: 400 }
      );
    }

    // Get current max order for this category
    const maxSkill = await prisma.skill.findFirst({
      where: { categoryId: Number(categoryId) },
      orderBy: { order: 'desc' },
      select: { order: true },
    });
    const order = maxSkill ? maxSkill.order + 1 : 0;

    const skill = await prisma.skill.create({
      data: {
        name,
        categoryId: Number(categoryId),
        order,
      },
      include: {
        category: true,
      }
    });

    const mapped = {
      id: skill.id,
      name: skill.name,
      categoryId: skill.categoryId,
      category: skill.category?.name || 'Uncategorized',
      order: skill.order,
    };

    return NextResponse.json({ success: true, data: mapped });
  } catch (error) {
    console.error('Create skill error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create skill' },
      { status: 500 }
    );
  }
}

// PUT update skill / reorder skills (protected)
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
        return NextResponse.json({ success: false, error: 'Invalid skill IDs list' }, { status: 400 });
      }

      await prisma.$transaction(
        ids.map((id: number, idx: number) =>
          prisma.skill.update({
            where: { id: Number(id) },
            data: { order: idx },
          })
        )
      );

      return NextResponse.json({ success: true, message: 'Skills reordered successfully' });
    }

    const { id, name, categoryId } = body;

    if (!id || !name || !categoryId) {
      return NextResponse.json(
        { success: false, error: 'ID, name, and categoryId are required' },
        { status: 400 }
      );
    }

    const skill = await prisma.skill.update({
      where: { id: Number(id) },
      data: {
        name,
        categoryId: Number(categoryId),
      },
      include: {
        category: true,
      }
    });

    const mapped = {
      id: skill.id,
      name: skill.name,
      categoryId: skill.categoryId,
      category: skill.category?.name || 'Uncategorized',
      order: skill.order,
    };

    return NextResponse.json({ success: true, data: mapped });
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

