"use client";

import { buildBlogPayload, generateSlug } from "@/lib/admin-data";
import { CONTENT_TOPIC_EXAMPLES } from "@/lib/contentTopics";
import BlogContentEditor from "@/components/admin/BlogContentEditor";
import ImageUploader from "@/components/admin/ImageUploader";
import { CardSection, Field, TextArea, TextInput } from "@/components/admin/AdminFields";
import { blogBlocksHaveMinContent } from "@/lib/blogContent";

export default function BlogForm({ form, setForm, onSubmit, busy, mode = "create" }) {
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

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        if (!String(form.coverImage || "").trim()) {
          window.alert("Please add a cover image before saving.");
          return;
        }
        if (!blogBlocksHaveMinContent(form.contentBlocks)) {
          window.alert("Please add at least one paragraph or photo with enough text before saving.");
          return;
        }
        await onSubmit(buildBlogPayload(form));
      }}
      className="space-y-6"
    >
      <CardSection
        title={mode === "edit" ? "Edit blog" : "Add blog"}
        description="Create polished editorial content that matches the travel brand language."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Title">
            <TextInput
              required
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
              placeholder="Curated group journeys that stay on budget"
            />
          </Field>
          <Field label="Slug">
            <TextInput
              required
              value={form.slug}
              onChange={(event) => updateField("slug", event.target.value)}
            />
          </Field>
        </div>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          <Field label="Category">
            <TextInput value={form.category} onChange={(event) => updateField("category", event.target.value)} />
          </Field>
          <Field label="Author name">
            <TextInput
              required
              value={form.authorName}
              onChange={(event) => updateField("authorName", event.target.value)}
            />
          </Field>
          <Field label="Publish date">
            <TextInput
              type="date"
              value={form.publishDate}
              onChange={(event) => updateField("publishDate", event.target.value)}
            />
          </Field>
        </div>
        <div className="mt-5">
          <Field label="Excerpt">
            <TextArea
              rows={4}
              value={form.excerpt}
              onChange={(event) => updateField("excerpt", event.target.value)}
              placeholder="A short hook for cards and search snippets..."
            />
          </Field>
        </div>
      </CardSection>

      <CardSection
        title="Content and cover media"
        description="Build the article with paragraphs, photos, and external links in any order. Use the toolbar in each paragraph for bold, italic, headings, and text color."
      >
        <div className="space-y-6">
          <ImageUploader
            label="Cover image"
            helperText="Used across the blog listing and the detail hero."
            images={form.coverImage}
            onChange={(value) => updateField("coverImage", value)}
          />
          <BlogContentEditor
            blocks={form.contentBlocks}
            onChange={(value) => updateField("contentBlocks", value)}
            helperText="Add paragraphs, photos, and external links in order. Each paragraph has formatting tools (bold, italic, H2, H3, color)."
          />
        </div>
      </CardSection>

      <CardSection
        title="Cross-link tours & packages"
        description="Connect this article to matching departures and seasonal landing pages for SEO (e.g. Rann of Kutch blogs → Rann tours)."
      >
        <Field
          label="Topic keys"
          hint={`Comma-separated — e.g. ${CONTENT_TOPIC_EXAMPLES.slice(0, 3).map((t) => t.key).join(', ')}`}
        >
          <TextInput
            value={form.topicKeysText}
            onChange={(event) => updateField("topicKeysText", event.target.value)}
            placeholder="rann-of-kutch, gujarat"
          />
        </Field>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <Field label="Landing page slug" hint="Published seasonal page, e.g. rann-of-kutch-season-2026-27">
            <TextInput
              value={form.landingPageSlug}
              onChange={(event) => updateField("landingPageSlug", event.target.value)}
              placeholder="rann-of-kutch-season-2026-27"
            />
          </Field>
          <Field label="Related tour slugs (optional)" hint="Tour slug only (Admin → Tours). One per line or comma-separated — links show on this blog and on the tour page.">
            <TextArea
              rows={3}
              value={form.relatedTourSlugsText}
              onChange={(event) => updateField("relatedTourSlugsText", event.target.value)}
              placeholder="spiti-valley-group-expedition-jun-2026"
            />
          </Field>
        </div>
        <Field
          label="Related package slugs (optional)"
          hint="Landing package slugs — e.g. classic-group-departure, bhuj-package"
        >
          <TextInput
            value={form.relatedPackageSlugsText}
            onChange={(event) => updateField("relatedPackageSlugsText", event.target.value)}
            placeholder="classic-group-departure, premium-tent-city"
          />
        </Field>
      </CardSection>

      <CardSection title="SEO fields" description="Improve discoverability without cluttering the main writing flow.">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="SEO title">
            <TextInput
              value={form.seoTitle}
              onChange={(event) => updateField("seoTitle", event.target.value)}
              placeholder="Custom search result title"
            />
          </Field>
          <Field label="SEO description">
            <TextArea
              rows={4}
              value={form.seoDescription}
              onChange={(event) => updateField("seoDescription", event.target.value)}
              placeholder="Short search result description"
            />
          </Field>
        </div>
      </CardSection>

      <div className="sticky bottom-4 z-20 rounded-[28px] border border-white/70 bg-white/92 p-4 shadow-[0_28px_60px_-30px_rgba(11,24,38,0.45)] backdrop-blur-xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#17324d]">Review the blog card, cover image, and SEO fields before publishing.</p>
            <p className="mt-1 text-sm text-[#6c8094]">Paragraphs and photos are saved in order and shown between sections on the blog page.</p>
          </div>
          <button
            type="submit"
            disabled={busy}
            className="rounded-full bg-[#f4a261] px-5 py-3 text-sm font-semibold text-[#17324d] shadow-[0_18px_36px_-24px_rgba(244,162,97,0.9)] transition hover:bg-[#ef9551] disabled:opacity-60"
          >
            {busy ? "Saving..." : mode === "edit" ? "Update blog" : "Save blog"}
          </button>
        </div>
      </div>
    </form>
  );
}
