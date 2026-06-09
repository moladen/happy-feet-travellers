'use client';

import { useState } from 'react';
import { submitContactForm } from '@/services/api';
import { resolveFormErrorMessage, USER_MESSAGES } from '@/lib/userMessages';
import { isValidIndianPhone, normalizeIndianPhone } from '@/lib/indianPhone';

const labelClass = 'mb-2 block text-sm font-semibold text-primary';
const fieldClass =
  'w-full rounded-xl border border-[#e5ddd0] bg-white px-4 py-3 text-[15px] text-foreground shadow-sm transition placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-cta/40';
const choiceClass =
  'flex cursor-pointer items-center gap-3 rounded-xl border border-[#e5ddd0] bg-white p-3 text-sm text-foreground transition hover:border-secondary/40 hover:bg-section-alt/50 has-[:checked]:border-secondary has-[:checked]:bg-section-alt/60';

export default function CustomizedTripEnquiryForm({ categoryLabel = 'custom trip' }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    duration: '',
    budget: '',
    travelers: '1',
    dates: '',
    preferences: [],
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const preferenceOptions = [
    'Adventure Activities',
    'Cultural Sites',
    'Relaxation',
    'Wildlife',
    'Food & Cuisine',
    'Photography',
  ];

  const togglePreference = (pref) => {
    setForm((prev) => ({
      ...prev,
      preferences: prev.preferences.includes(pref)
        ? prev.preferences.filter((p) => p !== pref)
        : [...prev.preferences, pref],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError(null);

    if (!form.name.trim() || form.name.trim().length < 2) {
      setError('Please enter your name.');
      return;
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!isValidIndianPhone(form.phone)) {
      setError('Enter a valid 10-digit Indian mobile number.');
      return;
    }
    if (!form.duration) {
      setError('Please select a preferred duration.');
      return;
    }

    const messageParts = [
      `Customized trip enquiry (${categoryLabel})`,
      `Duration: ${form.duration}`,
      form.budget ? `Budget: ${form.budget}` : null,
      `Travelers: ${form.travelers}`,
      form.dates ? `Preferred dates: ${form.dates}` : null,
      form.preferences.length ? `Preferences: ${form.preferences.join(', ')}` : null,
      form.notes.trim() ? `Notes: ${form.notes.trim()}` : null,
    ].filter(Boolean);

    setLoading(true);
    try {
      const result = await submitContactForm({
        name: form.name.trim(),
        email: form.email.trim(),
        whatsappNumber: normalizeIndianPhone(form.phone),
        message: messageParts.join('\n'),
        source: 'customized-trips',
        subject: `Custom quote: ${categoryLabel}`,
      });

      if (result.success) {
        setSuccess(true);
        setForm({
          name: '',
          email: '',
          phone: '',
          duration: '',
          budget: '',
          travelers: '1',
          dates: '',
          preferences: [],
          notes: '',
        });
      } else {
        setError(resolveFormErrorMessage(result));
      }
    } catch {
      setError(USER_MESSAGES.formSubmitFailed);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-2xl border border-[#c8e6c9] bg-[#f1f8f2] p-6 text-center text-[#1b5e20]">
        <p className="text-lg font-bold text-primary">Request received</p>
        <p className="mt-2 text-sm text-foreground/85">
          We&apos;ll reach out on WhatsApp or email with a tailored quote soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {error ? (
        <div className="rounded-xl border border-red-300 bg-red-50/80 p-3 text-sm text-red-700" role="alert">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="ct-name" className={labelClass}>
            Your name
          </label>
          <input
            id="ct-name"
            required
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="ct-email" className={labelClass}>
            Email
          </label>
          <input
            id="ct-email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="ct-phone" className={labelClass}>
          WhatsApp / mobile
        </label>
        <input
          id="ct-phone"
          required
          value={form.phone}
          onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
          placeholder="10-digit mobile"
          className={fieldClass}
        />
      </div>

      <div>
        <span className={labelClass}>Preferred duration</span>
        <div className="grid grid-cols-2 gap-3">
          {['3-4 Days', '4-5 Days', '5-6 Days', '7+ Days'].map((duration) => (
            <label key={duration} className={choiceClass}>
              <input
                type="radio"
                name="duration"
                value={duration}
                checked={form.duration === duration}
                onChange={() => setForm((p) => ({ ...p, duration }))}
                className="accent-primary"
              />
              <span>{duration}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="ct-budget" className={labelClass}>
          Budget range
        </label>
        <select
          id="ct-budget"
          value={form.budget}
          onChange={(e) => setForm((p) => ({ ...p, budget: e.target.value }))}
          className={fieldClass}
        >
          <option value="">Select your budget</option>
          <option>Under ₹10,000</option>
          <option>₹10,000 - ₹20,000</option>
          <option>₹20,000 - ₹50,000</option>
          <option>₹50,000+</option>
        </select>
      </div>

      <div>
        <span className={labelClass}>Preferences</span>
        <div className="space-y-2">
          {preferenceOptions.map((pref) => (
            <label
              key={pref}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-1 py-1 text-sm text-foreground transition hover:text-primary"
            >
              <input
                type="checkbox"
                checked={form.preferences.includes(pref)}
                onChange={() => togglePreference(pref)}
                className="accent-cta"
              />
              <span>{pref}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="ct-travelers" className={labelClass}>
            Number of travelers
          </label>
          <input
            id="ct-travelers"
            type="number"
            min="1"
            value={form.travelers}
            onChange={(e) => setForm((p) => ({ ...p, travelers: e.target.value }))}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="ct-dates" className={labelClass}>
            Preferred travel dates
          </label>
          <input
            id="ct-dates"
            value={form.dates}
            onChange={(e) => setForm((p) => ({ ...p, dates: e.target.value }))}
            placeholder="e.g., June 2026"
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="ct-notes" className={labelClass}>
          Anything else we should know?
        </label>
        <textarea
          id="ct-notes"
          rows={3}
          value={form.notes}
          onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
          className={fieldClass}
        />
      </div>

      <button type="submit" disabled={loading} className="btn-travel-primary w-full py-3.5 disabled:opacity-60">
        {loading ? 'Sending…' : 'Get custom quote'}
      </button>
    </form>
  );
}
