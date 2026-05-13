import apiClient, { unwrap } from '@/lib/apiClient';

export const getTestimonials = async () => {
  try {
    const res = await apiClient.get('/testimonials');
    return unwrap(res) ?? [];
  } catch {
    return [];
  }
};
