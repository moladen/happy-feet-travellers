'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { resolveHeroImageSrc } from '@/lib/heroSlides';
import { DEFAULT_SEASON_PROMO, resolveSeasonPromo } from '@/lib/seasonPromo';
import { getPublicSettings } from '@/services/settingsService';

/**
 * Premium season highlight card — full-bleed background image with text overlay.
 * Content is editable from Admin → Season Highlight.
 * @param {{ variant?: 'compact' | 'page'; className?: string }} props
 */
export default function RannSeasonPromo({ variant = 'compact', className = '' }) {
  const [promo, setPromo] = useState(DEFAULT_SEASON_PROMO);

  useEffect(() => {
    let active = true;
    (async () => {
      const settings = await getPublicSettings();
      if (!active) return;
      setPromo(resolveSeasonPromo(settings));
    })();
    return () => {
      active = false;
    };
  }, []);

  if (!promo.active) return null;

  const isPage = variant === 'page';
  const imageSrc = resolveHeroImageSrc(promo.imageUrl);
  const minHeight = isPage ? 'min-h-[260px] md:min-h-[280px]' : 'min-h-[220px] sm:min-h-[200px]';

  return (
    <aside
      className={`rann-season-promo group relative isolate overflow-hidden rounded-2xl border border-white/10 shadow-[0_24px_60px_-28px_rgba(6,21,37,0.65)] ${
        isPage ? 'md:rounded-3xl' : ''
      } ${minHeight} ${className}`.trim()}
      aria-labelledby="rann-season-promo-title"
    >
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt=""
          fill
          priority={isPage}
          unoptimized={imageSrc.includes('/uploads')}
          sizes={isPage ? '100vw' : '(max-width: 768px) 100vw, 960px'}
          className="object-cover object-center transition duration-700 group-hover:scale-[1.02]"
        />
      ) : (
        <div className="absolute inset-0 bg-[#0f2844]" aria-hidden />
      )}

      <div
        className="absolute inset-0 bg-gradient-to-r from-[#061525]/94 via-[#0f2844]/78 to-[#0f2844]/42"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#061525]/88 via-[#061525]/20 to-[#061525]/35"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 top-0 h-48 w-48 rounded-full bg-cta/20 blur-3xl"
        aria-hidden
      />

      <div
        className={`relative z-10 flex h-full flex-col justify-center ${
          isPage ? 'p-6 sm:p-7 md:p-8' : 'p-5 sm:p-6'
        }`}
      >
        <span className="inline-flex w-fit items-center rounded-full border border-white/25 bg-cta/95 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white shadow-lg backdrop-blur-sm sm:text-[11px]">
          {promo.badge}
        </span>

        <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/72 sm:text-[11px]">
          {promo.eyebrow}
        </p>

        <h3
          id="rann-season-promo-title"
          className={`mt-1.5 max-w-2xl font-display font-bold leading-[1.12] text-white ${
            isPage ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
          }`}
        >
          {promo.title}
        </h3>

        <p className={`mt-1.5 font-semibold text-[#f4c4a8] ${isPage ? 'text-sm' : 'text-xs sm:text-sm'}`}>
          {promo.subtitle}
        </p>

        <p
          className={`mt-2.5 max-w-2xl leading-relaxed text-white/84 ${
            isPage ? 'text-sm md:text-[15px]' : 'text-xs sm:text-sm'
          }`}
        >
          {promo.description}
        </p>

        {promo.tags?.length ? (
          <ul
            className={`mt-4 flex max-w-2xl flex-wrap gap-2 ${
              isPage ? 'text-xs' : 'text-[11px] sm:text-xs'
            }`}
          >
            {promo.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-white/20 bg-white/12 px-3 py-1 font-medium text-white/90 backdrop-blur-md"
              >
                {tag}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link
            href={promo.primaryCtaHref}
            className="inline-flex items-center gap-1.5 rounded-xl bg-cta px-4 py-2.5 text-xs font-bold text-white shadow-[0_12px_28px_-12px_rgba(231,111,81,0.85)] transition hover:bg-cta-hover sm:text-sm"
          >
            {promo.primaryCtaLabel}
            <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          {promo.secondaryCtaLabel && promo.secondaryCtaHref ? (
            <Link
              href={promo.secondaryCtaHref}
              className="text-xs font-semibold text-white/90 underline-offset-4 transition hover:text-white hover:underline sm:text-sm"
            >
              {promo.secondaryCtaLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
