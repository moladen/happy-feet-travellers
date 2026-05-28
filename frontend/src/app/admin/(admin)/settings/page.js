"use client";

import { useEffect, useState } from "react";
import PageTransition from "@/components/admin/PageTransition";
import { CardSection, Field, TextArea, TextInput } from "@/components/admin/AdminFields";
import { buildSettingsPayload, emptySettings, normaliseSettings } from "@/lib/admin-data";
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

  // Users sometimes paste extra characters like ":" or ";" before the URL.
  const cleaned = raw.replace(/^[\s;:]+/, "");
  if (!cleaned) return "";

  // If user pasted "instagram.com/..." without scheme, auto-fix to https://
  const looksLikeDomain =
    /^[\w-]+\.[a-z]{2,}([/].*)?$/i.test(cleaned) || cleaned.startsWith("www.");
  if (!/^https?:\/\//i.test(cleaned) && looksLikeDomain) {
    return `https://${cleaned}`;
  }

  return cleaned;
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
      setForm(normaliseSettings(result.data));
    })();

    return () => {
      active = false;
    };
  }, []);

  const showMessage = (text, error = false) => {
    setMessage(text);
    setIsError(error);
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

      <CardSection
        title="Website settings"
        description="Footer contact details, social links, and payment URL — saved to the database and shown on the public site."
      >
        {loading ? (
          <p className="text-sm text-[#6c8094]">Loading settings…</p>
        ) : (
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              setMessage("");

              if (!isValidEmail(form.email)) {
                showMessage("Enter a valid email address or leave the field empty.", true);
                return;
              }

              const payloadForm = {
                ...form,
                instagramUrl: normalizeHttpUrl(form.instagramUrl),
                facebookUrl: normalizeHttpUrl(form.facebookUrl),
                youtubeUrl: normalizeHttpUrl(form.youtubeUrl),
                paymentLink: normalizeHttpUrl(form.paymentLink),
              };

              for (const [label, value] of [
                ["Instagram URL", payloadForm.instagramUrl],
                ["Facebook URL", payloadForm.facebookUrl],
                ["YouTube URL", payloadForm.youtubeUrl],
                ["Payment link", payloadForm.paymentLink],
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
                setForm(normaliseSettings(result.data));
                showMessage(result.message || "Settings saved successfully.", false);
              } else {
                showMessage(result.message || "Could not save settings.", true);
              }
            }}
            className="space-y-6"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="WhatsApp number" hint="10-digit or +91 format">
                <TextInput
                  value={form.whatsappNumber}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, whatsappNumber: event.target.value }))
                  }
                  placeholder="9876543210 or +91 9876543210"
                />
              </Field>
              <Field label="Email">
                <TextInput
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
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

            <div className="grid gap-5 lg:grid-cols-2">
              <Field label="Office address">
                <TextArea
                  rows={4}
                  value={form.officeAddress}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, officeAddress: event.target.value }))
                  }
                />
              </Field>
              <Field label="Payment link">
                <TextInput
                  value={form.paymentLink}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, paymentLink: event.target.value }))
                  }
                  placeholder="https://..."
                />
              </Field>
            </div>

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

            <div className="sticky bottom-4 z-20 rounded-[28px] border border-white/70 bg-white/92 p-4 shadow-[0_28px_60px_-30px_rgba(11,24,38,0.45)] backdrop-blur-xl">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#17324d]">Keep public contact details consistent everywhere.</p>
                  <p className="mt-1 text-sm text-[#6c8094]">
                    Changes apply to the site footer, WhatsApp button, and social icons after save.
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
      </CardSection>
    </PageTransition>
  );
}
