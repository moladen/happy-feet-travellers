import { buildCustomizedTripsUrl } from '@/lib/personalizedTripSearch';

/**
 * Homepage customized journey inspiration — emotional, non-package positioning.
 */
export const CUSTOMIZED_JOURNEY_CATEGORIES = [
  {
    id: 'honeymoon',
    slug: 'honeymoon-escapes',
    title: 'Honeymoon Escapes',
    story: 'Romantic journeys crafted for slower, meaningful moments together.',
    image:
      'https://images.unsplash.com/photo-1529333166437-7750a6dd4a70?auto=format&fit=crop&w=1200&q=80',
    filter: { category: 'Honeymoon' },
    theme: 'rose',
  },
  {
    id: 'family',
    slug: 'family-vacations',
    title: 'Family Vacations',
    story: 'Holidays designed around comfort, connection, and unhurried days.',
    image:
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
    filter: { category: 'Family' },
    theme: 'warm',
  },
  {
    id: 'luxury',
    slug: 'luxury-retreats',
    title: 'Luxury Retreats',
    story: 'Restful stays and refined pacing — travel that feels intentionally calm.',
    image:
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
    filter: { q: 'luxury retreat' },
    theme: 'gold',
  },
  {
    id: 'adventure',
    slug: 'adventure-journeys',
    title: 'Adventure Journeys',
    story: 'Escapes for travellers who want more than sightseeing — real immersion.',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
    filter: { category: 'Adventure' },
    theme: 'forest',
  },
  {
    id: 'spiritual',
    slug: 'spiritual-getaways',
    title: 'Spiritual Getaways',
    story: 'Mindful routes, sacred landscapes, and space to breathe deeply again.',
    image:
      'https://images.unsplash.com/photo-1580619309936-099f1ddf8be7?auto=format&fit=crop&w=1200&q=80',
    filter: { category: 'Spiritual' },
    theme: 'earth',
  },
  {
    id: 'weekend',
    slug: 'weekend-escapes',
    title: 'Weekend Escapes',
    story: 'Short breaks with a curated rhythm — maximum feeling, minimum rush.',
    image:
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
    filter: { q: 'weekend' },
    theme: 'sky',
  },
  {
    id: 'slow',
    slug: 'slow-travel',
    title: 'Slow Travel Experiences',
    story: 'Fewer stops, deeper places — journeys that unfold at human pace.',
    image:
      'https://images.unsplash.com/photo-1476514525535-07fb1b4f5bb5?auto=format&fit=crop&w=1200&q=80',
    filter: { q: 'slow travel' },
    theme: 'sage',
  },
  {
    id: 'friends',
    slug: 'friends-getaways',
    title: 'Friends Getaways',
    story: 'Shared adventures built around laughter, discovery, and easy togetherness.',
    image:
      'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=1200&q=80',
    filter: { q: 'friends' },
    theme: 'violet',
  },
];

export const CUSTOMIZED_PLANNING_STEPS = [
  {
    id: 'vision',
    step: '01',
    title: 'Share your travel vision',
    text: 'Tell us how you want the journey to feel — pace, people, places, and the moments that matter.',
  },
  {
    id: 'curate',
    step: '02',
    title: 'We curate the experience',
    text: 'Our planners shape a private route with honest pricing, comfort-first stays, and real local texture.',
  },
  {
    id: 'travel',
    step: '03',
    title: 'Travel comfortably, your way',
    text: 'Move at your rhythm with dedicated support — before departure, on the road, and home again.',
  },
];

export const CUSTOMIZED_TRUST_LINES = [
  'Comfort-first planning',
  'Flexible itineraries',
  'Honest pricing',
  'Curated experiences',
  'Practical travel expertise',
];

export function getCategoryBrowseHref(category) {
  if (category.filter?.category) {
    return buildCustomizedTripsUrl({ category: category.filter.category });
  }
  if (category.filter?.q) {
    return buildCustomizedTripsUrl({ q: category.filter.q });
  }
  return '/customized-trips';
}

export function getCategoryEnquiryHref(category) {
  return `/customized-trips/${category.slug}`;
}
