/** Map API packageCategory / admin tags to emotional micro-tags on cards */
const CATEGORY_CHIPS = {
  honeymoon: { icon: '❤️', label: 'Honeymoon' },
  'honeymoon escape': { icon: '❤️', label: 'Honeymoon' },
  'best for couples': { icon: '❤️', label: 'Honeymoon' },
  adventure: { icon: '🏔', label: 'Adventure' },
  'adventure special': { icon: '🏔', label: 'Adventure' },
  spiritual: { icon: '🕉', label: 'Spiritual' },
  'spiritual sojourn': { icon: '🕉', label: 'Spiritual' },
  family: { icon: '👨‍👩‍👧', label: 'Family Time' },
  'family time': { icon: '👨‍👩‍👧', label: 'Family Time' },
  'family getaway': { icon: '👨‍👩‍👧', label: 'Family Time' },
  'family escapes': { icon: '👨‍👩‍👧', label: 'Family Time' },
  wildlife: { icon: '🦁', label: 'Wildlife' },
  'nature escape': { icon: '🌿', label: 'Slow Travel' },
  'road trips': { icon: '🚗', label: 'Road Trips' },
  'road trip': { icon: '🚗', label: 'Road Trips' },
  mountains: { icon: '🏔', label: 'Adventure' },
  beaches: { icon: '🌊', label: 'Coastal Escape' },
  coastal: { icon: '🌊', label: 'Coastal Escape' },
  'coastal escape': { icon: '🌊', label: 'Coastal Escape' },
  'coastal retreat': { icon: '🌊', label: 'Coastal Escape' },
  snow: { icon: '❄', label: 'Snow Lovers' },
  'snow lovers': { icon: '❄', label: 'Snow Lovers' },
  'snow escapes': { icon: '❄', label: 'Snow Lovers' },
  slow: { icon: '🌿', label: 'Slow Travel' },
  'slow travel': { icon: '🌿', label: 'Slow Travel' },
  heritage: { icon: '▣', label: 'Heritage' },
  'history lovers': { icon: '▣', label: 'Heritage' },
  desert: { icon: '✧', label: 'Desert Festival' },
  'desert festival': { icon: '✧', label: 'Desert Festival' },
  rann: { icon: '✧', label: 'Desert Festival' },
};

/**
 * Place-first chips so destinations are never mis-tagged
 * (Rann ≠ Honeymoon, Hampi ≠ generic honeymoon).
 */
const DESTINATION_RULES = [
  {
    icon: '✧',
    label: 'Desert Festival',
    keys: ['rann', 'kutch', 'white rann', 'rann utsav', 'dholavira', 'bhuj'],
  },
  {
    icon: '▣',
    label: 'Heritage',
    keys: ['hampi', 'hoysala', 'heritage ruins'],
  },
];

/**
 * Filter dropdown → allowed packageCategory / admin-tag values.
 * Intentionally does NOT use destination place names (Ladakh ≠ Adventure).
 */
const FILTER_ALIASES = {
  honeymoon: ['honeymoon', 'honeymoon escape', 'best for couples'],
  adventure: ['adventure', 'adventure special'],
  spiritual: ['spiritual', 'spiritual sojourn'],
  family: ['family', 'family time', 'family getaway', 'family escapes'],
  wildlife: ['wildlife'],
  'road trips': ['road trips', 'road trip'],
  mountains: ['mountains'],
  beaches: ['beaches', 'coastal', 'coastal escape', 'coastal retreat'],
};

/** Card label → filter dropdown keys it satisfies (one-way; Adventure ≠ Mountains) */
const LABEL_TO_FILTERS = {
  honeymoon: ['honeymoon'],
  adventure: ['adventure'],
  spiritual: ['spiritual'],
  'family time': ['family'],
  wildlife: ['wildlife'],
  'road trips': ['road trips'],
  'coastal escape': ['beaches'],
  'snow lovers': ['mountains'],
  'slow travel': ['wildlife'],
};

/** Keyword inference only when Experience category is empty — no place names */
const EXPERIENCE_RULES = [
  { icon: '❤️', label: 'Honeymoon', keys: ['honeymoon', 'romantic', 'anniversary', 'wedding'] },
  { icon: '🏔', label: 'Adventure', keys: ['adventure', 'trek', 'trekking', 'expedition', 'rafting'] },
  { icon: '🕉', label: 'Spiritual', keys: ['spiritual', 'pilgrim', 'ashram', 'meditation'] },
  { icon: '👨‍👩‍👧', label: 'Family Time', keys: ['family', 'kids', 'children'] },
  { icon: '🚗', label: 'Road Trips', keys: ['road trip', 'roadtrip', 'self-drive'] },
  { icon: '🌊', label: 'Coastal Escape', keys: ['beach', 'coastal'] },
  { icon: '❄', label: 'Snow Lovers', keys: ['snow', 'winter ski'] },
  { icon: '🌿', label: 'Slow Travel', keys: ['slow travel', 'unhurried'] },
];

