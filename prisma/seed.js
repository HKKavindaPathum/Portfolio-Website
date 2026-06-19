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
        title: 'MERN E-commerce Website',
        description: 'Developed a full-stack E-commerce platform to enable online product browsing, shopping, and secure transactions.',
        techStack: 'React.js, Node.js, Express.js, MongoDB, Tailwind CSS, Git',
        githubLink: 'https://github.com/HKKavindaPathum',
        liveLink: '',
        imageUrl: '',
      },
      {
        title: 'Invoice Management System',
        description: 'Developed a system to manage invoices, customer details, and payments, streamlining billing and record-keeping.',
        techStack: 'Laravel, PHP, Blade, Tailwind CSS, MySQL, Git',
        githubLink: 'https://github.com/HKKavindaPathum',
        liveLink: '',
        imageUrl: '',
      },
      {
        title: 'Snake Identification Web Application',
        description: 'Developed a web application to identify snake species from images, enhancing public awareness and safety regarding venomous snakes in Sri Lanka.',
        techStack: 'React.js, Flask, TensorFlow, HTML, CSS, JavaScript, Git',
        githubLink: 'https://github.com/HKKavindaPathum',
        liveLink: '',
        imageUrl: '',
      },
      {
        title: 'YouTube Frontend Clone',
        description: 'Developed a responsive YouTube-like frontend to emulate the core UI components of the platform, enhancing front-end development skills.',
        techStack: 'HTML, CSS, JavaScript, Git',
        githubLink: 'https://github.com/HKKavindaPathum',
        liveLink: '',
        imageUrl: '',
      },
      {
        title: 'Computer Shop Website',
        description: 'Developed a user-friendly website for showcasing computer products and facilitating customer interactions, simulating an online electronics store experience.',
        techStack: 'HTML, CSS, JavaScript, Git',
        githubLink: 'https://github.com/HKKavindaPathum',
        liveLink: '',
        imageUrl: '',
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
  console.log('Cleared old skills.');
  await prisma.skill.createMany({
    data: [
      // Programming Languages
      { name: 'JavaScript', category: 'Programming Languages' },
      { name: 'TypeScript', category: 'Programming Languages' },
      { name: 'PHP', category: 'Programming Languages' },
      { name: 'Python', category: 'Programming Languages' },
      { name: 'Java', category: 'Programming Languages' },
      { name: 'C++', category: 'Programming Languages' },
      
      // Web & UI
      { name: 'Next.js', category: 'Web & UI (Frameworks & Libs)' },
      { name: 'React.js', category: 'Web & UI (Frameworks & Libs)' },
      { name: 'Node.js', category: 'Web & UI (Frameworks & Libs)' },
      { name: 'Express.js', category: 'Web & UI (Frameworks & Libs)' },
      { name: 'Laravel', category: 'Web & UI (Frameworks & Libs)' },
      { name: 'Flask', category: 'Web & UI (Frameworks & Libs)' },
      { name: 'Tailwind CSS', category: 'Web & UI (Frameworks & Libs)' },
      { name: 'HTML/CSS', category: 'Web & UI (Frameworks & Libs)' },

      // Cloud & Databases
      { name: 'AWS', category: 'Cloud & Databases' },
      { name: 'Vercel', category: 'Cloud & Databases' },
      { name: 'Railway', category: 'Cloud & Databases' },
      { name: 'MySQL', category: 'Cloud & Databases' },
      { name: 'MongoDB', category: 'Cloud & Databases' },

      // Tools & Technologies
      { name: 'Git', category: 'Tools & Technologies' },
      { name: 'Postman', category: 'Tools & Technologies' },
      { name: 'TestNG', category: 'Tools & Technologies' },
      { name: 'WordPress', category: 'Tools & Technologies' },
      { name: 'XAMPP', category: 'Tools & Technologies' },
      { name: 'TensorFlow', category: 'Tools & Technologies' },
    ]
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
