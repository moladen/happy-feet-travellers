import {
  RANN_SEASON_DATES,
  RANN_SEASON_PATH,
  RANN_SEASON_TAGLINE,
  RANN_SEASON_TITLE,
} from '@/lib/rannSeason';

export const DEFAULT_SEASON_PROMO_IMAGE =
  'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=1400&h=700&fit=crop';

export const DEFAULT_SEASON_PROMO = {
  active: true,
  badge: 'Season 2026–27',
  eyebrow: 'Group departures & customized tours',
  title: RANN_SEASON_TITLE,
  subtitle: RANN_SEASON_DATES,
  description: RANN_SEASON_TAGLINE,
  imageUrl: DEFAULT_SEASON_PROMO_IMAGE,
  tags: ['10 group batches', 'FIT & family packages', 'Early-bird priority'],
  primaryCtaLabel: 'Explore season page',
  primaryCtaHref: RANN_SEASON_PATH,
  secondaryCtaLabel: 'Get priority access',
  secondaryCtaHref: `${RANN_SEASON_PATH}#priority-interest`,
};

function parseTagList(raw) {
  if (Array.isArray(raw)) {
    return raw.map((item) => String(item || '').trim()).filter(Boolean);
  }
  if (!raw) return [];
  try {
    const parsed = JSON.parse(String(raw));
    if (Array.isArray(parsed)) {
      return parsed.map((item) => String(item || '').trim()).filter(Boolean);
    }
  } catch {
    /* fall through */
  }
  return String(raw)
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function resolveSeasonPromo(settings) {
  if (!settings || typeof settings !== 'object') {
    return { ...DEFAULT_SEASON_PROMO };
  }

  const tags = parseTagList(settings.seasonPromoTags);
  const active =
    settings.seasonPromoActive === undefined || settings.seasonPromoActive === null
      ? DEFAULT_SEASON_PROMO.active
      : Boolean(settings.seasonPromoActive);

  return {
    active,
    badge:
      typeof settings.seasonPromoBadge === 'string' && settings.seasonPromoBadge.trim()
        ? settings.seasonPromoBadge.trim()
        : DEFAULT_SEASON_PROMO.badge,
    eyebrow:
      typeof settings.seasonPromoEyebrow === 'string' && settings.seasonPromoEyebrow.trim()
        ? settings.seasonPromoEyebrow.trim()
        : DEFAULT_SEASON_PROMO.eyebrow,
    title:
      typeof settings.seasonPromoTitle === 'string' && settings.seasonPromoTitle.trim()
        ? settings.seasonPromoTitle.trim()
        : DEFAULT_SEASON_PROMO.title,
    subtitle:
      typeof settings.seasonPromoSubtitle === 'string' && settings.seasonPromoSubtitle.trim()
        ? settings.seasonPromoSubtitle.trim()
        : DEFAULT_SEASON_PROMO.subtitle,
    description:
      typeof settings.seasonPromoDescription === 'string' && settings.seasonPromoDescription.trim()
        ? settings.seasonPromoDescription.trim()
        : DEFAULT_SEASON_PROMO.description,
    imageUrl:
      typeof settings.seasonPromoImageUrl === 'string' && settings.seasonPromoImageUrl.trim()
        ? settings.seasonPromoImageUrl.trim()
        : DEFAULT_SEASON_PROMO.imageUrl,
    tags: tags.length ? tags : DEFAULT_SEASON_PROMO.tags,
    primaryCtaLabel:
      typeof settings.seasonPromoPrimaryCtaLabel === 'string' &&
      settings.seasonPromoPrimaryCtaLabel.trim()
        ? settings.seasonPromoPrimaryCtaLabel.trim()
        : DEFAULT_SEASON_PROMO.primaryCtaLabel,
    primaryCtaHref:
      typeof settings.seasonPromoPrimaryCtaHref === 'string' &&
      settings.seasonPromoPrimaryCtaHref.trim()
        ? settings.seasonPromoPrimaryCtaHref.trim()
        : DEFAULT_SEASON_PROMO.primaryCtaHref,
    secondaryCtaLabel:
      typeof settings.seasonPromoSecondaryCtaLabel === 'string' &&
      settings.seasonPromoSecondaryCtaLabel.trim()
        ? settings.seasonPromoSecondaryCtaLabel.trim()
        : DEFAULT_SEASON_PROMO.secondaryCtaLabel,
    secondaryCtaHref:
      typeof settings.seasonPromoSecondaryCtaHref === 'string' &&
      settings.seasonPromoSecondaryCtaHref.trim()
        ? settings.seasonPromoSecondaryCtaHref.trim()
        : DEFAULT_SEASON_PROMO.secondaryCtaHref,
  };
}

export function tagsToTextarea(tags) {
  return (Array.isArray(tags) ? tags : []).join('\n');
}

export function textareaToTags(text) {
  return String(text || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}
