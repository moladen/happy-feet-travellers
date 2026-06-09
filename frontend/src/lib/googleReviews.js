/**
 * Manual Google Reviews data — edit here when adding/updating public reviews.
 * Link the badge to your Google Business profile via NEXT_PUBLIC_GOOGLE_REVIEWS_URL.
 */

export const GOOGLE_REVIEWS_PROFILE_URL =
  process.env.NEXT_PUBLIC_GOOGLE_REVIEWS_URL?.trim() ||
  'https://www.google.com/maps/search/Happy+Feet+Travellers+Pune';

export const GOOGLE_REVIEWS_SUMMARY = {
  rating: 4.8,
  maxRating: 5,
  totalReviews: 52,
  label: 'Google Reviews',
};

export const GOOGLE_REVIEWS = [
  {
    id: 'google-aditi',
    name: 'Aditi Joshi',
    date: 'November 2025',
    rating: 5,
    text: 'Booked the Sikkim group with friends. Pune pickup was on time, the captain was patient, and pricing matched the brochure exactly.',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    verified: true,
  },
  {
    id: 'google-sameer',
    name: 'Sameer Deshpande',
    date: 'October 2025',
    rating: 5,
    text: 'Family Goa trip was sorted end-to-end. No upselling on-trip and the WhatsApp support was genuinely quick.',
    image:
      'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=400&q=80',
    verified: true,
  },
  {
    id: 'google-priya',
    name: 'Priya Nair',
    date: 'September 2025',
    rating: 5,
    text: 'Spiti departure felt well-paced — homestays were clean, group size was comfortable, and the itinerary had room to breathe.',
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80',
    verified: true,
  },
  {
    id: 'google-rohan',
    name: 'Rohan Mehta',
    date: 'August 2025',
    rating: 5,
    text: 'Rann Utsav enquiry to booking was smooth on WhatsApp. Batch details were clear and the team followed up without chasing.',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    verified: true,
  },
  {
    id: 'google-neha',
    name: 'Neha Kulkarni',
    date: 'July 2025',
    rating: 5,
    text: 'Kerala honeymoon was beautifully planned — houseboat, transfers, and hotel choices all felt thoughtful. Would book again.',
    image:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    verified: true,
  },
  {
    id: 'google-arjun',
    name: 'Arjun Patil',
    date: 'June 2025',
    rating: 4,
    text: 'Solid Ladakh experience with clear communication before the trip. A couple of hotel check-ins were slow, but the team resolved it quickly.',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    verified: true,
  },
];
