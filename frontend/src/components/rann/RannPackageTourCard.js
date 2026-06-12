import Link from 'next/link';
import { resolveRannPackageBadge } from '@/lib/rannSeasonContent';
import { sanitiseStockImageUrl } from '@/lib/stockImages';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1516939884455-1445c8652f83?auto=format&fit=crop&w=1200&q=80';

const THEME_BY_CATEGORY = {
  group: 'friends',
  joining: 'firsttimer',
  land: 'adventure',
  premium: 'honeymoon',
  customized: 'family',
};

const PAY_NOTE = 'Transparent pricing · priority access available';

/**
 * Tour-card style package card — mirrors departure cards for consistent UX.
 * @param {{ pkg: object; landingSlug: string; className?: string }} props
 */
export default function RannPackageTourCard({ pkg, landingSlug, className = '' }) {
  const imageSrc = sanitiseStockImageUrl(pkg.featuredImage || pkg.image || FALLBACK_IMAGE);
  const detailHref = `/${landingSlug}/packages/${pkg.slug}`;
  const category = pkg.category || 'group';
  const themeSlug = THEME_BY_CATEGORY[category] || 'scenic';
  const audienceBadge = resolveRannPackageBadge(pkg);
  const displayTitle = pkg.emoji ? `${pkg.emoji} ${pkg.name}` : pkg.name;
  const duration = pkg.duration || '';
  const priceLabel = pkg.startingPrice || 'Price on request';

  return (
    <article
      className={`departure-tour-card departure-tour-card--${themeSlug} ${className} group h-full`}
      data-package-slug={pkg.slug}
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
            <span className="departure-tour-card__personality-tag">
              <span className="departure-tour-card__personality-icon" aria-hidden>
                {pkg.emoji || '🏜️'}
              </span>
              Rann Season 2026–27
            </span>
            {audienceBadge ? (
              <p
                className={`departure-tour-card__audience-badge departure-tour-card__audience-badge--${audienceBadge.tone || 'default'}`}
              >
                {audienceBadge.emoji ? (
                  <span className="departure-tour-card__audience-badge-emoji" aria-hidden>
                    {audienceBadge.emoji}
                  </span>
                ) : null}
                {audienceBadge.label}
              </p>
            ) : null}
          </div>
        </Link>

        <div className="departure-tour-card__inner flex flex-1 flex-col text-center">
          <Link
            href={detailHref}
            className="departure-tour-card__title-link rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-cta/50 focus-visible:ring-offset-2"
          >
            <h3 className="departure-tour-card__title">{displayTitle}</h3>
          </Link>

          {duration ? (
            <p className="departure-tour-card__meta">
              <span>{duration}</span>
            </p>
          ) : null}

          <p className="departure-tour-card__teaser">{pkg.shortDescription}</p>

          <div className="departure-tour-card__footer">
            <p className="departure-tour-card__price">{priceLabel}</p>
            <p className="departure-tour-card__pay-note">{PAY_NOTE}</p>

            <div className="departure-tour-card__actions">
              <Link href={detailHref} className="departure-tour-card__btn departure-tour-card__btn--primary">
                <span className="departure-tour-card__btn-label">View Package</span>
                <svg
                  className="departure-tour-card__btn-arrow h-4 w-4 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
