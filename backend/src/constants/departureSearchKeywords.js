const DESTINATION_SEARCH_ALIASES = {
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
  weekend: ['weekend', 'short trip'],
  international: ['international', 'bali', 'thailand', 'dubai', 'vietnam', 'nepal', 'bhutan'],
};

const SUB_CATEGORY_KEYWORDS = {
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

function expandSearchTerms(query) {
  const normalized = String(query || '').trim().toLowerCase();
  if (!normalized) return [];
  const aliases = DESTINATION_SEARCH_ALIASES[normalized];
  if (aliases) return [...new Set([normalized, ...aliases])];
  return [normalized];
}

function buildTextSearchOr(terms) {
  const fields = ['title', 'description', 'destination', 'state', 'departureCity'];
  return terms.flatMap((term) =>
    fields.map((field) => ({
      [field]: { contains: term, mode: 'insensitive' },
    }))
  );
}

function buildSubCategoryOr(sub) {
  const normalized = String(sub || '').trim().toLowerCase();
  const keywords = SUB_CATEGORY_KEYWORDS[normalized];
  if (!keywords) {
    return [{ subCategory: normalized }];
  }

  const fields = ['destination', 'title', 'state', 'description'];
  return [
    { subCategory: normalized },
    { subCategory: 'hills' },
    ...keywords.flatMap((keyword) =>
      fields.map((field) => ({
        [field]: { contains: keyword, mode: 'insensitive' },
      }))
    ),
  ];
}

module.exports = {
  expandSearchTerms,
  buildTextSearchOr,
  buildSubCategoryOr,
};
