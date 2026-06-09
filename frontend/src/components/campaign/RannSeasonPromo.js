import Image from 'next/image';
import Link from 'next/link';
import {
  RANN_SEASON_DATES,
  RANN_SEASON_PATH,
  RANN_SEASON_TAGLINE,
  RANN_SEASON_TITLE,
} from '@/lib/rannSeason';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=900&h=600&fit=crop';

/**
 * Cross-links the Rann season landing page from departures + personalized surfaces.
 * @param {{ variant?: 'compact' | 'page'; className?: string }} props
 */
export default function RannSeasonPromo({ variant = 'compact', className = '' }) {
  const isPage = variant === 'page';

  return (
    <aside
      className={`rann-season-promo overflow-hidden rounded-2xl border border-[#e5d4bc] bg-gradient-to-br from-[#fffdf9] via-[#faf6ef] to-[#f5efe3] shadow-[0_16px_40px_-28px_rgba(26,43,60,0.28)] ${
        isPage ? 'md:rounded-3xl' : ''
      } ${className}`.trim()}
      aria-labelledby="rann-season-promo-title"
    >
      <div className={`flex flex-col ${isPage ? 'md:flex-row md:items-stretch' : 'sm:flex-row sm:items-stretch'}`}>
        <div
          className={`relative shrink-0 bg-[#0f2844] ${
            isPage ? 'h-44 md:h-auto md:w-[min(42%,18rem)]' : 'h-36 sm:h-auto sm:w-[min(38%,11rem)]'
          }`}
        >
          <Image
            src={HERO_IMAGE}
            alt=""
            fill
            className="object-cover opacity-90"
            sizes={isPage ? '(max-width: 768px) 100vw, 18rem' : '(max-width: 640px) 100vw, 11rem'}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f2844]/55 to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#0f2844]/25" />
          <span className="absolute left-3 top-3 rounded-full bg-cta px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            Season 2026–27
          </span>
        </div>

        <div className={`flex min-w-0 flex-1 flex-col justify-center ${isPage ? 'p-5 sm:p-6 md:p-7' : 'p-4 sm:p-5'}`}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-secondary sm:text-xs">
            Group departures &amp; customized tours
          </p>
          <h3
            id="rann-season-promo-title"
            className={`mt-1.5 font-display font-bold leading-tight text-primary ${
              isPage ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'
            }`}
          >
            {RANN_SEASON_TITLE}
          </h3>
          <p className="mt-1 text-xs font-semibold text-cta">{RANN_SEASON_DATES}</p>
          <p className={`mt-2 leading-relaxed text-foreground/78 ${isPage ? 'text-sm md:text-[15px]' : 'text-xs sm:text-sm'}`}>
            {RANN_SEASON_TAGLINE}
          </p>
          <ul className={`mt-3 flex flex-wrap gap-2 text-[11px] font-medium text-foreground/70 ${isPage ? 'sm:text-xs' : ''}`}>
            <li className="rounded-full border border-[#e5d4bc] bg-white/80 px-2.5 py-1">10 group batches</li>
            <li className="rounded-full border border-[#e5d4bc] bg-white/80 px-2.5 py-1">FIT &amp; family packages</li>
            <li className="rounded-full border border-[#e5d4bc] bg-white/80 px-2.5 py-1">Early-bird priority</li>
          </ul>
          <div className={`mt-4 flex flex-wrap items-center gap-3 ${isPage ? '' : ''}`}>
            <Link
              href={RANN_SEASON_PATH}
              className="inline-flex items-center gap-1.5 rounded-xl bg-cta px-4 py-2.5 text-xs font-bold text-white transition hover:bg-cta-hover sm:text-sm"
            >
              Explore season page
              <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href={`${RANN_SEASON_PATH}#priority-interest`}
              className="text-xs font-semibold text-primary underline-offset-2 hover:underline sm:text-sm"
            >
              Get priority access
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
