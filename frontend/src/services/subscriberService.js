import apiClient, { unwrap, extractApiError } from '@/lib/apiClient';

export const subscribeToNewsletter = async ({ email, source = 'footer' }) => {
  try {
    const res = await apiClient.post('/subscribers', { email, source });
    return { success: true, data: unwrap(res), message: res?.data?.message };
  } catch (error) {
    const { message, details } = extractApiError(error, 'Could not subscribe right now.');
    return { success: false, message, details };
  }
};
