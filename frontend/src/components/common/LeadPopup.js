'use client';

import { useState, useEffect } from 'react';
import { submitContactForm } from '@/services/api';
import { resolveFormErrorMessage, USER_MESSAGES } from '@/lib/userMessages';
import { isValidIndianPhone, normalizeIndianPhone } from '@/lib/indianPhone';

const STORAGE_KEY = 'hft_lead_popup_dismissed_at';
const SUPPRESSION_MS = 7 * 24 * 60 * 60 * 1000;

export default function LeadPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [fieldError, setFieldError] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let dismissedAt = 0;
    try {
      dismissedAt = parseInt(window.localStorage.getItem(STORAGE_KEY) || '0', 10);
    } catch {
      dismissedAt = 0;
    }
    if (dismissedAt && Date.now() - dismissedAt < SUPPRESSION_MS) return;

    const timer = setTimeout(() => setIsVisible(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const close = () => {
    setIsVisible(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      /* storage might be disabled — that's fine */
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFieldError(null);
    setServerError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setFieldError('Please enter your name.');
      return;
    }
    if (!isValidIndianPhone(formData.phone)) {
      setFieldError('Enter a valid 10-digit Indian mobile number.');
      return;
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      setFieldError('Please add a few more details (at least 10 characters).');
      return;
    }

    if (loading || isSubmitted) return;

    setLoading(true);
    setServerError(null);

    try {
      const result = await submitContactForm({
        name: formData.name,
        whatsappNumber: normalizeIndianPhone(formData.phone),
        email: formData.email.trim() || undefined,
        message: formData.message,
        source: 'lead-popup',
        subject: 'Lead from popup',
      });

      if (result.success) {
        setIsSubmitted(true);
        try {
          window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
        } catch {
          /* noop */
        }
        setTimeout(() => setIsVisible(false), 2200);
      } else {
        setServerError(resolveFormErrorMessage(result));
      }
    } catch {
      setServerError(USER_MESSAGES.formSubmitFailed);
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-primary/20 p-4 backdrop-blur-xl backdrop-saturate-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-popup-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {!isSubmitted ? (
          <>
            <div className="border-b border-gray-200 p-6">
              <h3 id="lead-popup-title" className="mb-2 text-2xl font-bold text-primary">
                Quick enquiry
              </h3>
              <p className="text-foreground/80">
                After a few seconds on our site—drop your name, WhatsApp number and a short message. We&apos;ll reply with
                ideas and pricing.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4 p-6">
              {(fieldError || serverError) && (
                <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700" role="alert">
                  {fieldError || serverError}
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">
                  Email <span className="font-normal text-foreground/60">(optional)</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">Phone number</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="WhatsApp / mobile (10-digit)"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">Message</label>
                <textarea
                  name="message"
                  required
                  rows={3}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="Destination, dates, group size…"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90 transition font-semibold disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Sending…' : 'Send my details'}
                </button>
                <button
                  type="button"
                  onClick={close}
                  className="px-6 py-2 text-foreground hover:text-primary transition"
                >
                  Later
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-primary mb-2">Got it — talk soon!</h3>
            <p className="text-foreground/80">
              We&apos;ll review your details and reach out on WhatsApp within 24 hours with a tailored plan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
