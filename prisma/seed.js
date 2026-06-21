/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const adminUsername = 'admin';
  const adminPassword = 'admin123';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // Seed Admin
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

  const fs = require('fs');
  const path = require('path');

  let base64Cv = null;
  try {
    const cvFilePath = path.join(__dirname, '../public/cv.pdf');
    if (fs.existsSync(cvFilePath)) {
      base64Cv = fs.readFileSync(cvFilePath).toString('base64');
    }
  } catch (err) {
    console.warn('Could not read default cv.pdf for seeding:', err.message);
  }

  // Seed CV details
  const defaultCvData = {
    fullName: 'H.K.K.P.L. Dhananjaya',
    professionalTitle: 'Software Engineer',
    aboutSummary: 'Driven by a strong passion for software development, I am a dedicated Full-Stack Web Developer with proven experience in developing and successfully deploying reliable web applications. Eager to contribute to a dynamic software engineering team, collaborate on impactful projects, and continuously adapt to new technologies to deliver high-quality solutions.',
    cvUrl: 'https://www.linkedin.com/in/kavindapathum/',
    githubUrl: 'https://github.com/HKKavindaPathum',
    linkedinUrl: 'https://www.linkedin.com/in/kavindapathum/',
    email: 'hkkpldhananjaya@gmail.com',
    phone: '+94740707321',
    location: 'Sri Lanka',
    statsExperience: '1+',
    statsProjects: '20+',
    statsTechnologies: '20+',
    heroDescription: 'Crafting state-of-the-art web applications with clean architecture, elegant user interfaces, and robust backend logic. Let\'s build something extraordinary together.',
    cvFile: base64Cv,
  };

  const existingCv = await prisma.cvDetails.findFirst();
  if (!existingCv) {
    const cv = await prisma.cvDetails.create({
      data: defaultCvData,
    });
    console.log('CV Details seeded:', cv.fullName);
  } else {
    // If it exists, update it to match user's real details
    const cv = await prisma.cvDetails.update({
      where: { id: existingCv.id },
      data: defaultCvData,
    });
    console.log('CV Details updated:', cv.fullName);
  }

  // Seed user's actual projects
  // We clear existing projects first to ensure we seed his clean projects list
  await prisma.project.deleteMany();
  console.log('Cleared old projects.');

  await prisma.project.createMany({
    data: [
      {
        title: 'TechZone Computer Shop',
        description: 'A premium, full-stack e-commerce web application designed for a modern computer components and accessories retailer. It features a complete customer experience with glassmorphism UI layouts, real-time live product search, dynamic category filtering, and a stateful shopping cart persisted via LocalStorage. The platform includes a seamless checkout workflow supporting Cash on Delivery (COD) and Bank Transfer payments. It also features a robust Admin Dashboard equipped with high-level sales analytics (total revenue, order volume, product count), interactive order status tracking, and full product inventory CRUD operations integrated with Cloudinary for cloud-based asset management. Secured using bcryptjs password hashing and stateless JWT-based route protection.',
        techStack: 'Next.js (App Router), React, Tailwind CSS v4, Prisma ORM, PostgreSQL (Neon DB), Cloudinary, JWT, BcryptJS, Vercel',
        githubLink: 'https://github.com/HKKavindaPathum/TechZone-Computer-Shop-.git',
        githubBackendLink: null,
        liveLink: 'https://tech-zone-computer-shop.vercel.app/',
        imageUrl: '/project_images/techzone.png',
        order: 0,
      },
      {
        title: 'Crystal Beauty Clear',
        description: 'A premium MERN stack e-commerce web application for a cosmetics and beauty brand. Features a complete customer experience with dynamic catalog browsing, real-time search, Google OAuth & credentials authentication, a responsive shopping cart, and a product review system. It also includes a full-featured Admin Dashboard with interactive sales analytics charts (using Recharts), product inventory management (CRUD), order tracking (pending/completed/cancelled), and user/review moderation. Integrated with Supabase cloud storage for product assets, JWT for secure route protection, and Nodemailer for OTP-based password resets.',
        techStack: 'React, Vite, Tailwind CSS, Express.js, Node.js, Google OAuth, JWT, Vercel, Railway, Supabase, MongoDB',
        githubLink: 'https://github.com/HKKavindaPathum/Crystal_Beauty_Clear_Frontend.git',
        githubBackendLink: 'https://github.com/HKKavindaPathum/Crystal_Beauty_Clear_Backend.git',
        liveLink: 'https://crystal-beauty-clear-frontend-amber.vercel.app/',
        imageUrl: '/project_images/crystal_beauty.png',
        order: 1,
      },
      {
        title: 'Portfolio-Website',
        description: 'A premium personal portfolio website designed for a software engineer to showcase professional projects, skills, education, and career achievements. It features a modern, responsive user interface with clean architecture, interactive components, dynamic contact forms, and a secure administration panel for content management. Built using Next.js for server-side rendering and search engine optimization, powered by Prisma ORM and MySQL database, and protected with stateful authentication.',
        techStack: 'Next.js (App Router), React, Tailwind CSS v4, Prisma ORM, MySQL, JWT, BcryptJS, Vercel',
        githubLink: 'https://github.com/HKKavindaPathum/Portfolio-Website.git',
        githubBackendLink: null,
        liveLink: 'https://portfolio-website-nine-sage-15.vercel.app/',
        imageUrl: '/project_images/portfolio.png',
        order: 2,
      }
    ]
  });
  console.log('User projects seeded.');

  // Seed Education
  await prisma.education.deleteMany();
  console.log('Cleared old education.');
  await prisma.education.createMany({
    data: [
      {
        degree: 'Bachelor of Computer Science',
        institution: 'Eastern University of Sri Lanka',
        period: '08/2021 - 12/2024',
        description: 'Acquired core competencies in systems architecture, object-oriented programming, database models, algorithms, and computational maths.',
      },
      {
        degree: 'Full-Stack Web Development (MERN Stack)',
        institution: 'Skyrek Academy',
        period: '10 Weeks Training',
        description: 'Practical project-driven course focusing on client-server applications, responsive web layouts, database integrations, and API testing.',
      },
      {
        degree: 'G.C.E. Advanced Level',
        institution: 'Niwaththakachethiya National College, Anuradhapura',
        period: '2019',
        description: 'Combined Mathematics : C\nInformation & Communication Technology : C\nPhysics : S',
      },
      {
        degree: 'Full-Time English Course',
        institution: 'Kekirawa English Academy',
        period: '2015',
        description: 'Successfully completed a comprehensive full-time English language training program focusing on professional writing, grammar, and speaking skills.',
      },
      {
        degree: 'G.C.E. Ordinary Level',
        institution: 'A/Sri Siddhartha Central College, Eppawala',
        period: '2014',
        description: 'Mathematics : A\nHealth & Physical Education : A\nDrama & Theatre : B\nBuddhism : C\nSinhala : C\nEnglish : C\nScience : C\nHistory : C\nBusiness Studies : C',
      },
    ]
  });
  console.log('User education seeded.');

  // Seed Skills
  await prisma.skill.deleteMany();
  await prisma.skillCategory.deleteMany();
  console.log('Cleared old skills and categories.');

  const categoriesData = [
    { name: 'Programming Languages', order: 0 },
    { name: 'Web & UI (Frameworks & Libs)', order: 1 },
    { name: 'Cloud & Databases', order: 2 },
    { name: 'Tools & Technologies', order: 3 }
  ];

  const categoryMap = {};
  for (const cat of categoriesData) {
    const createdCat = await prisma.skillCategory.create({
      data: cat
    });
    categoryMap[createdCat.name] = createdCat.id;
  }
  console.log('Skill categories seeded.');

  const skillsData = [
    // Programming Languages
    { name: 'JavaScript', categoryId: categoryMap['Programming Languages'], order: 0 },
    { name: 'TypeScript', categoryId: categoryMap['Programming Languages'], order: 1 },
    { name: 'PHP', categoryId: categoryMap['Programming Languages'], order: 2 },
    { name: 'Python', categoryId: categoryMap['Programming Languages'], order: 3 },
    { name: 'Java', categoryId: categoryMap['Programming Languages'], order: 4 },
    { name: 'C++', categoryId: categoryMap['Programming Languages'], order: 5 },
    
    // Web & UI
    { name: 'Next.js', categoryId: categoryMap['Web & UI (Frameworks & Libs)'], order: 0 },
    { name: 'React.js', categoryId: categoryMap['Web & UI (Frameworks & Libs)'], order: 1 },
    { name: 'Node.js', categoryId: categoryMap['Web & UI (Frameworks & Libs)'], order: 2 },
    { name: 'Express.js', categoryId: categoryMap['Web & UI (Frameworks & Libs)'], order: 3 },
    { name: 'Laravel', categoryId: categoryMap['Web & UI (Frameworks & Libs)'], order: 4 },
    { name: 'Flask', categoryId: categoryMap['Web & UI (Frameworks & Libs)'], order: 5 },
    { name: 'Tailwind CSS', categoryId: categoryMap['Web & UI (Frameworks & Libs)'], order: 6 },
    { name: 'HTML/CSS', categoryId: categoryMap['Web & UI (Frameworks & Libs)'], order: 7 },

    // Cloud & Databases
    { name: 'AWS', categoryId: categoryMap['Cloud & Databases'], order: 0 },
    { name: 'Vercel', categoryId: categoryMap['Cloud & Databases'], order: 1 },
    { name: 'Railway', categoryId: categoryMap['Cloud & Databases'], order: 2 },
    { name: 'MySQL', categoryId: categoryMap['Cloud & Databases'], order: 3 },
    { name: 'MongoDB', categoryId: categoryMap['Cloud & Databases'], order: 4 },

    // Tools & Technologies
    { name: 'Git', categoryId: categoryMap['Tools & Technologies'], order: 0 },
    { name: 'Postman', categoryId: categoryMap['Tools & Technologies'], order: 1 },
    { name: 'TestNG', categoryId: categoryMap['Tools & Technologies'], order: 2 },
    { name: 'WordPress', categoryId: categoryMap['Tools & Technologies'], order: 3 },
    { name: 'XAMPP', categoryId: categoryMap['Tools & Technologies'], order: 4 },
    { name: 'TensorFlow', categoryId: categoryMap['Tools & Technologies'], order: 5 },
  ];

  await prisma.skill.createMany({
    data: skillsData
  });
  console.log('User skills seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
