'use client';

import { useState } from 'react';
import { submitContactForm } from '@/services/api';
import { resolveFormErrorMessage, USER_MESSAGES } from '@/lib/userMessages';
import { isValidIndianPhone, normalizeIndianPhone } from '@/lib/indianPhone';
import { PACKAGE_INTEREST_LABELS, RANN_SEASON_TITLE } from '@/lib/rannSeasonContent';

const MONTH_OPTIONS = [
  'November 2026',
  'December 2026',
  'January 2027',
  'February 2027',
  'March 2027',
  'Flexible',
];

const initialData = {
  name: '',
  city: '',
  mobile: '',
  preferredMonth: '',
  interestedIn: '',
  adults: '2',
  kids: '0',
  kidAges: '',
  website: '',
};

function validateForm(data) {
  const errors = {};
  if (!data.name.trim() || data.name.trim().length < 2) {
    errors.name = 'Please enter your name.';
  }
  if (!isValidIndianPhone(data.mobile)) {
    errors.mobile = 'Enter a valid 10-digit WhatsApp number (e.g. 98765 43210).';
  }
  if (!data.interestedIn) {
    errors.interestedIn = 'Please select a package or journey type.';
  }
  if (!Number(data.adults) || Number(data.adults) < 1) {
    errors.adults = 'At least 1 adult is required.';
  }
  return errors;
}

