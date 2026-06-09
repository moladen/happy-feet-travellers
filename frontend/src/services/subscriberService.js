import apiClient, { unwrap, extractPublicApiError } from '@/lib/apiClient';
import { USER_MESSAGES } from '@/lib/userMessages';

export const subscribeToNewsletter = async ({ email, source = 'footer' }) => {
  try {
    const res = await apiClient.post('/subscribers', { email, source });
    return { success: true, data: unwrap(res), message: res?.data?.message };
  } catch (error) {
    const { message } = extractPublicApiError(error, USER_MESSAGES.subscribeFailed, 'subscribe');
    return { success: false, message };
  }
};
