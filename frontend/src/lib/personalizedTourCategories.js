import { buildCustomizedTripsUrl } from '@/lib/personalizedTripSearch';

/** Homepage category chips — emotional, curated, not package listings. */
export const PERSONALIZED_TOUR_CATEGORIES = [
  {
    id: 'honeymoon',
    icon: '❤️',
    label: 'Honeymoon',
    filter: { category: 'Honeymoon' },
  },
  {
    id: 'adventure',
    icon: '🏔',
    label: 'Adventure',
    filter: { category: 'Adventure' },
  },
  {
    id: 'road-trips',
    icon: '🚗',
    label: 'Road Trips',
    filter: { category: 'Road Trips' },
  },
  {
    id: 'spiritual',
    icon: '🕉',
    label: 'Spiritual',
    filter: { category: 'Spiritual' },
  },
  {
    id: 'family',
    icon: '👨‍👩‍👧',
    label: 'Family Escapes',
    filter: { category: 'Family' },
  },
  {
    id: 'coastal',
    icon: '🌊',
    label: 'Coastal Retreats',
    filter: { q: 'coastal beach' },
  },
  {
    id: 'snow',
    icon: '❄',
    label: 'Snow Escapes',
    filter: { q: 'snow winter' },
  },
  {
    id: 'slow',
    icon: '🌿',
    label: 'Slow Travel',
    filter: { q: 'slow travel' },
  },
];

export const PERSONALIZED_SECTION_COPY = {
  eyebrow: 'Crafted around you',
  title: 'Personalized Tours',
  lede:
    'Journeys crafted around your kind of escape — romantic getaways, soulful retreats, and unforgettable adventures. Travel experiences thoughtfully designed around the moments that matter most.',
  ctaHeadline: "Tell us your dream trip — we'll build it for you.",
  ctaButton: 'Build Your Journey',
};

export function getPersonalizedCategoryHref(category) {
  if (category.filter?.category) {
    return buildCustomizedTripsUrl({ category: category.filter.category });
  }
  if (category.filter?.q) {
    return buildCustomizedTripsUrl({ q: category.filter.q });
  }
  return '/customized-trips';
}
