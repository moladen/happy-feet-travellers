/**
 * Demo enquiry email — no real SMTP password needed.
 * Run: npm run demo:email
 * Opens a preview link in the terminal (Ethereal test mail).
 */
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('module-alias').addAliases({ '@': path.resolve(__dirname, '../src') });

const emailService = require('@/services/emailService');
const settingsService = require('@/services/settingsService');

const demoEnquiry = {
  id: 'demo-' + Date.now(),
  name: 'Demo Traveller',
  phone: '9876543210',
  email: 'demo.guest@example.com',
  subject: 'Goa beach trip — June 2026',
  message:
    'Hi, we are 2 adults looking for a 5-day Goa package from Pune. Budget around ₹25,000 per person. Flexible dates in June.',
  source: 'demo-script',
  createdAt: new Date(),
};

async function main() {
  console.log('\n📧 Happy Feet — demo enquiry email\n');

  const recipient = await emailService.resolveNotifyRecipient(settingsService);
  console.log(`  Notify inbox (configured): ${recipient || '(not set)'}`);

  const result = await emailService.sendEnquiryNotification(demoEnquiry, recipient);

  if (!result.sent) {
    console.log('\n  ✗ Email not sent:', result.reason);
    console.log('  Tip: set ENQUIRY_NOTIFY_EMAIL in backend/.env and keep SMTP_DEV_ETHEREAL=true\n');
    process.exit(1);
  }

  if (result.previewUrl) {
    console.log('\n  ✓ Demo email created (test SMTP — not your real Gmail inbox)\n');
    console.log('  Open this link in your browser to read the email:\n');
    console.log(`  ${result.previewUrl}\n`);
    console.log('  After contact form submit, the same kind of link appears in `npm run dev` logs.\n');
  } else {
    console.log('\n  ✓ Email sent to:', recipient, '\n');
  }

  process.exit(0);
}

main().catch((err) => {
  console.error('\n  ✗ Demo failed:', err.message, '\n');
  process.exit(1);
});
