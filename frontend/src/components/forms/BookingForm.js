'use client';

import { useEffect, useState } from 'react';
import { submitContactForm } from '@/services/api';
import { resolveFormErrorMessage, USER_MESSAGES } from '@/lib/userMessages';
import {
  agesWithinInsuranceRange,
  parseTravellerAges,
  TRAVEL_INSURANCE_MAX_AGE,
  TRAVEL_INSURANCE_PRICE_INR,
} from '@/lib/travelInsurance';

const PHONE_RE = /^(?:\+?91[\s-]?)?[6-9]\d{9}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function buildTravelMessage(form) {
  const lines = [
    `Tentative travel dates: ${form.travelDates.trim()}`,
    `No. of Adults: ${form.adults}`,
  ];
  const kids = Number(form.kids) || 0;
  if (kids > 0) {
    const agePart = form.kidAges.trim() ? ` (ages: ${form.kidAges.trim()})` : '';
    lines.push(`No. of Kids: ${kids}${agePart}`);
  } else {
    lines.push('No. of Kids: 0');
  }
  lines.push(`Tentative budget: ${form.budget.trim()}`);
  if (form.travelInsurance) {
    lines.push(
      `Travel insurance: Yes (+₹${TRAVEL_INSURANCE_PRICE_INR} per person — to be added in final quotation, not charged online)`
    );
  }
  if (form.additionalNotes.trim()) {
    lines.push(`Additional notes: ${form.additionalNotes.trim()}`);
  }
  return lines.join('\n');
}

const validateForm = (data) => {
  const errors = {};
  if (!data.name?.trim() || data.name.trim().length < 2) errors.name = 'Please enter your name.';

  const phoneValue = data.whatsappNumber?.trim() || '';
  if (!PHONE_RE.test(phoneValue)) {
    errors.whatsappNumber = 'Enter a valid 10-digit Indian WhatsApp number.';
  }

  if (data.email?.trim() && !EMAIL_RE.test(data.email.trim())) {
    errors.email = 'Enter a valid email address, or leave blank.';
  }

  if (!data.destination?.trim() || data.destination.trim().length < 2) {
    errors.destination = 'Please tell us where you are thinking of travelling.';
  }

  if (!data.travelDates?.trim() || data.travelDates.trim().length < 2) {
    errors.travelDates = 'Please share your tentative travel dates.';
  }

  if (!Number(data.adults) || Number(data.adults) < 1) {
    errors.adults = 'At least 1 adult is required.';
  }

  const kids = Number(data.kids);
  if (data.kids !== '' && (Number.isNaN(kids) || kids < 0)) {
    errors.kids = 'Enter a valid number of kids, or 0.';
  }
  if (kids > 0 && !data.kidAges?.trim()) {
    errors.kidAges = 'Please specify the age(s) of the kids.';
  }

  if (!data.budget?.trim() || data.budget.trim().length < 2) {
    errors.budget = 'Please share your tentative budget.';
  }

  if (data.travelInsurance) {
    const kids = Number(data.kids) || 0;
    const kidAges = parseTravellerAges(data.kidAges);
    if (kids > 0 && kidAges.length && !agesWithinInsuranceRange(kidAges)) {
      errors.travelInsurance = `Travel insurance is available for ages 0–${TRAVEL_INSURANCE_MAX_AGE} years only.`;
    }
  }

  return errors;
};

