import apiClient, { unwrap, extractApiError } from '@/lib/apiClient';

/**
 * Submits an enquiry. Returns a discriminated object:
 *   { success: true, data, message }
 *   { success: false, message, details? }
 */
export const submitContactForm = async (formData) => {
  const payload = {
    name: formData.name,
    phone: formData.phone || formData.whatsappNumber,
    email: formData.email,
    message: formData.message,
    subject: formData.subject || null,
    source: formData.source || 'contact-form',
  };

  try {
    const res = await apiClient.post('/enquiry', payload);
    return {
      success: true,
      data: unwrap(res),
      message: res?.data?.message || 'Thank you for contacting us!',
    };
  } catch (error) {
    const { message, details } = extractApiError(
      error,
      'Could not send your message right now. Please try again.'
    );
    return { success: false, message, details };
  }
};
