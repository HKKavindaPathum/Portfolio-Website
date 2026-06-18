import { prisma } from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import EducationTimeline from '@/components/EducationTimeline';
import ProjectsGrid from '@/components/ProjectsGrid';
import ContactForm from '@/components/ContactForm';
import { Mail, Phone, MapPin } from 'lucide-react';

const GithubIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const TwitterIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

export const dynamic = 'force-dynamic';

export default async function Home() {
  const cv = await prisma.cvDetails.findFirst();

  const fullName = cv?.fullName || 'Jane Doe';
  const professionalTitle = cv?.professionalTitle || 'Full-Stack Developer & Architect';
  const aboutSummary = cv?.aboutSummary || 'Welcome to my portfolio! Log in to the admin panel to update this profile detail.';
  const cvUrl = cv?.cvUrl || '#';

  return (
    <div className="bg-white dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100 min-h-screen font-sans antialiased selection:bg-violet-500 selection:text-white transition-colors duration-300">
      <Navbar />
      
      {/* Sections */}
      <Hero fullName={fullName} professionalTitle={professionalTitle} cvUrl={cvUrl} />
      <About aboutSummary={aboutSummary} />
      <EducationTimeline />
      <ProjectsGrid />

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900 relative transition-colors duration-300">
        <div className="absolute inset-0 z-0 opacity-10 dark:opacity-15 pointer-events-none">
          <div className="absolute bottom-[10%] left-[10%] w-[30rem] h-[30rem] rounded-full bg-violet-500/5 dark:bg-violet-600/10 blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-violet-500 mb-2">Get In Touch</h2>
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">Let's Connect</h3>
            <div className="w-12 h-1 bg-violet-600 mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-5xl mx-auto">
            {/* Contact Details */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <h4 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Contact Information</h4>
                <p className="text-sm text-zinc-605 dark:text-zinc-400 leading-relaxed">
                  Feel free to reach out for project collaboration, freelance opportunities, or just to say hello. I'll get back to you as soon as possible.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-violet-600 dark:text-violet-400">
                    <Mail size={18} />
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider">Email</span>
                    <a href="mailto:hkkpldhananjaya@gmail.com" className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
                      hkkpldhananjaya@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-violet-600 dark:text-violet-400">
                    <Phone size={18} />
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider">Phone</span>
                    <a href="tel:+94740707321" className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
                      +94 740 707 321
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-violet-600 dark:text-violet-400">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider">Location</span>
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Sri Lanka</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <a href="https://github.com/HKKavindaPathum" target="_blank" rel="noopener noreferrer" className="p-3 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-350 dark:hover:border-zinc-700 transition-colors">
                  <GithubIcon size={18} />
                </a>
                <a href="https://www.linkedin.com/in/kavindapathum/" target="_blank" rel="noopener noreferrer" className="p-3 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-350 dark:hover:border-zinc-700 transition-colors">
                  <LinkedinIcon size={18} />
                </a>
              </div>
            </div>

            {/* Message Form Wrapper */}
            <div className="lg:col-span-7 bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-8 shadow-md dark:shadow-lg shadow-zinc-200/50 dark:shadow-black/20">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900 text-center text-xs text-zinc-600 dark:text-zinc-500 font-semibold uppercase tracking-wider transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4">
          <p>© {new Date().getFullYear()} {fullName}. All rights reserved.</p>
          <p className="mt-2 text-[10px] text-zinc-400 dark:text-zinc-600">Built using Next.js, Tailwind CSS, Prisma, and MySQL</p>
        </div>
      </footer>
    </div>
  );
}
