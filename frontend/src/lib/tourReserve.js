import { DEFAULT_SITE_CONTACT, whatsappHref } from '@/lib/siteContact';

/** Default seat-reserve deposit when not set on the tour or in offers copy */
export const DEFAULT_RESERVE_DEPOSIT = 5000;

export function isGroupDepartureTour(tour) {
  const category = String(tour?.category ?? '')
    .trim()
    .toLowerCase();
  if (category === 'customized') return false;
  return category === 'upcoming' || Boolean(tour?.startDate);
}

function parseAmountFromOffers(offers) {
  const text = String(offers || '');
  if (!text.trim()) return null;

  const patterns = [
    /book\s+with\s+₹?\s*([\d,]+)/i,
    /₹\s*([\d,]+)\s*(?:advance|booking|deposit|reserve)/i,
    /([\d,]+)\s*(?:advance|booking\s+amount|deposit)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      const amount = Number(String(match[1]).replace(/,/g, ''));
      if (Number.isFinite(amount) && amount > 0) return amount;
    }
  }
  return null;
}

/** Priority: admin `bookingDeposit` → legacy offers text → site default */
export function resolveReserveDepositAmount(tour) {
  const direct = Number(tour?.bookingDeposit ?? tour?.reserveDeposit);
  if (Number.isFinite(direct) && direct > 0) return direct;

  const fromOffers = parseAmountFromOffers(tour?.offers);
  if (fromOffers) return fromOffers;

  return DEFAULT_RESERVE_DEPOSIT;
}

export function formatReserveDepositInr(amount) {
  const value = Number(amount);
  if (!Number.isFinite(value) || value <= 0) return '₹5,000';
  return `₹${value.toLocaleString('en-IN')}`;
}

export function formatReserveSeatLabel(tour) {
  const amount = resolveReserveDepositAmount(tour);
  return `Reserve Seat @ ${formatReserveDepositInr(amount)}`;
}

function formatTourLabelForMessage(tour) {
  const title = String(tour?.title || 'your tour').trim();
  const duration = String(tour?.durationLabel || tour?.duration || '').trim();
  if (!duration) return title;
  if (title.toLowerCase().includes(duration.toLowerCase())) return title;
  return `${title} ${duration}`;
}

export function buildReserveSeatMessage(tour) {
  const tourLabel = formatTourLabelForMessage(tour);
  const deposit = formatReserveDepositInr(resolveReserveDepositAmount(tour));
  return [
    'Hello HFT Team,',
    `I want to reserve my seat for ${tourLabel} tour by paying ${deposit} booking amount.`,
    'Please confirm availability.',
  ].join('\n');
}

export function buildReserveSeatHref(tour, whatsappNumber) {
  const number = whatsappNumber || DEFAULT_SITE_CONTACT.whatsappNumber;
  return whatsappHref(number, buildReserveSeatMessage(tour));
}
