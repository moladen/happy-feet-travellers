const env = require('@/config/env');

const parseBool = (value, fallback = false) => {
  if (value == null || value === '') return fallback;
  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
};

const port = parseInt(process.env.SMTP_PORT, 10) || 587;
const secure =
  parseBool(process.env.SMTP_SECURE) || port === 465;

const user = process.env.SMTP_USER?.trim() || '';
const pass = process.env.SMTP_PASS?.trim() || '';
const host = process.env.SMTP_HOST?.trim() || '';

const smtpConfigured = Boolean(host && (user ? pass : true));

const mail = {
  /** Real SMTP (Brevo, Resend, Gmail, etc.) */
  enabled: smtpConfigured,
  host,
  port,
  secure,
  user: user || undefined,
  pass: pass || undefined,
  from: process.env.MAIL_FROM?.trim() || 'Happy Feet Travellers <noreply@happyfeet.com>',
  notifyTo:
    process.env.ENQUIRY_NOTIFY_EMAIL?.trim() ||
    process.env.COMPANY_EMAIL?.trim() ||
    env.admin?.email?.trim() ||
    null,
  verifyOnStart: parseBool(process.env.SMTP_VERIFY_ON_START, env.isProduction),
  /**
   * Local dev only: auto-use Ethereal test SMTP when SMTP_HOST is empty.
   * Set SMTP_DEV_ETHEREAL=false to silence test emails in development.
   */
  devEthereal: parseBool(process.env.SMTP_DEV_ETHEREAL, env.isDevelopment && !smtpConfigured),
};

module.exports = mail;
