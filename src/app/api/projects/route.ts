import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

// GET all projects (public)
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { id: 'desc' },
    });
    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    console.error('Fetch projects error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST create project (protected)
export async function POST(request: Request) {
  try {
    const auth = await verifyAuth();
    if (!auth) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, techStack, githubLink, liveLink, imageUrl } = body;

    if (!title || !description || !techStack) {
      return NextResponse.json(
        { success: false, error: 'Title, description, and techStack are required' },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        techStack,
        githubLink: githubLink || null,
        liveLink: liveLink || null,
        imageUrl: imageUrl || null,
      },
    });

    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    );
  }
}

// PUT update project (protected)
export async function PUT(request: Request) {
  try {
    const auth = await verifyAuth();
    if (!auth) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, description, techStack, githubLink, liveLink, imageUrl } = body;

    if (!id || !title || !description || !techStack) {
      return NextResponse.json(
        { success: false, error: 'ID, title, description, and techStack are required' },
        { status: 400 }
      );
    }

    const project = await prisma.project.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        techStack,
        githubLink: githubLink || null,
        liveLink: liveLink || null,
        imageUrl: imageUrl || null,
      },
    });

    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    console.error('Update project error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

// DELETE project (protected)
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
        { success: false, error: 'Project ID is required' },
        { status: 400 }
      );
    }

    const id = Number(idStr);
    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
