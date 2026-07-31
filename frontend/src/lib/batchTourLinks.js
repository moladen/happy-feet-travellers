/**
 * Link Season Calendar batch rows to public tour detail pages (/tour/[slug|id]).
 * Prefer explicit tourSlug / tourId from CMS/DB; optionally enrich by matching departure dates.
 */

import { getTourDetailHref } from '@/lib/tourDisplay';
import { RANN_SEASON_PATH } from '@/lib/rannSeasonContent';

/** Scroll target on the Rann landing page when no tour link is available. */
export const RANN_BATCH_LINK_HASH = '#packages';

const MONTHS = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11,
};

function pad2(n) {
  return String(n).padStart(2, '0');
}

/** @returns {{ y: number, m: number, d: number } | null} */
function ymdParts(dateLike) {
  if (!dateLike) return null;
  if (dateLike instanceof Date && !Number.isNaN(dateLike.getTime())) {
    return {
      y: dateLike.getUTCFullYear(),
      m: dateLike.getUTCMonth(),
      d: dateLike.getUTCDate(),
    };
  }
  const s = String(dateLike).trim();
  const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) {
    return { y: Number(iso[1]), m: Number(iso[2]) - 1, d: Number(iso[3]) };
  }
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return null;
  return { y: d.getUTCFullYear(), m: d.getUTCMonth(), d: d.getUTCDate() };
}

export function toDateKey(dateLike) {
  const p = ymdParts(dateLike);
  if (!p) return '';
  return `${p.y}-${pad2(p.m + 1)}-${pad2(p.d)}`;
}

/**
 * Parse calendar label like "21 – 25 Nov 2026" or "27 Feb – 3 Mar 2027".
 * @returns {{ startKey: string, endKey: string } | null}
 */
export function parseBatchDateRange(batch) {
  const text = String(batch?.dates || batch?.date || '').trim();
  if (!text) return null;

  const sameMonth = text.match(
    /^(\d{1,2})\s*[–\-]\s*(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/
  );
  if (sameMonth) {
    const m = MONTHS[sameMonth[3].slice(0, 3).toLowerCase()];
    if (m === undefined) return null;
    const y = Number(sameMonth[4]);
    const startKey = `${y}-${pad2(m + 1)}-${pad2(Number(sameMonth[1]))}`;
    const endKey = `${y}-${pad2(m + 1)}-${pad2(Number(sameMonth[2]))}`;
    return { startKey, endKey };
  }

  const crossMonth = text.match(
    /^(\d{1,2})\s+([A-Za-z]+)\s*[–\-]\s*(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/
  );
  if (crossMonth) {
    const m1 = MONTHS[crossMonth[2].slice(0, 3).toLowerCase()];
    const m2 = MONTHS[crossMonth[4].slice(0, 3).toLowerCase()];
    if (m1 === undefined || m2 === undefined) return null;
    const y = Number(crossMonth[5]);
    const startKey = `${y}-${pad2(m1 + 1)}-${pad2(Number(crossMonth[1]))}`;
    const endY = m2 < m1 ? y + 1 : y;
    const endKey = `${endY}-${pad2(m2 + 1)}-${pad2(Number(crossMonth[3]))}`;
    return { startKey, endKey };
  }

  return null;
}

function normaliseName(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function isRannRelatedTour(tour) {
  const blob = [
    tour?.destination,
    tour?.title,
    tour?.subCategory,
    tour?.seriesSlug,
    ...(Array.isArray(tour?.tags) ? tour.tags : []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return /rann|kutch|white desert|rann utsav/.test(blob);
}

function explicitTourKey(batch) {
  return String(batch?.tourSlug || batch?.tourId || batch?.slug || '').trim();
}

/**
 * Resolve href for a calendar batch. Never hardcodes a tour URL —
 * uses tourSlug/tourId from the batch (DB/CMS) or falls back to packages hash.
 */
export function resolveBatchTourHref(batch, landingHref = RANN_SEASON_PATH) {
  const tourKey = explicitTourKey(batch);
  if (tourKey) {
    return getTourDetailHref({ slug: tourKey, id: tourKey });
  }

  const custom = String(batch?.href || batch?.url || '').trim();
  if (custom) {
    if (/^https?:\/\//i.test(custom)) return custom;
    return custom.startsWith('/') ? custom : `/${custom}`;
  }

  const base = String(landingHref || RANN_SEASON_PATH).replace(/#.*$/, '');
  return `${base}${RANN_BATCH_LINK_HASH}`;
}

function findTourForBatch(batch, tours) {
  if (!Array.isArray(tours) || !tours.length) return null;

  const explicit = explicitTourKey(batch);
  if (explicit) {
    const byKey = tours.find(
      (t) => String(t.slug) === explicit || String(t.id) === explicit
    );
    if (byKey) return byKey;
  }

  const range = parseBatchDateRange(batch);
  if (range?.startKey) {
    const byStart = tours.filter((t) => toDateKey(t.startDate) === range.startKey);
    if (byStart.length === 1) return byStart[0];
    if (byStart.length > 1) {
      return byStart.find(isRannRelatedTour) || byStart[0];
    }

    const byRange = tours.filter((t) => {
      const start = toDateKey(t.startDate);
      const end = toDateKey(t.endDate) || start;
      if (!start) return false;
      return start <= range.endKey && end >= range.startKey;
    });
    const preferred = byRange.filter(isRannRelatedTour);
    const pool = preferred.length ? preferred : byRange;
    if (pool.length === 1) return pool[0];
    if (pool.length > 1) return pool[0];
  }

  const batchName = normaliseName(batch?.departureName || batch?.highlight);
  if (batchName.length >= 8) {
    const byTitle = tours.filter((t) => {
      const title = normaliseName(t.title);
      return title && (title.includes(batchName) || batchName.includes(title));
    });
    const preferred = byTitle.filter(isRannRelatedTour);
    const pool = preferred.length ? preferred : byTitle;
    if (pool.length === 1) return pool[0];
  }

  return null;
}

/**
 * Attach tourSlug / tourId from Tour records so every matching date links to /tour/...
 * Multiple batches may resolve to the same tour (same page) when they share tourSlug/tourId.
 *
 * @param {object[]} batches
 * @param {object[]} tours
 */
export function enrichBatchesWithTourLinks(batches = [], tours = []) {
  if (!Array.isArray(batches) || !batches.length) return [];

  return batches.map((batch) => {
    const existingKey = explicitTourKey(batch);
    if (existingKey) {
      const matched = Array.isArray(tours)
        ? tours.find((t) => String(t.slug) === existingKey || String(t.id) === existingKey)
        : null;
      return {
        ...batch,
        tourSlug: matched?.slug || batch.tourSlug || existingKey,
        tourId: matched?.id || batch.tourId || undefined,
      };
    }

    const tour = findTourForBatch(batch, tours);
    if (!tour) return { ...batch };

    return {
      ...batch,
      tourSlug: tour.slug || undefined,
      tourId: tour.id || undefined,
    };
  });
}
