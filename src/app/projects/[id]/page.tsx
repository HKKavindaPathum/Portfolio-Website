import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProjectDetailClient from './ProjectDetailClient';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const projectId = Number(id);

  if (isNaN(projectId)) {
    return {
      title: 'Project Not Found | Portfolio',
      description: 'The requested project could not be found.',
    };
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { title: true, description: true },
  });

  if (!project) {
    return {
      title: 'Project Not Found | Portfolio',
      description: 'The requested project could not be found.',
    };
  }

  // Clean description for meta tag (max 160 chars)
  const cleanDescription = project.description
    ? project.description.replace(/[\r\n\t]+/g, ' ').substring(0, 160)
    : 'Project details view';

  return {
    title: `${project.title} | Portfolio`,
    description: cleanDescription,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  const projectId = Number(id);

  if (isNaN(projectId)) {
    notFound();
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    notFound();
  }

  // Map imageFile to api route if present
  const mappedProject = {
    ...project,
    imageUrl: project.imageFile ? `/api/projects/image?id=${project.id}` : project.imageUrl,
  };

  return <ProjectDetailClient project={mappedProject} />;
}
