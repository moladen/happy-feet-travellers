import { publicFetch } from '@/lib/publicApi';
import { mergeSiteSettings } from '@/lib/siteContact';

export async function getPublicSettings() {
  try {
    const data = await publicFetch('/settings');
    return mergeSiteSettings(data);
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[getPublicSettings]', err?.message || err);
    }
    return mergeSiteSettings(null);
  }
}
