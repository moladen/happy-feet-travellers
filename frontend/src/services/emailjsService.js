import emailjs from '@emailjs/browser';
import { USER_MESSAGES } from '@/lib/userMessages';

export const EMAILJS_SERVICE_ID = String(process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '').trim();
export const EMAILJS_TEMPLATE_ID = String(process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '').trim();
export const EMAILJS_PUBLIC_KEY = String(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '').trim();

/**
 * Send an enquiry email via EmailJS.
 * @param {{ name: string; email: string; phone: string; title: string; message: string }} params
 */
export async function sendEnquiryEmail({ name, email, phone, title, message }) {
  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
    throw new Error('Email service is not configured. Please try again later.');
  }

  const response = await emailjs.send(
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    {
      name: name || '',
      email: email || '',
      phone: phone || '',
      title: title || 'General enquiry',
      message: message || '',
    },
    { publicKey: EMAILJS_PUBLIC_KEY }
  );

  if (response.status !== 200) {
    throw new Error(USER_MESSAGES.formSubmitFailed);
  }

  return response;
}
