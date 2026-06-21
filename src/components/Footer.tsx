'use client';

import { Terminal, ArrowUp, Download, ShieldCheck, Mail } from 'lucide-react';

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

interface FooterProps {
  fullName: string;
  professionalTitle: string;
  cvUrl: string;
  githubUrl: string;
  linkedinUrl: string;
}

export default function Footer({
  fullName,
  professionalTitle,
  cvUrl,
  githubUrl,
  linkedinUrl,
}: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900 transition-colors duration-300 overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute inset-0 z-0 opacity-5 dark:opacity-10 pointer-events-none">
        <div className="absolute bottom-0 left-[20%] w-[35rem] h-[15rem] rounded-full bg-violet-600/10 dark:bg-violet-600/15 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-12 items-start">
          {/* Column 1: Info & Branding */}
          <div className="md:col-span-7 space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-tr from-violet-600 to-indigo-655 rounded-lg text-white">
                <Terminal size={18} />
              </div>
              <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-500 dark:from-white dark:via-zinc-200 dark:to-zinc-400 tracking-wider">
                {fullName.toUpperCase()}.
              </span>
            </div>
            
            <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
              {professionalTitle}
            </p>
            
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-500 leading-relaxed max-w-xl">
              Designing and building clean, responsive, and robust digital solutions with modern web technologies. Feel free to connect for new opportunities or collaborations.
            </p>

            <div className="flex gap-3 pt-1">
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-xl text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:border-zinc-350 dark:hover:border-zinc-700 hover:shadow-sm transition-all duration-200 cursor-pointer"
                  aria-label="GitHub Profile"
                >
                  <GithubIcon size={16} />
                </a>
              )}
              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-xl text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:border-zinc-350 dark:hover:border-zinc-700 hover:shadow-sm transition-all duration-200 cursor-pointer"
                  aria-label="LinkedIn Profile"
                >
                  <LinkedinIcon size={16} />
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Quick Resources */}
          <div className="md:col-span-5 space-y-4 md:text-right flex flex-col md:items-end">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Resources
            </h4>
            <div className="flex flex-row md:flex-col lg:flex-row flex-wrap gap-2 md:justify-end">
              <a
                href={cvUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/85 rounded-xl text-xs font-semibold text-zinc-650 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm transition-all duration-200 cursor-pointer w-fit"
              >
                <Download size={13} className="text-violet-500" />
                <span>Download CV</span>
              </a>
              <a
                href="/backdoor-admin"
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/85 rounded-xl text-xs font-semibold text-zinc-655 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm transition-all duration-200 cursor-pointer w-fit"
              >
                <ShieldCheck size={13} className="text-violet-500" />
                <span>Admin Login</span>
              </a>
              <button
                onClick={scrollToTop}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/85 rounded-xl text-xs font-semibold text-zinc-655 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm transition-all duration-200 cursor-pointer w-fit"
              >
                <ArrowUp size={13} className="text-violet-500" />
                <span>Back to Top</span>
              </button>
            </div>
          </div>
        </div>

        {/* Separator line */}
        <div className="w-full h-px bg-zinc-200 dark:bg-zinc-900 my-8" />

        {/* Bottom Credits */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-2xs sm:text-xs text-zinc-500 dark:text-zinc-600 font-semibold uppercase tracking-wider">
          <p>© {new Date().getFullYear()} {fullName}. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>Built with:</span>
            <span className="px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded font-mono text-[10px]">Next.js</span>
            <span className="px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded font-mono text-[10px]">Tailwind</span>
            <span className="px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded font-mono text-[10px]">Prisma</span>
            <span className="px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded font-mono text-[10px]">MySQL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
