'use client';

import Link from 'next/link';
import {
  getCategoryBrowseHref,
  getCategoryEnquiryHref,
} from '@/lib/customizedJourneyCategories';

export default function CustomizedJourneyCategoryCard({ category }) {
  const browseHref = getCategoryBrowseHref(category);
  const enquiryHref = getCategoryEnquiryHref(category);

  return (
    <article
      className={`customized-journey-card customized-journey-card--${category.theme} group h-full`}
      data-category={category.id}
    >
      <div className="customized-journey-card__shell flex h-full flex-col overflow-hidden">
      <Link
        href={browseHref}
        className="customized-journey-card__media-link block shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-cta/50 focus-visible:ring-inset"
      >
        <div className="customized-journey-card__media">
          <img src={category.image} alt="" className="customized-journey-card__img" loading="lazy" />
          <div className="customized-journey-card__overlay" aria-hidden />
          <div className="customized-journey-card__tint" aria-hidden />
        </div>
      </Link>

      <div className="customized-journey-card__body flex flex-1 flex-col">
        <Link
          href={browseHref}
          className="customized-journey-card__title-link rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-cta/45"
        >
          <h3 className="customized-journey-card__title">{category.title}</h3>
        </Link>
        <p className="customized-journey-card__story">{category.story}</p>
        <div className="customized-journey-card__actions">
          <Link href={enquiryHref} className="customized-journey-card__btn">
            Plan your journey
          </Link>
          <Link href={browseHref} className="customized-journey-card__link">
            Explore ideas
          </Link>
        </div>
      </div>
      </div>
    </article>
  );
}
