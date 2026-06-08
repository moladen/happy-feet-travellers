'use client';

import { useEffect, useState } from 'react';
import { submitContactForm } from '@/services/api';
import { resolveFormErrorMessage, USER_MESSAGES } from '@/lib/userMessages';

const PHONE_RE = /^(?:\+?91[\s-]?)?[6-9]\d{9}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateForm = (data, { requirePhone = true, requireSubject = false } = {}) => {
  const errors = {};
  if (!data.name || data.name.trim().length < 2) errors.name = 'Please enter your name.';
  const phoneValue = data.whatsappNumber?.trim() || '';
  if (requirePhone && !PHONE_RE.test(phoneValue)) {
    errors.whatsappNumber = 'Enter a valid 10-digit Indian mobile number.';
  } else if (!requirePhone && phoneValue && !PHONE_RE.test(phoneValue)) {
    errors.whatsappNumber = 'Enter a valid 10-digit Indian mobile number, or leave blank.';
  }
  if (!data.email || !EMAIL_RE.test(data.email.trim())) errors.email = 'Enter a valid email address.';
  if (requireSubject && (!data.subject || data.subject.trim().length < 2))
    errors.subject = 'Please add a short subject.';
  if (!data.message || data.message.trim().length < 10)
    errors.message = 'Tell us a bit more (at least 10 characters).';
  return errors;
};

const initialForm = {
  name: '',
  whatsappNumber: '',
  email: '',
  subject: '',
  message: '',
  website: '',
};

function fieldClass(hasError, variant) {
  const base =
    'w-full rounded-xl border px-4 py-3.5 text-[15px] text-foreground transition placeholder:text-foreground/50 focus:outline-none focus:ring-2';
  if (variant === 'reach') {
    return `${base} focus:ring-cta/40 ${
      hasError ? 'border-red-400 bg-red-50/60' : 'border-[#e5ddd0] bg-white shadow-sm'
    }`;
  }
  return `${base} focus:ring-secondary ${
    hasError ? 'border-red-400 bg-red-50/50' : 'border-[#d0e2f0] bg-white'
  }`;
}

