'use client';

import { useEffect, useState } from 'react';
import { X, ExternalLink, Code, Laptop, Server, Globe } from 'lucide-react';
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

interface ProjectDetailsModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectDetailsModal({ project, onClose }: ProjectDetailsModalProps) {
  const [isRendered, setIsRendered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (project) {
      setIsRendered(true);
      // Let render happen first, then animate in
      const timer = setTimeout(() => setIsVisible(true), 10);
      document.body.style.overflow = 'hidden'; // Prevent page scroll when modal is open
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
      };
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => setIsRendered(false), 300); // Wait for transition out
      document.body.style.overflow = '';
      return () => clearTimeout(timer);
    }
  }, [project]);

  if (!isRendered || !project) return null;

  const badges = project.techStack
    ? project.techStack.split(',').map((t) => t.trim())
    : [];

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ${
        isVisible ? 'visible' : 'invisible'
      }`}
    >
      {/* Backdrop with Blur */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-zinc-950/60 dark:bg-zinc-950/80 backdrop-blur-sm transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Modal Container */}
      <div
        className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl relative max-h-[85vh] flex flex-col z-10 transition-all duration-300 transform ${
          isVisible ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0'
        }`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/50">
          <span className="text-xs font-bold uppercase tracking-widest text-violet-500">Project Details</span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-grow overflow-y-auto p-6 sm:p-8 space-y-6">
          
          {/* Image Showcase */}
          <div className="h-56 sm:h-80 rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-850 dark:to-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center overflow-hidden relative shadow-md">
            {project.imageUrl ? (
              <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                unoptimized
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-zinc-400 dark:text-zinc-500">
                <Code size={48} className="stroke-[1.5] text-violet-500/70" />
                <span className="text-xs uppercase tracking-widest font-mono">No Preview Image</span>
              </div>
            )}
          </div>

          {/* Title and Badges */}
          <div className="space-y-3">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight">
              {project.title}
            </h3>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {badges.map((badge, bIdx) => (
                <span
                  key={bIdx}
                  className="px-2.5 py-1 text-[10px] font-semibold tracking-wider text-violet-650 bg-violet-600/10 border border-violet-600/15 dark:text-violet-400 dark:bg-violet-500/10 dark:border-violet-500/15 rounded-md uppercase"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          <div className="w-full h-px bg-zinc-200 dark:bg-zinc-800/60" />

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">About the Project</h4>
            <div className="text-sm sm:text-base text-zinc-650 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap font-sans">
              {project.description}
            </div>
          </div>

          <div className="w-full h-px bg-zinc-200 dark:bg-zinc-800/60" />

          {/* Action Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            
            {/* Repositories */}
            <div className="space-y-3">
              <h5 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Repositories</h5>
              <div className="flex flex-col gap-2">
                {project.githubLink && project.githubBackendLink ? (
                  <>
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2.5 px-4 py-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/60 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800/80 rounded-xl text-xs font-semibold text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white transition-all shadow-sm"
                    >
                      <Laptop size={15} className="text-violet-500" />
                      <span>Frontend Repo</span>
                      <ExternalLink size={12} className="ml-auto opacity-50" />
                    </a>
                    <a
                      href={project.githubBackendLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2.5 px-4 py-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/60 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800/80 rounded-xl text-xs font-semibold text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white transition-all shadow-sm"
                    >
                      <Server size={15} className="text-indigo-500" />
                      <span>Backend Repo</span>
                      <ExternalLink size={12} className="ml-auto opacity-50" />
                    </a>
                  </>
                ) : (
                  <>
                    {project.githubLink && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2.5 px-4 py-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/60 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800/80 rounded-xl text-xs font-semibold text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white transition-all shadow-sm"
                      >
                        <GithubIcon size={15} />
                        <span>GitHub Repository</span>
                        <ExternalLink size={12} className="ml-auto opacity-50" />
                      </a>
                    )}
                    {project.githubBackendLink && (
                      <a
                        href={project.githubBackendLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2.5 px-4 py-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/60 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800/80 rounded-xl text-xs font-semibold text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white transition-all shadow-sm"
                      >
                        <GithubIcon size={15} />
                        <span>GitHub (Backend)</span>
                        <ExternalLink size={12} className="ml-auto opacity-50" />
                      </a>
                    )}
                    {!project.githubLink && !project.githubBackendLink && (
                      <span className="text-xs text-zinc-500 italic">No codebase repositories provided.</span>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Live Demo */}
            <div className="space-y-3">
              <h5 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Live Demonstration</h5>
              <div>
                {project.liveLink ? (
                  <a
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full px-5 py-3.5 bg-gradient-to-tr from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold uppercase tracking-wider text-xs rounded-xl transition-all shadow-md shadow-violet-600/10 hover:-translate-y-0.5"
                  >
                    <Globe size={14} />
                    <span>Launch Live Site</span>
                    <ExternalLink size={11} className="opacity-80" />
                  </a>
                ) : (
                  <div className="flex items-center justify-center w-full px-5 py-3.5 bg-zinc-100 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800/60 text-zinc-400 dark:text-zinc-500 text-xs font-semibold uppercase tracking-wider rounded-xl">
                    No Live Demo Available
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
