import apiClient, { unwrap, extractApiError } from '@/lib/apiClient';

/**
 * Submits an enquiry. Returns a discriminated object:
 *   { success: true, data, message }
 *   { success: false, message, details? }
 */
const PHONE_RE = /^(?:\+?91[\s-]?)?[6-9]\d{9}$/;

export const submitContactForm = async (formData) => {
  const rawPhone = (formData.phone || formData.whatsappNumber || '').trim();
  const phone = rawPhone && PHONE_RE.test(rawPhone) ? rawPhone : undefined;

  const payload = {
    name: formData.name?.trim(),
    message: formData.message?.trim(),
    subject: formData.subject?.trim() || null,
    destination: formData.destination?.trim() || null,
    source: formData.source || 'contact-form',
    website: formData.website || '',
    _honeypot: formData._honeypot || '',
  };
  if (phone) payload.whatsappNumber = phone;
  if (formData.email?.trim()) payload.email = formData.email.trim();

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
