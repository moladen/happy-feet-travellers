/** Visual themes for special Rann group batches — inferred from data or optional `specialTypes`. */

export const BATCH_THEME_KEYS = {
  FULL_MOON: 'full-moon',
  CHRISTMAS: 'christmas',
  KITE_FESTIVAL: 'kite-festival',
  VALENTINE: 'valentine',
  STANDARD: 'standard',
};

export const BATCH_THEME_LEGEND = [
  BATCH_THEME_KEYS.FULL_MOON,
  BATCH_THEME_KEYS.CHRISTMAS,
  BATCH_THEME_KEYS.KITE_FESTIVAL,
  BATCH_THEME_KEYS.VALENTINE,
];

const THEMES = {
  [BATCH_THEME_KEYS.FULL_MOON]: {
    key: BATCH_THEME_KEYS.FULL_MOON,
    label: 'Full Moon',
    emoji: '🌕',
    cardClass: 'rann-batch-card--full-moon',
    badgeClass: 'rann-batch-badge--full-moon',
    decor: '✦',
  },
  [BATCH_THEME_KEYS.CHRISTMAS]: {
    key: BATCH_THEME_KEYS.CHRISTMAS,
    label: 'Christmas',
    emoji: '🎄',
    cardClass: 'rann-batch-card--christmas',
    badgeClass: 'rann-batch-badge--christmas',
    decor: '❄',
  },
  [BATCH_THEME_KEYS.KITE_FESTIVAL]: {
    key: BATCH_THEME_KEYS.KITE_FESTIVAL,
    label: 'Kite Festival',
    emoji: '🪁',
    cardClass: 'rann-batch-card--kite',
    badgeClass: 'rann-batch-badge--kite',
    decor: '◆',
  },
  [BATCH_THEME_KEYS.VALENTINE]: {
    key: BATCH_THEME_KEYS.VALENTINE,
    label: 'Valentine',
    emoji: '❤️',
    labelShort: 'Valentine',
    cardClass: 'rann-batch-card--valentine',
    badgeClass: 'rann-batch-badge--valentine',
    decor: '♥',
  },
  [BATCH_THEME_KEYS.STANDARD]: {
    key: BATCH_THEME_KEYS.STANDARD,
    label: 'Standard batch',
    emoji: null,
    cardClass: 'rann-batch-card--standard',
    badgeClass: '',
    decor: null,
  },
};

function inferSpecialTypes(batch) {
  if (Array.isArray(batch.specialTypes) && batch.specialTypes.length) {
    return batch.specialTypes.filter((key) => THEMES[key]);
  }

  const types = [];
  const text = `${batch.highlight || ''} ${(batch.tags || []).join(' ')}`.toLowerCase();

  if (/full moon/.test(text)) types.push(BATCH_THEME_KEYS.FULL_MOON);
  if (/christmas/.test(text)) types.push(BATCH_THEME_KEYS.CHRISTMAS);
  if (/valentine/.test(text)) types.push(BATCH_THEME_KEYS.VALENTINE);
  if (/kite|uttarayan|makar sankranti/.test(text)) types.push(BATCH_THEME_KEYS.KITE_FESTIVAL);

  return types;
}

/** Primary theme drives card background; secondary types render as extra badges. */
export function resolveBatchPresentation(batch) {
  const specialTypes = inferSpecialTypes(batch);
  const primaryKey = specialTypes.length ? specialTypes[0] : BATCH_THEME_KEYS.STANDARD;
  const primary = THEMES[primaryKey] || THEMES[BATCH_THEME_KEYS.STANDARD];
  const badges = specialTypes.map((key) => THEMES[key]).filter(Boolean);
  const isSpecial = specialTypes.length > 0;

  const comboClass =
    specialTypes.includes(BATCH_THEME_KEYS.CHRISTMAS) &&
    specialTypes.includes(BATCH_THEME_KEYS.FULL_MOON)
      ? 'rann-batch-card--christmas-moon'
      : '';

  return {
    primary,
    badges,
    isSpecial,
    cardClass: isSpecial
      ? ['rann-batch-card--special', primary.cardClass, comboClass].filter(Boolean).join(' ')
      : primary.cardClass,
  };
}

export function getBatchThemeLegendItem(key) {
  return THEMES[key] || null;
}

export function getBatchDepartureName(batch) {
  return String(batch?.departureName || batch?.highlight || '').trim();
}

/** Resolve display price from batch payload (API may use alternate field names). */
export function resolveBatchPrice(batch, variant = 'regular') {
  const raw = String(
    batch?.price || batch?.startingPrice || batch?.amount || batch?.packagePrice || ''
  ).trim();
  if (raw) return raw;
  return variant === 'special' ? '₹21,499' : '₹20,499';
}

function parseBatchStartTime(batch) {
  const text = String(batch?.dates || batch?.date || '').trim();
  const months = {
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

  // Same month: "5 – 9 Dec 2026"
  const sameMonth = text.match(/^(\d{1,2})\s*[–\-]\s*\d{1,2}\s+([A-Za-z]+)\s+(\d{4})$/);
  if (sameMonth) {
    const month = months[sameMonth[2].slice(0, 3).toLowerCase()];
    if (month !== undefined) {
      return new Date(Number(sameMonth[3]), month, Number(sameMonth[1])).getTime();
    }
  }

  // Cross month: "27 Feb – 3 Mar 2027"
  const crossMonth = text.match(
    /^(\d{1,2})\s+([A-Za-z]+)\s*[–\-]\s*\d{1,2}\s+([A-Za-z]+)\s+(\d{4})$/
  );
  if (crossMonth) {
    const month = months[crossMonth[2].slice(0, 3).toLowerCase()];
    if (month !== undefined) {
      return new Date(Number(crossMonth[4]), month, Number(crossMonth[1])).getTime();
    }
  }

  // Unknown format — keep relative order by batch number after dated rows
  const batchNo = Number(batch?.batch);
  return Number.isFinite(batchNo) ? Number.MAX_SAFE_INTEGER - 1000 + batchNo : Number.MAX_SAFE_INTEGER;
}

export function sortBatchesChronologically(batches = []) {
  return [...batches].sort((a, b) => {
    const byDate = parseBatchStartTime(a) - parseBatchStartTime(b);
    if (byDate !== 0) return byDate;
    return (Number(a?.batch) || 0) - (Number(b?.batch) || 0);
  });
}

/** Split batches into special (full moon / festive) and regular tables. */
export function splitBatchCalendar(batches = []) {
  const specialRaw = [];
  const regularRaw = [];

  for (const batch of batches) {
    const category = String(batch?.category || '').toLowerCase();
    if (category === 'special') {
      specialRaw.push(batch);
    } else if (category === 'regular') {
      regularRaw.push(batch);
    } else if (inferSpecialTypes(batch).length > 0) {
      specialRaw.push(batch);
    } else {
      regularRaw.push(batch);
    }
  }

  return {
    special: sortBatchesChronologically(specialRaw),
    regular: sortBatchesChronologically(regularRaw),
  };
}
