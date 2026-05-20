import { API_BASE_URL } from '@/constants/site';

/** Default banners when API is unavailable (matches public/hero assets). */
export const FALLBACK_HERO_SLIDES = [
  {
    id: 'fallback-tropical',
    src: '/hero/tropical-paradise.jpg',
    alt: 'Crystal-clear turquoise beach and palm-lined coast',
    tag: 'Beach escapes',
    emoji: '🏖️',
  },
  {
    id: 'fallback-mountain',
    src: '/hero/mountain-golden.jpg',
    alt: 'Dramatic mountain peaks above a sea of clouds at sunrise',
    tag: 'Hill stations',
    emoji: '⛰️',
  },
  {
    id: 'fallback-desert',
    src: '/hero/desert-road-trip.jpg',
    alt: 'Open highway through bold desert and canyon landscapes',
    tag: 'Road trips',
    emoji: '🛣️',
  },
  {
    id: 'fallback-backpacker',
    src: '/hero/backpacker-sunset.jpg',
    alt: 'Solo traveller admiring a lake and mountain horizon',
    tag: 'Adventure tours',
    emoji: '🥾',
  },
  {
    id: 'fallback-resort',
    src: '/hero/resort-pool.jpg',
    alt: 'Infinity pool overlooking a vibrant tropical coastline',
    tag: 'Luxury getaways',
    emoji: '✨',
  },
  {
    id: 'fallback-starry',
    src: '/hero/starry-peaks.jpg',
    alt: 'Starry night sky over snow-capped mountain silhouettes',
    tag: 'Himalayan nights',
    emoji: '🌌',
  },
  {
    id: 'fallback-passport',
    src: '/hero/travel-passport.jpg',
    alt: 'Passport, map and camera ready for the next journey',
    tag: 'Plan your trip',
    emoji: '🧳',
  },
];

export function getApiOrigin() {
  const base = API_BASE_URL || 'http://localhost:5000/api';
  return base.replace(/\/api\/?$/, '');
}

/** Resolve CMS paths, backend uploads, or site-relative assets for next/image. */
export function resolveHeroImageSrc(path) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path) || path.startsWith('data:')) return path;
  if (path.startsWith('/uploads')) return `${getApiOrigin()}${path}`;
  return path;
}

export const HERO_IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp';
export const HERO_IMAGE_MAX_MB = 8;

export function validateHeroImageFile(file) {
  if (!file) return 'Choose an image to upload.';
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowed.includes(file.type)) return 'Only JPG, PNG, and WebP images are allowed.';
  if (file.size > HERO_IMAGE_MAX_MB * 1024 * 1024) {
    return `Image must be ${HERO_IMAGE_MAX_MB}MB or smaller.`;
  }
  return null;
}

export function mapSlidesForDisplay(slides) {
  if (!Array.isArray(slides) || !slides.length) return FALLBACK_HERO_SLIDES;
  return slides.map((slide) => ({
    id: slide.id,
    src: resolveHeroImageSrc(slide.src || slide.imageUrl),
    alt: slide.alt || slide.altText || 'Travel destination',
    tag: slide.tag || 'Travel',
    emoji: slide.emoji || '✨',
  }));
}
