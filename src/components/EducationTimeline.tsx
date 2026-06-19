'use client';

import { useState, useEffect } from 'react';
import { Building, Calendar, Loader2 } from 'lucide-react';

interface Education {
  id: number;
  degree: string;
  institution: string;
  period: string;
  description: string;
}

export default function EducationTimeline() {
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const res = await fetch('/api/education');
        const data = await res.json();
        if (data.success) {
          // Sort in descending order to match reverse chronological order
          const sorted = [...data.data].sort((a, b) => b.id - a.id);
          setEducationList(sorted);
        } else {
          setError(data.error || 'Failed to fetch education details');
        }
      } catch (err) {
        console.error('Education fetch error:', err);
        setError('An error occurred while loading education details.');
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900 relative transition-colors duration-300 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 animate-spin text-violet-500 mb-2" />
          <span className="text-zinc-500 dark:text-zinc-400 text-sm">Loading timeline...</span>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900 relative transition-colors duration-300 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 reveal">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-violet-500 mb-2">My Journey</h2>
          <p className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Education & Qualifications
          </p>
          <div className="w-12 h-1 bg-violet-600 mx-auto mt-4 rounded-full" />
        </div>

        {error && (
          <div className="text-center py-8 text-rose-600 dark:text-rose-400 bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/15 dark:border-rose-500/20 rounded-xl max-w-lg mx-auto">
            {error}
          </div>
        )}

        {!error && educationList.length === 0 && (
          <div className="text-center py-12 text-zinc-500 dark:text-zinc-500 italic">
            No education history found.
          </div>
        )}

        {/* Timeline Container */}
        {!error && educationList.length > 0 && (
          <div className="relative max-w-4xl mx-auto">
            {/* Central Vertical Line */}
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-violet-600 via-indigo-500 to-zinc-200 dark:to-zinc-900 transform sm:-translate-x-1/2" />

            {/* Timeline Nodes */}
            <div className="space-y-12">
              {educationList.map((item, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <div
                    key={`education-${item.id}`}
                    className={`relative flex flex-col sm:flex-row items-start sm:items-center justify-between ${
                      isEven ? 'sm:flex-row-reverse' : ''
                    }`}
                  >
                    {/* Glowing Node Point */}
                    <div className="absolute left-4 sm:left-1/2 w-6 h-6 rounded-full bg-white dark:bg-zinc-950 border-4 border-violet-500 transform -translate-x-1/2 z-10 flex items-center justify-center shadow-lg shadow-violet-500/50" />

                    {/* Card Container */}
                    <div
                      style={{ transitionDelay: `${idx * 150}ms` }}
                      className="w-full sm:w-[calc(50%-2rem)] pl-10 sm:pl-0 reveal"
                    >
                      <div className="p-6 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700/80 transition-colors shadow-md shadow-zinc-200/50 dark:shadow-black/20 relative group">
                        {/* Ambient card tint */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-violet-600/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                        <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400 text-xs font-semibold uppercase tracking-widest mb-3">
                          <Calendar size={14} />
                          {item.period}
                        </div>

                        <h3 className="text-lg font-bold text-zinc-900 group-hover:text-violet-650 dark:text-white dark:group-hover:text-violet-400 transition-colors mb-1">
                          {item.degree}
                        </h3>

                        <div className="flex items-center gap-1.5 text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-3">
                          <Building size={14} className="text-zinc-400 dark:text-zinc-500" />
                          {item.institution}
                        </div>

                        <p className="text-sm text-zinc-650 dark:text-zinc-500 leading-relaxed whitespace-pre-line">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Empty space for desktop layout symmetry */}
                    <div className="hidden sm:block w-[calc(50%-2rem)]" />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
