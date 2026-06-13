'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { submitContactForm } from '@/services/api';
import { downloadGuidePdf, resolveGuidePdfHref } from '@/lib/guidePdf';
import { isValidIndianPhone, normalizeIndianPhone } from '@/lib/indianPhone';
import { resolveFormErrorMessage, USER_MESSAGES } from '@/lib/userMessages';
import { RANN_PLANNING_GUIDE, RANN_SEASON_TITLE } from '@/lib/rannSeasonContent';

/**
 * Gated PDF lead magnet — captures name + WhatsApp before guide download.
 * @param {{ guide?: object; landingPageId?: string; landingPageTitle?: string; priorityHref?: string; whatsappGroupHref?: string }} props
 */
export default function RannGuideLeadMagnet({
  guide = RANN_PLANNING_GUIDE,
  landingPageId,
  landingPageTitle = RANN_SEASON_TITLE,
  priorityHref = '#priority-interest',
  whatsappGroupHref,
}) {
  const content = useMemo(() => ({ ...RANN_PLANNING_GUIDE, ...guide }), [guide]);
  const pdfUrl = content.pdfUrl || RANN_PLANNING_GUIDE.pdfUrl;
  const pdfFileName = content.pdfFileName || RANN_PLANNING_GUIDE.pdfFileName;
  const pdfHref = resolveGuidePdfHref(pdfUrl);

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [website, setWebsite] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const inputClass = (hasError) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-foreground/45 focus:ring-2 ${
      hasError
        ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
        : 'border-[#dceaf5] focus:border-primary focus:ring-primary/15'
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
    setError('');
    setLoading(true);

    const message = [
      `${landingPageTitle} — Planning Guide Download`,
      `Name: ${name.trim()}`,
      `WhatsApp: ${normalizeIndianPhone(mobile)}`,
      `Resource: ${content.title}`,
    ].join('\n');

    try {
      const result = await submitContactForm({
        name: name.trim(),
        whatsappNumber: mobile,
        subject: 'Rann Planning Guide Download',
        destination: landingPageTitle,
        message,
        source: landingPageId ? `rann-planning-guide:${landingPageId}` : 'rann-planning-guide',
        landingPageId: landingPageId?.startsWith?.('static') ? undefined : landingPageId,
        website,
      });

      if (result.success) {
        setSuccess(true);
        await downloadGuidePdf(pdfUrl, pdfFileName);
      } else {
        setError(result.message || USER_MESSAGES.formSubmitFailed);
      }
    } catch (err) {
      setError(resolveFormErrorMessage(err, USER_MESSAGES.formSubmitFailed));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="rann-planning-guide" className="rann-guide-magnet scroll-mt-24 py-12 md:py-16">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rann-guide-magnet__card overflow-hidden rounded-3xl border border-[#dceaf5] bg-gradient-to-br from-[#f8fbff] via-white to-[#fff9f2] shadow-sm">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-0">
            <div className="p-6 md:p-8 lg:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary">{content.eyebrow}</p>
              <h2 className="mt-2 font-display text-2xl font-bold text-primary md:text-3xl">{content.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-foreground/75 md:text-base">{content.lede}</p>
              <ul className="mt-5 space-y-2.5">
                {(content.highlights || []).map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-foreground/80">
                    <span
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#22c55e]/15 text-[11px] font-bold text-[#15803d]"
                      aria-hidden
                    >
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#rann-planning-guide-form"
                  className="inline-flex rounded-xl bg-cta px-5 py-3 text-sm font-bold text-white transition hover:bg-cta-hover"
                >
                  {content.submitLabel}
                </a>
                <Link
                  href={priorityHref}
                  className="inline-flex rounded-xl border border-primary bg-white px-5 py-3 text-sm font-bold text-primary transition hover:bg-section-alt"
                >
                  Get Priority Access
                </Link>
                {whatsappGroupHref ? (
                  <a
                    href={whatsappGroupHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-[#25D366]/40 bg-[#25D366]/10 px-5 py-3 text-sm font-bold text-[#128C7E] transition hover:bg-[#25D366]/18"
                  >
                    Join WhatsApp Updates
                  </a>
                ) : null}
              </div>
            </div>

            <div
              id="rann-planning-guide-form"
              className="border-t border-[#dceaf5] bg-white/80 p-6 md:p-8 lg:border-l lg:border-t-0 lg:p-10"
            >
              {success ? (
                <div className="flex h-full flex-col justify-center">
                  <div className="rounded-2xl border border-[#bbf7d0] bg-[#f0fdf4] p-6 text-center">
                    <p className="font-display text-xl font-bold text-primary">{content.successTitle}</p>
                    <p className="mt-2 text-sm text-foreground/75">
                      Thank you, {name.trim()}. {content.successLede}
                    </p>
                    <a
                      href={pdfHref}
                      download={pdfFileName}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex rounded-xl bg-cta px-5 py-3 text-sm font-bold text-white transition hover:bg-cta-hover"
                    >
                      {content.downloadAgainLabel}
                    </a>
                    <p className="mt-3 text-xs text-foreground/60">
                      PDF did not open?{' '}
                      <a href={pdfHref} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline">
                        Open guide in a new tab
                      </a>
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="font-display text-lg font-bold text-primary">{content.formTitle}</h3>
                  <p className="mt-2 text-sm text-foreground/70">{content.formLede}</p>
                  <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
                    <input
                      type="text"
                      name="website"
                      value={website}
                      onChange={(event) => setWebsite(event.target.value)}
                      className="hidden"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden
                    />
                    <div>
                      <label htmlFor="guide-name" className="mb-1.5 block text-xs font-semibold text-primary">
                        Full name
                      </label>
                      <input
                        id="guide-name"
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        className={inputClass(fieldErrors.name)}
                        placeholder="Your name"
                        autoComplete="name"
                      />
                      {fieldErrors.name ? (
                        <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>
                      ) : null}
                    </div>
                    <div>
                      <label htmlFor="guide-whatsapp" className="mb-1.5 block text-xs font-semibold text-primary">
                        WhatsApp number
                      </label>
                      <input
                        id="guide-whatsapp"
                        type="tel"
                        inputMode="numeric"
                        value={mobile}
                        onChange={(event) => setMobile(event.target.value)}
                        className={inputClass(fieldErrors.mobile)}
                        placeholder="10-digit mobile number"
                        autoComplete="tel"
                      />
                      {fieldErrors.mobile ? (
                        <p className="mt-1 text-xs text-red-600">{fieldErrors.mobile}</p>
                      ) : null}
                    </div>
                    {error ? <p className="text-sm text-red-600">{error}</p> : null}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-xl bg-cta px-5 py-3.5 text-sm font-bold text-white transition hover:bg-cta-hover disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? 'Submitting…' : content.submitLabel}
                    </button>
                    <p className="text-center text-[11px] leading-relaxed text-foreground/55">{content.disclaimer}</p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
