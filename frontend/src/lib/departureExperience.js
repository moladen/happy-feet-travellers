/** Curated personality labels — one distinctive identity per card */
const PERSONALITY_RULES = [
  { label: 'Honeymoon Escape', keys: ['honeymoon', 'couple', 'romantic', 'anniversary'], weight: 10 },
  { label: 'Monsoon Escape', keys: ['monsoon', 'rainforest', 'meghalaya', 'coorg', 'lush', 'western ghats'], weight: 9 },
  { label: 'Snow Lovers', keys: ['snow', 'winter', 'ski', 'auli', 'frozen', 'ladakh', 'spiti'], weight: 9 },
  { label: 'Adventure Special', keys: ['adventure', 'trek', 'trekking', 'expedition', 'summit'], weight: 8 },
  { label: 'Scenic Slow Travel', keys: ['slow travel', 'unhurried', 'scenic', 'leisurely', 'relaxed pace'], weight: 8 },
  { label: 'Scenic Slow Travel', keys: ['road trip', 'road', 'drive', 'highway', 'scenic route'], weight: 7 },
  { label: 'Coastal Retreat', keys: ['beach', 'goa', 'coastal', 'andaman', 'island', 'lakshadweep'], weight: 8 },
  { label: 'Friends Getaway', keys: ['friends', 'squad', 'bachelor', 'bachelorette', 'group trip', 'mates'], weight: 8 },
  { label: 'First-Timer Friendly', keys: ['first time', 'first-timer', 'beginner', 'introductory'], weight: 7 },
  { label: 'Spiritual Sojourn', keys: ['spiritual', 'temple', 'pilgrim', 'varanasi', 'rishikesh'], weight: 7 },
  { label: 'Family Getaway', keys: ['family', 'kids', 'children'], weight: 6 },
];

const SUBCATEGORY_TAGS = {
  mountains: 'Adventure Special',
  hills: 'Scenic Slow Travel',
  beaches: 'Coastal Retreat',
  wildlife: 'Adventure Special',
  spiritual: 'Spiritual Sojourn',
};

const FALLBACK_ROTATION = [
  'Coastal Retreat',
  'Scenic Slow Travel',
  'Friends Getaway',
  'Adventure Special',
  'Monsoon Escape',
  'Honeymoon Escape',
  'First-Timer Friendly',
  'Snow Lovers',
];

/** Per-personality emotional copy — experience-first, not package listings */
const STORIES_BY_LABEL = {
  'Honeymoon Escape': [
    'A softly paced escape for two — intimate stays, unhurried moments, and room to simply be together.',
    'Designed for couples who want romance without the rush — curated comfort and quiet beauty.',
  ],
  'Coastal Retreat': [
    'A thoughtfully planned coastal escape for slower, meaningful travel.',
    'Discover the coast beyond the ordinary with curated stays and comfort-first experiences.',
  ],
  'Scenic Slow Travel': [
    'Scenic routes, gentle pacing, and time to absorb the landscape — travel that breathes.',
    'For travelers who prefer the journey as much as the destination — unhurried and beautifully planned.',
  ],
  'Friends Getaway': [
    'Built for good company — shared adventures, easy laughs, and a batch that feels like friends.',
    'A lively small-group escape with comfort-first stays and experiences worth remembering together.',
  ],
  'Adventure Special': [
    'For seekers of elevation and adrenaline — expert pacing, safety-first planning, and epic views.',
    'Challenge and comfort in balance — a curated adventure for travelers who want more than a tour.',
  ],
  'Monsoon Escape': [
    'Green landscapes, misty mornings, and the magic of monsoon season — thoughtfully timed and paced.',
    'A lush retreat when the rains bring the country alive — intimate groups and soulful routes.',
  ],
  'Snow Lovers': [
    'Crisp air, snow-dusted peaks, and cozy evenings — winter travel with warmth at its core.',
    'A curated cold-weather journey for travelers who chase snowscapes and fireside comfort.',
  ],
  'First-Timer Friendly': [
    'Designed for travelers who value comfort, connection, and memorable first journeys.',
    'Gentle pacing, clear guidance, and a welcoming small group — perfect for your first big trip.',
  ],
  'Spiritual Sojourn': [
    'Sacred places, reflective mornings, and space for meaning — travel with intention and calm.',
    'A soulful small-group journey through landscapes that invite pause and presence.',
  ],
  'Family Getaway': [
    'Thoughtfully planned for every generation — comfort, ease, and moments the whole family will cherish.',
    'Family-friendly pacing with curated stays — connection over checklists.',
  ],
  'Curated Journey': [
    'Designed for travelers who value comfort, connection, and memorable journeys.',
    'A thoughtfully planned small-group escape — experience over itineraries.',
  ],
};

