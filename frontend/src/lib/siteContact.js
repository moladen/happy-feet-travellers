import { resolvePaymentPageContent } from '@/lib/paymentPageContent';

const DEFAULT_WHATSAPP = '919876543210';
const DEFAULT_EMAIL = 'info@happyfeet.com';

export function digitsOnly(value) {
  return String(value || '').replace(/\D/g, '');
}

export function formatIndianPhone(value) {
  const d = digitsOnly(value);
  if (!d) return null;
  if (d.length === 10) return `+91 ${d.slice(0, 5)} ${d.slice(5)}`;
  if (d.length === 12 && d.startsWith('91')) return `+91 ${d.slice(2, 7)} ${d.slice(7)}`;
  return `+${d}`;
}

export function whatsappHref(number, text) {
  const d = digitsOnly(number) || DEFAULT_WHATSAPP;
  const wa = d.length === 10 ? `91${d}` : d.startsWith('91') ? d : `91${d}`;
  const q = text ? `?text=${encodeURIComponent(text)}` : '';
  return `https://wa.me/${wa}${q}`;
}

export function telHref(number) {
  const d = digitsOnly(number);
  if (!d) return `tel:+${DEFAULT_WHATSAPP}`;
  if (d.length === 10) return `tel:+91${d}`;
  return `tel:+${d}`;
}

export const DEFAULT_SITE_CONTACT = {
  whatsappNumber: DEFAULT_WHATSAPP,
  email: DEFAULT_EMAIL,
  officeAddress: 'Pune, Maharashtra, India',
  instagramUrl: 'https://www.instagram.com/',
  facebookUrl: 'https://www.facebook.com/',
  youtubeUrl: 'https://www.youtube.com/',
  paymentLink: 'https://www.fundayoption.com/pay-online/',
};

/** On-site payment section (Contact page) — footer & nav link here first. */
export const SITE_PAYMENT_PAGE = '/contact#pay';

/** Public WhatsApp community for tour updates (replaces email newsletter). */
export const SITE_WHATSAPP_GROUP_URL =
  process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL ||
  'https://chat.whatsapp.com/DJGQZzmiJ02CT8uPUqtxgK';

/** External gateway URL from admin settings (used on Contact → Pay online button). */
export function resolveGatewayPaymentUrl(settings) {
  const merged = mergeSiteSettings(settings);
  const url = String(merged.paymentLink || '').trim();
  return url || DEFAULT_SITE_CONTACT.paymentLink;
}

/** Empty string = admin cleared; null/undefined = fall back to default on public site. */
function resolveSocialField(value, fallback) {
  if (value === null || value === undefined) return fallback;
  const trimmed = String(value).trim();
  return trimmed || null;
}

