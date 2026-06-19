interface AboutProps {
  aboutSummary: string;
  statsExperience: string;
  statsProjects: string;
  statsTechnologies: string;
}

export default function About({
  aboutSummary,
  statsExperience,
  statsProjects,
  statsTechnologies,
}: AboutProps) {
  const stats = [
    { value: statsExperience, label: 'Years Experience' },
    { value: statsProjects, label: 'Projects Completed' },
    { value: statsTechnologies, label: 'Technologies Used' },
  ];

  return (
    <section id="about" className="py-24 bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900 relative transition-colors duration-300 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 reveal">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white uppercase tracking-wider">
            About Me
          </h2>
          <div className="w-12 h-1 bg-violet-600 mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column - Biography */}
          <div className="lg:col-span-7 space-y-6 reveal">
            <div className="text-zinc-600 dark:text-zinc-400 leading-relaxed space-y-4 whitespace-pre-line text-base sm:text-lg">
              {aboutSummary || 'Please update your CV details in the admin panel.'}
            </div>
          </div>

          {/* Right Column - Stats Card Stack */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-6 reveal">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700/80 transition-colors flex flex-col items-center lg:items-start text-center lg:text-left shadow-md shadow-zinc-200/50 dark:shadow-black/20"
              >
                <span className="text-4xl sm:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-500 mb-2">
                  {stat.value}
                </span>
                <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
