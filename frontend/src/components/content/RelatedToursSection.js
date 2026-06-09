import Link from 'next/link';
import Image from 'next/image';
import { getTourDetailHref } from '@/lib/tourDisplay';
import { resolveTourPriceAmount } from '@/lib/tourPrice';

/**
 * @param {{ tours?: object[]; landingPage?: object | null; title?: string }} props
 */
export default function RelatedToursSection({
  tours = [],
  landingPage = null,
  title = 'Plan your trip',
}) {
  const hasTours = tours.length > 0;
  const hasPackages = landingPage?.packages?.length > 0;
  if (!hasTours && !hasPackages && !landingPage?.href) return null;

  return (
    <section className="content-crosslink mt-10 rounded-2xl border border-[#dceaf7] bg-[#f8fbff] p-6 md:p-8" aria-labelledby="related-tours-heading">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary">View tours</p>
          <h2 id="related-tours-heading" className="mt-1 font-display text-2xl font-bold text-primary">
            {title}
          </h2>
        </div>
        {landingPage?.href ? (
          <Link
            href={landingPage.href}
            className="rounded-full border border-primary bg-white px-4 py-2 text-sm font-semibold text-primary transition hover:bg-section-alt"
          >
            {landingPage.title || 'Season packages'} →
          </Link>
        ) : null}
      </div>

      {hasPackages ? (
        <div className="mt-6">
          <p className="mb-3 text-sm font-semibold text-primary">Packages on {landingPage.title}</p>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {landingPage.packages.map((pkg) => (
              <li key={pkg.id || pkg.slug}>
                <Link
                  href={pkg.href}
                  className="flex h-full flex-col overflow-hidden rounded-xl border border-[#dceaf7] bg-white shadow-sm transition hover:border-cta/40 hover:shadow-md"
                >
                  {pkg.featuredImage ? (
                    <div className="relative h-36 w-full">
                      <Image src={pkg.featuredImage} alt={pkg.name} fill className="object-cover" sizes="33vw" />
                    </div>
                  ) : null}
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="font-semibold text-primary">{pkg.name}</h3>
                    {pkg.shortDescription ? (
                      <p className="mt-1 line-clamp-2 text-xs text-foreground/70">{pkg.shortDescription}</p>
                    ) : null}
                    <p className="mt-auto pt-3 text-sm font-bold text-cta">
                      {pkg.startingPrice}
                      {pkg.duration ? <span className="ml-2 font-normal text-foreground/60">{pkg.duration}</span> : null}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {hasTours ? (
        <ul className={`grid gap-4 sm:grid-cols-2 ${hasPackages ? 'mt-6' : 'mt-6'}`}>
          {tours.map((tour) => {
            const href = getTourDetailHref(tour);
            const price = resolveTourPriceAmount(tour.startingPrice, tour.price);
            return (
              <li key={tour.id || tour.slug}>
                <Link
                  href={href}
                  className="flex gap-4 rounded-xl border border-[#dceaf7] bg-white p-3 shadow-sm transition hover:border-cta/40 hover:shadow-md"
                >
                  <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-section-alt">
                    {tour.coverImage || tour.image ? (
                      <Image
                        src={tour.coverImage || tour.image}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-2 text-sm font-bold text-primary">{tour.title}</h3>
                    {tour.destination ? (
                      <p className="mt-0.5 text-xs text-foreground/65">{tour.destination}</p>
                    ) : null}
                    <p className="mt-1 text-sm font-semibold text-cta">₹{price.toLocaleString('en-IN')}</p>
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
