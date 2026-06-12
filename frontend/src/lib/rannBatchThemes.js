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
