"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PageTransition from "@/components/admin/PageTransition";
import { AccordionSection, CardSection, Field, TextArea, TextInput } from "@/components/admin/AdminFields";
import { Icon } from "@/components/admin/AdminIcons";
import {
  aboutContentToForm,
  aboutFormToContent,
  emptyAboutForm,
  resolveAboutContent,
} from "@/lib/aboutContent";
import { buildSettingsPayload, normaliseSettings } from "@/lib/admin-data";
import { getSettings, updateSettings } from "@/services/adminService";

export default function AboutPageEditor() {
  const [siteSettings, setSiteSettings] = useState(null);
  const [form, setForm] = useState(emptyAboutForm());
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const result = await getSettings();
      if (!active) return;
      setLoading(false);
      if (!result.success) {
        setMessage(result.message);
        return;
      }
      const settings = normaliseSettings(result.data);
      setSiteSettings(settings);
      setForm(aboutContentToForm(result.data?.aboutPageContent));
    })();
    return () => {
      active = false;
    };
  }, []);

  const updateField = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <PageTransition className="w-full space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#4f7b9d]">
            Website content
          </p>
          <h1 className="mt-1 text-xl font-bold text-[#17324d] md:text-2xl">About Us Page</h1>
          <p className="mt-2 max-w-2xl text-sm text-[#5f6f7f]">
            Edit the public About Us page copy. Team profiles are hidden for now — this section manages the company
            story, mission, services, and trust content only.
          </p>
        </div>
        <Link
          href="/about"
          target="_blank"
          className="inline-flex items-center gap-2 rounded-full border border-[#d8e7f2] bg-white px-4 py-2 text-sm font-semibold text-[#1f4e79] shadow-sm transition hover:border-[#4fa3d1]"
        >
          <Icon name="eye" className="h-4 w-4" />
          Preview About page
        </Link>
      </div>

      {message ? (
        <div className="rounded-[26px] border border-[#f2d4bd] bg-[#fff5eb] px-5 py-4 text-sm text-[#a35a23]">
          {message}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-[26px] border border-[#f5c4c4] bg-[#fff0f0] px-5 py-4 text-sm text-[#9b2c2c]">
          {error}
        </div>
      ) : null}

      {loading ? (
        <CardSection title="Loading…" description="Fetching About Us content">
          <p className="text-sm text-[#6f8295]">Loading page content…</p>
        </CardSection>
      ) : (
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            if (!siteSettings) return;
            setBusy(true);
            setError("");
            const aboutPageContent = aboutFormToContent(form);
            const payload = buildSettingsPayload({
              ...siteSettings,
              aboutPageContent,
            });
            const result = await updateSettings(payload);
            setBusy(false);
            if (!result.success) {
              setError(result.message || "Could not save About Us content.");
              return;
            }
            setSiteSettings(normaliseSettings(result.data));
            setForm(aboutContentToForm(result.data?.aboutPageContent));
            setMessage("About Us page saved — visible on the live site.");
          }}
          className="space-y-5"
        >
          <CardSection
            title="Hero & introduction"
            description="Main heading and opening paragraphs on /about"
          >
            <div className="space-y-4">
              <Field label="Page headline">
                <TextInput
                  value={form.heroTitle}
                  onChange={(e) => updateField("heroTitle", e.target.value)}
                  placeholder="Travel Beyond Destinations"
                />
              </Field>
              <Field
                label="Intro paragraphs"
                hint="Separate paragraphs with a blank line"
              >
                <TextArea
                  rows={8}
                  value={form.introParagraphs}
                  onChange={(e) => updateField("introParagraphs", e.target.value)}
                />
              </Field>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Story image URL">
                  <TextInput
                    value={form.storyImageSrc}
                    onChange={(e) => updateField("storyImageSrc", e.target.value)}
                  />
                </Field>
                <Field label="Story image alt text">
                  <TextInput
                    value={form.storyImageAlt}
                    onChange={(e) => updateField("storyImageAlt", e.target.value)}
                  />
                </Field>
              </div>
            </div>
          </CardSection>

          <CardSection title="Mission & vision">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Mission">
                <TextArea rows={5} value={form.mission} onChange={(e) => updateField("mission", e.target.value)} />
              </Field>
              <Field label="Vision">
                <TextArea rows={5} value={form.vision} onChange={(e) => updateField("vision", e.target.value)} />
              </Field>
            </div>
          </CardSection>

          <CardSection title="What we do">
            <div className="space-y-4">
              <Field label="Group departures">
                <TextArea
                  rows={4}
                  value={form.groupDepartures}
                  onChange={(e) => updateField("groupDepartures", e.target.value)}
                />
              </Field>
              <Field label="Customized holidays">
                <TextArea
                  rows={4}
                  value={form.customizedHolidays}
                  onChange={(e) => updateField("customizedHolidays", e.target.value)}
                />
              </Field>
            </div>
          </CardSection>

          <AccordionSection
            title="Services list"
            description="One service per line"
            defaultOpen={false}
          >
            <Field label="Our services include">
              <TextArea rows={10} value={form.services} onChange={(e) => updateField("services", e.target.value)} />
            </Field>
          </AccordionSection>

          <AccordionSection
            title="How we work"
            description="One item per line: Title | Description"
            defaultOpen={false}
          >
            <Field label="Steps">
              <TextArea rows={8} value={form.howWeWork} onChange={(e) => updateField("howWeWork", e.target.value)} />
            </Field>
          </AccordionSection>

          <AccordionSection
            title="What we care about"
            description="One item per line: Title | Description"
            defaultOpen={false}
          >
            <Field label="Values">
              <TextArea rows={8} value={form.values} onChange={(e) => updateField("values", e.target.value)} />
            </Field>
          </AccordionSection>

          <AccordionSection
            title="Stats, testimonials & why choose us"
            description="By the numbers, guest quotes, and trust bullets"
            defaultOpen={false}
          >
            <div className="space-y-4">
              <Field label="By the numbers" hint="One stat per line: Icon | Value | Label">
                <TextArea rows={6} value={form.stats} onChange={(e) => updateField("stats", e.target.value)} />
              </Field>
              <Field label="What people say" hint="One quote per line">
                <TextArea
                  rows={6}
                  value={form.testimonials}
                  onChange={(e) => updateField("testimonials", e.target.value)}
                />
              </Field>
              <Field label="Why choose us" hint="One bullet per line">
                <TextArea rows={6} value={form.whyChoose} onChange={(e) => updateField("whyChoose", e.target.value)} />
              </Field>
            </div>
          </AccordionSection>

          <CardSection title="Closing call-to-action">
            <div className="space-y-4">
              <Field label="CTA heading">
                <TextInput value={form.ctaTitle} onChange={(e) => updateField("ctaTitle", e.target.value)} />
              </Field>
              <Field label="CTA paragraph">
                <TextArea rows={3} value={form.ctaText} onChange={(e) => updateField("ctaText", e.target.value)} />
              </Field>
              <Field label="Tagline">
                <TextInput value={form.ctaTagline} onChange={(e) => updateField("ctaTagline", e.target.value)} />
              </Field>
            </div>
          </CardSection>

          <div className="rounded-[26px] border border-[#dceaf7] bg-[#f4f9fd] px-5 py-4 text-sm text-[#425264]">
            Preview uses{' '}
            <strong>{resolveAboutContent(aboutFormToContent(form)).heroTitle}</strong> — team/crew sections stay hidden
            on the public site.
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={busy}
              className="rounded-full bg-[#f4a261] px-5 py-3 text-sm font-semibold text-[#17324d] shadow-[0_18px_36px_-24px_rgba(244,162,97,0.9)] transition hover:bg-[#ef9551] disabled:opacity-60"
            >
              {busy ? "Saving…" : "Save About Us page"}
            </button>
          </div>
        </form>
      )}
    </PageTransition>
  );
}
