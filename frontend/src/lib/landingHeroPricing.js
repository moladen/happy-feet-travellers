const DEFAULT_RANGE_LABEL = 'Packages from ₹18,999 to ₹31,999';
const DEFAULT_TAG = 'Transparent pricing · No hidden charges';

/** @param {string|number|null|undefined} value */
export function parseRupeeAmount(value) {
  if (value == null) return null;
  const raw = String(value).trim().toLowerCase();
  if (!raw || raw.includes('request') || raw.includes('quote') || raw.includes('tbd')) return null;
  const digits = raw.replace(/[^\d]/g, '');
  const amount = Number.parseInt(digits, 10);
  return Number.isFinite(amount) && amount > 0 ? amount : null;
}

/** @param {number} amount */
export function formatInr(amount) {
  return `₹${amount.toLocaleString('en-IN')}`;
}

/**
 * Resolve hero pricing copy for campaign landing pages.
 * @param {object} page
 * @param {object[]} [packages]
 * @returns {{ main: string; tag: string } | null}
 */
export function resolveLandingHeroPricing(page, packages = []) {
  const blocks =
    page?.customBlocks && typeof page.customBlocks === 'object' && !Array.isArray(page.customBlocks)
      ? page.customBlocks
      : {};

  const explicit = page?.heroPricing || blocks.heroPricing || blocks.heroPricingLabel;
  if (typeof explicit === 'string' && explicit.trim()) {
    return {
      main: explicit.trim(),
      tag: blocks.heroPricingTag || DEFAULT_TAG,
    };
  }

  const list = (Array.isArray(packages) && packages.length ? packages : page?.packages) || [];
  const amounts = list.map((pkg) => parseRupeeAmount(pkg?.startingPrice)).filter((n) => n != null);

  if (amounts.length >= 2) {
    const min = Math.min(...amounts);
    const max = Math.max(...amounts);
    if (min !== max) {
      return {
        main: `Packages from ${formatInr(min)} to ${formatInr(max)}`,
        tag: DEFAULT_TAG,
      };
    }
  }

  if (amounts.length >= 1) {
    return {
      main: `Starting from ${formatInr(Math.min(...amounts))}`,
      tag: DEFAULT_TAG,
    };
  }

  return {
    main: DEFAULT_RANGE_LABEL,
    tag: DEFAULT_TAG,
  };
}
