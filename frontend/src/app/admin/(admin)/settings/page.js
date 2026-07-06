"use client";

import { useEffect, useState } from "react";
import PageTransition from "@/components/admin/PageTransition";
import { CardSection, Field, TextArea, TextInput } from "@/components/admin/AdminFields";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { buildSettingsPayload, emptySettings, normaliseSettings } from "@/lib/admin-data";
import { isValidIndianPhone } from "@/lib/siteContact";
import {
  DEFAULT_CANCELLATION_HTML,
  DEFAULT_POLICIES_LAST_UPDATED,
  DEFAULT_PRIVACY_HTML,
  DEFAULT_TERMS_HTML,
} from "@/lib/defaultPolicies";
import { getSettings, updateSettings } from "@/services/adminService";

function isValidEmail(value) {
  if (!value.trim()) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isValidUrl(value) {
  if (!value.trim()) return true;
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function normalizeHttpUrl(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return "";

  const cleaned = raw.replace(/^[\s;:]+/, "");
  if (!cleaned) return "";

  const looksLikeDomain =
    /^[\w-]+\.[a-z]{2,}([/].*)?$/i.test(cleaned) || cleaned.startsWith("www.");
  if (!/^https?:\/\//i.test(cleaned) && looksLikeDomain) {
    return `https://${cleaned}`;
  }

  return cleaned;
}

function enrichSettingsForAdmin(payload) {
  const form = normaliseSettings(payload);
  if (!form.termsContent.trim()) form.termsContent = DEFAULT_TERMS_HTML;
  if (!form.privacyContent.trim()) form.privacyContent = DEFAULT_PRIVACY_HTML;
  if (!form.cancellationPolicyContent.trim()) {
    form.cancellationPolicyContent = DEFAULT_CANCELLATION_HTML;
  }
  if (!form.policiesLastUpdated.trim()) {
    form.policiesLastUpdated = DEFAULT_POLICIES_LAST_UPDATED;
  }
  return form;
}

export default function SettingsPage() {
  const [form, setForm] = useState({ ...emptySettings });
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let active = true;

    (async () => {
      const result = await getSettings();
      if (!active) return;
      setLoading(false);
      if (!result.success) {
        setIsError(true);
        setMessage(result.message || "Could not load settings.");
        return;
      }
      setForm(enrichSettingsForAdmin(result.data));
    })();

    return () => {
      active = false;
    };
  }, []);

  const showMessage = (text, error = false) => {
    setMessage(text);
    setIsError(error);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!isValidEmail(form.email)) {
      showMessage("Enter a valid email address or leave the field empty.", true);
      return;
    }

    for (const [label, value] of [
      ["WhatsApp number", form.whatsappNumber],
      ["Second phone number", form.secondaryPhoneNumber],
    ]) {
      if (!isValidIndianPhone(value)) {
        showMessage(`${label} must be a valid 10-digit Indian mobile number, or leave empty.`, true);
        return;
      }
    }

    const payloadForm = {
      ...form,
      instagramUrl: normalizeHttpUrl(form.instagramUrl),
      facebookUrl: normalizeHttpUrl(form.facebookUrl),
      youtubeUrl: normalizeHttpUrl(form.youtubeUrl),
    };

    for (const [label, value] of [
      ["Instagram URL", payloadForm.instagramUrl],
      ["Facebook URL", payloadForm.facebookUrl],
      ["YouTube URL", payloadForm.youtubeUrl],
    ]) {
      if (!isValidUrl(value)) {
        showMessage(`${label} must start with http:// or https://`, true);
        return;
      }
    }

    setBusy(true);
    const payload = buildSettingsPayload(payloadForm);
    const result = await updateSettings(payload);
    setBusy(false);

    if (result.success) {
      setForm(enrichSettingsForAdmin(result.data));
      showMessage(result.message || "Settings saved successfully.", false);
    } else {
      showMessage(result.message || "Could not save settings.", true);
    }
  };

  return (
    <PageTransition className="space-y-6">
      {message ? (
        <div
          className={`rounded-[26px] px-5 py-4 text-sm ${
            isError
              ? "border border-[#f2d4bd] bg-[#fff5eb] text-[#a35a23]"
              : "border border-[#d9e9d5] bg-[#f3fbf1] text-[#28623b]"
          }`}
          role="alert"
        >
          {message}
        </div>
      ) : null}

      {loading ? (
        <CardSection title="Website settings" description="Loading…">
          <p className="text-sm text-[#6c8094]">Loading settings…</p>
        </CardSection>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          <CardSection
            title="Website settings"
            description="Footer contact details and social links — shown on the public site."
          >
            <div className="space-y-6">
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="WhatsApp number" hint="Primary — used for WhatsApp chat buttons site-wide">
                  <TextInput
                    value={form.whatsappNumber}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, whatsappNumber: event.target.value }))
                    }
                    placeholder="9876543210 or +91 9876543210"
                  />
                </Field>
                <Field label="Second phone number" hint="Optional — shown alongside the first on Contact & footer">
                  <TextInput
                    value={form.secondaryPhoneNumber}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, secondaryPhoneNumber: event.target.value }))
                    }
                    placeholder="9123456789 or +91 9123456789"
                  />
                </Field>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Email">
                  <TextInput
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, email: event.target.value }))
                    }
                    placeholder="info@happyfeet.com"
                  />
                </Field>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <Field label="Instagram URL">
                  <TextInput
                    value={form.instagramUrl}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, instagramUrl: event.target.value }))
                    }
                    placeholder="https://instagram.com/..."
                  />
                </Field>
                <Field label="Facebook URL">
                  <TextInput
                    value={form.facebookUrl}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, facebookUrl: event.target.value }))
                    }
                    placeholder="https://facebook.com/..."
                  />
                </Field>
                <Field label="YouTube URL">
                  <TextInput
                    value={form.youtubeUrl}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, youtubeUrl: event.target.value }))
                    }
                    placeholder="https://youtube.com/..."
                  />
                </Field>
              </div>

              <Field label="Office address">
                <TextArea
                  rows={4}
                  value={form.officeAddress}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, officeAddress: event.target.value }))
                  }
                />
              </Field>

              <p className="text-sm text-[#6c8094]">
                UPI QR and bank account details are managed in{" "}
                <a href="/admin/payment" className="font-semibold text-[#1f4e79] underline-offset-2 hover:underline">
                  Admin → Payment
                </a>
                .
              </p>

              <div className="grid gap-5 lg:grid-cols-2">
                <Field label="Footer tagline">
                  <TextInput
                    value={form.footerTagline}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, footerTagline: event.target.value }))
                    }
                    placeholder="Curated group tours across India · Trusted travel experts"
                  />
                </Field>
                <Field label="Footer details">
                  <TextArea
                    rows={4}
                    value={form.footerDetails}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, footerDetails: event.target.value }))
                    }
                    placeholder="Experience-first small-group travel across India..."
                  />
                </Field>
              </div>
            </div>
          </CardSection>

          <CardSection
            title="Footer policy pages"
            description="Terms & Conditions, Privacy Policy, and Cancellation Policy — linked from the site footer."
          >
            <div className="space-y-6">
              <Field label="Policies last updated" hint="Shown on all three policy pages">
                <TextInput
                  value={form.policiesLastUpdated}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, policiesLastUpdated: event.target.value }))
                  }
                  placeholder={DEFAULT_POLICIES_LAST_UPDATED}
                />
              </Field>

              <RichTextEditor
                label="Terms & Conditions"
                helperText="Public page: /policies/terms"
                value={form.termsContent}
                onChange={(html) => setForm((current) => ({ ...current, termsContent: html }))}
              />

              <RichTextEditor
                label="Privacy Policy"
                helperText="Public page: /policies/privacy"
                value={form.privacyContent}
                onChange={(html) => setForm((current) => ({ ...current, privacyContent: html }))}
              />

              <RichTextEditor
                label="Cancellation Policy"
                helperText="Public page: /policies/cancellation"
                value={form.cancellationPolicyContent}
                onChange={(html) =>
                  setForm((current) => ({ ...current, cancellationPolicyContent: html }))
                }
              />
            </div>
          </CardSection>

          <div className="sticky bottom-4 z-20 rounded-[28px] border border-white/70 bg-white/92 p-4 shadow-[0_28px_60px_-30px_rgba(11,24,38,0.45)] backdrop-blur-xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-[#17324d]">Save contact details and policy pages together.</p>
                <p className="mt-1 text-sm text-[#6c8094]">
                  Footer links stay the same; content updates on the public policy pages after save.
                </p>
              </div>
              <button
                type="submit"
                disabled={busy}
                className="rounded-full bg-[#f4a261] px-5 py-3 text-sm font-semibold text-[#17324d] shadow-[0_18px_36px_-24px_rgba(244,162,97,0.9)] transition hover:bg-[#ef9551] disabled:opacity-60"
              >
                {busy ? "Saving..." : "Save settings"}
              </button>
            </div>
          </div>
        </form>
      )}
    </PageTransition>
  );
}
