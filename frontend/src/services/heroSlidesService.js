import { publicFetch } from '@/lib/publicApi';
import { mapSlidesForDisplay } from '@/lib/heroSlides';

export async function fetchPublicHeroSlides() {
  try {
    const data = await publicFetch('/hero-slides');
    const slides = data?.slides || [];
    return mapSlidesForDisplay(slides);
  } catch {
    return mapSlidesForDisplay([]);
  }
}
