/** Map API packageCategory to emotional micro-tags on cards */
const CATEGORY_CHIPS = {
  honeymoon: { icon: '❤️', label: 'Honeymoon' },
  adventure: { icon: '🏔', label: 'Adventure' },
  spiritual: { icon: '🕉', label: 'Spiritual' },
  family: { icon: '👨‍👩‍👧', label: 'Family Time' },
  wildlife: { icon: '🦁', label: 'Wildlife' },
  'road trips': { icon: '🚗', label: 'Road Trips' },
  'road trip': { icon: '🚗', label: 'Road Trips' },
  mountains: { icon: '🏔', label: 'Adventure' },
  beaches: { icon: '🌊', label: 'Coastal Escape' },
  coastal: { icon: '🌊', label: 'Coastal Escape' },
  snow: { icon: '❄', label: 'Snow Lovers' },
  slow: { icon: '🌿', label: 'Slow Travel' },
};

/** Experience micro-tags — max 1–2 per card */
const EXPERIENCE_RULES = [
  { icon: '❤️', label: 'Honeymoon', keys: ['honeymoon', 'romantic', 'couple', 'anniversary', 'wedding'] },
  { icon: '🏔', label: 'Adventure', keys: ['adventure', 'trek', 'trekking', 'spiti', 'ladakh', 'himalaya', 'expedition'] },
  { icon: '🕉', label: 'Spiritual', keys: ['spiritual', 'temple', 'pilgrim', 'varanasi', 'rishikesh', 'ashram', 'meditation'] },
  { icon: '👨‍👩‍👧', label: 'Family Time', keys: ['family', 'kids', 'children', 'parents'] },
  { icon: '🚗', label: 'Road Trips', keys: ['road trip', 'roadtrip', 'drive', 'highway', 'self-drive', 'motorbike', 'bike trip'] },
  { icon: '🌊', label: 'Coastal Escape', keys: ['beach', 'coastal', 'goa', 'andaman', 'lakshadweep', 'shore'] },
  { icon: '❄', label: 'Snow Lovers', keys: ['snow', 'winter', 'ski', 'gulmarg', 'manali snow', 'auli', 'kashmir winter'] },
  { icon: '🌿', label: 'Slow Travel', keys: ['slow travel', 'unhurried', 'leisurely', 'offbeat'] },
];

const DEFAULT_TAG = { icon: '✨', label: 'Curated journey' };

function tagKey(tag) {
  return `${tag.icon}|${tag.label}`;
}

function haystack(tour) {
  const parts = [
    tour?.title,
    tour?.subCategory,
    tour?.category,
    tour?.description,
    tour?.suitableFor,
    tour?.stayType,
    tour?.transport,
    ...(Array.isArray(tour?.highlights) ? tour.highlights : []),
  ];
  return parts.filter(Boolean).join(' ').toLowerCase();
}

/** @returns {{ icon: string; label: string }} */
export function getPersonalizedExperienceTag(tour) {
  const pkgCat = String(tour?.packageCategory || tour?.experienceCategory || '').trim();
  if (pkgCat) {
    const key = pkgCat.toLowerCase();
    if (CATEGORY_CHIPS[key]) return CATEGORY_CHIPS[key];
  }

  if (Array.isArray(tour?.tags)) {
    for (const tag of tour.tags) {
      const key = String(tag).toLowerCase();
      if (CATEGORY_CHIPS[key]) return CATEGORY_CHIPS[key];
      for (const rule of EXPERIENCE_RULES) {
        if (rule.keys.some((k) => key.includes(k))) return { icon: rule.icon, label: rule.label };
      }
    }
  }

  const text = haystack(tour);
  if (!text) return DEFAULT_TAG;

  for (const rule of EXPERIENCE_RULES) {
    if (rule.keys.some((key) => text.includes(key))) {
      return { icon: rule.icon, label: rule.label };
    }
  }

  const sub = String(tour?.subCategory || '').toLowerCase();
  if (sub === 'beaches' || sub === 'coastal') return { icon: '🌊', label: 'Coastal Escape' };
  if (sub === 'mountains' || sub === 'hills') return { icon: '🏔', label: 'Adventure' };
  if (sub === 'snow' || sub === 'winter') return { icon: '❄', label: 'Snow Lovers' };

  return DEFAULT_TAG;
}

/** Up to two emotional tags per card — avoids clutter. */
export function getPersonalizedExperienceTags(tour, max = 2) {
  const tags = [];
  const seen = new Set();
  const add = (tag) => {
    const key = tagKey(tag);
    if (seen.has(key) || tags.length >= max) return;
    seen.add(key);
    tags.push(tag);
  };

  add(getPersonalizedExperienceTag(tour));

  const text = haystack(tour);
  for (const rule of EXPERIENCE_RULES) {
    if (tags.length >= max) break;
    if (rule.keys.some((key) => text.includes(key))) add({ icon: rule.icon, label: rule.label });
  }

  return tags.length ? tags : [DEFAULT_TAG];
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
    keys: ['honeymoon', 'romantic', 'couple', 'anniversary'],
    line: 'Romantic journeys crafted for slower, meaningful moments together.',
  },
  {
    keys: ['family', 'kids', 'parents'],
    line: 'Family holidays designed around comfort, connection, and unhurried days.',
  },
  {
    keys: ['adventure', 'trek', 'expedition', 'spiti', 'ladakh'],
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

/** Experience-first copy for homepage cards — feelings over selling. */
export function getPersonalizedStoryTeaser(tour) {
  const text = haystack(tour);
  if (!text) return DEFAULT_TEASER;

  for (const rule of EMOTIONAL_TEASERS) {
    if (rule.keys.some((key) => text.includes(key))) return rule.line;
  }

  const raw = tour?.description ? String(tour.description).trim() : '';
  if (!raw) return DEFAULT_TEASER;
  if (raw.length <= 120) return raw;
  return `${raw.slice(0, 117).trim()}…`;
}