const INVITE_BY_LABEL = {
  'Honeymoon Escape': (place) => `Begin your romantic escape to ${place}`,
  'Coastal Retreat': (place) => `Join this curated coastal escape to ${place}`,
  'Friends Getaway': (place) => `Gather your circle for ${place}`,
  'Adventure Special': (place) => `Answer the call of ${place}`,
  default: (place) => `Experience ${place} beyond the ordinary`,
};

const CARD_THEMES = {
  'Honeymoon Escape': { slug: 'honeymoon', icon: '♥' },
  'Coastal Retreat': { slug: 'coastal', icon: '◆' },
  'Scenic Slow Travel': { slug: 'scenic', icon: '◇' },
  'Friends Getaway': { slug: 'friends', icon: '◎' },
  'Adventure Special': { slug: 'adventure', icon: '▲' },
  'Monsoon Escape': { slug: 'monsoon', icon: '❋' },
  'Snow Lovers': { slug: 'snow', icon: '✦' },
  'First-Timer Friendly': { slug: 'firsttimer', icon: '○' },
  'Spiritual Sojourn': { slug: 'spiritual', icon: '☼' },
  'Family Getaway': { slug: 'family', icon: '◈' },
  'Curated Journey': { slug: 'curated', icon: '✧' },
};

const LEGACY_EXPERIENCE_RULES = [
  { icon: '♥', label: 'Honeymoon Escape', keys: ['couple', 'honeymoon', 'romantic'] },
  { icon: '✦', label: 'Snow Lovers', keys: ['snow', 'winter', 'kashmir', 'himachal', 'ladakh'] },
  { icon: '▲', label: 'Adventure Special', keys: ['adventure', 'trek', 'himalaya', 'mountain'] },
  { icon: '❋', label: 'Monsoon Escape', keys: ['monsoon', 'rainforest', 'meghalaya'] },
  { icon: '◇', label: 'Scenic Slow Travel', keys: ['road', 'drive', 'scenic route'] },
  { icon: '◆', label: 'Coastal Retreat', keys: ['beach', 'goa', 'coastal', 'andaman'] },
  { icon: '◎', label: 'Friends Getaway', keys: ['friends', 'bachelor', 'squad'] },
  { icon: '☼', label: 'Spiritual Sojourn', keys: ['spiritual', 'temple', 'pilgrim'] },
  { icon: '◈', label: 'Family Getaway', keys: ['family', 'kids', 'children'] },
];

const DEFAULT_TAG = { icon: '✧', label: 'Curated Journey' };

const TAG_ALIASES = {
  'best for couples': 'Honeymoon Escape',
  honeymoon: 'Honeymoon Escape',
  'snow lovers': 'Snow Lovers',
  adventure: 'Adventure Special',
  scenic: 'Scenic Slow Travel',
  'scenic road journey': 'Scenic Slow Travel',
  'road trip': 'Scenic Slow Travel',
  spiritual: 'Spiritual Sojourn',
  'family friendly': 'Family Getaway',
  wildlife: 'Adventure Special',
  monsoon: 'Monsoon Escape',
  'monsoon retreat': 'Monsoon Escape',
  'coastal escape': 'Coastal Retreat',
  beach: 'Coastal Retreat',
  friends: 'Friends Getaway',
  'first-timer': 'First-Timer Friendly',
};

