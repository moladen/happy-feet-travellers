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
  const base = String(process.env.NEXT_PUBLIC_API_URL || API_BASE_URL || 'http://localhost:5000/api').replace(
    /\/$/,
    ''
  );
  if (base.startsWith('http://') || base.startsWith('https://')) {
    return base.replace(/\/api\/?$/, '');
  }
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  const proxy = process.env.API_PROXY_TARGET?.replace(/\/$/, '');
  if (proxy) return proxy;
  return 'http://localhost:5000';
}

/** True when URL is a temporary browser blob (must not be saved or shown on public pages). */
export function isTemporaryImageUrl(path) {
  return String(path || '').trim().startsWith('blob:');
}

/**
 * Resolve CMS paths, backend uploads, or site-relative assets for next/image.
 * Uploaded files use relative `/uploads/...` so Next.js rewrites proxy to the backend.
 */
export function resolveHeroImageSrc(path) {
  const raw = String(path || '').trim();
  if (!raw || isTemporaryImageUrl(raw)) return '';
  if (/^https?:\/\//i.test(raw) || raw.startsWith('data:')) return raw;
  if (raw.startsWith('/uploads')) return raw;
  return raw;
}

/** Admin previews may need absolute backend URL when API is on another port without rewrites. */
export function resolveHeroImageSrcForAdmin(path) {
  const resolved = resolveHeroImageSrc(path);
  if (!resolved || resolved.startsWith('http') || !resolved.startsWith('/uploads')) return resolved;
  return `${getApiOrigin()}${resolved}`;
}

export const HERO_IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp';
export const HERO_IMAGE_MAX_MB = 8;

function heroImageExtension(name) {
  const match = String(name || '').toLowerCase().match(/\.(jpe?g|png|webp)$/);
  return match?.[1] || '';
}

/** Accept files Windows may leave with an empty MIME type when extension is valid. */
export function isImageFile(file) {
  if (!file) return false;
  const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/pjpeg']);
  const ext = heroImageExtension(file.name);
  const type = String(file.type || '').toLowerCase();
  const typeOk = !type || allowedTypes.has(type);
  const extOk = ['jpg', 'jpeg', 'png', 'webp'].includes(ext);
  return typeOk || extOk;
}

export function validateHeroImageFile(file) {
  if (!file) return 'Choose an image to upload.';
  const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/pjpeg']);
  const ext = heroImageExtension(file.name);
  const type = String(file.type || '').toLowerCase();
  const typeOk = !type || allowedTypes.has(type);
  const extOk = ['jpg', 'jpeg', 'png', 'webp'].includes(ext);
  if (!typeOk && !extOk) return 'Only JPG, PNG, and WebP images are allowed.';
  if (file.size > HERO_IMAGE_MAX_MB * 1024 * 1024) {
    return `Image must be ${HERO_IMAGE_MAX_MB}MB or smaller.`;
  }
  return null;
}

/** Admin upload preview — keeps blob/data URLs and resolves backend uploads. */
export function resolveAdminPreviewSrc(path) {
  const raw = String(path || '').trim();
  if (!raw) return '';
  if (raw.startsWith('blob:') || raw.startsWith('data:')) return raw;
  return resolveHeroImageSrcForAdmin(raw) || resolveHeroImageSrc(raw);
}

export function mapSlidesForDisplay(slides) {
  if (!Array.isArray(slides) || !slides.length) return FALLBACK_HERO_SLIDES;
  const mapped = slides
    .map((slide) => ({
      id: slide.id,
      src: resolveHeroImageSrc(slide.src || slide.imageUrl),
      alt: slide.alt || slide.altText || 'Travel destination',
      tag: slide.tag || 'Travel',
      emoji: slide.emoji || '✨',
    }))
    .filter((slide) => slide.src);
  return mapped.length ? mapped : FALLBACK_HERO_SLIDES;
}
