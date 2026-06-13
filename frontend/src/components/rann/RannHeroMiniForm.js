'use client';

import { useState } from 'react';
import Link from 'next/link';
import { submitContactForm } from '@/services/api';
import { isValidIndianPhone, normalizeIndianPhone } from '@/lib/indianPhone';
import { RANN_PRIORITY_MONTH_OPTIONS, RANN_SEASON_TITLE } from '@/lib/rannSeasonContent';
import { resolveFormErrorMessage, USER_MESSAGES } from '@/lib/userMessages';

function buildMiniMessage({ name, mobile, preferredMonth }, landingPageTitle) {
  return [
    `${landingPageTitle} — Priority Interest (hero form)`,
    `Name: ${name.trim()}`,
    `WhatsApp: ${normalizeIndianPhone(mobile)}`,
    `Preferred month: ${preferredMonth || 'Flexible'}`,
    'Package interest: To be confirmed on WhatsApp',
    'Travellers: Adults: 2',
  ].join('\n');
}

/**
 * Compact priority capture form for the Rann hero — submits without scrolling.
 */
export default function RannHeroMiniForm({
  landingPageId,
  landingPageTitle = RANN_SEASON_TITLE,
  whatsappChatHref,
  successMessage,
}) {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [preferredMonth, setPreferredMonth] = useState('');
  const [website, setWebsite] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const inputClass = (hasError) =>
    `w-full rounded-xl border bg-white/95 px-3.5 py-2.5 text-sm text-foreground outline-none transition placeholder:text-foreground/45 focus:ring-2 ${
      hasError
        ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
        : 'border-white/35 focus:border-white/60 focus:ring-white/25'
    }`;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;

    const errors = {};
    if (!name.trim() || name.trim().length < 2) {
      errors.name = 'Please enter your name.';
    }
    if (!isValidIndianPhone(mobile)) {
      errors.mobile = 'Enter a valid 10-digit WhatsApp number.';
    }

    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setLoading(true);
    setError('');

    const normalizedMobile = normalizeIndianPhone(mobile);
    const message = buildMiniMessage({ name, mobile, preferredMonth }, landingPageTitle);

    try {
      const result = await submitContactForm({
        name: name.trim(),
        whatsappNumber: normalizedMobile,
        subject: 'Rann Priority — Hero form',
        destination: landingPageTitle,
        landingPageId: landingPageId || undefined,
        message,
        source: landingPageId ? `landing-page-hero:${landingPageId}` : 'rann-landing-hero-form',
        website,
      });

      if (result?.success) {
        setSuccess(true);
        setName('');
        setMobile('');
        setPreferredMonth('');
        window.setTimeout(() => {
          window.location.href = whatsappChatHref;
        }, 1800);
        return;
      }

      setError(resolveFormErrorMessage(result));
    } catch {
      setError(USER_MESSAGES.formSubmitFailed);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div
        className="rann-hero-mini-form rounded-2xl border border-[#a5d6a7]/60 bg-[#e8f5e9]/95 p-5 text-center shadow-xl backdrop-blur-md sm:p-6"
        role="status"
        aria-live="polite"
      >
        <p className="font-display text-lg font-bold text-[#1b5e20]">You&apos;re on the priority list!</p>
        <p className="mt-2 text-sm leading-relaxed text-foreground/78">
          {successMessage ||
            'Redirecting you to WhatsApp so our team can share batch calendars and early-bird options.'}
        </p>
      </div>
    );
  }

  return (
    <div className="rann-hero-mini-form rann-hero-mini-form--premium rounded-2xl border border-white/20 bg-[#0f1c2e]/72 p-5 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.55)] backdrop-blur-md sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">Quick priority access</p>
      <h2 className="mt-1 font-display text-xl font-bold text-white sm:text-[1.35rem]">Get batch alerts first</h2>
      <p className="mt-1.5 text-sm text-white/78">Name, WhatsApp &amp; preferred month — we reply within hours.</p>

      {error ? (
        <p className="mt-3 rounded-lg border border-red-300/50 bg-red-950/40 px-3 py-2 text-xs text-red-100">{error}</p>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-4 space-y-3" noValidate>
        <div>
          <label htmlFor="rann-hero-name" className="sr-only">
            Name
          </label>
          <input
            id="rann-hero-name"
            name="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setFieldErrors((prev) => ({ ...prev, name: undefined }));
            }}
            placeholder="Your name *"
            autoComplete="name"
            className={inputClass(Boolean(fieldErrors.name))}
          />
          {fieldErrors.name ? <p className="mt-1 text-xs text-red-200">{fieldErrors.name}</p> : null}
        </div>

        <div>
          <label htmlFor="rann-hero-mobile" className="sr-only">
            WhatsApp number
          </label>
          <input
            id="rann-hero-mobile"
            name="mobile"
            type="tel"
            value={mobile}
            onChange={(e) => {
              setMobile(e.target.value);
              setFieldErrors((prev) => ({ ...prev, mobile: undefined }));
            }}
            placeholder="WhatsApp number * (10 digits)"
            autoComplete="tel"
            className={inputClass(Boolean(fieldErrors.mobile))}
          />
          {fieldErrors.mobile ? <p className="mt-1 text-xs text-red-200">{fieldErrors.mobile}</p> : null}
        </div>

        <div>
          <label htmlFor="rann-hero-month" className="sr-only">
            Preferred month
          </label>
          <select
            id="rann-hero-month"
            name="preferredMonth"
            value={preferredMonth}
            onChange={(e) => setPreferredMonth(e.target.value)}
            className={inputClass(false)}
          >
            <option value="">Preferred month</option>
            {RANN_PRIORITY_MONTH_OPTIONS.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <input
          type="text"
          name="website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden
        />

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center rounded-xl bg-cta px-5 py-3.5 text-sm font-bold text-white shadow-[0_12px_28px_-12px_rgba(231,111,81,0.65)] transition hover:bg-cta-hover disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Submitting…' : 'Get Priority Access'}
        </button>
      </form>

      <p className="mt-3 text-center text-xs text-white/55">
        Need to share more details?{' '}
        <Link href="#priority-interest" className="font-semibold text-white/85 underline underline-offset-2 hover:text-white">
          Complete full form
        </Link>
      </p>
    </div>
  );
}
