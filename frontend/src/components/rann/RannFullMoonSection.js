import Link from 'next/link';
import RannSectionHeading from '@/components/rann/RannSectionHeading';

/**
 * @param {{ calendar?: Array<{ batch?: number; dates?: string; price?: string; highlight?: string; label?: string }> }} props
 */
export default function RannFullMoonSection({ calendar }) {
  if (!calendar?.length) return null;

  return (
    <section id="full-moon-calendar" className="section-tone-cream scroll-mt-24 py-12 md:py-16">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <RannSectionHeading
          eyebrow="Peak nights"
          title="Full Moon Calendar"
          lede="Our flagship group batches aligned with full moon windows — when the White Rann glows under moonlit skies."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {calendar.map((entry) => (
            <article
              key={entry.batch || entry.dates}
              className="rann-full-moon-card rounded-2xl border border-[#dceaf5] bg-white p-5 shadow-sm"
            >
              {entry.batch ? (
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
                  Batch {entry.batch}
                </p>
              ) : null}
              <p className="mt-2 font-display text-lg font-bold text-primary">{entry.dates}</p>
              {entry.highlight || entry.label ? (
                <p className="mt-2 text-sm leading-relaxed text-foreground/75">{entry.highlight || entry.label}</p>
              ) : null}
              {entry.price ? (
                <p className="mt-3 text-sm font-bold text-cta">{entry.price}</p>
              ) : null}
            </article>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-foreground/70">
          See all 10 group batches in our{' '}
          <Link href="#batch-calendar" className="font-semibold text-primary underline-offset-2 hover:underline">
            batch calendar
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
