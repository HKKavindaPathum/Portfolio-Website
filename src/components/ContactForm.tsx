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
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Your Name</label>
          <input
            type="text"
            required
            className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl p-3 text-sm text-zinc-200 outline-none transition-all"
            placeholder="John Doe"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Email Address</label>
          <input
            type="email"
            required
            className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl p-3 text-sm text-zinc-200 outline-none transition-all"
            placeholder="john@example.com"
          />
        </div>
      </div>
      
      <div className="space-y-1">
        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Subject</label>
        <input
          type="text"
          required
          className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl p-3 text-sm text-zinc-200 outline-none transition-all"
          placeholder="Project Inquiry"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Message</label>
        <textarea
          required
          rows={5}
          className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl p-3 text-sm text-zinc-200 outline-none resize-none leading-relaxed transition-all"
          placeholder="Hi, let's discuss details about your next project..."
        />
      </div>

      <button
        type="submit"
        className="w-full bg-white hover:bg-zinc-200 text-zinc-950 font-bold py-3.5 px-4 rounded-xl transition-colors mt-2 text-sm uppercase tracking-wider shadow-lg shadow-white/5"
      >
        Send Message
      </button>
    </form>
  );
}
