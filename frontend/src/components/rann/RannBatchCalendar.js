import RannSectionHeading from '@/components/rann/RannSectionHeading';
import {
  BATCH_THEME_LEGEND,
  getBatchThemeLegendItem,
  resolveBatchPresentation,
} from '@/lib/rannBatchThemes';

function BatchLegend() {
  return (
    <div className="rann-batch-legend mb-6 flex flex-wrap items-center gap-2 sm:gap-3">
      <span className="mr-1 text-[11px] font-semibold uppercase tracking-wider text-foreground/55">
        Special departures
      </span>
      {BATCH_THEME_LEGEND.map((key) => {
        const theme = getBatchThemeLegendItem(key);
        if (!theme) return null;
        return (
          <span key={key} className={`rann-batch-badge rann-batch-badge--legend ${theme.badgeClass}`}>
            <span aria-hidden>{theme.emoji}</span>
            {theme.label}
          </span>
        );
      })}
      <span className="rann-batch-badge rann-batch-badge--legend rann-batch-badge--standard">
        Standard batch
      </span>
    </div>
  );
}

function BatchCard({ batch }) {
  const { primary, badges, isSpecial, cardClass } = resolveBatchPresentation(batch);

  return (
    <article className={`rann-batch-card ${cardClass}`}>
      {isSpecial && primary.decor ? (
        <span className="rann-batch-card__decor" aria-hidden>
          {primary.decor}
        </span>
      ) : null}
      {isSpecial && primary.emoji ? (
        <span className="rann-batch-card__watermark" aria-hidden>
          {primary.emoji}
        </span>
      ) : null}

      <div className="rann-batch-card__head">
        <span className="rann-batch-card__number">Batch #{batch.batch}</span>
        {isSpecial ? (
          <div className="flex flex-wrap justify-end gap-1.5">
            {badges.map((theme) => (
              <span key={theme.key} className={`rann-batch-badge ${theme.badgeClass}`}>
                {theme.emoji ? <span aria-hidden>{theme.emoji}</span> : null}
                {theme.label}
              </span>
            ))}
          </div>
        ) : (
          <span className="rann-batch-badge rann-batch-badge--standard">Standard</span>
        )}
      </div>

      <p className="rann-batch-card__dates">{batch.dates}</p>
      <p className="rann-batch-card__price">{batch.price}</p>
      <p className="rann-batch-card__highlight">{batch.highlight}</p>

      {batch.tags?.length ? (
        <div className="rann-batch-card__tags">
          {batch.tags.map((tag) => (
            <span key={tag} className="rann-batch-card__tag">
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </article>
  );
}

/**
 * @param {{ batches?: Array<{ batch: number; dates: string; price: string; highlight: string; tags?: string[]; specialTypes?: string[] }> }} props
 */
export default function RannBatchCalendar({ batches = [] }) {
  if (!batches.length) return null;

  return (
    <section id="batch-calendar" className="section-tone-cream scroll-mt-24 py-12 md:py-16">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <RannSectionHeading
          eyebrow="Group departures"
          title="2026–27 Batch Calendar"
          lede="Ten planned group batches across the official Rann Utsav season — spot Full Moon, festive, and signature departures at a glance."
        />

        <BatchLegend />

        <div className="rann-batch-grid">
          {batches.map((row) => (
            <BatchCard key={row.batch} batch={row} />
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-foreground/65">
          Prices indicative for Group Departure from Mumbai/Pune · 3AC upgrades &amp; add-ons quoted at
          confirmation
        </p>
      </div>
    </section>
  );
}
