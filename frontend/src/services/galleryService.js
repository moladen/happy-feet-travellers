import { mockGalleryImages } from '@/data/mockData';
import { publicFetch, shouldUseMockFallback } from '@/lib/publicApi';

const API_ASSET_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api')
  .replace(/\/api\/?$/, '')
  .replace(/\/$/, '');

const pickItems = (data) => {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.items)) return data.items;
  return [];
};

function resolveImageUrl(value) {
  const src = String(value || '').trim();
  if (!src) return '';
  if (/^(data:|blob:|https?:\/\/)/i.test(src)) return src;
  if (src.startsWith('/images/') || src.startsWith('/videos/') || src.startsWith('/happy-feet-logo')) {
    return src;
  }
  if (src.startsWith('/')) return API_ASSET_BASE ? `${API_ASSET_BASE}${src}` : src;
  return API_ASSET_BASE ? `${API_ASSET_BASE}/${src}` : `/${src}`;
}

const normalise = (item) => {
  if (!item || typeof item !== 'object') return null;
  const raw = item.image || item.src || item.url;
  const src = resolveImageUrl(raw);
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
    const rows = pickItems(data).map(normalise).filter(Boolean);
    if (rows.length) return rows;
    if (shouldUseMockFallback()) {
      return mockGalleryImages.map(normalise).filter(Boolean);
    }
    return [];
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[getGalleryImages]', err?.message || err);
    }
    return shouldUseMockFallback() ? mockGalleryImages.map(normalise).filter(Boolean) : [];
  }
}
