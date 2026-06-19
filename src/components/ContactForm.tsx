'use client';

import { useState } from 'react';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      console.error('Configuration error: NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY is missing.');
      setStatus('error');
      return;
    }

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          from_name: 'Portfolio Contact Form',
        }),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        console.error('Web3Forms error:', result);
        setStatus('error');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 text-center space-y-4 reveal">
        <CheckCircle2 className="w-12 h-12 text-emerald-500 animate-bounce" />
        <h4 className="text-xl font-bold text-zinc-900 dark:text-white">Message Sent!</h4>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-sm leading-relaxed">
          Thank you for reaching out. Your message has been sent successfully and I will get back to you shortly.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 rounded-xl hover:opacity-90 transition-opacity cursor-pointer shadow-md"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {status === 'error' && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm">
          <AlertCircle size={18} />
          <span>Failed to send message. Please try again or email directly.</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Your Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-violet-600 focus:ring-1 focus:ring-violet-600 dark:focus:border-violet-500 dark:focus:ring-1 dark:focus:ring-violet-500 rounded-xl p-3 text-sm text-zinc-800 dark:text-zinc-200 outline-none transition-all"
            placeholder="John Doe"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Email Address</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          className="w-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-violet-600 focus:ring-1 focus:ring-violet-600 dark:focus:border-violet-500 dark:focus:ring-1 dark:focus:ring-violet-500 rounded-xl p-3 text-sm text-zinc-800 dark:text-zinc-200 outline-none transition-all"
          placeholder="Project Inquiry"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Message</label>
        <textarea
          required
          rows={5}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-violet-600 focus:ring-1 focus:ring-violet-600 dark:focus:border-violet-500 dark:focus:ring-1 dark:focus:ring-violet-500 rounded-xl p-3 text-sm text-zinc-800 dark:text-zinc-200 outline-none resize-none leading-relaxed transition-all"
          placeholder="Hi, let's discuss details about your next project..."
        />
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-950 font-bold py-3.5 px-4 rounded-xl transition-colors mt-2 text-sm uppercase tracking-wider shadow-lg shadow-black/5 dark:shadow-white/5 cursor-pointer flex items-center justify-center gap-2"
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Sending...
          </>
        ) : (
          'Send Message'
        )}
      </button>
    </form>
  );
}
