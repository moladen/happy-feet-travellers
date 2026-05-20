const nodemailer = require('nodemailer');
const mail = require('@/config/mail');
const env = require('@/config/env');
const logger = require('@/utils/logger');
const { buildEnquiryEmail } = require('@/templates/enquiryEmail');

let transporter;
let transporterMode = null; // 'smtp' | 'ethereal'
let etherealReady = false;

function isLeadPlaceholderEmail(email) {
  const value = String(email || '').trim().toLowerCase();
  return !value || value.endsWith('@happyfeet.in') || value.startsWith('lead+');
}

async function createEtherealTransporter() {
  const testAccount = await nodemailer.createTestAccount();
  const transport = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: { user: testAccount.user, pass: testAccount.pass },
  });
  transport._etherealUser = testAccount.user;
  return transport;
}

async function getTransporter() {
  if (transporter) return transporter;

  if (mail.enabled) {
    transporter = nodemailer.createTransport({
      host: mail.host,
      port: mail.port,
      secure: mail.secure,
      auth: mail.user && mail.pass ? { user: mail.user, pass: mail.pass } : undefined,
    });
    transporterMode = 'smtp';
    return transporter;
  }

  if (mail.devEthereal) {
    transporter = await createEtherealTransporter();
    transporterMode = 'ethereal';
    etherealReady = true;
    logger.info(
      `[mail] Development test SMTP active (Ethereal). Login: https://ethereal.email — user: ${transporter._etherealUser}`
    );
    logger.info(
      '[mail] Add SMTP_HOST + SMTP_USER + SMTP_PASS in backend/.env to send real enquiry emails to your inbox.'
    );
    return transporter;
  }

  return null;
}

async function verifyMailTransport() {
  const transport = await getTransporter();
  if (!transport) {
    if (env.isProduction) {
      logger.warn(
        '[mail] SMTP not configured — set SMTP_HOST, SMTP_USER, SMTP_PASS, ENQUIRY_NOTIFY_EMAIL in backend/.env'
      );
    } else {
      logger.info(
        '[mail] SMTP not configured. Set SMTP_* in backend/.env, or enable SMTP_DEV_ETHEREAL (default on in development).'
      );
    }
    return false;
  }
  try {
    await transport.verify();
    if (transporterMode === 'smtp') {
      logger.info('[mail] SMTP connection verified — enquiry emails will be sent.');
    } else {
      logger.info('[mail] Ethereal test SMTP ready — enquiry emails will use preview links in logs.');
    }
    return true;
  } catch (err) {
    logger.error('[mail] SMTP verification failed:', err.message);
    return false;
  }
}

/**
 * Resolve company inbox: ENQUIRY_NOTIFY_EMAIL → SiteSettings.email → ADMIN_EMAIL
 */
async function resolveNotifyRecipient(settingsService) {
  if (mail.notifyTo) return mail.notifyTo;
  try {
    const settings = await settingsService.getSettings();
    if (settings?.email?.trim()) return settings.email.trim();
  } catch (err) {
    logger.warn('[mail] Could not load site settings for notify email:', err.message);
  }
  if (env.admin?.email?.trim()) return env.admin.email.trim();
  return null;
}

async function sendEnquiryNotification(enquiry, recipient) {
  if (!recipient) {
    logger.warn('[mail] Skipping enquiry email — set ENQUIRY_NOTIFY_EMAIL in backend/.env');
    return { sent: false, reason: 'no_recipient' };
  }

  const transport = await getTransporter();
  if (!transport) {
    logger.warn('[mail] Skipping enquiry email — SMTP not configured.');
    return { sent: false, reason: 'smtp_disabled' };
  }

  const { subject, text, html } = buildEnquiryEmail(enquiry);
  const replyTo = isLeadPlaceholderEmail(enquiry.email) ? undefined : enquiry.email;
  const from =
    transporterMode === 'ethereal'
      ? `"Happy Feet Travellers (dev)" <${transport._etherealUser}>`
      : mail.from;

  const info = await transport.sendMail({
    from,
    to: recipient,
    replyTo,
    subject,
    text,
    html,
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    logger.info(`[mail] Enquiry email preview (dev): ${previewUrl}`);
  } else {
    logger.info(`[mail] Enquiry notification sent to ${recipient} (${info.messageId || 'ok'})`);
  }

  return { sent: true, messageId: info.messageId, previewUrl: previewUrl || null };
}

module.exports = {
  verifyMailTransport,
  resolveNotifyRecipient,
  sendEnquiryNotification,
  getTransporter,
};
