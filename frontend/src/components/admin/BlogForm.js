"use client";

import { buildBlogPayload, generateSlug } from "@/lib/admin-data";
import ImageUploader from "@/components/admin/ImageUploader";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { CardSection, Field, TextArea, TextInput } from "@/components/admin/AdminFields";

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

      <CardSection title="Content and cover media" description="Rich editorial content with a strong hero visual.">
        <div className="space-y-6">
          <ImageUploader
            label="Cover image"
            helperText="Used across the blog listing and the detail hero."
            images={form.coverImage}
            onChange={(value) => updateField("coverImage", value)}
          />
          <RichTextEditor
            label="Blog content"
            helperText="Add structure with headings, quotes, and lists."
            value={form.content}
            onChange={(value) => updateField("content", value)}
          />
        </div>
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
            <p className="mt-1 text-sm text-[#6c8094]">The editor content is stored as rich HTML for future rendering flexibility.</p>
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
