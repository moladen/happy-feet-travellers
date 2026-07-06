import { isTemporaryImageUrl, resolveHeroImageSrc } from '@/lib/heroSlides';

/** Public testimonial avatar — same rules as hero/gallery uploads. */
export function resolveTestimonialImage(value) {
  const raw = String(value || '').trim();
  if (!raw || isTemporaryImageUrl(raw)) return '';

  try {
    if (/^https?:\/\//i.test(raw)) {
      const pathname = new URL(raw).pathname;
      if (pathname.startsWith('/uploads/')) {
        return resolveHeroImageSrc(pathname);
      }
      return raw;
    }
  } catch {
    /* use path rules below */
  }

  return resolveHeroImageSrc(raw);
}

export function mapApiTestimonialToReview(item) {
  if (!item || typeof item !== 'object') return null;

  const text = String(item.review || '').trim();
  const name = String(item.name || 'Traveller').trim();
  if (!text) return null;

  const rating = Number(item.rating);
  return {
    id: item.id || `testimonial-${name}`,
    name,
    date: String(item.city || '').trim() || undefined,
    rating: Number.isFinite(rating) && rating >= 1 ? rating : 5,
    text,
    image: resolveTestimonialImage(item.image),
    verified: false,
  };
}

export function getHomeTestimonials(apiTestimonials = []) {
  return (Array.isArray(apiTestimonials) ? apiTestimonials : [])
    .map(mapApiTestimonialToReview)
    .filter(Boolean);
}
