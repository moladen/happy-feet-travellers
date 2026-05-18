'use client';

import { useState } from 'react';
import { submitContactForm } from '@/services/api';

const PHONE_RE = /^(?:\+?91[\s-]?)?[6-9]\d{9}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateForm = ({ name, whatsappNumber, email, message }) => {
  const errors = {};
  if (!name || name.trim().length < 2) errors.name = 'Please enter your name.';
  if (!whatsappNumber || !PHONE_RE.test(whatsappNumber.trim()))
    errors.whatsappNumber = 'Enter a valid 10-digit Indian mobile number.';
  if (!email || !EMAIL_RE.test(email.trim())) errors.email = 'Enter a valid email address.';
  if (!message || message.trim().length < 10)
    errors.message = 'Tell us a bit more (at least 10 characters).';
  return errors;
};

const initialForm = { name: '', whatsappNumber: '', email: '', message: '' };

const fieldClass = (hasError) =>
  `w-full rounded-xl border px-4 py-3 text-[15px] text-foreground transition placeholder:text-foreground/45 focus:outline-none focus:ring-2 focus:ring-secondary ${
    hasError ? 'border-red-400 bg-red-50/50' : 'border-[#d0e2f0] bg-white'
  }`;

export default function ContactForm() {
  const [formData, setFormData] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [serverDetails, setServerDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    if (serverError) setServerError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm(formData);
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setServerError(null);
    setServerDetails(null);
    setLoading(true);

    const result = await submitContactForm({ ...formData, source: 'contact-form' });

    setLoading(false);
    if (result.success) {
      setSubmitted(true);
      setFormData(initialForm);
      setTimeout(() => setSubmitted(false), 6000);
    } else {
      setServerError(result.message);
      setServerDetails(result.details || null);
    }
  };

  const labelClass = 'mb-2 block text-sm font-semibold tracking-tight text-foreground';

  return (
    <div className="w-full rounded-2xl border border-[#dceaf5] bg-white p-6 shadow-md ring-1 ring-primary/[0.04] md:rounded-3xl md:p-8">
      <h2 className="mb-2 text-2xl font-bold text-primary md:text-3xl">Quick enquiry</h2>
      <p className="mb-8 max-w-2xl text-sm leading-relaxed text-foreground/80 md:text-[15px]">
        Share your requirements — our team will reply with options. Include destination, dates, number of days, number of
        people, tentative budget, and any specific needs.
      </p>

      {submitted && (
        <div className="mb-6 rounded-xl border border-[#2E7D32]/35 bg-[#e8f5e9] px-4 py-3 md:px-5 md:py-4">
          <p className="font-semibold text-[#1B5E20]">Thank you — we&apos;ve received your message.</p>
          <p className="mt-1 text-sm text-foreground/75">Our team will get back to you shortly.</p>
        </div>
      )}

      {serverError && (
        <div className="mb-6 rounded-xl border border-red-300 bg-red-50 px-4 py-3 md:px-5 md:py-4" role="alert">
          <p className="font-semibold text-red-700">{serverError}</p>
          {serverDetails && (
            <ul className="mt-2 list-inside list-disc space-y-0.5 text-sm text-red-700/90">
              {serverDetails.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 gap-5 md:gap-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-5">
          <div className="min-w-0">
            <label htmlFor="name" className={labelClass}>
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Your full name"
              aria-invalid={Boolean(fieldErrors.name)}
              className={fieldClass(Boolean(fieldErrors.name))}
            />
            {fieldErrors.name && <p className="mt-1.5 text-xs text-red-600">{fieldErrors.name}</p>}
          </div>

          <div className="min-w-0">
            <label htmlFor="whatsappNumber" className={labelClass}>
              WhatsApp number *
            </label>
            <input
              type="tel"
              id="whatsappNumber"
              name="whatsappNumber"
              value={formData.whatsappNumber}
              onChange={handleChange}
              required
              placeholder="+91 98765 43210"
              aria-invalid={Boolean(fieldErrors.whatsappNumber)}
              className={fieldClass(Boolean(fieldErrors.whatsappNumber))}
            />
            {fieldErrors.whatsappNumber && (
              <p className="mt-1.5 text-xs text-red-600">{fieldErrors.whatsappNumber}</p>
            )}
          </div>
        </div>

        <div className="min-w-0">
          <label htmlFor="email" className={labelClass}>
            Email address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="you@example.com"
            aria-invalid={Boolean(fieldErrors.email)}
            className={fieldClass(Boolean(fieldErrors.email))}
          />
          {fieldErrors.email && <p className="mt-1.5 text-xs text-red-600">{fieldErrors.email}</p>}
        </div>

        <div className="min-w-0">
          <label htmlFor="message" className={labelClass}>
            Your message *
          </label>
          <p className="mb-2 text-xs leading-relaxed text-foreground/60">
            Destination, dates, number of days, number of people, tentative budget, and any specific requirements.
          </p>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            placeholder="e.g. Sikkim–Darjeeling, June 2026, 6 days, 2 adults, budget around ₹50,000…"
            rows={6}
            aria-invalid={Boolean(fieldErrors.message)}
            className={`${fieldClass(Boolean(fieldErrors.message))} resize-none leading-relaxed`}
          />
          {fieldErrors.message && <p className="mt-1.5 text-xs text-red-600">{fieldErrors.message}</p>}
        </div>

        <div className="pt-1">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-cta px-6 py-3.5 text-base font-bold text-primary transition hover:bg-[#E76F51] hover:text-white disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600 sm:w-auto sm:min-w-[12rem]"
          >
            {loading ? 'Sending…' : 'Send message'}
          </button>
        </div>
      </form>
    </div>
  );
}
