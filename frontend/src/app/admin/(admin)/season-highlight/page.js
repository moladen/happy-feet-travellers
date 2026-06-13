"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import PageTransition from "@/components/admin/PageTransition";
import { CardSection, Field, TextArea, TextInput } from "@/components/admin/AdminFields";
import ImageUploader from "@/components/admin/ImageUploader";
import { Icon } from "@/components/admin/AdminIcons";
import { buildSettingsPayload, normaliseSettings } from "@/lib/admin-data";
import { isTemporaryImageUrl, resolveHeroImageSrc } from "@/lib/heroSlides";
import {
  DEFAULT_SEASON_PROMO,
  resolveSeasonPromo,
  tagsToTextarea,
  textareaToTags,
} from "@/lib/seasonPromo";
import { getSettings, updateSettings, uploadHeroImage } from "@/services/adminService";

function enrichSeasonPromoForm(payload) {
  const form = normaliseSettings(payload);
  const promo = resolveSeasonPromo(form);
  return {
    ...form,
    seasonPromoActive: promo.active,
    seasonPromoBadge: promo.badge,
    seasonPromoEyebrow: promo.eyebrow,
    seasonPromoTitle: promo.title,
    seasonPromoSubtitle: promo.subtitle,
    seasonPromoDescription: promo.description,
    seasonPromoImageUrl: promo.imageUrl,
    seasonPromoTags: promo.tags,
    seasonPromoPrimaryCtaLabel: promo.primaryCtaLabel,
    seasonPromoPrimaryCtaHref: promo.primaryCtaHref,
    seasonPromoSecondaryCtaLabel: promo.secondaryCtaLabel,
    seasonPromoSecondaryCtaHref: promo.secondaryCtaHref,
  };
}

