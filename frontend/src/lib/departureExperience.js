/** Curated personality labels — one distinctive identity per card */
import { getPersonalizedStoryTeaser } from '@/lib/personalizedTourExperience';

const PERSONALITY_RULES = [
  // Destination-specific first (high weight) so Rann ≠ Adventure, Hampi ≠ generic
  { label: 'Desert Festival', keys: ['rann', 'kutch', 'white rann', 'rann utsav', 'bhuj', 'dholavira'], weight: 14 },
  { label: 'History Lovers', keys: ['hampi', 'heritage', 'history', 'historic', 'ruins', 'fort', 'palace', 'hoysala'], weight: 12 },
  { label: 'Nature Escape', keys: ['coorg', 'chikmagalur', 'nature', 'forest', 'wildlife', 'national park', 'safari'], weight: 11 },
  { label: 'Honeymoon Escape', keys: ['honeymoon', 'couple', 'romantic', 'anniversary'], weight: 10 },
  { label: 'Monsoon Escape', keys: ['monsoon', 'rainforest', 'meghalaya', 'lush', 'western ghats'], weight: 9 },
  { label: 'Snow Lovers', keys: ['snow', 'winter', 'ski', 'auli', 'frozen', 'ladakh', 'spiti'], weight: 9 },
  { label: 'Coastal Retreat', keys: ['beach', 'goa', 'coastal', 'andaman', 'island', 'lakshadweep'], weight: 8 },
  { label: 'Spiritual Sojourn', keys: ['spiritual', 'pilgrim', 'varanasi', 'rishikesh'], weight: 7 },
  { label: 'Friends Getaway', keys: ['friends', 'squad', 'bachelor', 'bachelorette', 'mates'], weight: 8 },
  { label: 'First-Timer Friendly', keys: ['first time', 'first-timer', 'beginner', 'introductory'], weight: 7 },
  { label: 'Family Getaway', keys: ['family', 'kids', 'children'], weight: 6 },
  { label: 'Scenic Slow Travel', keys: ['slow travel', 'unhurried', 'scenic', 'leisurely', 'relaxed pace', 'road trip'], weight: 7 },
  // Adventure only on clear trek/expedition signals — not desert festivals or culture trips
  { label: 'Adventure Special', keys: ['trek', 'trekking', 'expedition', 'summit', 'rafting', 'camping trek'], weight: 6 },
];

const SUBCATEGORY_TAGS = {
  mountains: 'Snow Lovers',
  hills: 'Scenic Slow Travel',
  beaches: 'Coastal Retreat',
  wildlife: 'Nature Escape',
  spiritual: 'Spiritual Sojourn',
  heritage: 'History Lovers',
  desert: 'Desert Festival',
};

const FALLBACK_ROTATION = [
  'Scenic Slow Travel',
  'Nature Escape',
  'Friends Getaway',
  'History Lovers',
  'Coastal Retreat',
  'First-Timer Friendly',
  'Family Getaway',
  'Monsoon Escape',
];

/** Per-personality emotional copy — only used when Admin leaves Card teaser blank AND autoCopy is desired.
 *  Default UX: no auto teaser (cards stay clean). Kept for optional fallback via useAutoTeaser. */
const STORIES_BY_LABEL = {
  'Honeymoon Escape': [
    'A softly paced escape for two — intimate stays, unhurried moments, and room to simply be together.',
  ],
  'Coastal Retreat': [
    'A thoughtfully planned coastal escape for slower, meaningful travel.',
  ],
  'Scenic Slow Travel': [
    'Scenic routes, gentle pacing, and time to absorb the landscape — travel that breathes.',
  ],
  'Friends Getaway': [
    'Built for good company — shared adventures, easy laughs, and a batch that feels like friends.',
  ],
  'Adventure Special': [
    'Challenge and comfort in balance — curated for travellers who want more than a checklist tour.',
  ],
  'Monsoon Escape': [
    'Green landscapes, misty mornings, and the magic of monsoon season — thoughtfully timed and paced.',
  ],
  'Snow Lovers': [
    'Crisp air, snow-dusted peaks, and cozy evenings — winter travel with warmth at its core.',
  ],
  'First-Timer Friendly': [
    'Gentle pacing, clear guidance, and a welcoming small group — perfect for your first big trip.',
  ],
  'Spiritual Sojourn': [
    'Sacred places, reflective mornings, and space for meaning — travel with intention and calm.',
  ],
  'Family Getaway': [
    'Thoughtfully planned for every generation — comfort, ease, and moments the whole family will cherish.',
  ],
  'History Lovers': [
    'Walk through living heritage — temples, ruins, and stories that shaped the land.',
  ],
  'Desert Festival': [
    'Salt flats, festival nights, and Kutchi culture — a season journey beyond the ordinary.',
  ],
  'Nature Escape': [
    'Misty hills, coffee country, and quiet nature days — paced for comfort and connection.',
  ],
  'Curated Journey': [
    'A thoughtfully planned small-group escape — experience over itineraries.',
  ],
};

