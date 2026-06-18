'use client';

import { Download, ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface HeroProps {
  fullName: string;
  professionalTitle: string;
  cvUrl: string;
}

export default function Hero({ fullName, professionalTitle, cvUrl }: HeroProps) {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950 pt-20 overflow-hidden transition-colors duration-300"
    >
      {/* Background gradients */}
      <div className="absolute inset-0 z-0 opacity-15 dark:opacity-20 pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-[30rem] h-[30rem] rounded-full bg-violet-500/10 dark:bg-violet-600/20 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[30rem] h-[30rem] rounded-full bg-indigo-500/10 dark:bg-indigo-600/20 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-12 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Column Text */}
          <div className="flex flex-col space-y-6 text-center md:text-left order-2 md:order-1">
            <div className="inline-flex self-center md:self-start items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Available for Freelance & Full-time
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
              <span className="block text-zinc-500 dark:text-zinc-400 text-xl sm:text-2xl font-medium mb-2">Hello, I'm</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-500 dark:from-white dark:via-zinc-200 dark:to-zinc-400">
                {fullName}
              </span>
              <span className="block mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-500 dark:from-violet-400 dark:to-indigo-400">
                {professionalTitle}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-650 dark:text-zinc-400 max-w-xl mx-auto md:mx-0 leading-relaxed">
              Crafting state-of-the-art web applications with clean architecture, elegant user interfaces, and robust backend logic. Let's build something extraordinary together.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-4">
              <a
                href={cvUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold rounded-xl bg-zinc-900 text-white hover:bg-zinc-850 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 transition-colors shadow-lg shadow-black/5 dark:shadow-white/5"
              >
                <Download size={16} />
                Download CV
              </a>
              <a
                href="#contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold rounded-xl bg-zinc-100 text-zinc-900 border border-zinc-200 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-white dark:border-zinc-800 dark:hover:bg-zinc-800 dark:hover:border-zinc-700 transition-colors"
              >
                Contact Me
                <ArrowRight size={16} />
              </a>
            </div>
          </div>

          {/* Right Column Profile Image */}
          <div className="flex justify-center order-1 md:order-2">
            <div className="relative group">
              {/* Glow effects */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full blur opacity-25 dark:opacity-35 group-hover:opacity-50 dark:group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
              
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden border-4 border-white dark:border-zinc-900 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center shadow-lg dark:shadow-none">
                <Image
                  src="/profile_avatar.png"
                  alt={fullName}
                  fill
                  sizes="(max-width: 640px) 256px, 320px"
                  priority
                  className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
