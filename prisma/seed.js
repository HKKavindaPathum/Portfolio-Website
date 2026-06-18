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
  const existingCv = await prisma.cvDetails.findFirst();
  if (!existingCv) {
    const cv = await prisma.cvDetails.create({
      data: {
        fullName: 'H.K.K.P.L. Dhananjaya',
        professionalTitle: 'Software Engineer',
        aboutSummary: 'Driven by a strong passion for software development, I am a dedicated Full-Stack Web Developer with proven experience in developing and successfully deploying reliable web applications. Eager to contribute to a dynamic software engineering team, collaborate on impactful projects, and continuously adapt to new technologies to deliver high-quality solutions.',
        cvUrl: 'https://www.linkedin.com/in/kavindapathum/',
      },
    });
    console.log('CV Details seeded:', cv.fullName);
  } else {
    // If it exists, update it to match user's real details
    const cv = await prisma.cvDetails.update({
      where: { id: existingCv.id },
      data: {
        fullName: 'H.K.K.P.L. Dhananjaya',
        professionalTitle: 'Software Engineer',
        aboutSummary: 'Driven by a strong passion for software development, I am a dedicated Full-Stack Web Developer with proven experience in developing and successfully deploying reliable web applications. Eager to contribute to a dynamic software engineering team, collaborate on impactful projects, and continuously adapt to new technologies to deliver high-quality solutions.',
        cvUrl: 'https://www.linkedin.com/in/kavindapathum/',
      }
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
