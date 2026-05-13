'use client';

import { useState } from 'react';
import { subscribeToNewsletter } from '@/services/api';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NewsletterForm({ source = 'footer' }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setFeedback({ ok: false, message: 'Enter a valid email address.' });
      return;
    }
    setLoading(true);
    setFeedback(null);

    const result = await subscribeToNewsletter({ email: email.trim(), source });

    setLoading(false);
    if (result.success) {
      setFeedback({ ok: true, message: 'Subscribed! Look out for trip drops in your inbox.' });
      setEmail('');
    } else {
      setFeedback({ ok: false, message: result.message });
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-3 flex flex-col gap-2">
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (feedback) setFeedback(null);
          }}
          placeholder="you@example.com"
          className="w-full flex-1 rounded-full border border-white/30 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-white/60 focus:border-cta focus:outline-none focus:ring-2 focus:ring-cta/40"
        />
        <button
          type="submit"
          disabled={loading}
          className="shrink-0 rounded-full bg-cta px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-[#E76F51] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Joining…' : 'Subscribe'}
        </button>
      </div>
      {feedback && (
        <p
          role={feedback.ok ? 'status' : 'alert'}
          className={`text-xs ${feedback.ok ? 'text-emerald-200' : 'text-red-200'}`}
        >
          {feedback.message}
        </p>
      )}
    </form>
  );
}
