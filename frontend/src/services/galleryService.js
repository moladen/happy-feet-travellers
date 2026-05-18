import { publicFetch } from '@/lib/publicApi';

const pickItems = (data) => {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.items)) return data.items;
  return [];
};

const normalise = (item) => {
  if (!item || typeof item !== 'object') return null;
  const src = item.image || item.src || item.url;
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
    return [];
  }
}
