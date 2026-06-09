/**
 * Dual-tone brand assets — light surfaces use dark typography; dark surfaces use light artwork.
 * @typedef {'light' | 'dark'} BrandLogoTone
 */

/** Compact mark for cream / light chrome (multiply blend) */
export const BRAND_LOGO_ON_LIGHT_SRC = '/hft-logo.png';

/** Full wordmark for dark hero overlay — white type on dark matte */
export const BRAND_LOGO_ON_DARK_SRC = '/happy-feet-logo-transparent.png';

/** @deprecated Use {@link getBrandLogoSrc} */
export const BRAND_LOGO_IMAGE_SRC = BRAND_LOGO_ON_LIGHT_SRC;

/**
 * @param {BrandLogoTone} tone
 * @returns {string}
 */
export function getBrandLogoSrc(tone) {
  return tone === 'dark' ? BRAND_LOGO_ON_DARK_SRC : BRAND_LOGO_ON_LIGHT_SRC;
}

/** @type {Record<BrandLogoTone, string>} */
export const BRAND_LOGO_TONE_LABEL = {
  light: 'Happy Feet Travellers — light background logo',
  dark: 'Happy Feet Travellers — dark background logo',
};

/**
 * Resolve logo tone from navbar context (legacy `navTone` support).
 * @param {{ tone?: BrandLogoTone; navTone?: 'hero' | 'solid' }} props
 * @returns {BrandLogoTone}
 */
export function resolveBrandLogoTone({ tone, navTone }) {
  if (tone === 'light' || tone === 'dark') return tone;
  if (navTone === 'hero') return 'dark';
  if (navTone === 'solid') return 'light';
  return 'light';
}