export default function SeasonHighlightPage() {
  const [form, setForm] = useState(null);
  const [tagText, setTagText] = useState(tagsToTextarea(DEFAULT_SEASON_PROMO.tags));
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
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
        setMessage(result.message || "Could not load season highlight.");
        return;
      }
      const next = enrichSeasonPromoForm(result.data);
      setForm(next);
      setTagText(tagsToTextarea(next.seasonPromoTags));
    })();
    return () => {
      active = false;
    };
  }, []);

  const preview = useMemo(() => {
    if (!form) return DEFAULT_SEASON_PROMO;
    return resolveSeasonPromo({
      ...form,
      seasonPromoTags: textareaToTags(tagText),
    });
  }, [form, tagText]);

  const previewImage = resolveHeroImageSrc(preview.imageUrl);

  const showMessage = (text, error = false) => {
    setMessage(text);
    setIsError(error);
  };

  if (loading) {
    return (
      <PageTransition>
        <CardSection title="Season highlight card" description="Loading…">
          <p className="text-sm text-[#6c8094]">Loading…</p>
        </CardSection>
      </PageTransition>
    );
  }

  if (!form) {
    return (
      <PageTransition>
        <CardSection title="Season highlight card">
          <p className="text-sm text-[#a35a23]">{message || "Could not load settings."}</p>
        </CardSection>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[28px] border border-[#e7eef4] bg-[linear-gradient(135deg,#fff8f1,#f4f9fd)] p-6 shadow-[0_24px_50px_-32px_rgba(31,78,121,0.45)] md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#4f7b9d]">
            Featured campaign
          </p>
          <h1 className="mt-2 text-2xl font-bold text-[#17324d]">Season Highlight Card</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#5f6f7f]">
            Update the premium highlight card on Upcoming Departures, Personalized Tours, and the
            homepage. Change the background image, heading, and copy for Christmas, Full Moon, New
            Year, or any seasonal push.
          </p>
        </div>
        <Link
          href="/upcoming-departures"
          target="_blank"
          className="inline-flex items-center gap-2 self-start rounded-full border border-[#d8e7f2] bg-white px-4 py-2.5 text-sm font-semibold text-[#1f4e79] shadow-sm transition hover:border-[#4fa3d1]"
        >
          <Icon name="eye" className="h-4 w-4" />
          Preview on site
        </Link>
      </div>

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

      <form
        onSubmit={async (event) => {
          event.preventDefault();
          if (isTemporaryImageUrl(form.seasonPromoImageUrl)) {
            showMessage("Wait for the background image upload to finish, then save again.", true);
            return;
          }

          setBusy(true);
          const payload = buildSettingsPayload({
            ...form,
            seasonPromoTags: textareaToTags(tagText),
          });
          const result = await updateSettings(payload);
          setBusy(false);

          if (!result.success) {
            showMessage(result.message || "Could not save season highlight.", true);
            return;
          }

          const next = enrichSeasonPromoForm(result.data);
          setForm(next);
          setTagText(tagsToTextarea(next.seasonPromoTags));
          showMessage("Season highlight saved — live on departures and tour pages.", false);
        }}
        className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] xl:items-start"
      >
        <CardSection
          title="Card content"
          description="Heading, subtitle line, description, tags, and buttons."
        >
          <div className="space-y-5">
            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-[#e7eef4] bg-[#fbfdff] px-4 py-3">
              <input
                type="checkbox"
                checked={form.seasonPromoActive}
                onChange={(event) =>
                  setForm((current) => ({ ...current, seasonPromoActive: event.target.checked }))
                }
                className="h-4 w-4 rounded border-[#c9dbe8] text-[#1f4e79]"
              />
              <span className="text-sm font-medium text-[#314559]">Show highlight card on the site</span>
            </label>

            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Badge" hint="e.g. Season 2026–27, Christmas Special">
                <TextInput
                  value={form.seasonPromoBadge}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, seasonPromoBadge: event.target.value }))
                  }
                />
              </Field>
              <Field label="Eyebrow label">
                <TextInput
                  value={form.seasonPromoEyebrow}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, seasonPromoEyebrow: event.target.value }))
                  }
                />
              </Field>
            </div>

            <Field label="Main heading" hint="e.g. Rann of Kutch · Christmas Full Moon Batch">
              <TextInput
                value={form.seasonPromoTitle}
                onChange={(event) =>
                  setForm((current) => ({ ...current, seasonPromoTitle: event.target.value }))
                }
              />
            </Field>

            <Field label="Subtitle line" hint="Date range or one-line hook below the heading">
              <TextInput
                value={form.seasonPromoSubtitle}
                onChange={(event) =>
                  setForm((current) => ({ ...current, seasonPromoSubtitle: event.target.value }))
                }
                placeholder="24 December 2026 — Christmas + Full Moon departure"
              />
            </Field>

            <Field label="Description">
              <TextArea
                rows={4}
                value={form.seasonPromoDescription}
                onChange={(event) =>
                  setForm((current) => ({ ...current, seasonPromoDescription: event.target.value }))
                }
              />
            </Field>

            <Field label="Highlight tags" hint="One tag per line (max 8)">
              <TextArea
                rows={4}
                value={tagText}
                onChange={(event) => setTagText(event.target.value)}
                placeholder={"10 group batches\nFIT & family packages\nEarly-bird priority"}
              />
            </Field>

            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Primary button label">
                <TextInput
                  value={form.seasonPromoPrimaryCtaLabel}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      seasonPromoPrimaryCtaLabel: event.target.value,
                    }))
                  }
                />
              </Field>
              <Field label="Primary button link">
                <TextInput
                  value={form.seasonPromoPrimaryCtaHref}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      seasonPromoPrimaryCtaHref: event.target.value,
                    }))
                  }
                  placeholder="/rann-of-kutch-season-2026-27"
                />
              </Field>
              <Field label="Secondary link label">
                <TextInput
                  value={form.seasonPromoSecondaryCtaLabel}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      seasonPromoSecondaryCtaLabel: event.target.value,
                    }))
                  }
                />
              </Field>
              <Field label="Secondary link URL">
                <TextInput
                  value={form.seasonPromoSecondaryCtaHref}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      seasonPromoSecondaryCtaHref: event.target.value,
                    }))
                  }
                  placeholder="/rann-of-kutch-season-2026-27#priority-interest"
                />
              </Field>
            </div>

            <ImageUploader
              label="Background image"
              helperText="Wide landscape photo — fills the full card behind the text."
              images={form.seasonPromoImageUrl}
              onChange={(value) =>
                setForm((current) => ({ ...current, seasonPromoImageUrl: value }))
              }
              uploadImage={uploadHeroImage}
            />
          </div>
        </CardSection>

        <CardSection title="Live preview" description="Same size and layout as the public site card.">
          <div className="relative isolate min-h-[220px] overflow-hidden rounded-2xl border border-white/10 shadow-[0_24px_60px_-28px_rgba(6,21,37,0.65)]">
            {previewImage ? (
              <Image
                src={previewImage}
                alt=""
                fill
                unoptimized
                sizes="480px"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-[#0f2844]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-[#061525]/94 via-[#0f2844]/78 to-[#0f2844]/42" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#061525]/88 via-transparent to-[#061525]/35" />
            <div className="relative z-10 p-5 sm:p-6">
              <span className="inline-flex rounded-full bg-cta/95 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                {preview.badge}
              </span>
              <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/72">
                {preview.eyebrow}
              </p>
              <h3 className="mt-1.5 text-xl font-bold leading-tight text-white">{preview.title}</h3>
              <p className="mt-1.5 text-xs font-semibold text-[#f4c4a8]">{preview.subtitle}</p>
              <p className="mt-2 text-xs leading-relaxed text-white/84">{preview.description}</p>
              <ul className="mt-3 flex flex-wrap gap-2 text-[11px]">
                {preview.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-white/20 bg-white/12 px-2.5 py-1 text-white/90"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="sticky bottom-4 z-20 mt-6 rounded-[28px] border border-white/70 bg-white/92 p-4 shadow-[0_28px_60px_-30px_rgba(11,24,38,0.45)] backdrop-blur-xl">
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-full bg-[#f4a261] px-5 py-3 text-sm font-semibold text-[#17324d] shadow-[0_18px_36px_-24px_rgba(244,162,97,0.9)] transition hover:bg-[#ef9551] disabled:opacity-60 sm:w-auto"
            >
              {busy ? "Saving..." : "Save season highlight"}
            </button>
          </div>
        </CardSection>
      </form>
    </PageTransition>
  );
}
