import { GOOGLE_REVIEWS_PROFILE_URL } from '@/lib/googleReviews';

export const FLOATING_TRUST_BAR = {
  rating: '4.8',
  reviewCount: '202+',
  items: [
    {
      id: 'google-rating',
      emoji: '⭐',
      label: '4.8 Google Rating',
      href: GOOGLE_REVIEWS_PROFILE_URL,
      external: true,
    },
    {
      id: 'reviews',
      emoji: '📝',
      label: '202+ Reviews',
      href: GOOGLE_REVIEWS_PROFILE_URL,
      external: true,
    },
    {
      id: 'trusted',
      emoji: '🧳',
      label: 'Trusted by Thousands of Travellers',
      href: '/about',
    },
    {
      id: 'seasonal',
      emoji: '🏜️',
      label: 'Exclusive Seasonal Departures',
      href: '/upcoming-departures',
    },
  ],
};
