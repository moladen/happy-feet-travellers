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

  return (
    <div className="w-full rounded-2xl border border-[#eaf4fb] bg-white p-6 shadow-lg md:p-7">
      <h2 className="mb-2 text-3xl font-bold text-primary">Quick enquiry</h2>
      <p className="mb-5 text-sm leading-relaxed text-foreground/80">
        Share your requirements—our team will reply with options. Include destination, dates, number of days, number of
        people, tentative budget, and any specific needs.
      </p>

      {submitted && (
        <div className="mb-6 rounded-lg border border-[#2E7D32]/30 bg-[#e8f5e9] p-4">
          <p className="font-semibold text-[#1B5E20]">Thank you—we&apos;ve received your message.</p>
          <p className="text-sm text-foreground/80">Our team will get back to you shortly.</p>
        </div>
      )}

      {serverError && (
        <div className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4" role="alert">
          <p className="font-semibold text-red-700">{serverError}</p>
          {serverDetails && (
            <ul className="mt-2 list-inside list-disc text-sm text-red-700/90">
              {serverDetails.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-foreground">
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
            className={`w-full rounded-lg border px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-secondary ${
              fieldErrors.name ? 'border-red-400 bg-red-50/40' : 'border-[#d6e4f1]'
            }`}
          />
          {fieldErrors.name && <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>}
        </div>

        <div>
          <label htmlFor="whatsappNumber" className="mb-1.5 block text-sm font-semibold text-foreground">
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
            className={`w-full rounded-lg border px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-secondary ${
              fieldErrors.whatsappNumber ? 'border-red-400 bg-red-50/40' : 'border-[#d6e4f1]'
            }`}
          />
          {fieldErrors.whatsappNumber && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.whatsappNumber}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-foreground">
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
            className={`w-full rounded-lg border px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-secondary ${
              fieldErrors.email ? 'border-red-400 bg-red-50/40' : 'border-[#d6e4f1]'
            }`}
          />
          {fieldErrors.email && <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>}
        </div>

        <div>
          <label htmlFor="message" className="mb-1.5 block text-sm font-semibold text-foreground">
            Your message *
          </label>
          <p className="mb-1.5 text-xs leading-relaxed text-foreground/65">
            Type your requirements: destination, dates, number of days, number of people, tentative budget, specific
            requirements.
          </p>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            placeholder="e.g. Sikkim–Darjeeling, June 2026, 6 days, 2 adults, budget around ₹50,000…"
            rows="6"
            aria-invalid={Boolean(fieldErrors.message)}
            className={`w-full resize-none rounded-lg border px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-secondary ${
              fieldErrors.message ? 'border-red-400 bg-red-50/40' : 'border-[#d6e4f1]'
            }`}
          />
          {fieldErrors.message && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-cta px-6 py-3 font-bold text-primary transition hover:bg-[#E76F51] hover:text-white disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600"
        >
          {loading ? 'Sending…' : 'Send message'}
        </button>
      </form>
    </div>
  );
}
