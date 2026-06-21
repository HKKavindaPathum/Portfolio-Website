import Link from 'next/link';
import { Terminal, Home, AlertCircle } from 'lucide-react';

export const metadata = {
  title: '404 - Page Not Found | Portfolio',
  description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen font-sans antialiased flex flex-col items-center justify-center p-4">
      {/* Decorative gradient */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-[25%] left-[25%] w-[30rem] h-[30rem] rounded-full bg-violet-600/10 blur-[120px]" />
      </div>

      <div className="relative z-10 text-center max-w-md space-y-6">
        {/* Animated icon container */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-violet-500 shadow-lg shadow-violet-500/5">
          <AlertCircle size={32} />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-white">404</h1>
          <h2 className="text-xl font-semibold text-zinc-300">Page Not Found</h2>
          <p className="text-sm text-zinc-500 max-w-xs mx-auto">
            The project or resource you requested could not be found or has been moved.
          </p>
        </div>

        <div className="w-12 h-1 bg-violet-600 mx-auto rounded-full" />

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs font-semibold uppercase tracking-wider text-white transition-all shadow-md shadow-black/30 hover:-translate-y-0.5"
          >
            <Home size={14} />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
