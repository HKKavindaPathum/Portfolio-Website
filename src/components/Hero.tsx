'use client';

import { useState, useEffect } from 'react';
import { Download, ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface HeroProps {
  fullName: string;
  professionalTitle: string;
  cvUrl: string;
  heroDescription: string;
}

export default function Hero({ fullName, professionalTitle, cvUrl, heroDescription }: HeroProps) {
  const [showAvatar, setShowAvatar] = useState(false);

  // Toggle between real photo and AI avatar every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setShowAvatar((prev) => !prev);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

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
              <span className="block text-zinc-500 dark:text-zinc-400 text-xl sm:text-2xl font-medium mb-2">Hello, I&apos;m</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-500 dark:from-white dark:via-zinc-200 dark:to-zinc-400">
                {fullName}
              </span>
              <span className="block mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-500 dark:from-violet-400 dark:to-indigo-400">
                {professionalTitle}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto md:mx-0 leading-relaxed">
              {heroDescription}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-4">
              <a
                href={cvUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold rounded-xl bg-zinc-900 text-white hover:bg-zinc-855 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 transition-colors shadow-lg shadow-black/5 dark:shadow-white/5"
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

          {/* Right Column Profile Image (with Slide & Swap transition and real rotating border) */}
          <div className="flex justify-center order-1 md:order-2">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center group overflow-hidden rounded-full">
              {/* Behind-the-scene ambient glow (blurred) */}
              <div className="absolute -inset-2.5 bg-gradient-to-r from-violet-600 via-indigo-650 to-violet-600 rounded-full blur opacity-25 dark:opacity-35 animate-spin-slow"></div>
              
              {/* 1. Spinning border ring (Black & White Conic Gradient for high visibility) */}
              <div 
                className="absolute inset-0 rounded-full animate-spin-slow"
                style={{
                  background: 'conic-gradient(#000000 90deg, #ffffff 90deg 180deg, #000000 180deg 270deg, #ffffff 270deg)'
                }}
              ></div>
              
              {/* 2. Slide & Swap Inner container (creates a 4px border by inset-[4px]) */}
              <div className="absolute inset-[4px] rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
                
                {/* Slide 1: Real Photo */}
                <div 
                  className={`absolute inset-0 w-full h-full rounded-full overflow-hidden transition-all duration-1000 ease-in-out ${
                    showAvatar ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'
                  }`}
                >
                  <Image
                    src="/real_photo.jpg"
                    alt={fullName}
                    fill
                    sizes="(max-width: 640px) 256px, 320px"
                    priority
                    className="object-cover"
                  />
                </div>

                {/* Slide 2: AI Stylized Avatar */}
                <div 
                  className={`absolute inset-0 w-full h-full rounded-full overflow-hidden transition-all duration-1000 ease-in-out ${
                    showAvatar ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                  }`}
                >
                  <Image
                    src="/profile_avatar.png"
                    alt={`${fullName} Avatar`}
                    fill
                    sizes="(max-width: 640px) 256px, 320px"
                    priority
                    className="object-cover"
                  />
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
