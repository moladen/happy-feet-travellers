import Image from 'next/image';
import Link from 'next/link';
import { packageDetailPath } from '@/services/landingPageService';

/**
 * @param {{ pkg: object; landingSlug: string }} props
 */
const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=1200&h=900&fit=crop';

export default function RannPackageShowcaseCard({ pkg, landingSlug }) {
  const name = pkg.name || pkg.title || 'Package';
  const image = pkg.featuredImage || pkg.image || FALLBACK_IMAGE;
  const highlights = Array.isArray(pkg.highlights) ? pkg.highlights : [];
  const detailHref =
    pkg.viewDetailsUrl || (landingSlug && pkg.slug ? packageDetailPath(landingSlug, pkg.slug) : '#');
  return (
    <article className="rann-package-showcase overflow-hidden rounded-3xl border border-[#e5d4bc] bg-white shadow-[0_20px_50px_-35px_rgba(26,43,60,0.2)]">
      <div className="relative h-52 bg-section-alt sm:h-56 md:h-60">
        <Image src={image} alt={name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-lg shadow-sm" aria-hidden>
          {pkg.emoji}
        </span>
      </div>
      <div className="p-5 sm:p-6">
        <h3 className="font-display text-xl font-bold text-primary md:text-2xl">{name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-foreground/78">{pkg.shortDescription}</p>
        <ul className="mt-4 space-y-2">
          {highlights.map((item) => (
            <li key={item} className="flex gap-2 text-sm text-foreground/80">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cta" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#efe6d8] pt-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-foreground/55">Starting price</p>
            <p className="text-lg font-bold text-cta">{pkg.startingPrice}</p>
            <p className="text-xs text-foreground/60">{pkg.duration}</p>
          </div>
          <Link
            href={detailHref}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
          >
            View Details
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
