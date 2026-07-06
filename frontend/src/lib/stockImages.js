/** Verified Unsplash URLs — avoid 404 upstream errors from Next.js image optimizer. */
export const TRAVEL_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80';

export const STOCK_IMAGES = {
  travel: TRAVEL_FALLBACK_IMAGE,
  landscape: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
  road: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80',
  train: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&w=1200&q=80',
  beach: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  mountains: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
  group: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
  desert: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
  hampi: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
  heritage: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
};

/** Removed / typo Unsplash photo IDs → verified replacements. */
const BROKEN_FRAGMENTS = [
  ['07fb1b4f5bb5', '07fb3b4ae5f1'],
  ['1472148439583-1f1550f021e5', '1563492065599-3520f775eeed'],
  ['1515169069757-1a2f416f6707', '1563492065599-3520f775eeed'],
  ['1585503418493-5c898ea0ac6e', '1587474260584-136574528ed5'],
];

/**
 * Fix broken stock URLs before passing to next/image.
 * @param {string} url
 * @returns {string}
 */
export function sanitiseStockImageUrl(url) {
  const raw = String(url || '').trim();
  if (!raw) return TRAVEL_FALLBACK_IMAGE;

  let next = raw;
  for (const [broken, replacement] of BROKEN_FRAGMENTS) {
    if (next.includes(broken)) {
      next = next.replace(broken, replacement);
    }
  }
  return next;
}

/**
 * Resolve stock image by key with sanitisation.
 * @param {keyof STOCK_IMAGES} key
 * @returns {string}
 */
export function stockImage(key) {
  return sanitiseStockImageUrl(STOCK_IMAGES[key] || TRAVEL_FALLBACK_IMAGE);
}
