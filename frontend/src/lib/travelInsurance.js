export const TRAVEL_INSURANCE_PRICE_INR = 200;
export const TRAVEL_INSURANCE_MAX_AGE = 70;

/** Parse ages from free-text kid age field (e.g. "8, 12 years"). */
export function parseTravellerAges(text) {
  const raw = String(text || '').trim();
  if (!raw) return [];
  return raw
    .split(/[,;/\s]+/)
    .map((part) => part.replace(/[^\d]/g, ''))
    .filter(Boolean)
    .map((digits) => Number(digits))
    .filter((age) => Number.isFinite(age));
}

export function agesWithinInsuranceRange(ages, maxAge = TRAVEL_INSURANCE_MAX_AGE) {
  if (!ages.length) return true;
  return ages.every((age) => age >= 0 && age <= maxAge);
}

export function formatTravelInsuranceLabel(requested) {
  if (!requested) return 'Not requested';
  return `Yes (+₹${TRAVEL_INSURANCE_PRICE_INR} per person — added in final quotation)`;
}