function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function haystack(tour) {
  const parts = [
    tour?.title,
    tour?.destination,
    tour?.subCategory,
    tour?.description,
    tour?.suitableFor,
    tour?.transport,
    tour?.stayType,
    ...(Array.isArray(tour?.highlights) ? tour.highlights : []),
    ...(Array.isArray(tour?.tags) ? tour.tags : []),
  ];
  return parts.filter(Boolean).join(' ').toLowerCase();
}

function placeName(tour) {
  if (tour?.destination && String(tour.destination).trim()) {
    return String(tour.destination).trim();
  }
  const title = String(tour?.title || 'your destination');
  const cut = title.split(/[–—|:]/)[0].trim();
  return cut || title;
}

function tourSeed(tour) {
  return String(tour?.id ?? tour?.slug ?? tour?.title ?? 'departure');
}

function normalisePersonalityLabel(raw) {
  const key = String(raw || '').trim().toLowerCase();
  if (!key) return null;
  if (TAG_ALIASES[key]) return TAG_ALIASES[key];
  const known = PERSONALITY_RULES.find((r) => r.label.toLowerCase() === key);
  if (known) return known.label;
  return String(raw).trim();
}

function scoreRule(rule, text) {
  let score = 0;
  for (const k of rule.keys) {
    if (text.includes(k)) score += k.includes(' ') ? 3 : 1;
  }
  return score > 0 ? score + rule.weight : 0;
}

/**
 * One distinctive personality label per card.
 * Uses tour content — stable rotation by id so cards don't all share one label.
 */
export function getDeparturePersonalityTags(tour, max = 1) {
  const text = haystack(tour);
  const ranked = [];

  if (Array.isArray(tour?.tags)) {
    for (const t of tour.tags) {
      const label = normalisePersonalityLabel(t);
      if (label) ranked.push({ label, score: 100 });
    }
  }

  for (const rule of PERSONALITY_RULES) {
    const score = scoreRule(rule, text);
    if (score > 0) ranked.push({ label: rule.label, score });
  }

  const sub = String(tour?.subCategory || '').toLowerCase();
  if (SUBCATEGORY_TAGS[sub]) {
    ranked.push({ label: SUBCATEGORY_TAGS[sub], score: 5 });
  }

  ranked.sort((a, b) => b.score - a.score);

  const unique = [];
  const seen = new Set();
  for (const { label } of ranked) {
    const key = label.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(label);
    if (unique.length >= max) break;
  }

  if (unique.length) return unique;

  const idx = hashString(tourSeed(tour)) % FALLBACK_ROTATION.length;
  return [FALLBACK_ROTATION[idx]];
}

/** Visual theme slug + icon for per-card cinematic accents */
export function getDepartureCardTheme(tour) {
  const [label] = getDeparturePersonalityTags(tour, 1);
  const theme = CARD_THEMES[label] || CARD_THEMES['Curated Journey'];
  return { label, slug: theme.slug, icon: theme.icon };
}

/** @deprecated Prefer single personality tag */
export function getDepartureMicroTags() {
  return [];
}

/** @returns {{ icon: string; label: string }} */
export function getDepartureExperienceTag(tour) {
  const { label, icon } = getDepartureCardTheme(tour);
  const legacy = LEGACY_EXPERIENCE_RULES.find((r) => r.label === label);
  if (legacy) return { icon: legacy.icon, label: legacy.label };
  return { icon, label: label || DEFAULT_TAG.label };
}

