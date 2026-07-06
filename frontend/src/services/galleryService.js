import { mockGalleryImages } from '@/data/mockData';
import { resolveHeroImageSrc, isTemporaryImageUrl } from '@/lib/heroSlides';
import { publicFetch, shouldUseMockFallback } from '@/lib/publicApi';

const pickItems = (data) => {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.items)) return data.items;
  return [];
};

function resolveGalleryImageUrl(value) {
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
    /* fall through */
  }

  if (raw.startsWith('/images/') || raw.startsWith('/videos/') || raw.startsWith('/happy-feet-logo')) {
    return raw;
  }

  return resolveHeroImageSrc(raw) || raw;
}

const normalise = (item) => {
  if (!item || typeof item !== 'object') return null;
  const raw = item.image || item.src || item.url;
  const src = resolveGalleryImageUrl(raw);
  if (!src) return null;
  return {
    id: item.id,
    src,
    alt: item.altText || item.alt || item.title || 'Gallery photo',
    title: item.title || null,
    category: item.category || null,
  };
};

export async function getGalleryImages() {
  try {
    const data = await publicFetch('/gallery');
    return pickItems(data).map(normalise).filter(Boolean);
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[getGalleryImages]', err?.message || err);
    }
    if (shouldUseMockFallback()) {
      return mockGalleryImages.map(normalise).filter(Boolean);
    }
    return [];
  }
}
