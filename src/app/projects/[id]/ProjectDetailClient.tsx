'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ExternalLink, Code, Sun, Moon, Laptop, Server, Globe } from 'lucide-react';
import Image from 'next/image';

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

interface Project {
  id: number;
  title: string;
  description: string;
  techStack: string;
  githubLink?: string | null;
  githubBackendLink?: string | null;
  liveLink?: string | null;
  imageUrl?: string | null;
}

export default function ProjectDetailClient({ project }: { project: Project }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    // Initial theme set from localStorage or document class
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme || (document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    setTheme(initialTheme);
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const badges = project.techStack
    ? project.techStack.split(',').map((t) => t.trim())
    : [];

  return (
    <div className="bg-white dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100 min-h-screen font-sans antialiased selection:bg-violet-500 selection:text-white transition-colors duration-300 w-full flex flex-col">
      {/* Blurred Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200/50 dark:border-zinc-800/50 py-4 shadow-lg shadow-black/5 dark:shadow-black/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <a
            href="/"
            className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
            Back to Portfolio
          </a>
          
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-650 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors border border-zinc-200/50 dark:border-zinc-800/50 cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow py-12 sm:py-20 relative overflow-hidden">
        {/* Aesthetic Background Gradients */}
        <div className="absolute inset-0 z-0 opacity-10 dark:opacity-15 pointer-events-none">
          <div className="absolute top-[10%] left-[5%] w-[35rem] h-[35rem] rounded-full bg-violet-500/10 dark:bg-violet-600/15 blur-[130px]" />
          <div className="absolute bottom-[10%] right-[5%] w-[30rem] h-[30rem] rounded-full bg-indigo-500/5 dark:bg-indigo-600/10 blur-[120px]" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <article className="space-y-10">
            {/* Project Image Panel */}
            <div className="h-[22rem] sm:h-[32rem] rounded-3xl bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-950 border border-zinc-200 dark:border-zinc-800/80 flex items-center justify-center overflow-hidden relative shadow-2xl shadow-zinc-200/50 dark:shadow-black/40 group">
              {project.imageUrl ? (
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  fill
                  unoptimized
                  priority
                  className="object-cover w-full h-full transform group-hover:scale-102 transition-transform duration-500"
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-zinc-400 dark:text-zinc-500">
                  <Code size={64} className="stroke-[1.2] text-violet-500/70" />
                  <span className="text-xs uppercase tracking-widest font-mono">No Preview Image Available</span>
                </div>
              )}
            </div>

            {/* Project Details Panel */}
            <div className="bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/85 rounded-3xl p-8 sm:p-12 shadow-xl shadow-zinc-200/30 dark:shadow-black/20 backdrop-blur-sm">
              
              {/* Header Info */}
              <div className="space-y-4 mb-8">
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight">
                  {project.title}
                </h1>
                
                {/* Tech Badges */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {badges.map((badge, bIdx) => (
                    <span
                      key={bIdx}
                      className="px-3.5 py-1.5 text-xs font-semibold tracking-wider text-violet-600 bg-violet-600/10 border border-violet-600/15 dark:text-violet-400 dark:bg-violet-500/10 dark:border-violet-500/15 rounded-lg uppercase"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>

              <div className="w-full h-px bg-zinc-200 dark:bg-zinc-800/70 my-8" />

              {/* Description Body */}
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white uppercase tracking-wider text-xs">
                  About the Project
                </h2>
                <div className="text-base sm:text-lg text-zinc-650 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap font-sans">
                  {project.description}
                </div>
              </div>

              <div className="w-full h-px bg-zinc-200 dark:bg-zinc-800/70 my-8" />

              {/* Action Links Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-2">
                
                {/* Left side: Repository links */}
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                    Code Repositories
                  </h3>
                  
                  <div className="flex flex-col gap-3">
                    {/* Render Frontend & Backend separately if both are provided */}
                    {project.githubLink && project.githubBackendLink ? (
                      <>
                        <a
                          href={project.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-3 px-5 py-3.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm font-semibold text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white transition-all duration-200 shadow-md shadow-zinc-200/40 dark:shadow-none"
                        >
                          <Laptop size={18} className="text-violet-550" />
                          <span>Frontend Repository</span>
                          <ExternalLink size={14} className="ml-auto opacity-50" />
                        </a>
                        <a
                          href={project.githubBackendLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-3 px-5 py-3.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm font-semibold text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white transition-all duration-200 shadow-md shadow-zinc-200/40 dark:shadow-none"
                        >
                          <Server size={18} className="text-indigo-500" />
                          <span>Backend Repository</span>
                          <ExternalLink size={14} className="ml-auto opacity-50" />
                        </a>
                      </>
                    ) : (
                      <>
                        {/* Standard single repository */}
                        {project.githubLink && (
                          <a
                            href={project.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-5 py-3.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm font-semibold text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white transition-all duration-200 shadow-md shadow-zinc-200/40 dark:shadow-none"
                          >
                            <GithubIcon size={18} />
                            <span>GitHub Repository</span>
                            <ExternalLink size={14} className="ml-auto opacity-50" />
                          </a>
                        )}
                        {project.githubBackendLink && (
                          <a
                            href={project.githubBackendLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-5 py-3.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm font-semibold text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white transition-all duration-200 shadow-md shadow-zinc-200/40 dark:shadow-none"
                          >
                            <GithubIcon size={18} />
                            <span>GitHub Repository (Backend)</span>
                            <ExternalLink size={14} className="ml-auto opacity-50" />
                          </a>
                        )}
                        {!project.githubLink && !project.githubBackendLink && (
                          <span className="text-sm text-zinc-500 italic">
                            Private or no repository link provided.
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Right side: Live demonstration link */}
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                    Live Demonstration
                  </h3>
                  
                  <div>
                    {project.liveLink ? (
                      <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2.5 w-full px-6 py-4 bg-gradient-to-tr from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold uppercase tracking-wider text-xs rounded-2xl transition-all duration-200 shadow-lg shadow-violet-600/20 dark:shadow-none border border-violet-600/10 hover:-translate-y-0.5"
                      >
                        <Globe size={16} />
                        <span>Launch Live Site</span>
                        <ExternalLink size={12} className="opacity-80" />
                      </a>
                    ) : (
                      <div className="flex items-center justify-center w-full px-6 py-4 bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 text-zinc-400 dark:text-zinc-500 text-xs font-semibold uppercase tracking-wider rounded-2xl">
                        No Live Demo Available
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </div>
          </article>
        </div>
      </main>

      {/* Simplified Footer */}
      <footer className="py-8 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900 text-center text-[10px] text-zinc-500 font-semibold uppercase tracking-wider transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          <span>© {new Date().getFullYear()} Project Details</span>
          <span>Built with Next.js & Tailwind CSS</span>
        </div>
      </footer>
    </div>
  );
}