export function mergeSiteSettings(settings) {
  if (!settings || typeof settings !== 'object') return { ...DEFAULT_SITE_CONTACT };
  const heroCommunityAvatars = Array.isArray(settings.heroCommunityAvatars)
    ? settings.heroCommunityAvatars.filter(Boolean)
    : [];
  return {
    ...DEFAULT_SITE_CONTACT,
    ...settings,
    whatsappNumber: settings.whatsappNumber || DEFAULT_SITE_CONTACT.whatsappNumber,
    email: settings.email || DEFAULT_SITE_CONTACT.email,
    officeAddress: settings.officeAddress || DEFAULT_SITE_CONTACT.officeAddress,
    facebookUrl: resolveSocialField(settings.facebookUrl, DEFAULT_SITE_CONTACT.facebookUrl),
    instagramUrl: resolveSocialField(settings.instagramUrl, DEFAULT_SITE_CONTACT.instagramUrl),
    youtubeUrl: resolveSocialField(settings.youtubeUrl, DEFAULT_SITE_CONTACT.youtubeUrl),
    paymentLink: settings.paymentLink?.trim()
      ? settings.paymentLink.trim()
      : DEFAULT_SITE_CONTACT.paymentLink,
    heroCommunityQuote: settings.heroCommunityQuote ?? null,
    heroCommunityBannerUrl: settings.heroCommunityBannerUrl ?? null,
    heroCommunityAvatars,
    seasonPromoActive: settings.seasonPromoActive ?? true,
    seasonPromoBadge: settings.seasonPromoBadge ?? null,
    seasonPromoEyebrow: settings.seasonPromoEyebrow ?? null,
    seasonPromoTitle: settings.seasonPromoTitle ?? null,
    seasonPromoSubtitle: settings.seasonPromoSubtitle ?? null,
    seasonPromoDescription: settings.seasonPromoDescription ?? null,
    seasonPromoImageUrl: settings.seasonPromoImageUrl ?? null,
    seasonPromoTags: Array.isArray(settings.seasonPromoTags) ? settings.seasonPromoTags : [],
    seasonPromoPrimaryCtaLabel: settings.seasonPromoPrimaryCtaLabel ?? null,
    seasonPromoPrimaryCtaHref: settings.seasonPromoPrimaryCtaHref ?? null,
    seasonPromoSecondaryCtaLabel: settings.seasonPromoSecondaryCtaLabel ?? null,
    seasonPromoSecondaryCtaHref: settings.seasonPromoSecondaryCtaHref ?? null,
    paymentPageContent: resolvePaymentPageContent(settings),
  };
}

/** Google Maps pin for the contact page map (separate from office address text). */
export const OFFICE_MAP_QUERY = 'Chinchwad,Pune,Maharashtra';

/** Google Maps embed for contact page. */
export function buildGoogleMapsEmbedUrl(query = OFFICE_MAP_QUERY) {
  const encoded = encodeURIComponent(String(query || OFFICE_MAP_QUERY).trim() || OFFICE_MAP_QUERY);
  return `https://www.google.com/maps?q=${encoded}&output=embed`;
}

/** Admin / strict mode — only non-empty saved values. */
export function buildSocialLinks(settings) {
  const s = settings && typeof settings === 'object' ? settings : {};
  const links = [];

  const facebook = String(s.facebookUrl || '').trim();
  if (facebook) {
    links.push({
      label: 'Facebook',
      href: facebook,
      icon: 'facebook',
      hover:
        'hover:border-[#1877F2]/70 hover:bg-[#1877F2]/20 hover:text-white hover:shadow-[0_8px_24px_-8px_rgba(24,119,242,0.45)]',
    });
  }

  const instagram = String(s.instagramUrl || '').trim();
  if (instagram) {
    links.push({
      label: 'Instagram',
      href: instagram,
      icon: 'instagram',
      hover:
        'hover:border-pink-300/60 hover:bg-gradient-to-br hover:from-[#f09433]/25 hover:via-[#dc2743]/20 hover:to-[#bc1888]/25 hover:text-white hover:shadow-[0_8px_24px_-8px_rgba(220,39,67,0.35)]',
    });
  }

  const youtube = String(s.youtubeUrl || '').trim();
  if (youtube) {
    links.push({
      label: 'YouTube',
      href: youtube,
      icon: 'youtube',
      hover:
        'hover:border-[#FF0000]/55 hover:bg-[#FF0000]/18 hover:text-white hover:shadow-[0_8px_24px_-8px_rgba(255,0,0,0.35)]',
    });
  }

  const whatsapp = String(s.whatsappNumber || '').trim();
  if (whatsapp) {
    links.push({
      label: 'WhatsApp',
      href: whatsappHref(whatsapp, "Hi, I'm interested in your tours"),
      icon: 'whatsapp',
      hover:
        'hover:border-[#25D366]/70 hover:bg-[#25D366]/22 hover:text-white hover:shadow-[0_8px_24px_-8px_rgba(37,211,102,0.4)]',
    });
  }

  return links;
}

/** Public footer — uses admin URLs, with sensible defaults until configured. */
export function buildFooterSocialLinks(settings) {
  const merged = mergeSiteSettings(settings);
  return buildSocialLinks(merged);
}
