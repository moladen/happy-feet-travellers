/**
 * Shared destination / category keyword matching for departures search,
 * footer links, and filters.
 */

export const DESTINATION_SEARCH_ALIASES = {
  himachal: [
    'himachal',
    'spiti',
    'spiti valley',
    'manali',
    'shimla',
    'kinnaur',
    'kullu',
    'kasol',
    'dharamshala',
    'dalhousie',
    'chandratal',
    'kaza',
  ],
  spiti: ['spiti', 'spiti valley', 'kinnaur', 'kaza', 'chandratal', 'tabo', 'himachal'],
  kashmir: ['kashmir', 'srinagar', 'gulmarg', 'pahalgam', 'sonamarg'],
  kerala: ['kerala', 'munnar', 'alleppey', 'kochi', 'wayanad', 'thekkady', 'backwater'],
  northeast: ['northeast', 'meghalaya', 'sikkim', 'arunachal', 'nagaland', 'assam', 'cherrapunji', 'shillong'],
  sikkim: ['sikkim', 'gangtok', 'darjeeling', 'northeast'],
  goa: ['goa', 'beach', 'coastal'],
  weekend: ['weekend', 'short trip', '2 days', '3 days', '4 days'],
  international: ['international', 'bali', 'thailand', 'dubai', 'vietnam', 'nepal', 'bhutan'],
};

export const SUB_CATEGORY_KEYWORDS = {
  mountains: [
    'mountains',
    'mountain',
    'hills',
    'himalaya',
    'himalayas',
    'spiti',
    'himachal',
    'ladakh',
    'sikkim',
    'manali',
    'shimla',
    'kinnaur',
    'valley',
    'high altitude',
    'snow',
  ],
  beaches: ['beaches', 'beach', 'goa', 'coastal', 'andaman', 'lakshadweep', 'island'],
  cultural: ['cultural', 'culture', 'heritage', 'temple', 'fort', 'rajasthan', 'varanasi', 'spiritual'],
  adventure: ['adventure', 'trek', 'trekking', 'expedition', 'summit', 'camping'],
};

export function normaliseSearchTerm(value) {
  return String(value || '').trim().toLowerCase();
}

export function expandSearchTerms(query) {
  const normalized = normaliseSearchTerm(query);
  if (!normalized) return [];
  const aliases = DESTINATION_SEARCH_ALIASES[normalized];
  if (aliases) return [...new Set([normalized, ...aliases.map(normaliseSearchTerm)])];
  return [normalized];
}

export function buildTourSearchHaystack(tour) {
  return [
    tour?.title,
    tour?.slug,
    tour?.description,
    tour?.category,
    tour?.subCategory,
    tour?.departureCity,
    tour?.destination,
    tour?.state,
    tour?.date,
    tour?.dateLabel,
    tour?.duration,
    tour?.durationLabel,
    tour?.urgency,
    tour?.offers,
    tour?.meals,
    tour?.stayType,
    tour?.transport,
    tour?.suitableFor,
    ...(Array.isArray(tour?.tags) ? tour.tags : []),
    ...(Array.isArray(tour?.highlights) ? tour.highlights : []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

export function tourMatchesSearchQuery(tour, query) {
  const terms = expandSearchTerms(query);
  if (!terms.length) return true;
  const haystack = buildTourSearchHaystack(tour);
  return terms.some((term) => haystack.includes(term));
}

export function tourMatchesSubCategory(tour, subCategory) {
  const sub = normaliseSearchTerm(subCategory);
  if (!sub || sub === 'all') return true;

  const tourSub = normaliseSearchTerm(tour?.subCategory);
  if (tourSub === sub) return true;

  const keywords = SUB_CATEGORY_KEYWORDS[sub] || [sub];
  const haystack = buildTourSearchHaystack(tour);
  return keywords.some((keyword) => haystack.includes(keyword));
}
