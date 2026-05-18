'use client';

import { useState } from 'react';
import { submitContactForm } from '@/services/api';

const PHONE_RE = /^(?:\+?91[\s-]?)?[6-9]\d{9}$/;

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
    setError(null);

    if (!form.name.trim() || form.name.trim().length < 2) {
      setError('Please enter your name.');
      return;
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!PHONE_RE.test(form.phone.trim())) {
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
    const result = await submitContactForm({
      name: form.name.trim(),
      email: form.email.trim(),
      whatsappNumber: form.phone.trim(),
      message: messageParts.join('\n'),
      source: 'customized-trips',
      subject: `Custom quote: ${categoryLabel}`,
    });
    setLoading(false);

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
      setError(result.message || 'Could not send your request. Please try again.');
    }
  };

  if (success) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center text-green-900">
        <p className="text-lg font-bold">Request received</p>
        <p className="mt-2 text-sm">We&apos;ll reach out on WhatsApp or email with a tailored quote soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {error ? (
        <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700" role="alert">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="ct-name" className="mb-2 block text-sm font-semibold text-gray-800">
            Your name
          </label>
          <input
            id="ct-name"
            required
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="ct-email" className="mb-2 block text-sm font-semibold text-gray-800">
            Email
          </label>
          <input
            id="ct-email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="ct-phone" className="mb-2 block text-sm font-semibold text-gray-800">
          WhatsApp / mobile
        </label>
        <input
          id="ct-phone"
          required
          value={form.phone}
          onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
          placeholder="10-digit mobile"
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <span className="mb-2 block text-sm font-semibold text-gray-800">Preferred duration</span>
        <div className="grid grid-cols-2 gap-3">
          {['3-4 Days', '4-5 Days', '5-6 Days', '7+ Days'].map((duration) => (
            <label
              key={duration}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-300 p-3 hover:bg-blue-50"
            >
              <input
                type="radio"
                name="duration"
                value={duration}
                checked={form.duration === duration}
                onChange={() => setForm((p) => ({ ...p, duration }))}
              />
              <span>{duration}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="ct-budget" className="mb-2 block text-sm font-semibold text-gray-800">
          Budget range
        </label>
        <select
          id="ct-budget"
          value={form.budget}
          onChange={(e) => setForm((p) => ({ ...p, budget: e.target.value }))}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select your budget</option>
          <option>Under ₹10,000</option>
          <option>₹10,000 - ₹20,000</option>
          <option>₹20,000 - ₹50,000</option>
          <option>₹50,000+</option>
        </select>
      </div>

      <div>
        <span className="mb-2 block text-sm font-semibold text-gray-800">Preferences</span>
        <div className="space-y-2">
          {preferenceOptions.map((pref) => (
            <label key={pref} className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={form.preferences.includes(pref)}
                onChange={() => togglePreference(pref)}
              />
              <span>{pref}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="ct-travelers" className="mb-2 block text-sm font-semibold text-gray-800">
            Number of travelers
          </label>
          <input
            id="ct-travelers"
            type="number"
            min="1"
            value={form.travelers}
            onChange={(e) => setForm((p) => ({ ...p, travelers: e.target.value }))}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="ct-dates" className="mb-2 block text-sm font-semibold text-gray-800">
            Preferred travel dates
          </label>
          <input
            id="ct-dates"
            value={form.dates}
            onChange={(e) => setForm((p) => ({ ...p, dates: e.target.value }))}
            placeholder="e.g., June 2026"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="ct-notes" className="mb-2 block text-sm font-semibold text-gray-800">
          Anything else we should know?
        </label>
        <textarea
          id="ct-notes"
          rows={3}
          value={form.notes}
          onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? 'Sending…' : 'Get custom quote'}
      </button>
    </form>
  );
}