function buildWhatsAppMessage(formData, landingPageTitle) {
  const travellerSummary = [
    `Adults: ${formData.adults}`,
    Number(formData.kids) > 0 ? `Kids: ${formData.kids}` : null,
    formData.kidAges.trim() ? `Kid ages: ${formData.kidAges.trim()}` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return [
    `${landingPageTitle} — Priority Interest`,
    `Name: ${formData.name.trim()}`,
    `City: ${formData.city.trim() || 'Not provided'}`,
    `WhatsApp: ${normalizeIndianPhone(formData.mobile)}`,
    `Preferred month: ${formData.preferredMonth || 'Flexible'}`,
    `Interested in: ${formData.interestedIn}`,
    `Travellers: ${travellerSummary}`,
  ].join('\n');
}

/**
 * @param {{ whatsappChatHref: string; whatsappGroupHref: string }} props
 */
export default function RannPriorityForm({
  whatsappChatHref,
  whatsappGroupHref,
  landingPageId,
  landingPageTitle = RANN_SEASON_TITLE,
  packageOptions = PACKAGE_INTEREST_LABELS,
  defaultPackage = '',
  successMessage: successMessageProp,
}) {
  const options = packageOptions?.length ? packageOptions : PACKAGE_INTEREST_LABELS;
  const [formData, setFormData] = useState({ ...initialData, interestedIn: defaultPackage });
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [whatsappFallbackHref, setWhatsappFallbackHref] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    if (error) setError('');
    if (whatsappFallbackHref) setWhatsappFallbackHref('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;

    const errors = validateForm(formData);
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setLoading(true);
    setError('');
    setWhatsappFallbackHref('');

    try {
      const message = buildWhatsAppMessage(formData, landingPageTitle);
      const mobile = normalizeIndianPhone(formData.mobile);

      const result = await submitContactForm({
        name: formData.name.trim(),
        whatsappNumber: mobile,
        subject: `Rann Priority - ${formData.interestedIn}`,
        destination: landingPageTitle,
        landingPageId: landingPageId || undefined,
        message,
        source: landingPageId ? `landing-page:${landingPageId}` : 'rann-landing-priority-form',
        website: formData.website,
      });

      if (result?.success) {
        setSuccess(true);
        setFormData({ ...initialData, interestedIn: defaultPackage });
        window.setTimeout(() => {
          window.location.href = whatsappChatHref;
        }, 2200);
        return;
      }

      setError(resolveFormErrorMessage(result));
      setWhatsappFallbackHref(whatsappChatHref);
    } catch {
      setError(USER_MESSAGES.formSubmitFailed);
      setWhatsappFallbackHref(whatsappChatHref);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (hasError) =>
    `w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:ring-2 ${
      hasError
        ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
        : 'border-[#d9cbb4] focus:border-[#1f4e79] focus:ring-[#1f4e79]/20'
    }`;

  if (success) {
    return (
      <div
        className="rounded-3xl border border-[#a5d6a7] bg-[#e8f5e9] p-6 text-center shadow-sm sm:p-8"
        role="status"
        aria-live="polite"
      >
        <h2 className="font-display text-2xl font-bold text-[#1b5e20]">You&apos;re on the priority list!</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-foreground/80">
          {successMessageProp ||
            'Thank you — your request is received. Redirecting you to WhatsApp so our travel expert can share batch calendars and early-bird options.'}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <a
            href={whatsappChatHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex rounded-xl bg-[#25D366] px-5 py-3 text-sm font-bold text-white transition hover:brightness-110"
          >
            Continue on WhatsApp
          </a>
          <a
            href={whatsappGroupHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex rounded-xl border border-[#25D366]/45 bg-white px-5 py-3 text-sm font-bold text-[#128C7E] transition hover:bg-[#25D366]/10"
          >
            Join WhatsApp Priority Group
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      id="priority-interest"
      className="scroll-mt-28 rounded-3xl border border-[#e5d4bc] bg-[#fffaf1] p-5 shadow-[0_20px_50px_-35px_rgba(26,43,60,0.45)] sm:p-7"
    >
      <h2 className="font-display text-2xl font-bold text-primary md:text-[2rem]">Get Priority Access</h2>
      <p className="mt-2 text-sm text-foreground/75">
        {landingPageTitle} — share your travel intent and get first access to batch calendars, pricing, and confirmation
        support.
      </p>

      {error ? (
        <div className="mt-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p>{error}</p>
          {whatsappFallbackHref ? (
            <a
              href={whatsappFallbackHref}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex font-semibold text-[#128C7E] underline underline-offset-2"
            >
              Continue on WhatsApp anyway →
            </a>
          ) : null}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-5 grid gap-4 md:grid-cols-2" noValidate>
        <div>
          <label htmlFor="rann-name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-foreground/70">
            Name *
          </label>
          <input id="rann-name" name="name" value={formData.name} onChange={handleChange} className={inputClass(fieldErrors.name)} />
          {fieldErrors.name ? <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p> : null}
        </div>

        <div>
          <label htmlFor="rann-city" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-foreground/70">
            City
          </label>
          <input id="rann-city" name="city" value={formData.city} onChange={handleChange} className={inputClass(false)} />
        </div>

        <div>
          <label htmlFor="rann-mobile" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-foreground/70">
            WhatsApp Number *
          </label>
          <input
            id="rann-mobile"
            name="mobile"
            type="tel"
            value={formData.mobile}
            onChange={handleChange}
            className={inputClass(fieldErrors.mobile)}
            placeholder="98765 43210"
          />
          {fieldErrors.mobile ? <p className="mt-1 text-xs text-red-600">{fieldErrors.mobile}</p> : null}
        </div>

        <div>
          <label htmlFor="rann-month" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-foreground/70">
            Preferred Travel Month
          </label>
          <select id="rann-month" name="preferredMonth" value={formData.preferredMonth} onChange={handleChange} className={inputClass(false)}>
            <option value="">Select month</option>
            {MONTH_OPTIONS.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="rann-package" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-foreground/70">
            Interested In *
          </label>
          <select
            id="rann-package"
            name="interestedIn"
            value={formData.interestedIn}
            onChange={handleChange}
            className={inputClass(fieldErrors.interestedIn)}
          >
            <option value="">Select package or journey type</option>
            {options.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          {fieldErrors.interestedIn ? <p className="mt-1 text-xs text-red-600">{fieldErrors.interestedIn}</p> : null}
        </div>

        <div>
          <label htmlFor="rann-adults" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-foreground/70">
            Adults *
          </label>
          <input
            id="rann-adults"
            name="adults"
            type="number"
            min="1"
            max="30"
            value={formData.adults}
            onChange={handleChange}
            className={inputClass(fieldErrors.adults)}
          />
          {fieldErrors.adults ? <p className="mt-1 text-xs text-red-600">{fieldErrors.adults}</p> : null}
        </div>

        <div>
          <label htmlFor="rann-kids" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-foreground/70">
            Kids
          </label>
          <input
            id="rann-kids"
            name="kids"
            type="number"
            min="0"
            max="15"
            value={formData.kids}
            onChange={handleChange}
            className={inputClass(false)}
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="rann-kid-ages" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-foreground/70">
            Kid Ages (if any)
          </label>
          <input
            id="rann-kid-ages"
            name="kidAges"
            value={formData.kidAges}
            onChange={handleChange}
            className={inputClass(false)}
            placeholder="e.g. 6, 9"
          />
        </div>

        <div className="hidden" aria-hidden>
          <input name="website" value={formData.website} onChange={handleChange} tabIndex={-1} autoComplete="off" />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-xl bg-cta px-5 py-3.5 text-sm font-bold text-white transition hover:bg-cta-hover disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Submitting…' : 'Get Priority Access'}
          </button>
          <p className="mt-2 text-center text-xs text-foreground/55">
            After submit, you&apos;ll be redirected to WhatsApp with your details.
          </p>
        </div>
      </form>
    </div>
  );
}
