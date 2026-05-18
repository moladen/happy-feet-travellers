import { publicFetch } from '@/lib/publicApi';

const pickList = (data) => {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.testimonials)) return data.testimonials;
  return [];
};

export const getTestimonials = async () => {
  try {
    const data = await publicFetch('/testimonials');
    return pickList(data);
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[getTestimonials]', err?.message || err);
    }
    return [];
  }
};