const initialForm = {
  name: '',
  whatsappNumber: '',
  email: '',
  destination: '',
  travelDates: '',
  adults: '2',
  kids: '0',
  kidAges: '',
  budget: '',
  travelInsurance: false,
  additionalNotes: '',
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

export default function BookingForm({ variant = 'default', headingId }) {
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
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    if (serverError) setServerError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || submitted) return;

    const errors = validateForm(formData);
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setServerError(null);
    setLoading(true);

    const insuranceRequested = Boolean(formData.travelInsurance);

    try {
      const result = await submitContactForm({
        name: formData.name,
        whatsappNumber: formData.whatsappNumber,
        email: formData.email || undefined,
        destination: formData.destination.trim(),
        travelInsuranceRequested: insuranceRequested,
        message: buildTravelMessage(formData),
        source: isReach ? 'booking-form' : 'booking-form',
        website: formData.website,
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

  const showLabel = !isReach;

  return (
    <div className={shellClass}>
      {isReach ? (
        <>
          <h2 id={headingId} className="section-title mb-2 text-2xl leading-tight sm:text-3xl md:text-[2rem]">
            <span className="text-cta">Reach</span>
            <span className="text-primary"> &amp; Get in Touch With Us!</span>
          </h2>
          <p className="mb-6 max-w-md text-sm leading-relaxed text-foreground/75 md:mb-8 md:text-[15px]">
            Questions about a departure or a customized trip? Share your destination and travel details — we usually
            reply within a few hours on WhatsApp.
          </p>
        </>
      ) : (
        <>
          <h2 className="mb-2 text-2xl font-bold text-primary md:text-3xl">Booking form</h2>
          <p className="mb-8 max-w-2xl text-sm leading-relaxed text-foreground/80 md:text-[15px]">
            Tell us where you want to go and your travel details. Our team will draft package options and get back to
            you on WhatsApp.
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
            Our team has been notified and will get back to you shortly on WhatsApp.
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
            {showLabel && (
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
              placeholder={isReach ? 'Your name *' : 'Your full name'}
              aria-invalid={Boolean(fieldErrors.name)}
              className={fieldClass(Boolean(fieldErrors.name), variant)}
            />
            {fieldErrors.name && <p className="mt-1.5 text-xs text-red-600">{fieldErrors.name}</p>}
          </div>

          <div className="min-w-0">
            {showLabel && (
              <label htmlFor="whatsappNumber" className={labelClass}>
                WhatsApp number *
              </label>
            )}
            <input
              type="tel"
              id="whatsappNumber"
              name="whatsappNumber"
              value={formData.whatsappNumber}
              onChange={handleChange}
              required
              placeholder={isReach ? 'WhatsApp number * (10 digits)' : '+91 98765 43210'}
              aria-invalid={Boolean(fieldErrors.whatsappNumber)}
              className={fieldClass(Boolean(fieldErrors.whatsappNumber), variant)}
            />
            {fieldErrors.whatsappNumber && (
              <p className="mt-1.5 text-xs text-red-600">{fieldErrors.whatsappNumber}</p>
            )}
          </div>

          <div className="min-w-0">
            {showLabel && (
              <label htmlFor="email" className={labelClass}>
                Email address <span className="font-normal text-foreground/55">(optional)</span>
              </label>
            )}
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={isReach ? 'Email address (optional)' : 'you@example.com (optional)'}
              aria-invalid={Boolean(fieldErrors.email)}
              className={fieldClass(Boolean(fieldErrors.email), variant)}
            />
            {fieldErrors.email && <p className="mt-1.5 text-xs text-red-600">{fieldErrors.email}</p>}
          </div>

          <div className="min-w-0">
            {showLabel && (
              <label htmlFor="destination" className={labelClass}>
                Destination *
              </label>
            )}
            <input
              type="text"
              id="destination"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              required
              placeholder={isReach ? 'Where are you thinking of travelling? *' : 'e.g. Rann of Kutch, Sikkim, Kerala…'}
              aria-invalid={Boolean(fieldErrors.destination)}
              className={fieldClass(Boolean(fieldErrors.destination), variant)}
            />
            {fieldErrors.destination && <p className="mt-1.5 text-xs text-red-600">{fieldErrors.destination}</p>}
          </div>

          <div className="min-w-0 rounded-2xl border border-[#e5ddd0]/80 bg-white/60 p-4 md:p-5">
            <p className="text-sm font-semibold text-foreground">
              Please specify the below details of your travel: *
            </p>

            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="travelDates" className="mb-1.5 block text-xs font-semibold text-foreground/80">
                  Tentative travel dates *
                </label>
                <input
                  type="text"
                  id="travelDates"
                  name="travelDates"
                  value={formData.travelDates}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 15–20 June 2026, or flexible in July"
                  aria-invalid={Boolean(fieldErrors.travelDates)}
                  className={fieldClass(Boolean(fieldErrors.travelDates), variant)}
                />
                {fieldErrors.travelDates && (
                  <p className="mt-1.5 text-xs text-red-600">{fieldErrors.travelDates}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="adults" className="mb-1.5 block text-xs font-semibold text-foreground/80">
                    No. of Adults *
                  </label>
                  <input
                    type="number"
                    id="adults"
                    name="adults"
                    min="1"
                    value={formData.adults}
                    onChange={handleChange}
                    required
                    aria-invalid={Boolean(fieldErrors.adults)}
                    className={fieldClass(Boolean(fieldErrors.adults), variant)}
                  />
                  {fieldErrors.adults && <p className="mt-1.5 text-xs text-red-600">{fieldErrors.adults}</p>}
                </div>
                <div>
                  <label htmlFor="kids" className="mb-1.5 block text-xs font-semibold text-foreground/80">
                    No. of Kids
                  </label>
                  <input
                    type="number"
                    id="kids"
                    name="kids"
                    min="0"
                    value={formData.kids}
                    onChange={handleChange}
                    aria-invalid={Boolean(fieldErrors.kids)}
                    className={fieldClass(Boolean(fieldErrors.kids), variant)}
                  />
                  {fieldErrors.kids && <p className="mt-1.5 text-xs text-red-600">{fieldErrors.kids}</p>}
                </div>
              </div>

              {Number(formData.kids) > 0 ? (
                <div>
                  <label htmlFor="kidAges" className="mb-1.5 block text-xs font-semibold text-foreground/80">
                    Kids&apos; ages *
                  </label>
                  <input
                    type="text"
                    id="kidAges"
                    name="kidAges"
                    value={formData.kidAges}
                    onChange={handleChange}
                    placeholder="e.g. 8 years, 12 years"
                    aria-invalid={Boolean(fieldErrors.kidAges)}
                    className={fieldClass(Boolean(fieldErrors.kidAges), variant)}
                  />
                  {fieldErrors.kidAges && <p className="mt-1.5 text-xs text-red-600">{fieldErrors.kidAges}</p>}
                </div>
              ) : null}

              <div>
                <label htmlFor="budget" className="mb-1.5 block text-xs font-semibold text-foreground/80">
                  Tentative budget *
                </label>
                <input
                  type="text"
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  required
                  placeholder="e.g. ₹25,000 per person, or ₹1,20,000 total"
                  aria-invalid={Boolean(fieldErrors.budget)}
                  className={fieldClass(Boolean(fieldErrors.budget), variant)}
                />
                {fieldErrors.budget && <p className="mt-1.5 text-xs text-red-600">{fieldErrors.budget}</p>}
              </div>

              <div className="rounded-xl border border-[#dceaf5] bg-[#f8fbff] px-4 py-3.5">
                <label htmlFor="travelInsurance" className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    id="travelInsurance"
                    name="travelInsurance"
                    checked={formData.travelInsurance}
                    onChange={handleChange}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#d0e2f0] text-primary focus:ring-2 focus:ring-secondary/40"
                  />
                  <span className="min-w-0">
                    <span className="text-sm font-semibold text-foreground">
                      Travel Insurance (+₹{TRAVEL_INSURANCE_PRICE_INR})
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-foreground/65">
                      Optional. Available for travellers aged 0–{TRAVEL_INSURANCE_MAX_AGE} years. The amount will be
                      added to your final quotation — not charged online.
                    </span>
                  </span>
                </label>
                {fieldErrors.travelInsurance ? (
                  <p className="mt-2 text-xs text-red-600">{fieldErrors.travelInsurance}</p>
                ) : null}
              </div>

              <div>
                <label htmlFor="additionalNotes" className="mb-1.5 block text-xs font-semibold text-foreground/80">
                  Anything else we should know? <span className="font-normal text-foreground/55">(optional)</span>
                </label>
                <textarea
                  id="additionalNotes"
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Hotel preference, must-see places, flight already booked, etc."
                  className={`${fieldClass(false, variant)} resize-none leading-relaxed`}
                />
              </div>
            </div>
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
              {loading ? 'Sending…' : submitted ? 'Sent' : 'Send Enquiry'}
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
}
