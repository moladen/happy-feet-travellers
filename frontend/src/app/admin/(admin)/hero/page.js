"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import PageTransition from "@/components/admin/PageTransition";
import { CardSection, Field, TextInput, AccordionSection } from "@/components/admin/AdminFields";
import { Icon } from "@/components/admin/AdminIcons";
import { emptyHeroSlideForm } from "@/lib/admin-data";
import { compressImageFile } from "@/lib/compressImage";
import {
  HERO_IMAGE_ACCEPT,
  HERO_IMAGE_MAX_MB,
  resolveAdminPreviewSrc,
  resolveHeroImageSrc,
  resolveHeroImageSrcForAdmin,
  validateHeroImageFile,
} from "@/lib/heroSlides";
import {
  createHeroSlide,
  deleteHeroSlide,
  listHeroSlides,
  reorderHeroSlides,
  updateHeroSlide,
} from "@/services/adminService";
import HeroCommunityEditor from "@/components/admin/HeroCommunityEditor";

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
  const [communityNotice, setCommunityNotice] = useState("");
  const [communityError, setCommunityError] = useState(false);

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
      previewUrl: resolveHeroImageSrcForAdmin(slide.src) || resolveHeroImageSrc(slide.src),
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

  const previewSrc = form.previewUrl
    ? resolveAdminPreviewSrc(form.previewUrl)
    : editing
      ? resolveAdminPreviewSrc(editing.src)
      : "";

  return (
    <PageTransition className="w-full space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#4f7b9d]">
            Homepage hero
          </p>
          <h1 className="mt-1 text-xl font-bold text-[#17324d] md:text-2xl">Hero Section Management</h1>
        </div>
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-2 rounded-full border border-[#d8e7f2] bg-white px-4 py-2 text-sm font-semibold text-[#1f4e79] shadow-sm transition hover:border-[#4fa3d1]"
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

      {communityNotice ? (
        <div
          className={`rounded-[26px] px-5 py-4 text-sm ${
            communityError
              ? "border border-[#f2d4bd] bg-[#fff5eb] text-[#a35a23]"
              : "border border-[#d9e9d5] bg-[#f3fbf1] text-[#28623b]"
          }`}
        >
          {communityNotice}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-[26px] border border-[#f5c4c4] bg-[#fff0f0] px-5 py-4 text-sm text-[#9b2c2c]">
          {error}
        </div>
      ) : null}

      <div className="space-y-5">
        <CardSection
          title="Live carousel slides"
          description={`${slides.length} slide${slides.length === 1 ? "" : "s"} · order matches homepage`}
        >
          {!slides.length ? (
            <p className="text-sm text-[#6f8295]">No slides yet. Expand &quot;Add hero slide&quot; below to upload your first banner.</p>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {slides.map((slide, index) => {
                const src = resolveHeroImageSrcForAdmin(slide.src) || resolveHeroImageSrc(slide.src);
                return (
                  <li
                    key={slide.id}
                    className="overflow-hidden rounded-[18px] border border-[#e7eef4] bg-white shadow-[0_8px_24px_-18px_rgba(31,78,121,0.35)]"
                  >
                    <div className="relative h-[100px] w-full bg-[#0a1628] sm:h-[110px]">
                      <Image src={src} alt={slide.alt} fill unoptimized sizes="280px" className="object-cover" />
                      {!slide.active ? (
                        <span className="absolute left-2 top-2 rounded-full bg-[#06111b]/75 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/80">
                          Hidden
                        </span>
                      ) : null}
                    </div>
                    <div className="space-y-2.5 p-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#17324d]">
                          {slide.emoji} {slide.tag || "Untitled"}
                        </p>
                        <p className="line-clamp-1 text-xs text-[#6f8295]">{slide.alt}</p>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          disabled={busy || index === 0}
                          onClick={() => moveSlide(index, -1)}
                          className="rounded-lg border border-[#d5e1eb] px-2.5 py-1.5 text-xs font-semibold text-[#1f4e79] disabled:opacity-40"
                          aria-label="Move up"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          disabled={busy || index === slides.length - 1}
                          onClick={() => moveSlide(index, 1)}
                          className="rounded-lg border border-[#d5e1eb] px-2.5 py-1.5 text-xs font-semibold text-[#1f4e79] disabled:opacity-40"
                          aria-label="Move down"
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={() => startEdit(slide)}
                          className="rounded-lg bg-[#edf5fb] px-2.5 py-1.5 text-xs font-semibold text-[#1f4e79]"
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
                          className="rounded-lg border border-[#f5c4c4] px-2.5 py-1.5 text-xs font-semibold text-[#9b2c2c]"
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

        <CardSection
          title="Manage banners"
          description="Add a new slide or edit the traveler trust band below the homepage hero."
        >
          <AccordionSection
            key={editing?.id || "new-slide"}
            title={editing ? "Replace hero slide" : "Add hero slide"}
            description="Upload image, alt text, and destination tag."
            defaultOpen={!slides.length || Boolean(editing)}
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
              if (form.imageFile) {
                const compressed = await compressImageFile(form.imageFile);
                fd.set("image", compressed);
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
            className="space-y-4"
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
              {previewSrc ? (
                <div className="relative h-[180px] w-full overflow-hidden bg-[#0a1628] md:h-[220px]">
                  <motion.div
                    key={previewSrc}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0"
                  >
                    {/* Native img required — next/image does not support blob: preview URLs */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewSrc}
                      alt="Hero preview"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#061525]/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-2xl border border-white/20 bg-black/40 px-3 py-2 text-xs font-semibold text-white backdrop-blur-md">
                      <span>{form.emoji || "✨"}</span>
                      <span>{form.tag || "Preview tag"}</span>
                    </div>
                  </motion.div>
                </div>
              ) : (
                <div className="flex h-[120px] flex-col items-center justify-center gap-2 bg-[#eef5fb] px-6 text-center md:h-[132px]">
                  <Icon name="hero" className="h-9 w-9 text-[#4fa3d1]" />
                  <p className="text-sm font-semibold text-[#17324d]">No preview yet</p>
                  <p className="max-w-md text-xs text-[#6f8295]">
                    Upload a wide landscape image (1920×1080 recommended)
                  </p>
                </div>
              )}
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
                      setForm((c) => ({ ...c, imageFile: null, previewUrl: editing ? resolveAdminPreviewSrc(editing.src) : "" }));
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

            <div className="grid gap-4 sm:grid-cols-2">
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
          </AccordionSection>
        </CardSection>
      </div>

      <HeroCommunityEditor
        busy={busy}
        setBusy={setBusy}
        onMessage={(text, isErr = false) => {
          setCommunityNotice(text);
          setCommunityError(isErr);
        }}
      />
    </PageTransition>
  );
}