const INVITE_BY_LABEL = {
  'Honeymoon Escape': (place) => `Begin your romantic escape to ${place}`,
  'Coastal Retreat': (place) => `Join this curated coastal escape to ${place}`,
  'Friends Getaway': (place) => `Gather your circle for ${place}`,
  'Adventure Special': (place) => `Answer the call of ${place}`,
  'Desert Festival': (place) => `Experience the magic of ${place}`,
  'History Lovers': (place) => `Walk the heritage of ${place}`,
  'Nature Escape': (place) => `Breathe easy in ${place}`,
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
  'History Lovers': { slug: 'history', icon: '▣' },
  'Desert Festival': { slug: 'desert', icon: '✧' },
  'Nature Escape': { slug: 'nature', icon: '❀' },
  'Curated Journey': { slug: 'curated', icon: '✧' },
};

const LEGACY_EXPERIENCE_RULES = [
  { icon: '♥', label: 'Honeymoon Escape', keys: ['couple', 'honeymoon', 'romantic'] },
  { icon: '✦', label: 'Snow Lovers', keys: ['snow', 'winter', 'kashmir', 'himachal', 'ladakh'] },
  { icon: '▲', label: 'Adventure Special', keys: ['trek', 'trekking', 'expedition'] },
  { icon: '❋', label: 'Monsoon Escape', keys: ['monsoon', 'rainforest', 'meghalaya'] },
  { icon: '◇', label: 'Scenic Slow Travel', keys: ['road', 'drive', 'scenic route'] },
  { icon: '◆', label: 'Coastal Retreat', keys: ['beach', 'goa', 'coastal', 'andaman'] },
  { icon: '◎', label: 'Friends Getaway', keys: ['friends', 'bachelor', 'squad'] },
  { icon: '☼', label: 'Spiritual Sojourn', keys: ['spiritual', 'pilgrim'] },
  { icon: '◈', label: 'Family Getaway', keys: ['family', 'kids', 'children'] },
  { icon: '▣', label: 'History Lovers', keys: ['hampi', 'heritage', 'history'] },
  { icon: '✧', label: 'Desert Festival', keys: ['rann', 'kutch'] },
  { icon: '❀', label: 'Nature Escape', keys: ['coorg', 'nature', 'wildlife'] },
];

const DEFAULT_TAG = { icon: '✧', label: 'Curated Journey' };

