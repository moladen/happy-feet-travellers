import Link from 'next/link';
import Image from 'next/image';
import { formatTourPriceLabel, getTourDetailHref } from '@/lib/tourDisplay';
import { sanitiseStockImageUrl } from '@/lib/stockImages';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80';

function tourCategoryLabel(category) {
  return String(category || '').toLowerCase() === 'customized' ? 'Personalized tour' : 'Group departure';
}

function toursListHref(tours) {
  const allCustomized = tours.every((t) => String(t.category || '').toLowerCase() === 'customized');
  return allCustomized ? '/customized-trips' : '/upcoming-departures';
}

function toursListLabel(tours) {
  const allCustomized = tours.every((t) => String(t.category || '').toLowerCase() === 'customized');
  return allCustomized ? 'All personalized tours' : 'All departures';
}

function formatDuration(tour) {
  if (tour.durationLabel) return tour.durationLabel;
  if (tour.duration) return `${tour.duration} days`;
  return null;
}

/**
 * @param {{ tours?: object[]; landingPage?: object | null; title?: string }} props
 */
export default function RelatedToursSection({
  tours = [],
  landingPage = null,
  title = 'Related tours & departures',
}) {
  if (!tours.length && !landingPage?.href) return null;

  return (
    <section
      className="content-crosslink mt-10 rounded-2xl border border-[#dceaf7] bg-[#f8fbff] p-6 md:p-8"
      aria-labelledby="related-tours-heading"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary">Plan your trip</p>
          <h2 id="related-tours-heading" className="mt-1 font-display text-2xl font-bold text-primary md:text-3xl">
            {title}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-foreground/75">
            Fixed departures and personalized journeys linked to this story — continue from the blog to booking.
          </p>
        </div>
        {tours.length > 0 ? (
          <Link
            href={toursListHref(tours)}
            className="rounded-full border border-primary bg-white px-4 py-2 text-sm font-semibold text-primary transition hover:bg-section-alt"
          >
            {toursListLabel(tours)}
          </Link>
        ) : null}
      </div>

      {landingPage?.href ? (
        <div className="mt-6 rounded-xl border border-[#dceaf7] bg-white px-4 py-3 text-sm">
          <span className="text-foreground/75">Season hub: </span>
          <Link href={landingPage.href} className="font-semibold text-primary hover:text-cta">
            {landingPage.title}
          </Link>
        </div>
      ) : null}

      {tours.length > 0 ? (
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tours.map((tour) => {
            const href = tour.href || getTourDetailHref(tour);
            const image = sanitiseStockImageUrl(tour.coverImage || tour.image || FALLBACK_IMAGE);
            const duration = formatDuration(tour);
            const meta = [tour.destination, tour.dateLabel, duration].filter(Boolean).join(' · ');

            return (
              <li key={tour.id || tour.slug}>
                <Link
                  href={href}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#dceaf7] bg-white shadow-sm transition hover:border-cta/35 hover:shadow-md"
                >
                  <div className="relative aspect-[16/10] bg-section-alt">
                    <Image
                      src={image}
                      alt=""
                      fill
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-white/92 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary">
                      {tourCategoryLabel(tour.category)}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="line-clamp-2 font-semibold text-primary group-hover:text-secondary">{tour.title}</h3>
                    {meta ? <p className="mt-2 line-clamp-2 text-sm text-foreground/70">{meta}</p> : null}
                    <p className="mt-auto pt-3 text-sm font-bold text-cta">{formatTourPriceLabel(tour)}</p>
                    <span className="mt-2 text-xs font-semibold text-primary">View tour →</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </section>
  );
}