/** Subtle small-group line */
export function getDepartureGroupSizeLabel(tour) {
  const raw =
    tour?.groupSize ||
    tour?.groupSizeLabel ||
    tour?.maxGroupSize ||
    tour?.batchSize;

  if (raw && String(raw).trim()) {
    const s = String(raw).trim();
    if (/curated batch|comfort-first/i.test(s)) return s;
    if (/travell|people|group|seat|pax/i.test(s)) return s;
    if (/^\d+\s*[-–]\s*\d+$/.test(s)) return `${s} travelers only`;
    if (/^\d+$/.test(s)) return `Up to ${s} travelers`;
    return s;
  }

  const text = haystack(tour);
  const range = text.match(/(\d{1,2})\s*[-–]\s*(\d{1,2})\s*(?:travell|people|pax|seat|guest)/i);
  if (range) return `${range[1]}–${range[2]} travelers only`;

  const maxMatch = text.match(/(?:max|upto|up to)\s*(\d{1,2})\s*(?:travell|people|pax|seat)/i);
  if (maxMatch) return `Up to ${maxMatch[1]} travelers`;

  if (/small\s*group|intimate/i.test(text)) return 'Comfort-first small group';

  const variants = [
    '12–18 travelers only',
    'Small curated batch',
    'Curated batch experience',
    'Comfort-first small group',
  ];
  return variants[hashString(tourSeed(tour)) % variants.length];
}

/** @returns {string} */
export function formatDepartureDateLabel(tour) {
  if (tour?.dateLabel) return tour.dateLabel;
  if (tour?.date) return tour.date;
  if (tour?.startDate) {
    const start = new Date(tour.startDate);
    if (!Number.isNaN(start.getTime())) {
      const end = tour.endDate ? new Date(tour.endDate) : null;
      const fmt = { day: 'numeric', month: 'short', year: 'numeric' };
      if (end && !Number.isNaN(end.getTime()) && end > start) {
        const sameYear = start.getFullYear() === end.getFullYear();
        const startStr = start.toLocaleDateString('en-GB', sameYear ? { day: 'numeric', month: 'short' } : fmt);
        const endStr = end.toLocaleDateString('en-GB', fmt);
        return `${startStr} – ${endStr}`;
      }
      return start.toLocaleDateString('en-GB', fmt);
    }
  }
  return 'Dates announced soon';
}

/** Short emotional copy — ~2 lines max, personality-aware */
export function getDepartureStoryTeaser(tour, maxLen = 96) {
  const raw = tour?.cardTeaser || tour?.experienceTeaser;
  if (raw && String(raw).trim()) {
    const s = String(raw).trim();
    return s.length > maxLen ? `${s.slice(0, maxLen).trim()}…` : s;
  }

  const [label] = getDeparturePersonalityTags(tour, 1);
  const stories = STORIES_BY_LABEL[label] || STORIES_BY_LABEL['Curated Journey'];
  const seed = hashString(tourSeed(tour));
  let line = stories[seed % stories.length];

  const place = placeName(tour);
  if (place && place !== 'your destination' && !line.toLowerCase().includes(place.toLowerCase())) {
    const withPlace = stories.find((s) => s.includes('{place}'));
    if (withPlace) line = withPlace.replace(/\{place\}/g, place);
  }

  if (line.length > maxLen) line = `${line.slice(0, maxLen).trim()}…`;
  return line;
}

/** Experience-first invite line */
export function getDepartureEmotionalInvite(tour) {
  if (tour?.cardInvite && String(tour.cardInvite).trim()) {
    return String(tour.cardInvite).trim();
  }
  const place = placeName(tour);
  const [label] = getDeparturePersonalityTags(tour, 1);
  const fn = INVITE_BY_LABEL[label] || INVITE_BY_LABEL.default;
  const variants = [fn(place)];
  if (label === 'Coastal Retreat') {
    variants.push(`Discover ${place} beyond the ordinary`);
  }
  const seed = hashString(tourSeed(tour));
  return variants[seed % variants.length];
}
