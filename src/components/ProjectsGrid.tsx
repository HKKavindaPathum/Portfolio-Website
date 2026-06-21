'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, Code } from 'lucide-react';
import Image from 'next/image';
import ProjectDetailsModal from './ProjectDetailsModal';

const GithubIcon = ({ size = 14 }: { size?: number }) => (
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

export default function ProjectsGrid() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        if (data.success) {
          setProjects(data.data);
        } else {
          setError(data.error || 'Failed to fetch projects');
        }
      } catch (err) {
        console.error('Projects fetch error:', err);
        setError('An error occurred while loading projects.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <section id="projects" className="py-24 bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-violet-500 mb-2">My Work</h2>
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">Recent Projects</h3>
            <div className="w-12 h-1 bg-violet-600 mx-auto mt-4 rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={`projects-skeleton-${n}`} className="rounded-2xl border border-zinc-200 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-900 p-6 space-y-4 animate-pulse">
                <div className="h-44 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-6 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-4 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-4 w-5/6 rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="flex gap-2 pt-2">
                  <div className="h-6 w-16 rounded bg-zinc-200 dark:bg-zinc-800" />
                  <div className="h-6 w-16 rounded bg-zinc-200 dark:bg-zinc-800" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-24 bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900 relative transition-colors duration-300 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 reveal">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-violet-500 mb-2">My Work</h2>
          <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">Recent Projects</h3>
          <div className="w-12 h-1 bg-violet-600 mx-auto mt-4 rounded-full" />
        </div>

        {error && (
          <div className="text-center py-8 text-rose-600 dark:text-rose-400 bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/15 dark:border-rose-500/20 rounded-xl max-w-lg mx-auto">
            {error}
          </div>
        )}

        {!error && projects.length === 0 && (
          <div className="text-center py-12 text-zinc-500 dark:text-zinc-500 italic">
            No projects found. Log into the admin dashboard to add your work!
          </div>
        )}

        {!error && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => {
              const badges = project.techStack
                ? project.techStack.split(',').map((t) => t.trim())
                : [];
              return (
                <div
                  key={`project-card-${project.id}`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                  className="reveal h-full"
                >
                  <div
                    className="group relative rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700/80 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-md shadow-zinc-200/50 dark:shadow-black/20 hover:-translate-y-1 h-full"
                  >
                    <div className="p-6">
                      {/* Project Image/Icon */}
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="w-full block h-44 rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-950 border border-zinc-200 dark:border-zinc-800/80 flex items-center justify-center mb-6 overflow-hidden relative group-hover:border-violet-500/50 transition-colors cursor-pointer text-left"
                      >
                        {project.imageUrl ? (
                          <Image
                            src={project.imageUrl}
                            alt={project.title}
                            fill
                            unoptimized
                            className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-zinc-400 dark:text-zinc-500 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors mx-auto">
                            <Code size={40} className="stroke-[1.5]" />
                            <span className="text-xs uppercase tracking-widest font-mono">No Preview</span>
                          </div>
                        )}
                      </button>

                      <h4 className="text-xl font-bold text-zinc-900 group-hover:text-violet-600 dark:text-white dark:group-hover:text-violet-400 transition-colors mb-4">
                        <button
                          onClick={() => setSelectedProject(project)}
                          className="hover:underline text-left cursor-pointer"
                        >
                          {project.title}
                        </button>
                      </h4>

                      {/* Tech badges */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {badges.map((badge, bIdx) => (
                          <span
                            key={bIdx}
                            className="px-2.5 py-1 text-[10px] font-semibold tracking-wider text-violet-600 bg-violet-600/10 border border-violet-600/15 dark:text-violet-400 dark:bg-violet-500/10 dark:border-violet-500/15 rounded-md uppercase"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="p-6 pt-0 flex gap-4 border-t border-zinc-200/50 dark:border-zinc-800/30 mt-auto">
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer"
                      >
                        <ExternalLink size={14} />
                        View Details
                      </button>
                      {project.liveLink && (
                        <a
                          href={project.liveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors ml-auto"
                        >
                          <ExternalLink size={14} />
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Project Details Modal */}
      <ProjectDetailsModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
