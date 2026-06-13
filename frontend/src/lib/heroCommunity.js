export const DEFAULT_HERO_COMMUNITY_QUOTE =
  'Trusted by travelers who value comfort, transparency, and meaningful journeys.';

export const DEFAULT_HERO_COMMUNITY_AVATARS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=128&h=128&fit=crop',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop',
];

function isPublicImageUrl(value) {
  const url = String(value || '').trim();
  if (!url) return false;
  if (url.startsWith('blob:')) return false;
  return true;
}

export function resolveHeroCommunity(settings) {
  const avatars = Array.isArray(settings?.heroCommunityAvatars)
    ? settings.heroCommunityAvatars
        .map((item) => String(item || '').trim())
        .filter(isPublicImageUrl)
    : [];

  return {
    quote:
      typeof settings?.heroCommunityQuote === 'string' && settings.heroCommunityQuote.trim()
        ? settings.heroCommunityQuote.trim()
        : DEFAULT_HERO_COMMUNITY_QUOTE,
    bannerUrl:
      typeof settings?.heroCommunityBannerUrl === 'string' &&
      isPublicImageUrl(settings.heroCommunityBannerUrl)
        ? settings.heroCommunityBannerUrl.trim()
        : '',
    avatars: avatars.length ? avatars : DEFAULT_HERO_COMMUNITY_AVATARS,
  };
}
