"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { CardSection, Field, TextArea } from "@/components/admin/AdminFields";
import ImageUploader from "@/components/admin/ImageUploader";
import { buildSettingsPayload, normaliseSettings } from "@/lib/admin-data";
import {
  DEFAULT_HERO_COMMUNITY_AVATARS,
  DEFAULT_HERO_COMMUNITY_QUOTE,
} from "@/lib/heroCommunity";
import { isTemporaryImageUrl, resolveHeroImageSrc } from "@/lib/heroSlides";
import { getSettings, updateSettings, uploadHeroImage } from "@/services/adminService";

function sanitiseImageList(values) {
  return (Array.isArray(values) ? values : [])
    .map((item) => String(item || "").trim())
    .filter((item) => item && !isTemporaryImageUrl(item));
}

function resolvePreviewAvatars(avatars) {
  const source = avatars.length ? avatars : DEFAULT_HERO_COMMUNITY_AVATARS;
  return source
    .map((src) => resolveHeroImageSrc(src))
    .filter(Boolean)
    .slice(0, 6);
}

export default function HeroCommunityEditor({ busy, setBusy, onMessage }) {
  const [loading, setLoading] = useState(true);
  const [siteSettings, setSiteSettings] = useState(null);
  const [quote, setQuote] = useState(DEFAULT_HERO_COMMUNITY_QUOTE);
  const [bannerUrl, setBannerUrl] = useState("");
  const [avatars, setAvatars] = useState([]);

  useEffect(() => {
    let active = true;
    (async () => {
      const result = await getSettings();
      if (!active) return;
      setLoading(false);
      if (!result.success) {
        onMessage(result.message, true);
        return;
      }
      const form = normaliseSettings(result.data);
      setSiteSettings(form);
      setQuote(form.heroCommunityQuote.trim() || DEFAULT_HERO_COMMUNITY_QUOTE);
      setBannerUrl(form.heroCommunityBannerUrl || "");
      setAvatars(
        form.heroCommunityAvatars.length
          ? form.heroCommunityAvatars
          : [...DEFAULT_HERO_COMMUNITY_AVATARS]
      );
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bannerPreview = resolveHeroImageSrc(bannerUrl);
  const previewAvatars = useMemo(() => resolvePreviewAvatars(avatars), [avatars]);

  if (loading) {
    return (
      <CardSection title="Traveler trust band" description="Loading…">
        <p className="text-sm text-[#6c8094]">Loading trust band settings…</p>
      </CardSection>
    );
  }

  return (
    <CardSection
      title="Traveler trust band"
      description="Upload your travelers' photos, a background banner, and the trust message shown below the hero buttons on the homepage."
    >
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          if (!siteSettings) return;

          const cleanBanner = isTemporaryImageUrl(bannerUrl) ? "" : String(bannerUrl || "").trim();
          const cleanAvatars = sanitiseImageList(avatars).slice(0, 12);

          if (isTemporaryImageUrl(bannerUrl) || sanitiseImageList(avatars).length !== avatars.length) {
            onMessage("Wait for photo uploads to finish, then save again.", true);
            return;
          }

          setBusy(true);
          const payload = buildSettingsPayload({
            ...siteSettings,
            heroCommunityQuote: quote,
            heroCommunityBannerUrl: cleanBanner,
            heroCommunityAvatars: cleanAvatars,
          });
          const result = await updateSettings(payload);
          setBusy(false);
          if (!result.success) {
            onMessage(result.message || "Could not save trust band.", true);
            return;
          }
          const next = normaliseSettings(result.data);
          setSiteSettings(next);
          setQuote(next.heroCommunityQuote.trim() || DEFAULT_HERO_COMMUNITY_QUOTE);
          setBannerUrl(next.heroCommunityBannerUrl || "");
          setAvatars(
            next.heroCommunityAvatars.length
              ? next.heroCommunityAvatars
              : [...DEFAULT_HERO_COMMUNITY_AVATARS]
          );
          onMessage("Traveler trust band saved — visible on the homepage hero.", false);
        }}
        className="space-y-6"
      >
        <div className="overflow-hidden rounded-[24px] border border-[#e7eef4] bg-[#0a1628]">
          <div
            className="relative min-h-[180px] bg-cover bg-center"
            style={
              bannerPreview
                ? { backgroundImage: `url(${bannerPreview})` }
                : { background: "linear-gradient(135deg, #0f2844, #061525)" }
            }
          >
            <div className="absolute inset-0 bg-[#02060c]/45" />
            <div className="relative flex flex-col items-center justify-center gap-4 px-6 py-10 text-center">
              <div className="flex items-center justify-center pl-2">
                {previewAvatars.map((src, index) => (
                  <span
                    key={`${src}-${index}`}
                    className="relative -ml-3 h-12 w-12 overflow-hidden rounded-full border-2 border-white first:ml-0 sm:h-14 sm:w-14"
                    style={{ zIndex: 10 - index }}
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      unoptimized
                      sizes="56px"
                      className="object-cover"
                    />
                  </span>
                ))}
              </div>
              <p className="max-w-xl text-sm font-medium italic leading-relaxed text-white/90 sm:text-base">
                {quote.trim() || DEFAULT_HERO_COMMUNITY_QUOTE}
              </p>
            </div>
          </div>
          <p className="border-t border-[#e7eef4] bg-white px-4 py-3 text-xs text-[#6f8295]">
            Live preview — matches the homepage trust band layout.
          </p>
        </div>

        <Field label="Trust message">
          <TextArea
            rows={3}
            value={quote}
            onChange={(event) => setQuote(event.target.value)}
            placeholder={DEFAULT_HERO_COMMUNITY_QUOTE}
          />
        </Field>

        <ImageUploader
          label="Background banner (optional)"
          helperText="Wide landscape photo behind the traveler photos — e.g. boat, beach, or group trip scene."
          images={bannerUrl}
          onChange={setBannerUrl}
          uploadImage={uploadHeroImage}
        />

        <ImageUploader
          label="Traveler photos"
          helperText="Upload circular profile photos of your happy travelers (up to 12). Order matches left-to-right on the site."
          images={avatars}
          onChange={setAvatars}
          multiple
          uploadImage={uploadHeroImage}
        />

        <div className="flex flex-wrap items-center gap-3 border-t border-[#e7eef4] pt-5">
          <button
            type="submit"
            disabled={busy}
            className="rounded-full bg-[#f4a261] px-5 py-3 text-sm font-semibold text-[#17324d] shadow-[0_18px_36px_-24px_rgba(244,162,97,0.9)] transition hover:bg-[#ef9551] disabled:opacity-60"
          >
            {busy ? "Saving..." : "Save trust band"}
          </button>
        </div>
      </form>
    </CardSection>
  );
}
