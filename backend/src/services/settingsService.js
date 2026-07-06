const prisma = require('@/config/database');
const { withDatabaseErrors } = require('@/utils/databaseErrors');

const SETTINGS_ID = 'site-settings';

function parseStringList(raw) {
  const sanitise = (list) =>
    list
      .map((item) => String(item || '').trim())
      .filter((item) => item && !item.startsWith('blob:'));

  if (Array.isArray(raw)) {
    return sanitise(raw);
  }
  if (!raw) return [];
  try {
    const parsed = JSON.parse(String(raw));
    if (!Array.isArray(parsed)) return [];
    return sanitise(parsed);
  } catch {
    return sanitise(String(raw).split('\n'));
  }
}

function serializeStringList(value) {
  const list = parseStringList(value);
  return list.length ? JSON.stringify(list) : null;
}

function parseActive(value, fallback = true) {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value === 'boolean') return value;
  const normalized = String(value).toLowerCase();
  return normalized === 'true' || normalized === '1' || normalized === 'yes';
}

function parseAboutPageContent(raw) {
  if (!raw) return null;
  if (typeof raw === 'object' && !Array.isArray(raw)) return raw;
  try {
    const parsed = JSON.parse(String(raw));
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function parsePaymentPageContent(raw) {
  if (!raw) return null;
  if (typeof raw === 'object' && !Array.isArray(raw)) return raw;
  try {
    const parsed = JSON.parse(String(raw));
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function serializeAboutPageContent(value) {
  const parsed = parseAboutPageContent(value);
  return parsed ? JSON.stringify(parsed) : null;
}

function serializePaymentPageContent(value) {
  const parsed = parsePaymentPageContent(value);
  if (!parsed) return null;
  if (parsed.qrImageUrl) {
    parsed.qrImageUrl = sanitiseImageUrl(parsed.qrImageUrl) || null;
  }
  return parsed;
}

function formatSettings(row) {
  if (!row) return row;
  return {
    ...row,
    heroCommunityAvatars: parseStringList(row.heroCommunityAvatars),
    seasonPromoTags: parseStringList(row.seasonPromoTags),
    seasonPromoActive: parseActive(row.seasonPromoActive, true),
    aboutPageContent: parseAboutPageContent(row.aboutPageContent),
    paymentPageContent: parsePaymentPageContent(row.paymentPageContent),
  };
}

async function getSettings() {
  return withDatabaseErrors(async () => {
    const settings = await prisma.siteSettings.findUnique({ where: { id: SETTINGS_ID } });
    return formatSettings(
      settings || {
        id: SETTINGS_ID,
        whatsappNumber: null,
        secondaryPhoneNumber: null,
        email: null,
        instagramUrl: null,
        facebookUrl: null,
        youtubeUrl: null,
        officeAddress: null,
        paymentLink: null,
        footerTagline: null,
        footerDetails: null,
        termsContent: null,
        privacyContent: null,
        cancellationPolicyContent: null,
        policiesLastUpdated: null,
        heroCommunityQuote: null,
        heroCommunityBannerUrl: null,
        heroCommunityAvatars: null,
        seasonPromoActive: true,
        seasonPromoBadge: null,
        seasonPromoEyebrow: null,
        seasonPromoTitle: null,
        seasonPromoSubtitle: null,
        seasonPromoDescription: null,
        seasonPromoImageUrl: null,
        seasonPromoTags: null,
        seasonPromoPrimaryCtaLabel: null,
        seasonPromoPrimaryCtaHref: null,
    seasonPromoSecondaryCtaLabel: null,
    seasonPromoSecondaryCtaHref: null,
    aboutPageContent: null,
    paymentPageContent: null,
      }
    );
  });
}

const trimOrNull = (value) => {
  if (value == null) return null;
  const s = String(value).trim();
  return s || null;
};

function sanitiseImageUrl(value) {
  const url = trimOrNull(value);
  return url && url.startsWith('blob:') ? null : url;
}

async function upsertSettings(payload) {
  const data = {
    whatsappNumber: trimOrNull(payload.whatsappNumber),
    secondaryPhoneNumber: trimOrNull(payload.secondaryPhoneNumber),
    email: trimOrNull(payload.email),
    instagramUrl: trimOrNull(payload.instagramUrl),
    facebookUrl: trimOrNull(payload.facebookUrl),
    youtubeUrl: trimOrNull(payload.youtubeUrl),
    officeAddress: trimOrNull(payload.officeAddress),
    paymentLink: trimOrNull(payload.paymentLink),
    footerTagline: trimOrNull(payload.footerTagline),
    footerDetails: trimOrNull(payload.footerDetails),
    termsContent: trimOrNull(payload.termsContent),
    privacyContent: trimOrNull(payload.privacyContent),
    cancellationPolicyContent: trimOrNull(payload.cancellationPolicyContent),
    policiesLastUpdated: trimOrNull(payload.policiesLastUpdated),
    heroCommunityQuote: trimOrNull(payload.heroCommunityQuote),
    heroCommunityBannerUrl: sanitiseImageUrl(payload.heroCommunityBannerUrl),
    heroCommunityAvatars: serializeStringList(payload.heroCommunityAvatars),
    seasonPromoActive: parseActive(payload.seasonPromoActive, true),
    seasonPromoBadge: trimOrNull(payload.seasonPromoBadge),
    seasonPromoEyebrow: trimOrNull(payload.seasonPromoEyebrow),
    seasonPromoTitle: trimOrNull(payload.seasonPromoTitle),
    seasonPromoSubtitle: trimOrNull(payload.seasonPromoSubtitle),
    seasonPromoDescription: trimOrNull(payload.seasonPromoDescription),
    seasonPromoImageUrl: sanitiseImageUrl(payload.seasonPromoImageUrl),
    seasonPromoTags: serializeStringList(payload.seasonPromoTags),
    seasonPromoPrimaryCtaLabel: trimOrNull(payload.seasonPromoPrimaryCtaLabel),
    seasonPromoPrimaryCtaHref: trimOrNull(payload.seasonPromoPrimaryCtaHref),
    seasonPromoSecondaryCtaLabel: trimOrNull(payload.seasonPromoSecondaryCtaLabel),
    seasonPromoSecondaryCtaHref: trimOrNull(payload.seasonPromoSecondaryCtaHref),
  };

  if (payload.aboutPageContent !== undefined) {
    data.aboutPageContent = serializeAboutPageContent(payload.aboutPageContent);
  }

  if (payload.paymentPageContent !== undefined) {
    data.paymentPageContent = serializePaymentPageContent(payload.paymentPageContent);
  }

  return withDatabaseErrors(async () => {
    const saved = await prisma.siteSettings.upsert({
      where: { id: SETTINGS_ID },
      update: data,
      create: { id: SETTINGS_ID, ...data },
    });
    return formatSettings(saved);
  });
}

module.exports = {
  getSettings,
  upsertSettings,
};
