"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import PageTransition from "@/components/admin/PageTransition";
import { CardSection, Field, TextInput } from "@/components/admin/AdminFields";
import { Icon } from "@/components/admin/AdminIcons";
import { emptyHeroSlideForm } from "@/lib/admin-data";
import {
  HERO_IMAGE_ACCEPT,
  HERO_IMAGE_MAX_MB,
  resolveHeroImageSrc,
  validateHeroImageFile,
} from "@/lib/heroSlides";
import {
  createHeroSlide,
  deleteHeroSlide,
  listHeroSlides,
  reorderHeroSlides,
  updateHeroSlide,
} from "@/services/adminService";

function buildHeroFormData(form, { requireImage = false, editingId = null } = {}) {
  const fd = new FormData();
  if (form.imageFile) fd.append("image", form.imageFile);
  else if (requireImage && !editingId) return null;

  fd.append("altText", form.altText.trim());
  if (form.tag?.trim()) fd.append("tag", form.tag.trim());
  if (form.emoji?.trim()) fd.append("emoji", form.emoji.trim());
  if (form.sortOrder !== "" && form.sortOrder != null) fd.append("sortOrder", String(form.sortOrder));
  fd.append("active", form.active ? "true" : "false");
  return fd;
}

export default function HeroManagementPage() {
  const inputRef = useRef(null);
  const [slides, setSlides] = useState([]);
  const [form, setForm] = useState({ ...emptyHeroSlideForm });
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    const result = await listHeroSlides();
    if (!result.success) {
      setMessage(result.message);
      return;
    }
    setSlides(result.data?.slides || []);
    setMessage("");
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const result = await listHeroSlides();
      if (cancelled) return;
      if (!result.success) {
        setMessage(result.message);
        return;
      }
      setSlides(result.data?.slides || []);
      setMessage("");
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const resetForm = () => {
    if (form.previewUrl?.startsWith("blob:")) URL.revokeObjectURL(form.previewUrl);
    setForm({ ...emptyHeroSlideForm });
    setEditing(null);
    setError("");
  };

  const setImageFile = (file) => {
    const validation = validateHeroImageFile(file);
    if (validation) {
      setError(validation);
      return;
    }
    setError("");
    if (form.previewUrl?.startsWith("blob:")) URL.revokeObjectURL(form.previewUrl);
    const previewUrl = URL.createObjectURL(file);
    setForm((current) => ({ ...current, imageFile: file, previewUrl }));
  };

  const startEdit = (slide) => {
    if (form.previewUrl?.startsWith("blob:")) URL.revokeObjectURL(form.previewUrl);
    setEditing(slide);
    setForm({
      altText: slide.alt || "",
      tag: slide.tag || "",
      emoji: slide.emoji || "✨",
      sortOrder: String(slide.sortOrder ?? ""),
      active: slide.active !== false,
      imageFile: null,
      previewUrl: resolveHeroImageSrc(slide.src),
    });
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const moveSlide = async (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= slides.length) return;
    const order = [...slides];
    const [item] = order.splice(index, 1);
    order.splice(target, 0, item);
    setBusy(true);
    const result = await reorderHeroSlides(order.map((s) => s.id));
    setBusy(false);
    if (!result.success) {
      setMessage(result.message);
      return;
    }
    setSlides(result.data?.slides || order);
  };

  const previewSrc =
    form.previewUrl || (editing ? resolveHeroImageSrc(editing.src) : "");

  return (
    <PageTransition className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[28px] border border-[#e7eef4] bg-[linear-gradient(135deg,#fff8f1,#f4f9fd)] p-6 shadow-[0_24px_50px_-32px_rgba(31,78,121,0.45)] md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#4f7b9d]">
            Homepage hero
          </p>
          <h1 className="mt-2 text-2xl font-bold text-[#17324d]">Hero Section Management</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#5f6f7f]">
            Upload high-resolution banner images (JPG, PNG, WebP up to {HERO_IMAGE_MAX_MB}MB). Changes
            appear on the homepage carousel automatically.
          </p>
        </div>
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-2 self-start rounded-full border border-[#d8e7f2] bg-white px-4 py-2.5 text-sm font-semibold text-[#1f4e79] shadow-sm transition hover:border-[#4fa3d1]"
        >
          <Icon name="eye" className="h-4 w-4" />
          Preview site
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

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] xl:items-start">
        <CardSection
          title={editing ? "Replace hero slide" : "Upload hero slide"}
          description="Add destination tags and alt text for accessibility. Drag to reorder slides in the list."
        >
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              setError("");
              if (!form.altText.trim() || form.altText.trim().length < 3) {
                setError("Alt text is required (at least 3 characters).");
                return;
              }
              const fd = buildHeroFormData(form, { requireImage: !editing, editingId: editing?.id });
              if (!fd) {
                setError("Choose an image file to upload.");
                return;
              }
              setBusy(true);
              const result = editing
                ? await updateHeroSlide(editing.id, fd)
                : await createHeroSlide(fd);
              setBusy(false);
              if (!result.success) {
                setError(result.message);
                return;
              }
              resetForm();
              await load();
              setMessage(editing ? "Hero slide updated on the live site." : "Hero slide published to the homepage.");
            }}
            className="space-y-5"
          >
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0];
                if (file) setImageFile(file);
              }}
              className="overflow-hidden rounded-[24px] border border-dashed border-[#c9dbe8] bg-[#f8fbfe]"
            >
              <div className="relative aspect-[21/9] w-full min-h-[160px] bg-[#0a1628]">
                {previewSrc ? (
                  <motion.div
                    key={previewSrc}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={previewSrc}
                      alt="Hero preview"
                      fill
                      unoptimized
                      sizes="(max-width: 1280px) 100vw, 720px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#061525]/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-2xl border border-white/20 bg-black/40 px-3 py-2 text-xs font-semibold text-white backdrop-blur-md">
                      <span>{form.emoji || "✨"}</span>
                      <span>{form.tag || "Preview tag"}</span>
                    </div>
                  </motion.div>
                ) : (
                  <div className="grid h-full min-h-[160px] place-items-center p-8 text-center">
                    <div>
                      <Icon name="hero" className="mx-auto h-10 w-10 text-[#7ec8e3]" />
                      <p className="mt-3 text-sm font-semibold text-white/90">No preview yet</p>
                      <p className="mt-1 text-xs text-white/60">Upload a wide landscape image (1920×1080 recommended)</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 border-t border-[#e7eef4] bg-white p-4">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="rounded-full bg-[#1f4e79] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#173b5d]"
                >
                  {previewSrc ? "Replace image" : "Choose image"}
                </button>
                {previewSrc ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (form.previewUrl?.startsWith("blob:")) URL.revokeObjectURL(form.previewUrl);
                      setForm((c) => ({ ...c, imageFile: null, previewUrl: editing ? resolveHeroImageSrc(editing.src) : "" }));
                    }}
                    className="rounded-full border border-[#d5e1eb] px-4 py-2 text-sm font-semibold text-[#425264] transition hover:border-[#f4a261]"
                  >
                    Clear selection
                  </button>
                ) : null}
                <input
                  ref={inputRef}
                  type="file"
                  accept={HERO_IMAGE_ACCEPT}
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setImageFile(file);
                    e.target.value = "";
                  }}
                />
                <p className="text-xs text-[#6f8295]">JPG · PNG · WebP · max {HERO_IMAGE_MAX_MB}MB</p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Alt text (required)">
                <TextInput
                  value={form.altText}
                  onChange={(e) => setForm((c) => ({ ...c, altText: e.target.value }))}
                  placeholder="Turquoise beach with palm trees at sunset"
                />
              </Field>
              <Field label="Destination tag">
                <TextInput
                  value={form.tag}
                  onChange={(e) => setForm((c) => ({ ...c, tag: e.target.value }))}
                  placeholder="Beach escapes"
                />
              </Field>
              <Field label="Emoji badge">
                <TextInput
                  value={form.emoji}
                  onChange={(e) => setForm((c) => ({ ...c, emoji: e.target.value }))}
                  placeholder="🏖️"
                />
              </Field>
              <Field label="Sort order (optional)">
                <TextInput
                  type="number"
                  min={0}
                  value={form.sortOrder}
                  onChange={(e) => setForm((c) => ({ ...c, sortOrder: e.target.value }))}
                  placeholder="Auto"
                />
              </Field>
            </div>

            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-[#e7eef4] bg-[#fbfdff] px-4 py-3">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm((c) => ({ ...c, active: e.target.checked }))}
                className="h-4 w-4 rounded border-[#c9dbe8] text-[#1f4e79]"
              />
              <span className="text-sm font-medium text-[#314559]">Show on homepage carousel</span>
            </label>

            <div className="flex flex-wrap items-center gap-3 border-t border-[#e7eef4] pt-5">
              <button
                type="submit"
                disabled={busy}
                className="rounded-full bg-[#f4a261] px-5 py-3 text-sm font-semibold text-[#17324d] shadow-[0_18px_36px_-24px_rgba(244,162,97,0.9)] transition hover:bg-[#ef9551] disabled:opacity-60"
              >
                {busy ? "Saving..." : editing ? "Save changes" : "Publish slide"}
              </button>
              {editing ? (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-full border border-[#d5e1eb] px-5 py-3 text-sm font-semibold text-[#425264]"
                >
                  Cancel edit
                </button>
              ) : null}
            </div>
          </form>
        </CardSection>

        <CardSection
          title="Live carousel slides"
          description={`${slides.length} slide${slides.length === 1 ? "" : "s"} · order matches homepage`}
        >
          {!slides.length ? (
            <p className="text-sm text-[#6f8295]">No slides yet. Upload your first hero banner above.</p>
          ) : (
            <ul className="space-y-4">
              {slides.map((slide, index) => {
                const src = resolveHeroImageSrc(slide.src);
                return (
                  <li
                    key={slide.id}
                    className="overflow-hidden rounded-[22px] border border-[#e7eef4] bg-white shadow-[0_12px_32px_-24px_rgba(31,78,121,0.4)]"
                  >
                    <div className="relative aspect-[16/7] w-full bg-[#0a1628]">
                      <Image src={src} alt={slide.alt} fill unoptimized sizes="400px" className="object-cover" />
                      {!slide.active ? (
                        <span className="absolute left-3 top-3 rounded-full bg-[#06111b]/75 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white/80">
                          Hidden
                        </span>
                      ) : null}
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3 p-4">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#17324d]">
                          {slide.emoji} {slide.tag || "Untitled"}
                        </p>
                        <p className="truncate text-xs text-[#6f8295]">{slide.alt}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          disabled={busy || index === 0}
                          onClick={() => moveSlide(index, -1)}
                          className="rounded-xl border border-[#d5e1eb] px-3 py-2 text-xs font-semibold text-[#1f4e79] disabled:opacity-40"
                          aria-label="Move up"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          disabled={busy || index === slides.length - 1}
                          onClick={() => moveSlide(index, 1)}
                          className="rounded-xl border border-[#d5e1eb] px-3 py-2 text-xs font-semibold text-[#1f4e79] disabled:opacity-40"
                          aria-label="Move down"
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={() => startEdit(slide)}
                          className="rounded-xl bg-[#edf5fb] px-3 py-2 text-xs font-semibold text-[#1f4e79]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={async () => {
                            if (!window.confirm("Remove this hero slide from the homepage?")) return;
                            setBusy(true);
                            const result = await deleteHeroSlide(slide.id);
                            setBusy(false);
                            if (!result.success) {
                              setMessage(result.message);
                              return;
                            }
                            if (editing?.id === slide.id) resetForm();
                            await load();
                            setMessage("Hero slide removed.");
                          }}
                          className="rounded-xl border border-[#f5c4c4] px-3 py-2 text-xs font-semibold text-[#9b2c2c]"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardSection>
      </div>
    </PageTransition>
  );
}
