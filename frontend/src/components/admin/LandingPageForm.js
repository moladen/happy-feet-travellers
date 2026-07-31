"use client";

import Link from "next/link";
import { buildLandingPayload, generateSlug, landingStatusOptions } from "@/lib/admin-data";
import { ensureLandingImagesUploaded } from "@/lib/ensureLandingImages";
import ImageUploader from "@/components/admin/ImageUploader";
import {
  LandingBestTimeSection,
  LandingFaqsSection,
  LandingGallerySection,
  LandingGroupBatchesSection,
  LandingPackagesSection,
  LandingPlanningGuideSection,
  LandingTestimonialsSection,
  LandingWhyVisitSection,
} from "@/components/admin/LandingPageContentSections";
import { CardSection, Field, SelectInput, TextArea, TextInput } from "@/components/admin/AdminFields";

export default function LandingPageForm({ form, setForm, onSubmit, busy, mode = "create" }) {
  const updateField = (key, value) => {
    setForm((current) => {
      const next = { ...current, [key]: value };
      if (key === "title") {
        const autoSlug = generateSlug(current.title || "");
        if (!current.slug || current.slug === autoSlug) {
          next.slug = generateSlug(value);
        }
      }
      return next;
    });
  };

  const submit = async (event) => {
    event.preventDefault();
    try {
      const withImages = await ensureLandingImagesUploaded(form);
      await onSubmit(buildLandingPayload(withImages));
    } catch (error) {
      window.alert(error?.message || "Could not prepare images for save.");
    }
  };

  const publicPath = form.slug ? `/${form.slug}` : null;

  return (
    <form onSubmit={submit} className="space-y-6">
      <CardSection
        title={mode === "edit" ? "Edit landing page" : "New landing page"}
        description="Full campaign CMS — hero, packages, gallery, FAQs, and landing-only testimonials."
        actions={
          publicPath ? (
            <Link
              href={publicPath}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-[#d5e1eb] px-4 py-2 text-sm font-semibold text-[#1f4e79] transition hover:border-[#4fa3d1]"
            >
              View live page ↗
            </Link>
          ) : null
        }
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Page title">
            <TextInput required value={form.title} onChange={(e) => updateField("title", e.target.value)} />
          </Field>
          <Field label="URL slug">
            <TextInput required value={form.slug} onChange={(e) => updateField("slug", e.target.value)} />
          </Field>
        </div>
        <div className="mt-5 max-w-xs">
          <Field label="Status">
            <SelectInput value={form.status} onChange={(e) => updateField("status", e.target.value)}>
              {landingStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </SelectInput>
          </Field>
        </div>
      </CardSection>

      <CardSection title="Hero section" description="Headline, banner image, season dates, and trust badges.">
        <div className="space-y-5">
          <Field label="Hero headline">
            <TextInput value={form.heroHeading} onChange={(e) => updateField("heroHeading", e.target.value)} />
          </Field>
          <Field label="Hero subheading">
            <TextArea rows={3} value={form.heroSubheading} onChange={(e) => updateField("heroSubheading", e.target.value)} />
          </Field>
          <ImageUploader
            label="Hero banner image"
            images={form.heroBannerImage}
            onChange={(value) => updateField("heroBannerImage", value)}
          />
          <Field label="Season dates">
            <TextInput value={form.seasonDates} onChange={(e) => updateField("seasonDates", e.target.value)} />
          </Field>
          <Field label="Hero trust badges" hint="One per line">
            <TextArea rows={4} value={form.heroSocialProofText} onChange={(e) => updateField("heroSocialProofText", e.target.value)} />
          </Field>
        </div>
      </CardSection>

      <CardSection title="Introduction">
        <div className="space-y-5">
          <Field label="Section title">
            <TextInput value={form.introTitle} onChange={(e) => updateField("introTitle", e.target.value)} />
          </Field>
          <Field label="Paragraphs" hint="One per line">
            <TextArea rows={5} value={form.introParagraphsText} onChange={(e) => updateField("introParagraphsText", e.target.value)} />
          </Field>
          <Field label="Summary bullets" hint="One per line">
            <TextArea rows={4} value={form.introSummaryText} onChange={(e) => updateField("introSummaryText", e.target.value)} />
          </Field>
        </div>
      </CardSection>

      <LandingPlanningGuideSection form={form} updateField={updateField} />

      <LandingWhyVisitSection whyVisit={form._whyVisit} setForm={setForm} />
      <LandingBestTimeSection form={form} updateField={updateField} />
      <LandingGroupBatchesSection groupBatches={form._groupBatches} setForm={setForm} />
      <LandingPackagesSection packages={form._packages} setForm={setForm} />
      <LandingGallerySection gallerySlides={form._gallerySlides} setForm={setForm} />
      <LandingFaqsSection faqs={form._faqs} setForm={setForm} />
      <LandingTestimonialsSection testimonials={form._testimonials} setForm={setForm} />

      <CardSection title="Calls to action">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Button text">
            <TextInput value={form.ctaButtonText} onChange={(e) => updateField("ctaButtonText", e.target.value)} />
          </Field>
          <Field label="Button link">
            <TextInput value={form.ctaButtonLink} onChange={(e) => updateField("ctaButtonLink", e.target.value)} />
          </Field>
          <Field label="WhatsApp CTA link">
            <TextInput value={form.whatsappCtaLink} onChange={(e) => updateField("whatsappCtaLink", e.target.value)} />
          </Field>
          <Field label="WhatsApp group link">
            <TextInput value={form.whatsappGroupLink} onChange={(e) => updateField("whatsappGroupLink", e.target.value)} />
          </Field>
        </div>
        <label className="mt-5 flex items-center gap-3 text-sm text-[#314559]">
          <input
            type="checkbox"
            checked={Boolean(form.whatsappGroupEnabled)}
            onChange={(e) => updateField("whatsappGroupEnabled", e.target.checked)}
            className="h-4 w-4 rounded border-[#c9dbe8]"
          />
          Show WhatsApp group join option
        </label>
      </CardSection>

      <CardSection title="SEO & sharing">
        <div className="space-y-5">
          <Field label="SEO title">
            <TextInput value={form.seoTitle} onChange={(e) => updateField("seoTitle", e.target.value)} />
          </Field>
          <Field label="SEO description">
            <TextArea rows={3} value={form.seoDescription} onChange={(e) => updateField("seoDescription", e.target.value)} />
          </Field>
          <ImageUploader label="Social share image (OG)" images={form.ogImage} onChange={(value) => updateField("ogImage", value)} />
        </div>
      </CardSection>

      <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-between gap-3 rounded-[28px] border border-white/80 bg-white/95 px-5 py-4 shadow-[0_24px_48px_-28px_rgba(31,78,121,0.45)] backdrop-blur">
        <p className="text-sm text-[#526477]">Ready to save this landing page?</p>
        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-[#f4a261] px-5 py-2.5 text-sm font-semibold text-[#17324d] shadow-[0_16px_32px_-20px_rgba(244,162,97,0.85)] transition hover:bg-[#ee9654] disabled:opacity-60"
        >
          {busy ? "Saving…" : mode === "edit" ? "Update landing page" : "Save landing page"}
        </button>
      </div>
    </form>
  );
}
