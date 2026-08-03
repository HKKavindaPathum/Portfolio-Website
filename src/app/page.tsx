import { prisma } from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import EducationTimeline from '@/components/EducationTimeline';
import ProjectsGrid from '@/components/ProjectsGrid';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/icons/SocialIcons';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const cv = await prisma.cvDetails.findFirst();

  const fullName = cv?.fullName || 'Jane Doe';
  const professionalTitle = cv?.professionalTitle || 'Full-Stack Developer & Architect';
  const aboutSummary = cv?.aboutSummary || 'Welcome to my portfolio! Log in to the admin panel to update this profile detail.';
  const cvUrl = cv?.cvFile ? '/api/cv/download' : (cv?.cvUrl && cv.cvUrl !== '#' ? cv.cvUrl : '');
  const githubUrl = cv?.githubUrl || '';
  const linkedinUrl = cv?.linkedinUrl || '';
  const email = cv?.email || '';
  const phone = cv?.phone || '';
  const location = cv?.location || '';
  const statsExperience = cv?.statsExperience || '5+';
  const statsProjects = cv?.statsProjects || '30+';
  const statsTechnologies = cv?.statsTechnologies || '15+';
  const heroDescription = cv?.heroDescription || "Crafting state-of-the-art web applications with clean architecture, elegant user interfaces, and robust backend logic. Let's build something extraordinary together.";

  return (
    <div className="bg-white dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100 min-h-screen font-sans antialiased selection:bg-violet-500 selection:text-white transition-colors duration-300 w-full overflow-x-hidden">
      <Navbar />
      
      {/* Sections */}
      <Hero fullName={fullName} professionalTitle={professionalTitle} cvUrl={cvUrl} heroDescription={heroDescription} />
      <About
        aboutSummary={aboutSummary}
        statsExperience={statsExperience}
        statsProjects={statsProjects}
        statsTechnologies={statsTechnologies}
      />
      <EducationTimeline />
      <Skills />
      <ProjectsGrid />

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900 relative transition-colors duration-300 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10 dark:opacity-15 pointer-events-none">
          <div className="absolute bottom-[10%] left-[10%] w-[30rem] h-[30rem] rounded-full bg-violet-500/5 dark:bg-violet-600/10 blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 reveal">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-violet-500 mb-2">Get In Touch</h2>
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">Let&apos;s Connect</h3>
            <div className="w-12 h-1 bg-violet-600 mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-5xl mx-auto">
            {/* Contact Details */}
            <div className="lg:col-span-5 space-y-8 reveal">
              <div>
                <h4 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Contact Information</h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Feel free to reach out for project collaboration, freelance opportunities, or just to say hello. I&apos;ll get back to you as soon as possible.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-violet-600 dark:text-violet-400">
                    <Mail size={18} />
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider">Email</span>
                    <a href={`mailto:${email}`} className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
                      {email || 'Not specified'}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-violet-600 dark:text-violet-400">
                    <Phone size={18} />
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider">Phone</span>
                    <a href={`tel:${phone}`} className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
                      {phone || 'Not specified'}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-violet-600 dark:text-violet-400">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider">Location</span>
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{location || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                {githubUrl && (
                  <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="p-3 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-350 dark:hover:border-zinc-700 transition-colors">
                    <GithubIcon size={18} />
                  </a>
                )}
                {linkedinUrl && (
                  <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="p-3 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-350 dark:hover:border-zinc-700 transition-colors">
                    <LinkedinIcon size={18} />
                  </a>
                )}
              </div>
            </div>

            {/* Message Form Wrapper */}
            <div
              style={{ transitionDelay: '150ms' }}
              className="lg:col-span-7 bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-8 shadow-md dark:shadow-lg shadow-zinc-200/50 dark:shadow-black/20 reveal"
            >
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer
        fullName={fullName}
        professionalTitle={professionalTitle}
        cvUrl={cvUrl}
        githubUrl={githubUrl}
        linkedinUrl={linkedinUrl}
      />
    </div>
  );
}
