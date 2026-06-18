const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const adminUsername = 'admin';
  const adminPassword = 'admin123';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.admin.upsert({
    where: { username: adminUsername },
    update: {
      password: hashedPassword,
    },
    create: {
      username: adminUsername,
      password: hashedPassword,
    },
  });
  console.log('Admin user seeded:', admin.username);

  // Seed CV details
  const existingCv = await prisma.cvDetails.findFirst();
  if (!existingCv) {
    const cv = await prisma.cvDetails.create({
      data: {
        fullName: 'Jane Doe',
        professionalTitle: 'Full-Stack Next.js Developer & Architect',
        aboutSummary: 'I am a professional software engineer with a deep passion for building high-performance, responsive web applications. Specialized in Next.js, React, TypeScript, and database architecture. I strive to write clean, maintainable code and deliver high-quality user experiences.',
        cvUrl: 'https://example.com/resume.pdf',
      },
    });
    console.log('CV Details seeded:', cv.fullName);
  } else {
    console.log('CV Details already exist.');
  }

  // Seed initial projects
  const projectCount = await prisma.project.count();
  if (projectCount === 0) {
    await prisma.project.createMany({
      data: [
        {
          title: 'Premium E-Commerce Application',
          description: 'A high-performance modern e-commerce application featuring full cart capabilities, stripe processing, user authentication, and admin product management.',
          techStack: 'Next.js, Tailwind CSS, Prisma, MySQL',
          githubLink: 'https://github.com/hkkavinda/ecommerce-app',
          liveLink: 'https://ecommerce-demo.dev',
          imageUrl: '',
        },
        {
          title: 'Real-time Task Dashboard',
          description: 'An interactive drag-and-drop project management workspace featuring dynamic boards, live web-sockets sync, and role-based permissions.',
          techStack: 'Next.js, TypeScript, Tailwind CSS, Socket.io, MySQL',
          githubLink: 'https://github.com/hkkavinda/task-dashboard',
          liveLink: 'https://task-dashboard.dev',
          imageUrl: '',
        }
      ]
    });
    console.log('Placeholder projects seeded.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
