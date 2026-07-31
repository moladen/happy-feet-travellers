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

function toDateKey(dateLike) {
  const p = ymdParts(dateLike);
  if (!p) return '';
  return `${p.y}-${pad2(p.m + 1)}-${pad2(p.d)}`;
}

function parseBatchDateRange(batch) {
  const text = String(batch?.dates || batch?.date || '').trim();
  if (!text) return null;

  const sameMonth = text.match(/^(\d{1,2})\s*[–\-]\s*(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
  if (sameMonth) {
    const m = MONTHS[sameMonth[3].slice(0, 3).toLowerCase()];
    if (m === undefined) return null;
    const y = Number(sameMonth[4]);
    return {
      startKey: `${y}-${pad2(m + 1)}-${pad2(Number(sameMonth[1]))}`,
      endKey: `${y}-${pad2(m + 1)}-${pad2(Number(sameMonth[2]))}`,
    };
  }

  const crossMonth = text.match(
    /^(\d{1,2})\s+([A-Za-z]+)\s*[–\-]\s*(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/
  );
  if (crossMonth) {
    const m1 = MONTHS[crossMonth[2].slice(0, 3).toLowerCase()];
    const m2 = MONTHS[crossMonth[4].slice(0, 3).toLowerCase()];
    if (m1 === undefined || m2 === undefined) return null;
    const y = Number(crossMonth[5]);
    const endY = m2 < m1 ? y + 1 : y;
    return {
      startKey: `${y}-${pad2(m1 + 1)}-${pad2(Number(crossMonth[1]))}`,
      endKey: `${endY}-${pad2(m2 + 1)}-${pad2(Number(crossMonth[3]))}`,
    };
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

function findTourForBatch(batch, tours) {
  if (!Array.isArray(tours) || !tours.length) return null;

  const explicit = explicitTourKey(batch);
  if (explicit) {
    const byKey = tours.find((t) => String(t.slug) === explicit || String(t.id) === explicit);
    if (byKey) return byKey;
  }

  const range = parseBatchDateRange(batch);
  if (range?.startKey) {
    const byStart = tours.filter((t) => toDateKey(t.startDate) === range.startKey);
    if (byStart.length === 1) return byStart[0];
    if (byStart.length > 1) return byStart.find(isRannRelatedTour) || byStart[0];

    const byRange = tours.filter((t) => {
      const start = toDateKey(t.startDate);
      const end = toDateKey(t.endDate) || start;
      if (!start) return false;
      return start <= range.endKey && end >= range.startKey;
    });
    const preferred = byRange.filter(isRannRelatedTour);
    const pool = preferred.length ? preferred : byRange;
    if (pool.length) return pool[0];
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
 * Resolve tourSlug/tourId on groupBatches using Tour rows from the database.
 * Explicit tourSlug/tourId always win; otherwise match by start date / title.
 *
 * @param {unknown} batches
 * @param {Array<{ id: string, slug: string, startDate?: Date|string|null, endDate?: Date|string|null, title?: string, destination?: string, tags?: string[], subCategory?: string, seriesSlug?: string|null }>} tours
 */
function enrichGroupBatchesWithTours(batches, tours) {
  if (!Array.isArray(batches) || !batches.length) return batches;

  return batches.map((batch) => {
    if (!batch || typeof batch !== 'object') return batch;

    const existingKey = explicitTourKey(batch);
    if (existingKey) {
      const matched = tours.find((t) => String(t.slug) === existingKey || String(t.id) === existingKey);
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

module.exports = {
  enrichGroupBatchesWithTours,
  parseBatchDateRange,
  toDateKey,
};