export default function ContactForm({ variant = 'default', headingId }) {
  const isReach = variant === 'reach';
  const [formData, setFormData] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.location.search) return;
    window.history.replaceState({}, '', window.location.pathname);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    if (serverError) setServerError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || submitted) return;

    const errors = validateForm(formData, {
      requirePhone: !isReach,
      requireSubject: isReach,
    });
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setServerError(null);
    setLoading(true);

    try {
      const result = await submitContactForm({
        ...formData,
        destination: isReach ? formData.subject : formData.subject || undefined,
        source: isReach ? 'contact-page' : 'contact-form',
      });

      if (result.success) {
        setSubmitted(true);
        setFormData(initialForm);
        setTimeout(() => setSubmitted(false), 8000);
      } else {
        setServerError(resolveFormErrorMessage(result));
      }
    } catch {
      setServerError(USER_MESSAGES.formSubmitFailed);
    } finally {
      setLoading(false);
    }
  };

  const labelClass = 'mb-2 block text-sm font-semibold tracking-tight text-foreground';

  const shellClass = isReach
    ? 'flex h-full flex-col justify-center bg-[#faf6ef] p-6 sm:p-8 md:p-10 lg:p-12'
    : 'w-full rounded-2xl border border-[#dceaf5] bg-white p-6 shadow-md ring-1 ring-primary/[0.04] md:rounded-3xl md:p-8';

  return (
    <div className={shellClass}>
      {isReach ? (
        <>
          <h2 id={headingId} className="section-title mb-2 text-2xl leading-tight sm:text-3xl md:text-[2rem]">
            <span className="text-cta">Reach</span>
            <span className="text-primary"> &amp; Get in Touch With Us!</span>
          </h2>
          <p className="mb-6 max-w-md text-sm leading-relaxed text-foreground/75 md:mb-8 md:text-[15px]">
            Questions about a departure, a customized trip, or payment? Send a note — we usually reply within a few
            hours on WhatsApp or email.
          </p>
        </>
      ) : (
        <>
          <h2 className="mb-2 text-2xl font-bold text-primary md:text-3xl">Quick enquiry</h2>
          <p className="mb-8 max-w-2xl text-sm leading-relaxed text-foreground/80 md:text-[15px]">
            Share your requirements — our team will reply with options. Include destination, dates, number of days,
            number of people, tentative budget, and any specific needs.
          </p>
        </>
      )}

      {submitted && (
        <div
          className="mb-6 rounded-xl border border-[#2E7D32]/35 bg-[#e8f5e9] px-4 py-3 md:px-5 md:py-4"
          role="status"
          aria-live="polite"
        >
          <p className="font-semibold text-[#1B5E20]">Thank you — we&apos;ve received your enquiry.</p>
          <p className="mt-1 text-sm text-foreground/75">
            Our team has been notified and will get back to you shortly on WhatsApp or email.
          </p>
        </div>
      )}

      {serverError && (
        <div className="mb-6 rounded-xl border border-red-300 bg-red-50 px-4 py-3 md:px-5 md:py-4" role="alert">
          <p className="font-semibold text-red-700">{serverError}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        noValidate
        method="post"
        action="/contact"
        className="min-w-0"
        aria-busy={loading}
      >
        <fieldset
          disabled={loading || submitted}
          className="grid min-w-0 grid-cols-1 gap-4 border-0 p-0 m-0 md:gap-5 disabled:opacity-90"
        >
        {/* Honeypot — hidden from users, traps bots */}
        <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input
            type="text"
            id="website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={formData.website}
            onChange={handleChange}
          />
        </div>

        <div className="min-w-0">
          {!isReach && (
            <label htmlFor="name" className={labelClass}>
              Name *
            </label>
          )}
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder={isReach ? 'Enter Your Name' : 'Your full name'}
            aria-invalid={Boolean(fieldErrors.name)}
            className={fieldClass(Boolean(fieldErrors.name), variant)}
          />
          {fieldErrors.name && <p className="mt-1.5 text-xs text-red-600">{fieldErrors.name}</p>}
        </div>

        <div className="min-w-0">
          {!isReach && (
            <label htmlFor="email" className={labelClass}>
              Email address *
            </label>
          )}
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder={isReach ? 'Your Email Address' : 'you@example.com'}
            aria-invalid={Boolean(fieldErrors.email)}
            className={fieldClass(Boolean(fieldErrors.email), variant)}
          />
          {fieldErrors.email && <p className="mt-1.5 text-xs text-red-600">{fieldErrors.email}</p>}
        </div>

        {isReach ? (
          <div className="min-w-0">
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              placeholder="Add Your Subject"
              aria-invalid={Boolean(fieldErrors.subject)}
              className={fieldClass(Boolean(fieldErrors.subject), variant)}
            />
            {fieldErrors.subject && <p className="mt-1.5 text-xs text-red-600">{fieldErrors.subject}</p>}
          </div>
        ) : null}

        {!isReach ? (
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
              className={fieldClass(Boolean(fieldErrors.whatsappNumber), variant)}
            />
            {fieldErrors.whatsappNumber && (
              <p className="mt-1.5 text-xs text-red-600">{fieldErrors.whatsappNumber}</p>
            )}
          </div>
        ) : (
          <div className="min-w-0">
            <input
              type="tel"
              id="whatsappNumber"
              name="whatsappNumber"
              value={formData.whatsappNumber}
              onChange={handleChange}
              placeholder="WhatsApp number (optional)"
              aria-invalid={Boolean(fieldErrors.whatsappNumber)}
              className={fieldClass(Boolean(fieldErrors.whatsappNumber), variant)}
            />
            {fieldErrors.whatsappNumber && (
              <p className="mt-1.5 text-xs text-red-600">{fieldErrors.whatsappNumber}</p>
            )}
          </div>
        )}

        <div className="min-w-0">
          {!isReach && (
            <>
              <label htmlFor="message" className={labelClass}>
                Your message *
              </label>
              <p className="mb-2 text-xs leading-relaxed text-foreground/60">
                Destination, dates, number of days, number of people, tentative budget, and any specific requirements.
              </p>
            </>
          )}
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            placeholder={isReach ? 'Message' : 'e.g. Sikkim–Darjeeling, June 2026, 6 days, 2 adults…'}
            rows={isReach ? 5 : 6}
            aria-invalid={Boolean(fieldErrors.message)}
            className={`${fieldClass(Boolean(fieldErrors.message), variant)} resize-none leading-relaxed`}
          />
          {fieldErrors.message && <p className="mt-1.5 text-xs text-red-600">{fieldErrors.message}</p>}
        </div>

        <div className="pt-1">
          <button
            type="submit"
            disabled={loading || submitted}
            aria-busy={loading}
            className={
              isReach
                ? 'inline-flex min-w-[10.5rem] items-center justify-center rounded-xl bg-[#22c55e] px-8 py-3.5 text-base font-bold text-white shadow-[0_10px_28px_-8px_rgba(34,197,94,0.55)] transition hover:bg-[#16a34a] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600'
                : 'w-full rounded-xl bg-cta px-6 py-3.5 text-base font-bold text-primary transition hover:bg-cta-hover hover:text-white disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600 sm:w-auto sm:min-w-[12rem]'
            }
          >
            {loading ? 'Sending…' : submitted ? 'Sent' : 'Send Message'}
          </button>
        </div>
        </fieldset>
      </form>
    </div>
  );
}
