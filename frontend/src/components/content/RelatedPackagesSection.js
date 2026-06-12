import Link from 'next/link';
import Image from 'next/image';
import { sanitiseStockImageUrl } from '@/lib/stockImages';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1516939884455-1445c8652f83?auto=format&fit=crop&w=1200&q=80';

/**
 * @param {{ packages?: object[]; landingPage?: object | null; title?: string }} props
 */
export default function RelatedPackagesSection({
  packages = [],
  landingPage = null,
  title = 'Related packages',
}) {
  const items = packages.length ? packages : landingPage?.packages || [];
  if (!items.length && !landingPage?.href) return null;

  const hubTitle = landingPage?.title || 'Season packages';

  return (
    <section
      className="content-crosslink mt-10 rounded-2xl border border-[#e5d4bc] bg-[#fffdf9] p-6 md:p-8"
      aria-labelledby="related-packages-heading"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary">Plan your trip</p>
          <h2 id="related-packages-heading" className="mt-1 font-display text-2xl font-bold text-primary md:text-3xl">
            {title}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-foreground/75">
            Explore Rann Utsav packages and continue planning without leaving the site.
          </p>
        </div>
        {landingPage?.href ? (
          <Link
            href={landingPage.href}
            className="rounded-full border border-primary bg-white px-4 py-2 text-sm font-semibold text-primary transition hover:bg-section-alt"
          >
            {hubTitle} →
          </Link>
        ) : null}
      </div>

      {items.length > 0 ? (
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((pkg) => {
            const href = pkg.href || (landingPage?.href && pkg.slug ? `${landingPage.href}/packages/${pkg.slug}` : '#');
            const image = sanitiseStockImageUrl(pkg.featuredImage || pkg.image || FALLBACK_IMAGE);
            const displayName = pkg.emoji ? `${pkg.emoji} ${pkg.name}` : pkg.name;

            return (
              <li key={pkg.id || pkg.slug}>
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
                      Package
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="line-clamp-2 font-semibold text-primary group-hover:text-secondary">{displayName}</h3>
                    {pkg.shortDescription ? (
                      <p className="mt-2 line-clamp-3 text-sm text-foreground/70">{pkg.shortDescription}</p>
                    ) : null}
                    <p className="mt-auto pt-3 text-sm font-bold text-cta">
                      {pkg.startingPrice || 'Price on request'}
                      {pkg.duration ? (
                        <span className="ml-2 font-normal text-foreground/60">{pkg.duration}</span>
                      ) : null}
                    </p>
                    <span className="mt-2 text-xs font-semibold text-primary">View package →</span>
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