const TAG_ALIASES = {
  'best for couples': 'Honeymoon Escape',
  honeymoon: 'Honeymoon Escape',
  'snow lovers': 'Snow Lovers',
  adventure: 'Adventure Special',
  'adventure special': 'Adventure Special',
  scenic: 'Scenic Slow Travel',
  'scenic road journey': 'Scenic Slow Travel',
  'road trip': 'Scenic Slow Travel',
  spiritual: 'Spiritual Sojourn',
  'family friendly': 'Family Getaway',
  wildlife: 'Nature Escape',
  'nature escape': 'Nature Escape',
  monsoon: 'Monsoon Escape',
  'monsoon retreat': 'Monsoon Escape',
  'coastal escape': 'Coastal Retreat',
  beach: 'Coastal Retreat',
  friends: 'Friends Getaway',
  'first-timer': 'First-Timer Friendly',
  history: 'History Lovers',
  'history lovers': 'History Lovers',
  heritage: 'History Lovers',
  desert: 'Desert Festival',
  'desert festival': 'Desert Festival',
  rann: 'Desert Festival',
  culture: 'Desert Festival',
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
  const themeKnown = Object.keys(CARD_THEMES).find((l) => l.toLowerCase() === key);
  if (themeKnown) return themeKnown;
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
 * Admin → Personality tags win first; else keyword/destination rules.
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

/** @returns {boolean} */
export function looksLikeBatchDateList(text) {
  return /batch\s*\d+\s*:/i.test(String(text || ''));
}

/**
 * Split a date label into display lines.
 * Supports real newlines and single-line "Batch 1: … Batch 2: …" pastes.
 * @param {string} text
 * @returns {string[]}
 */
export function splitTourDateLabelLines(text) {
  const raw = String(text || '').replace(/\r\n/g, '\n').trim();
  if (!raw) return [];

  const byNewline = raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  if (byNewline.length > 1) return byNewline;

  const one = byNewline[0] || raw;
  if (looksLikeBatchDateList(one)) {
    const byBatch = one
      .split(/(?=\bBatch\s*\d+\s*:)/i)
      .map((line) => line.trim())
      .filter(Boolean);
    if (byBatch.length > 1) return byBatch;
  }

  return [one];
}

/**
 * Resolve which text to treat as the tour's date / batch list for detail + PDF.
 * If batches were pasted into durationLabel by mistake, still show them under Dates.
 */
export function resolveTourDatesText(tour) {
  const dateLabel = String(tour?.dateLabel || '').trim();
  const durationLabel = String(tour?.durationLabel || '').trim();
  const date = String(tour?.date || '').trim();

  if (looksLikeBatchDateList(durationLabel)) return durationLabel;
  if (looksLikeBatchDateList(dateLabel)) return dateLabel;
  if (looksLikeBatchDateList(date)) return date;
  if (dateLabel) return dateLabel;
  if (date && date !== durationLabel) return date;
  return formatDepartureDateLabel(tour);
}

/** @returns {string[]} */
export function getTourDateLabelLines(tour) {
  return splitTourDateLabelLines(resolveTourDatesText(tour));
}

/** Duration for hero/meta — never show a batch list under the clock icon. */
export function getTourDurationDisplay(tour) {
  const label = String(tour?.durationLabel || '').trim();
  if (label && !looksLikeBatchDateList(label)) return label;

  const rawDuration = tour?.duration;
  if (rawDuration == null || rawDuration === '') return null;
  if (looksLikeBatchDateList(rawDuration)) return null;
  if (typeof rawDuration === 'number' && Number.isFinite(rawDuration)) {
    return `${rawDuration} day${rawDuration === 1 ? '' : 's'}`;
  }
  const asText = String(rawDuration).trim();
  if (!asText || looksLikeBatchDateList(asText)) return null;
  return asText;
}

/** @returns {string} Full date label (may include multiple lines). */
export function formatDepartureDateLabel(tour) {
  if (tour?.dateLabel) return String(tour.dateLabel);
  if (tour?.date && !looksLikeBatchDateList(tour?.durationLabel)) return String(tour.date);
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

/** Single-line summary for cards / tight UI (first line only). */
export function formatDepartureDateLabelCompact(tour) {
  const lines = getTourDateLabelLines(tour);
  if (!lines.length) return 'Dates announced soon';
  if (lines.length === 1) return lines[0];
  return `${lines[0]} (+${lines.length - 1} more)`;
}

/**
 * Card teaser under the title — same behaviour as Personalized Tours:
 * 1. Admin "Card teaser" wins when set
 * 2. Else auto emotional line / description snippet
 */
export function getDepartureStoryTeaser(tour, maxLen = 120) {
  const manual = tour?.cardTeaser || tour?.experienceTeaser;
  if (manual && String(manual).trim()) {
    const s = String(manual).trim();
    return s.length > maxLen ? `${s.slice(0, maxLen).trim()}…` : s;
  }

  const auto = getPersonalizedStoryTeaser(tour);
  if (!auto) return '';
  return auto.length > maxLen ? `${auto.slice(0, maxLen).trim()}…` : auto;
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

export { STORIES_BY_LABEL };
