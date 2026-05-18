/**
 * Parse rupee / plain numeric input (commas, ₹, spaces allowed).
 * Returns null when empty or invalid.
 */
export function parsePriceInput(value) {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'number') {
    return Number.isFinite(value) && value >= 0 ? value : null;
  }
  const cleaned = String(value).replace(/[₹,\s]/g, '').replace(/[^\d.]/g, '');
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

/** Single amount for display/save — prefers explicit starting price, then price. */
export function resolveTourPriceAmount(startingPrice, price) {
  const fromStarting = parsePriceInput(startingPrice);
  if (fromStarting != null) return fromStarting;
  const fromPrice = parsePriceInput(price);
  if (fromPrice != null) return fromPrice;
  return 0;
}
