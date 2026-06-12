import apiClient, { extractApiError } from '@/lib/apiClient';
import { sendEnquiryEmail } from '@/services/emailjsService';
import { normalizeIndianPhone, isValidIndianPhone } from '@/lib/indianPhone';
import { USER_MESSAGES } from '@/lib/userMessages';

/**
 * Submits an enquiry via EmailJS (email) + API (admin panel).
 * Success when EmailJS delivers; admin save is best-effort in parallel.
 */

function resolveTitle(formData) {
  return (
    formData.destination?.trim() ||
    formData.subject?.trim() ||
    formData.title?.trim() ||
    'General enquiry'
  );
}

function resolvePhone(formData) {
  const rawPhone = (formData.phone || formData.whatsappNumber || '').trim();
  if (!rawPhone) return '';
  return isValidIndianPhone(rawPhone) ? normalizeIndianPhone(rawPhone) : '';
}

function buildApiPayload(formData) {
  const phone = resolvePhone(formData);
  const title = resolveTitle(formData);

  const payload = {
    name: formData.name?.trim(),
    message: formData.message?.trim(),
    subject:
      formData.destination?.trim() ||
      formData.subject?.trim() ||
      (title !== 'General enquiry' ? title : null),
    destination: formData.destination?.trim() || null,
    source: formData.source || 'contact-form',
    website: formData.website || '',
    _honeypot: formData._honeypot || '',
  };

  if (phone) payload.whatsappNumber = phone;
  if (formData.email?.trim()) payload.email = formData.email.trim();
  if (formData.landingPageId?.trim()) payload.landingPageId = formData.landingPageId.trim();
  if (formData.travellerType?.trim()) payload.travellerType = formData.travellerType.trim();
  if (formData.travelInsuranceRequested) payload.travelInsuranceRequested = true;

  return { payload, title, phone };
}

export const submitContactForm = async (formData) => {
  if (formData.website?.trim()) {
    return { success: true, message: 'Thank you for contacting us!' };
  }

  const { payload, title, phone } = buildApiPayload(formData);

  const emailParams = {
    name: payload.name || '',
    email: payload.email || formData.email?.trim() || '',
    phone,
    title,
    message: payload.message || '',
  };

  const [emailResult, adminResult] = await Promise.allSettled([
    sendEnquiryEmail(emailParams),
    apiClient.post('/enquiry', payload),
  ]);

  const emailOk = emailResult.status === 'fulfilled';
  const adminOk = adminResult.status === 'fulfilled';

  if (process.env.NODE_ENV !== 'production') {
    if (!emailOk) {
      const emailErr =
        emailResult.reason?.text || emailResult.reason?.message || emailResult.reason;
      console.warn('[enquiry] EmailJS failed:', emailErr);
    }
    if (!adminOk) {
      const adminErr = adminResult.reason;
      console.warn('[enquiry] Admin save failed:', extractApiError(adminErr, adminErr?.message).message);
    }
  }

  if (emailOk || adminOk) {
    return {
      success: true,
      message: 'Thank you for contacting us!',
    };
  }

  return {
    success: false,
    message: USER_MESSAGES.formSubmitFailed,
  };
};
