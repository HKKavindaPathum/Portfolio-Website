interface AboutProps {
  aboutSummary: string;
}

export default function About({ aboutSummary }: AboutProps) {
  const stats = [
    { value: '5+', label: 'Years Experience' },
    { value: '30+', label: 'Projects Completed' },
    { value: '15+', label: 'Technologies Mastered' },
  ];

  return (
    <section id="about" className="py-24 bg-zinc-950 border-t border-zinc-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-violet-500 mb-2">About Me</h2>
          <p className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            My Biography & Philosophy
          </p>
          <div className="w-12 h-1 bg-violet-600 mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column - Biography */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-xl sm:text-2xl font-bold text-zinc-100">
              Transforming complex engineering challenges into fluid, premium user experiences.
            </h3>
            
            <div className="text-zinc-400 leading-relaxed space-y-4 whitespace-pre-line">
              {aboutSummary || 'Please update your CV details in the admin panel.'}
            </div>
          </div>

          {/* Right Column - Stats Card Stack */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-6">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700/80 transition-colors flex flex-col items-center lg:items-start text-center lg:text-left shadow-lg shadow-black/20"
              >
                <span className="text-4xl sm:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-500 mb-2">
                  {stat.value}
                </span>
                <span className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
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
