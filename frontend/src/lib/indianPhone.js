/** Normalise common Indian mobile inputs to 10-digit string. */
export function normalizeIndianPhone(raw) {
  let digits = String(raw || '').trim().replace(/[\s-]/g, '');
  if (!digits) return '';

  if (digits.startsWith('+91')) digits = digits.slice(3);
  else if (digits.startsWith('91') && digits.length === 12) digits = digits.slice(2);
  if (digits.startsWith('0') && digits.length === 11) digits = digits.slice(1);

  return digits;
}

/** @param {string} raw */
export function isValidIndianPhone(raw) {
  const digits = normalizeIndianPhone(raw);
  return /^[6-9]\d{9}$/.test(digits);
}

/** @param {string} raw */
export function formatIndianPhoneDisplay(raw) {
  const digits = normalizeIndianPhone(raw);
  if (digits.length !== 10) return String(raw || '').trim();
  return `${digits.slice(0, 5)} ${digits.slice(5)}`;
}
