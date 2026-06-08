import Image from 'next/image';
import Link from 'next/link';
import { packageDetailPath } from '@/services/landingPageService';

/**
 * @param {{ pkg: object; landingSlug: string }} props
 */
const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=1200&h=900&fit=crop';

export default function RannPackageGridCard({ pkg, landingSlug }) {
  const name = pkg.name || pkg.title || 'Package';
  const image = pkg.featuredImage || pkg.image || FALLBACK_IMAGE;
  const highlights = Array.isArray(pkg.highlights) ? pkg.highlights : [];
  const detailHref =
    pkg.viewDetailsUrl || (landingSlug && pkg.slug ? packageDetailPath(landingSlug, pkg.slug) : '#');
  return (
    <article className="rann-package-grid-card flex h-full flex-col overflow-hidden rounded-2xl border border-[#dceaf5] bg-white shadow-sm transition hover:shadow-md">
      <div className="relative h-44 bg-section-alt">
        <Image src={image} alt={name} fill className="object-cover" sizes="(max-width: 640px) 100vw, 33vw" />
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="text-lg" aria-hidden>
          {pkg.emoji}
        </p>
        <h3 className="mt-1 font-display text-lg font-bold text-primary">{name}</h3>
        <p className="mt-1 text-xs font-semibold text-secondary">{pkg.duration}</p>
        <p className="mt-2 text-sm font-bold text-cta">{pkg.startingPrice}</p>
        <ul className="mt-3 flex-1 space-y-1.5">
          {highlights.slice(0, 3).map((h) => (
            <li key={h} className="text-xs leading-snug text-foreground/75">
              • {h}
            </li>
          ))}
        </ul>
        <Link
          href={detailHref}
          className="mt-4 inline-flex items-center justify-center gap-1 rounded-xl border border-primary/15 bg-[#f8fbff] px-4 py-2.5 text-sm font-semibold text-primary transition hover:border-cta/35 hover:text-cta"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}