const DEFAULT_TAG = { icon: '✨', label: 'Curated journey' };

function tagKey(tag) {
  return `${tag.icon}|${tag.label}`;
}

function placeHaystack(tour) {
  return [tour?.title, tour?.destination, tour?.state, tour?.departureCity]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function chipFromDestination(tour) {
  const hay = placeHaystack(tour);
  if (!hay) return null;
  for (const rule of DESTINATION_RULES) {
    if (rule.keys.some((key) => hay.includes(key))) {
      return { icon: rule.icon, label: rule.label };
    }
  }
  return null;
}

function chipFromLabel(raw) {
  const key = String(raw || '').trim().toLowerCase();
  if (!key) return null;
  if (CATEGORY_CHIPS[key]) return CATEGORY_CHIPS[key];
  return null;
}

function chipFromKeywordText(text) {
  const hay = String(text || '').toLowerCase();
  if (!hay) return null;
  for (const rule of EXPERIENCE_RULES) {
    if (rule.keys.some((key) => hay.includes(key))) {
      return { icon: rule.icon, label: rule.label };
    }
  }
  return null;
}

/** @returns {{ icon: string; label: string }} */
export function getPersonalizedExperienceTag(tour) {
  // Destination identity first — Rann/Hampi must not inherit wrong Experience category
  const fromPlace = chipFromDestination(tour);
  if (fromPlace) return fromPlace;

  const pkgCat = String(tour?.packageCategory || tour?.experienceCategory || '').trim();
  const fromPkg = chipFromLabel(pkgCat);
  if (fromPkg) return fromPkg;

  if (Array.isArray(tour?.tags)) {
    for (const tag of tour.tags) {
      const fromTag = chipFromLabel(tag) || chipFromKeywordText(tag);
      if (fromTag) return fromTag;
    }
  }

  // Only when admin left Experience category empty
  const inferred = chipFromKeywordText(
    [tour?.title, tour?.suitableFor, ...(Array.isArray(tour?.tags) ? tour.tags : [])]
      .filter(Boolean)
      .join(' ')
  );
  if (inferred) return inferred;

  const sub = String(tour?.subCategory || '').toLowerCase();
  if (sub === 'beaches' || sub === 'coastal') return { icon: '🌊', label: 'Coastal Escape' };
  if (sub === 'adventure') return { icon: '🏔', label: 'Adventure' };
  if (sub === 'spiritual') return { icon: '🕉', label: 'Spiritual' };
  if (sub === 'family') return { icon: '👨‍👩‍👧', label: 'Family Time' };
  if (sub === 'desert') return { icon: '✧', label: 'Desert Festival' };
  if (sub === 'heritage') return { icon: '▣', label: 'Heritage' };

  return DEFAULT_TAG;
}

/** Primary experience + optional admin tags (skip tags that fight destination identity). */
export function getPersonalizedExperienceTags(tour, max = 2) {
  const tags = [];
  const seen = new Set();
  const placeChip = chipFromDestination(tour);
  const add = (tag) => {
    if (!tag) return;
    const key = tagKey(tag);
    if (seen.has(key) || tags.length >= max) return;
    // Never stack Honeymoon/Adventure on a desert-festival destination
    if (placeChip && (tag.label === 'Honeymoon' || tag.label === 'Adventure')) return;
    seen.add(key);
    tags.push(tag);
  };

  add(getPersonalizedExperienceTag(tour));

  if (Array.isArray(tour?.tags)) {
    for (const raw of tour.tags) {
      if (tags.length >= max) break;
      add(chipFromLabel(raw) || chipFromKeywordText(raw));
    }
  }

  return tags.length ? tags : [DEFAULT_TAG];
}

function valueMatchesAliases(value, aliases) {
  const v = String(value || '').trim().toLowerCase();
  if (!v) return false;
  return aliases.some((alias) => v === alias || v.startsWith(`${alias} `));
}

function chipMatchesFilter(chipLabel, filterKey) {
  const label = String(chipLabel || '').trim().toLowerCase();
  const wanted = String(filterKey || '').trim().toLowerCase();
  if (!label || !wanted) return false;
  const filters = LABEL_TO_FILTERS[label] || [label];
  return filters.includes(wanted);
}

/**
 * Experience filter: Admin Experience category first; otherwise primary tag only.
 * Does not treat destination names (e.g. Ladakh) as Adventure.
 */
export function tourMatchesExperienceFilter(tour, categoryValue) {
  const wanted = String(categoryValue || '').trim().toLowerCase();
  if (!wanted || wanted === 'customized' || wanted === 'upcoming') return true;

  const aliases = FILTER_ALIASES[wanted] || [wanted];

  const pkg = String(tour?.packageCategory || tour?.experienceCategory || '').trim();
  if (pkg) {
    if (valueMatchesAliases(pkg, aliases)) return true;
    const pkgChip = chipFromLabel(pkg);
    if (pkgChip && chipMatchesFilter(pkgChip.label, wanted)) return true;
    // Explicit category set → never match via title keywords or secondary tags
    return false;
  }

  // No Experience category: match primary inferred experience only
  const primary = getPersonalizedExperienceTag(tour);
  return chipMatchesFilter(primary.label, wanted);
}

export const INSPIRATION_EXPERIENCES = [
  { icon: '❤️', label: 'Honeymoon' },
  { icon: '🏔', label: 'Adventure' },
  { icon: '🚗', label: 'Road Trips' },
  { icon: '🕉', label: 'Spiritual' },
  { icon: '👨‍👩‍👧', label: 'Family Escapes' },
  { icon: '🌊', label: 'Coastal Retreats' },
  { icon: '❄', label: 'Snow Escapes' },
  { icon: '🌿', label: 'Slow Travel' },
];

const EMOTIONAL_TEASERS = [
  {
    keys: ['rann', 'kutch', 'white desert', 'dholavira'],
    line: 'Salt flats, festival nights, and Kutchi culture — a season journey beyond the ordinary.',
  },
  {
    keys: ['hampi', 'heritage ruins'],
    line: 'Walk through living heritage — temples, ruins, and stories that shaped the land.',
  },
  {
    keys: ['honeymoon', 'romantic', 'anniversary'],
    line: 'Romantic journeys crafted for slower, meaningful moments together.',
  },
  {
    keys: ['family', 'kids', 'parents'],
    line: 'Family holidays designed around comfort, connection, and unhurried days.',
  },
  {
    keys: ['adventure', 'trek', 'expedition'],
    line: 'Adventure escapes for travellers who want more than sightseeing.',
  },
  {
    keys: ['spiritual', 'temple', 'pilgrim', 'ashram', 'meditation'],
    line: 'Spiritual journeys built around peace, connection, and comfort.',
  },
  {
    keys: ['road trip', 'roadtrip', 'drive', 'highway'],
    line: 'Road trips thoughtfully curated for unforgettable shared experiences.',
  },
  {
    keys: ['beach', 'coastal', 'goa', 'shore'],
    line: 'Coastal retreats shaped for calm horizons and unhurried days.',
  },
  {
    keys: ['snow', 'winter', 'ski', 'gulmarg'],
    line: 'Snow escapes for travellers who love crisp air and quiet wonder.',
  },
  {
    keys: ['luxury', 'retreat', 'resort', 'spa'],
    line: 'Refined pacing and restful stays — travel that feels intentionally calm.',
  },
  {
    keys: ['weekend', 'short break', 'getaway'],
    line: 'Short breaks with a curated rhythm — maximum feeling, minimum rush.',
  },
  {
    keys: ['slow', 'unhurried', 'leisurely'],
    line: 'Fewer stops, deeper places — journeys that unfold at human pace.',
  },
  {
    keys: ['friends', 'group of friends', 'reunion'],
    line: 'Shared adventures built around discovery and easy togetherness.',
  },
];

const DEFAULT_TEASER =
  'A journey shaped around your dates, rhythm, and what matters most to you.';

function teaserHaystack(tour) {
  return [
    tour?.title,
    tour?.packageCategory,
    tour?.experienceCategory,
    tour?.description,
    tour?.suitableFor,
    ...(Array.isArray(tour?.tags) ? tour.tags : []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

/** Experience-first copy for homepage cards — feelings over selling. */
export function getPersonalizedStoryTeaser(tour) {
  const text = teaserHaystack(tour);
  if (!text) return DEFAULT_TEASER;

  for (const rule of EMOTIONAL_TEASERS) {
    if (rule.keys.some((key) => text.includes(key))) return rule.line;
  }

  const raw = tour?.description ? String(tour.description).trim() : '';
  if (!raw) return DEFAULT_TEASER;
  if (raw.length <= 120) return raw;
  return `${raw.slice(0, 117).trim()}…`;
}
