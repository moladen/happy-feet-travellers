'use client';

import Link from 'next/link';
import { getTourDetailHref } from '@/lib/tourDisplay';
import {
  formatDepartureDateLabel,
  getDepartureCardTheme,
  getDepartureEmotionalInvite,
  getDepartureExperienceTag,
  getDepartureGroupSizeLabel,
  getDepartureStoryTeaser,
} from '@/lib/departureExperience';
import { resolveTourPriceAmount } from '@/lib/tourPrice';
import {
  buildReserveSeatHref,
  isGroupDepartureTour,
} from '@/lib/tourReserve';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80';

const PAY_NOTE = 'Flexible hold · balance closer to departure';

/**
 * Premium departure card with per-journey theme accents — CMS-driven via `tour` prop.
 */
export default function DepartureTourCard({ tour, whatsappNumber, className = '' }) {
  const imageSrc = tour?.coverImage || tour?.image || FALLBACK_IMAGE;
  const detailHref = getTourDetailHref(tour);
  const { slug: themeSlug } = getDepartureCardTheme(tour);
  const { icon: tagIcon, label: personalityLabel } = getDepartureExperienceTag(tour);
  const groupLabel = getDepartureGroupSizeLabel(tour);
  const dateLabel = formatDepartureDateLabel(tour);
  const duration = tour?.durationLabel || tour?.duration || '';
  const amount = resolveTourPriceAmount(tour?.startingPrice, tour?.price);
  const priceLabel = amount > 0 ? `From ₹${amount.toLocaleString('en-IN')}` : 'Price on request';
  const teaser = getDepartureStoryTeaser(tour);
  const emotionalInvite = getDepartureEmotionalInvite(tour);
  const showReserve = isGroupDepartureTour(tour);
  const reserveHref = buildReserveSeatHref(tour, whatsappNumber);

  return (
    <article
      className={`departure-tour-card departure-tour-card--${themeSlug} ${className} group h-full`}
      data-tour-id={tour?.id ?? undefined}
      data-journey-theme={themeSlug}
    >
      <div className="departure-tour-card__shell flex h-full flex-col overflow-hidden">
        <Link
          href={detailHref}
          className="departure-tour-card__media-link block shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-cta/55 focus-visible:ring-inset"
        >
          <div className="departure-tour-card__media">
            <img src={imageSrc} alt="" className="departure-tour-card__img" loading="lazy" />
            <div className="departure-tour-card__overlay" aria-hidden />
            <div className="departure-tour-card__media-tint" aria-hidden />
            {personalityLabel ? (
              <span className="departure-tour-card__personality-tag">
                <span className="departure-tour-card__personality-icon" aria-hidden>
                  {tagIcon}
                </span>
                {personalityLabel}
              </span>
            ) : null}
            <p className="departure-tour-card__group">
              <span className="departure-tour-card__group-dot" aria-hidden />
              {groupLabel}
            </p>
          </div>
        </Link>

        <div className="departure-tour-card__inner flex flex-1 flex-col text-center">
          <Link
            href={detailHref}
            className="departure-tour-card__title-link rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-cta/50 focus-visible:ring-offset-2"
          >
            <h3 className="departure-tour-card__title">{tour.title}</h3>
          </Link>

          <p className="departure-tour-card__meta">
            <span>{dateLabel}</span>
            {duration ? (
              <>
                <span className="departure-tour-card__meta-dot" aria-hidden>
                  ·
                </span>
                <span>{duration}</span>
              </>
            ) : null}
          </p>

          <p className="departure-tour-card__teaser">{teaser}</p>

          <div className="departure-tour-card__footer">
            <p className="departure-tour-card__price">{priceLabel}</p>
            <p className="departure-tour-card__pay-note">{PAY_NOTE}</p>

            <div className="departure-tour-card__actions">
              <Link href={detailHref} className="departure-tour-card__btn departure-tour-card__btn--primary">
                <span className="departure-tour-card__btn-label">Explore Journey</span>
                <svg className="departure-tour-card__btn-arrow h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              {showReserve ? (
                <a
                  href={reserveHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="departure-tour-card__invite-link"
                >
                  {emotionalInvite}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
