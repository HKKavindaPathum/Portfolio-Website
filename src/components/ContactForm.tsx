'use client';

export default function ContactForm() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Message sent successfully! (Demo submission)');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Your Name</label>
          <input
            type="text"
            required
            className="w-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-violet-600 focus:ring-1 focus:ring-violet-600 dark:focus:border-violet-500 dark:focus:ring-1 dark:focus:ring-violet-500 rounded-xl p-3 text-sm text-zinc-800 dark:text-zinc-200 outline-none transition-all"
            placeholder="John Doe"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Email Address</label>
          <input
            type="email"
            required
            className="w-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-violet-600 focus:ring-1 focus:ring-violet-600 dark:focus:border-violet-500 dark:focus:ring-1 dark:focus:ring-violet-500 rounded-xl p-3 text-sm text-zinc-800 dark:text-zinc-200 outline-none transition-all"
            placeholder="john@example.com"
          />
        </div>
      </div>
      
      <div className="space-y-1">
        <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Subject</label>
        <input
          type="text"
          required
          className="w-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-violet-600 focus:ring-1 focus:ring-violet-600 dark:focus:border-violet-500 dark:focus:ring-1 dark:focus:ring-violet-500 rounded-xl p-3 text-sm text-zinc-800 dark:text-zinc-200 outline-none transition-all"
          placeholder="Project Inquiry"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Message</label>
        <textarea
          required
          rows={5}
          className="w-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-violet-600 focus:ring-1 focus:ring-violet-600 dark:focus:border-violet-500 dark:focus:ring-1 dark:focus:ring-violet-500 rounded-xl p-3 text-sm text-zinc-800 dark:text-zinc-200 outline-none resize-none leading-relaxed transition-all"
          placeholder="Hi, let's discuss details about your next project..."
        />
      </div>

      <button
        type="submit"
        className="w-full bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-950 font-bold py-3.5 px-4 rounded-xl transition-colors mt-2 text-sm uppercase tracking-wider shadow-lg shadow-black/5 dark:shadow-white/5 cursor-pointer"
      >
        Send Message
      </button>
    </form>
  );
}
