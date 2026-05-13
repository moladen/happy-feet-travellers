"use client";

import { useEffect, useState } from "react";
import PageTransition from "@/components/admin/PageTransition";
import { CardSection, Field, TextArea, TextInput } from "@/components/admin/AdminFields";
import { emptySettings, normaliseSettings } from "@/lib/admin-data";
import { getSettings, updateSettings } from "@/services/adminService";

export default function SettingsPage() {
  const [form, setForm] = useState({ ...emptySettings });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      const result = await getSettings();
      if (!result.success) {
        setMessage(result.message);
        return;
      }
      setForm(normaliseSettings(result.data));
    };

    load();
  }, []);

  return (
    <PageTransition className="space-y-6">
      {message ? (
        <div className="rounded-[26px] border border-[#d9e9d5] bg-[#f3fbf1] px-5 py-4 text-sm text-[#28623b]">
          {message}
        </div>
      ) : null}

      <CardSection
        title="Website settings"
        description="Centralise footer, contact, payment, and social links so the admin panel can control all dynamic website settings."
      >
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            setBusy(true);
            const result = await updateSettings(form);
            setBusy(false);
            setMessage(result.message);
            if (result.success) {
              setForm(normaliseSettings(result.data));
            }
          }}
          className="space-y-6"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="WhatsApp number">
              <TextInput
                value={form.whatsappNumber}
                onChange={(event) =>
                  setForm((current) => ({ ...current, whatsappNumber: event.target.value }))
                }
                placeholder="+91 9876543210"
              />
            </Field>
            <Field label="Email">
              <TextInput
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
              />
            </Field>
            <Field label="Facebook URL">
              <TextInput
                value={form.facebookUrl}
                onChange={(event) =>
                  setForm((current) => ({ ...current, facebookUrl: event.target.value }))
                }
              />
            </Field>
            <Field label="YouTube URL">
              <TextInput
                value={form.youtubeUrl}
                onChange={(event) =>
                  setForm((current) => ({ ...current, youtubeUrl: event.target.value }))
                }
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
                placeholder="Affordable group tours · Trusted local experts"
              />
            </Field>
            <Field label="Footer details">
              <TextArea
                rows={4}
                value={form.footerDetails}
                onChange={(event) =>
                  setForm((current) => ({ ...current, footerDetails: event.target.value }))
                }
                placeholder="Pune-based small-group travel..."
              />
            </Field>
          </div>

          <div className="sticky bottom-4 z-20 rounded-[28px] border border-white/70 bg-white/92 p-4 shadow-[0_28px_60px_-30px_rgba(11,24,38,0.45)] backdrop-blur-xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-[#17324d]">Keep public contact details consistent everywhere.</p>
                <p className="mt-1 text-sm text-[#6c8094]">These settings are ready to feed the public website when wired in.</p>
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
      </CardSection>
    </PageTransition>
  );
}
