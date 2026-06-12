import Image from 'next/image';
import Link from 'next/link';
import { FULL_MOON_SECTION, resolveFullMoonCalendar, resolveFullMoonSection } from '@/lib/rannSeasonContent';
import { sanitiseStockImageUrl } from '@/lib/stockImages';

function FullMoonCard({ entry, badgeLabel }) {
  const dates = entry.dates || entry.date || '';

  return (
    <article className="rann-full-moon-card">
      <span className="rann-full-moon-card__glow" aria-hidden />
      <span className="rann-full-moon-card__watermark" aria-hidden>
        🌕
      </span>

      <div className="rann-full-moon-card__head">
        {entry.batch ? (
          <span className="rann-full-moon-card__batch">Batch #{entry.batch}</span>
        ) : (
          <span className="rann-full-moon-card__batch">Premium departure</span>
        )}
        <span className="rann-full-moon-card__badge">
          <span aria-hidden>🌕</span>
          {badgeLabel}
        </span>
      </div>

      <p className="rann-full-moon-card__dates">{dates}</p>
      {entry.price ? <p className="rann-full-moon-card__price">{entry.price}</p> : null}
      {entry.highlight || entry.label ? (
        <p className="rann-full-moon-card__highlight">{entry.highlight || entry.label}</p>
      ) : null}

      {entry.tags?.length ? (
        <div className="rann-full-moon-card__tags">
          {entry.tags.map((tag) => (
            <span key={tag} className="rann-full-moon-card__tag">
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </article>
  );
}

/**
 * @param {{ page?: object; section?: object; calendar?: object[] }} props
 */
export default function RannFullMoonSection({ page, section, calendar }) {
  const sectionContent = section || (page ? resolveFullMoonSection(page) : FULL_MOON_SECTION);
  const entries = calendar || (page ? resolveFullMoonCalendar(page) : []);

  if (sectionContent.enabled === false || !entries.length) return null;

  const backgroundImage = sanitiseStockImageUrl(
    sectionContent.backgroundImage || FULL_MOON_SECTION.backgroundImage
  );
  const badgeLabel = sectionContent.badgeLabel || FULL_MOON_SECTION.badgeLabel;

  return (
    <section id="full-moon-calendar" className="rann-full-moon-section scroll-mt-24">
      <div className="rann-full-moon-section__backdrop" aria-hidden>
        <Image
          src={backgroundImage}
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="rann-full-moon-section__overlay" />
      </div>

      <div className="rann-full-moon-section__inner container mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-20">
        <div className="rann-full-moon-section__intro mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#c8d4ff]">
            {sectionContent.eyebrow}
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-white md:text-4xl">{sectionContent.title}</h2>
          <p className="mt-4 text-sm leading-relaxed text-white/88 md:text-base">{sectionContent.lede}</p>
        </div>

        <div className="rann-full-moon-grid mt-10">
          {entries.map((entry, index) => {
            const key = [entry.batch, entry.dates, entry.date, index].filter(Boolean).join('-');
            return <FullMoonCard key={key} entry={entry} badgeLabel={badgeLabel} />;
          })}
        </div>

        <p className="mt-10 text-center text-sm text-white/78">
          Compare all group departures in our{' '}
          <Link
            href="#batch-calendar"
            className="font-semibold text-white underline decoration-white/40 underline-offset-4 transition hover:decoration-white"
          >
            full batch calendar
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
