'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getTourDetailHref } from '@/lib/tourDisplay';
import {
  getPersonalizedExperienceTags,
  getPersonalizedStoryTeaser,
} from '@/lib/personalizedTourExperience';
import { resolveTourPriceAmount } from '@/lib/tourPrice';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80';

/**
 * @param {{ tour: object; variant?: 'default' | 'experience' }} props
 * experience = homepage Personalized Tours (emotional tags, no marketplace pricing)
 */
export default function PersonalizedTourCard({ tour, variant = 'default' }) {
  const isExperience = variant === 'experience';
  const primarySrc = tour?.coverImage || tour?.image || FALLBACK_IMAGE;
  const [imageSrc, setImageSrc] = useState(primarySrc);

  useEffect(() => {
    setImageSrc(primarySrc);
  }, [primarySrc]);
  const detailHref = getTourDetailHref(tour);
  const tags = getPersonalizedExperienceTags(tour, isExperience ? 2 : 1);
  const ctaLabel = isExperience ? 'Explore this journey' : tour?.ctaData?.primaryLabel || 'Explore journey';
  const duration = tour?.durationLabel || tour?.duration || 'Flexible pace';
  const teaser = isExperience ? getPersonalizedStoryTeaser(tour) : getDefaultTeaser(tour);
  const startingPriceAmount = resolveTourPriceAmount(tour?.startingPrice, tour?.price);
  const showPriceRibbon = isExperience && startingPriceAmount > 0;

  return (
    <Link
      href={detailHref}
      className={`personalized-tour-card personalized-tour-card--${isExperience ? 'experience' : 'default'} group block h-full rounded-[1.35rem] focus:outline-none focus-visible:ring-2 focus-visible:ring-cta/55 focus-visible:ring-offset-2`}
    >
      <article className="personalized-tour-card__inner flex h-full flex-col overflow-hidden">
        <div className="personalized-tour-card__media">
          <img
            src={imageSrc}
            alt=""
            className="personalized-tour-card__img"
            loading="lazy"
            onError={() => {
              if (imageSrc !== FALLBACK_IMAGE) setImageSrc(FALLBACK_IMAGE);
            }}
          />
          <div className="personalized-tour-card__overlay" aria-hidden />
          {showPriceRibbon ? (
            <div className="personalized-tour-card__price-ribbon" aria-label={`Starting from ₹${startingPriceAmount.toLocaleString('en-IN')}`}>
              <span className="personalized-tour-card__price-ribbon-label">Starting From</span>
              <span className="personalized-tour-card__price-ribbon-amount">
                ₹{startingPriceAmount.toLocaleString('en-IN')}
              </span>
            </div>
          ) : null}
          <div className="personalized-tour-card__tags" aria-label="Experience type">
            {tags.map((tag) => (
              <span key={`${tag.icon}-${tag.label}`} className="personalized-tour-card__tag">
                <span aria-hidden>{tag.icon}</span> {tag.label}
              </span>
            ))}
          </div>
          {!isExperience && tour?.urgency ? (
            <span className="personalized-tour-card__badge">{tour.urgency}</span>
          ) : null}
        </div>

        <div className="personalized-tour-card__body">
          <h3 className="personalized-tour-card__title">{tour.title}</h3>
          {isExperience ? (
            <p className="personalized-tour-card__mood">{duration}</p>
          ) : (
            <p className="personalized-tour-card__meta">
              <span>{duration}</span>
              <span className="personalized-tour-card__meta-dot" aria-hidden>
                ·
              </span>
              <span>{getPriceLabel(tour)}</span>
            </p>
          )}
          <p className="personalized-tour-card__teaser">{teaser}</p>
          <span className="personalized-tour-card__cta">
            {ctaLabel}
            <svg className="personalized-tour-card__cta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </div>
      </article>
    </Link>
  );
}

function getDefaultTeaser(tour) {
  const raw = tour?.description ? String(tour.description).trim() : '';
  if (!raw) return getPersonalizedStoryTeaser(tour);
  return raw.length > 110 ? `${raw.slice(0, 110).trim()}…` : raw;
}

function getPriceLabel(tour) {
  const amount = resolveTourPriceAmount(tour?.startingPrice, tour?.price);
  return amount > 0 ? `From ₹${amount.toLocaleString('en-IN')}` : 'Tailored quote';
}
