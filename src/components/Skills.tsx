'use client';

import { useState, useEffect } from 'react';
import { Code2, Globe, Database, Cpu, Loader2 } from 'lucide-react';

interface Skill {
  id: number;
  name: string;
  category: string;
}

const getCategoryIcon = (category: string) => {
  const normalized = category.toLowerCase();
  if (normalized.includes('language')) return <Code2 className="w-6 h-6 text-violet-600 dark:text-violet-400" />;
  if (normalized.includes('web') || normalized.includes('ui') || normalized.includes('framework')) {
    return <Globe className="w-6 h-6 text-violet-600 dark:text-violet-400" />;
  }
  if (normalized.includes('database') || normalized.includes('cloud') || normalized.includes('db')) {
    return <Database className="w-6 h-6 text-violet-600 dark:text-violet-400" />;
  }
  return <Cpu className="w-6 h-6 text-violet-600 dark:text-violet-400" />;
};

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await fetch('/api/skills');
        const data = await res.json();
        if (data.success) {
          setSkills(data.data);
        } else {
          setError(data.error || 'Failed to fetch skills');
        }
      } catch (err) {
        console.error('Skills fetch error:', err);
        setError('An error occurred while loading skills.');
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  if (loading) {
    return (
      <section id="skills" className="py-24 bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900 relative transition-colors duration-300 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 animate-spin text-violet-500 mb-2" />
          <span className="text-zinc-500 dark:text-zinc-400 text-sm">Loading skills...</span>
        </div>
      </section>
    );
  }

  // Group skills by category in order of appearance (server-sorted order)
  const grouped: { [key: string]: string[] } = {};
  const categories: string[] = [];

  skills.forEach((skill) => {
    const catName = skill.category || 'Uncategorized';
    if (!categories.includes(catName)) {
      categories.push(catName);
    }
    if (!grouped[catName]) {
      grouped[catName] = [];
    }
    grouped[catName].push(skill.name);
  });

  return (
    <section
      id="skills"
      className="py-24 bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900 relative transition-colors duration-300 overflow-hidden"
    >
      <div className="absolute inset-0 z-0 opacity-10 dark:opacity-15 pointer-events-none">
        <div className="absolute top-[20%] right-[10%] w-[30rem] h-[30rem] rounded-full bg-indigo-500/5 dark:bg-indigo-600/10 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 reveal">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-violet-500 mb-2">My Expertise</h2>
          <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Skills & Technologies
          </h3>
          <div className="w-12 h-1 bg-violet-600 mx-auto mt-4 rounded-full" />
        </div>

        {error && (
          <div className="text-center py-8 text-rose-600 dark:text-rose-400 bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/15 dark:border-rose-500/20 rounded-xl max-w-lg mx-auto">
            {error}
          </div>
        )}

        {!error && categories.length === 0 && (
          <div className="text-center py-12 text-zinc-500 dark:text-zinc-500 italic">
            No skills found.
          </div>
        )}

        {/* Skills Grid */}
        {!error && categories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {categories.map((category, idx) => (
              <div
                key={`skill-category-${category}`}
                style={{ transitionDelay: `${idx * 150}ms` }}
                className="reveal"
              >
                <div className="p-8 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700/80 transition-all duration-300 shadow-md dark:shadow-lg shadow-zinc-200/50 dark:shadow-black/20 relative group h-full">
                  {/* Accent glow on hover */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-violet-600/5 to-indigo-650/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                      {getCategoryIcon(category)}
                    </div>
                    <h4 className="text-lg font-bold text-zinc-900 dark:text-white">
                      {category}
                    </h4>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {grouped[category].map((skillName, sIdx) => (
                      <span
                        key={`skill-badge-${skillName}-${sIdx}`}
                        className="px-3.5 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-violet-500 dark:hover:border-violet-400 hover:text-violet-600 dark:hover:text-violet-400 hover:shadow-sm transition-all duration-200 cursor-default"
                      >
                        {skillName}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
