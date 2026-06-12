const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

function formatDestination(enquiry) {
  if (enquiry.subject?.trim()) return enquiry.subject.trim();
  const firstLine = String(enquiry.message || '')
    .split('\n')[0]
    ?.trim();
  if (firstLine && firstLine.length <= 120) return firstLine;
  return 'General enquiry';
}

function formatTravellerType(value) {
  if (value === 'domestic') return 'Domestic';
  if (value === 'international') return 'International';
  return '—';
}

function formatTravelInsurance(enquiry) {
  if (!enquiry.travelInsuranceRequested) return 'Not requested';
  return 'Yes (+₹200 per person — to be added in final quotation)';
}

function buildEnquiryEmail(enquiry) {
  const destination = formatDestination(enquiry);
  const submittedAt = enquiry.createdAt
    ? new Date(enquiry.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    : new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const rows = [
    ['Name', enquiry.name],
    ['Phone Number', enquiry.phone || '—'],
    ['Email', enquiry.email],
    ['Destination', destination],
    ['Traveller type', formatTravellerType(enquiry.travellerType)],
    ['Travel insurance', formatTravelInsurance(enquiry)],
    ['Travel details', enquiry.message],
    ['Source', enquiry.source || 'website'],
    ['Submitted', submittedAt],
  ];

  const text = [
    'New Travel Enquiry Received',
    '',
    ...rows.map(([label, value]) => `${label}: ${value}`),
    '',
    `Enquiry ID: ${enquiry.id}`,
  ].join('\n');

  const htmlRows = rows
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #e8edf2;font-weight:600;color:#1f4e79;vertical-align:top;width:160px;">${escapeHtml(label)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e8edf2;color:#2b2b2b;white-space:pre-wrap;">${escapeHtml(value)}</td>
      </tr>`
    )
    .join('');

  const html = `<!DOCTYPE html>
<html>
<body style="margin:0;padding:24px;background:#f4f7fb;font-family:Segoe UI,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 8px 24px rgba(31,78,121,0.12);">
    <tr>
      <td style="padding:20px 24px;background:linear-gradient(135deg,#1f4e79,#4fa3d1);color:#ffffff;">
        <h1 style="margin:0;font-size:20px;font-weight:700;">New Travel Enquiry Received</h1>
        <p style="margin:8px 0 0;font-size:13px;opacity:0.9;">Happy Feet Travellers — website contact form</p>
      </td>
    </tr>
    <tr>
      <td style="padding:8px 8px 0;">
        <table width="100%" cellpadding="0" cellspacing="0">${htmlRows}</table>
      </td>
    </tr>
    <tr>
      <td style="padding:16px 24px 20px;font-size:12px;color:#6f8094;">
        Reference: ${escapeHtml(enquiry.id)}
      </td>
    </tr>
  </table>
</body>
</html>`;

  return {
    subject: 'New Travel Enquiry Received',
    text,
    html,
    destination,
  };
}

module.exports = { buildEnquiryEmail, formatDestination };
