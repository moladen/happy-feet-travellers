import Link from 'next/link';
import RannSectionHeading from '@/components/rann/RannSectionHeading';
import { getBatchDepartureName, resolveBatchPrice, splitBatchCalendar } from '@/lib/rannBatchThemes';
import { resolveBatchTourHref, RANN_BATCH_LINK_HASH } from '@/lib/batchTourLinks';
import { RANN_SEASON_PATH } from '@/lib/rannSeasonContent';

export { RANN_BATCH_LINK_HASH };

function CalendarIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
    </svg>
  );
}

function BatchTableRow({ batch, variant, landingHref }) {
  const name = getBatchDepartureName(batch);
  const badge = String(batch?.badge || '').trim();
  const href = resolveBatchTourHref(batch, landingHref);
  const price = resolveBatchPrice(batch, variant);
  const goesToTour = Boolean(String(batch?.tourSlug || batch?.tourId || batch?.slug || '').trim());

  return (
    <tr className={`rann-cal-row rann-cal-row--${variant}${goesToTour ? ' rann-cal-row--linked' : ''}`}>
      <td className="rann-cal-row__dates">
        <Link href={href} className="rann-cal-row__hit">
          <span className="rann-cal-row__date-inner">
            <CalendarIcon className="rann-cal-row__cal-icon" />
            <span>{batch.dates || batch.date}</span>
            {badge ? <span className="rann-cal-row__badge">{badge}</span> : null}
          </span>
        </Link>
      </td>
      <td className="rann-cal-row__name">
        <Link href={href} className="rann-cal-row__link">
          {name}
        </Link>
      </td>
      <td className="rann-cal-row__price">
        <Link href={href} className="rann-cal-row__hit rann-cal-row__hit--price">
          <span className={`rann-cal-price rann-cal-price--${variant}`}>{price}</span>
        </Link>
      </td>
    </tr>
  );
}

function SpecialDeparturesTable({ rows, landingHref }) {
  if (!rows.length) return null;

  return (
    <div className="rann-cal-table rann-cal-table--special">
      <div className="rann-cal-table__banner">
        <span className="rann-cal-table__banner-moon" aria-hidden>
          🌕
        </span>
        <h3 className="rann-cal-table__banner-title">Full Moon &amp; New Year Special Departures</h3>
        <span className="rann-cal-table__banner-stars" aria-hidden>
          ✦ ✦
        </span>
      </div>
      <div className="rann-cal-table__scroll">
        <table className="rann-cal-table__grid">
          <thead>
            <tr>
              <th scope="col">Batch dates</th>
              <th scope="col">Departure name</th>
              <th scope="col">Price</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((batch) => (
              <BatchTableRow
                key={batch.batch ?? `${batch.dates}-${batch.departureName}`}
                batch={batch}
                variant="special"
                landingHref={landingHref}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RegularDeparturesTable({ rows, landingHref }) {
  if (!rows.length) return null;

  return (
    <div className="rann-cal-table rann-cal-table--regular">
      <div className="rann-cal-table__regular-head">
        <span className="rann-cal-table__regular-art" aria-hidden>
          🏜️ 🐪 🌴
        </span>
        <div className="rann-cal-table__regular-titles">
          <div className="rann-cal-table__regular-rule">
            <span aria-hidden>◆</span>
            <span>Regular departures</span>
            <span aria-hidden>◆</span>
          </div>
          <p className="rann-cal-table__regular-tagline">Amazing experiences, every single time!</p>
        </div>
      </div>
      <div className="rann-cal-table__scroll">
        <table className="rann-cal-table__grid">
          <thead>
            <tr>
              <th scope="col">Batch dates</th>
              <th scope="col">Departure name</th>
              <th scope="col">Price</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((batch) => (
              <BatchTableRow
                key={batch.batch ?? `${batch.dates}-${batch.departureName}`}
                batch={batch}
                variant="regular"
                landingHref={landingHref}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * @param {{
 *   batches?: Array<object>;
 *   landingHref?: string;
 * }} props
 */
export default function RannBatchCalendar({ batches = [], landingHref = RANN_SEASON_PATH }) {
  if (!batches.length) return null;

  const { special, regular } = splitBatchCalendar(batches);
  const resolvedLandingHref = String(landingHref || RANN_SEASON_PATH).trim() || RANN_SEASON_PATH;

  return (
    <section id="batch-calendar" className="rann-cal-section section-tone-cream scroll-mt-24 py-12 pb-24 md:py-16 md:pb-28">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6">
        <RannSectionHeading
          eyebrow="Group departures"
          title="2026–27 Batch Calendar"
          lede="Full Moon & festive specials alongside regular group batches — fixed dates, transparent pricing, Mumbai/Pune train coordination."
        />

        <div className="rann-cal-stack">
          <SpecialDeparturesTable rows={special} landingHref={resolvedLandingHref} />
          <RegularDeparturesTable rows={regular} landingHref={resolvedLandingHref} />
        </div>

        <p className="rann-cal-promo">
          Book Early to Pay Less.
          <br />
          DM for Discount Offers.
        </p>

        <p className="rann-cal-footnote">
          Prices indicative for Group Departure from Mumbai/Pune · 3AC upgrades &amp; add-ons quoted at
          confirmation
        </p>
      </div>
    </section>
  );
}
