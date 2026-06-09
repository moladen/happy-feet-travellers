/**
 * Seed Rann of Kutch Season 2026–27 landing page from default content.
 * Run: node scripts/seed-rann-landing.js
 */
require('module-alias/register');
const prisma = require('../src/config/database');

const SLUG = 'rann-of-kutch-season-2026-27';

const payload = {
  title: 'Rann of Kutch Season 2026–2027',
  slug: SLUG,
  status: 'published',
  heroHeading: 'Rann of Kutch Season 2026–2027',
  heroSubheading:
    'Premium White Desert journeys — group departures, family FIT plans, and full moon experiences across the Rann Utsav season.',
  heroBannerImage:
    'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=2400&h=1400&fit=crop',
  seasonDates: '5 November 2026 – 4 March 2027',
  ctaButtonText: 'Get Priority Access',
  ctaButtonLink: '#priority-interest',
  whatsappGroupEnabled: true,
  introContent: {
    title: 'Introduction to Rann Utsav',
    paragraphs: [
      "Rann Utsav is Gujarat's signature winter celebration — a curated blend of White Desert vistas, folk music, handicraft villages, and thoughtfully paced travel across Kutch.",
      'Happy Feet Travellers designs the season around comfort-first movement, honest pricing, and practical expertise so you experience the desert without the usual planning stress.',
    ],
    summary: [
      'White Rann under moonlit skies',
      'Handicrafts, folk performances & local cuisine',
      'Dholavira, Mandvi, Bhuj & iconic desert routes',
      'Group departures and private family itineraries',
    ],
  },
  whyVisit: [
    {
      title: 'White Desert',
      description: 'Endless salt flats that glow at sunrise and turn surreal under festival lights.',
      image: 'https://images.unsplash.com/photo-1516939884455-1445c8652f83?w=1200&h=900&fit=crop',
    },
    {
      title: 'Full Moon Experience',
      description: 'The Rann at full moon is a once-a-season spectacle — plan dates early for supernight batches.',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=900&fit=crop',
    },
    {
      title: 'Dholavira',
      description: 'UNESCO-listed Harappan heritage that adds depth beyond the desert scenery.',
      image: 'https://images.unsplash.com/photo-1524499982521-1ffd58dd89ea?w=1200&h=900&fit=crop',
    },
    {
      title: 'Mandvi Beach',
      description: 'Coastal calm, palace views, and a gentle contrast to the arid landscapes inland.',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=900&fit=crop',
    },
    {
      title: 'Road to Heaven',
      description: "The iconic elevated corridor through the Rann — one of India's most photographed routes.",
      image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&h=900&fit=crop',
    },
    {
      title: 'Local Culture',
      description: 'Village crafts, embroidery, music, and Kutchi hospitality woven into every itinerary.',
      image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&h=900&fit=crop',
    },
  ],
  bestTimeToVisit: {
    season: '5 November 2026 – 4 March 2027',
    points: [
      'Official Rann Utsav window runs November through early March — ideal weather for desert nights.',
      'December and January are peak festive months with full moon departures and highest demand.',
      'Book trains, Bhungas, and tent city inventory 60–90 days ahead for confirmed arrangements.',
      'Families and senior travellers should prefer paced itineraries with comfortable transfers.',
    ],
  },
  fullMoonCalendar: [
    { date: '24 November 2026', highlight: 'Batch 2 — Long Weekend + New Moon window' },
    { date: '24 December 2026', highlight: 'Batch 4 — Christmas + Full Moon departure' },
    { date: '22 January 2027', highlight: 'Batch 7 — Full Moon Supernight' },
    { date: '21 February 2027', highlight: 'Batch 9 — Full Moon Special' },
    { date: '20 March 2027', highlight: 'Season finale full moon atmosphere' },
  ],
  formConfig: {
    enabled: true,
    redirectToWhatsApp: true,
    successMessage:
      "Thank you — your request is received. Redirecting you to WhatsApp so our travel expert can share batch calendars and early-bird options.",
  },
  seoTitle: 'Rann of Kutch Season 2026–27 | Happy Feet Travellers',
  seoDescription:
    'Priority access for Rann of Kutch Season 2026–27 departures, premium packages, batch calendar, add-ons, and early booking support.',
  seoKeywords: ['Rann of Kutch', 'Rann Utsav 2026', 'Kutch tour packages', 'White Desert India'],
  packages: [
    {
      slug: 'classic-group-departure',
      name: 'Group Departure from Mumbai/Pune',
      category: 'group',
      emoji: '🏜️',
      duration: '5 Days / 4 Nights',
      startingPrice: '₹24,999',
      featuredImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200&h=900&fit=crop',
      shortDescription:
        'Fixed-date group journey with train coordination from Mumbai/Pune, curated sightseeing, and White Rann highlights.',
      highlights: [
        'Small-group pacing with experienced trip lead',
        'Train assistance from Mumbai / Pune',
        'White Rann, Bhuj, Mandvi & cultural evenings',
        'Transparent inclusions and optional upgrades',
      ],
      sortOrder: 0,
    },
    {
      slug: 'ahmedabad-joining',
      name: 'Ahmedabad Joining Package',
      category: 'joining',
      emoji: '🏜️',
      duration: '4 Days / 3 Nights',
      startingPrice: '₹18,499',
      featuredImage: 'https://images.unsplash.com/photo-1564507004663-b6dfb3c824d5?w=1200&h=900&fit=crop',
      shortDescription:
        'Join the circuit from Ahmedabad with seamless transfers into Kutch — perfect for flyers and Gujarat residents.',
      highlights: [
        'Ahmedabad pickup & drop coordination',
        'Flexible joining for flight travellers',
        'Core Rann + heritage route coverage',
        'Add Ahmedabad city extension on request',
      ],
      sortOrder: 1,
    },
    {
      slug: 'bhuj-package',
      name: 'Bhuj Land Package',
      category: 'land',
      emoji: '🏜️',
      duration: '4 Days / 3 Nights',
      startingPrice: '₹16,999',
      featuredImage: 'https://images.unsplash.com/photo-1625505826533-5c80aca7d157?w=1200&h=900&fit=crop',
      shortDescription:
        'Land-only package from Bhuj — ideal when you self-book trains or flights and want a local expert on the ground.',
      highlights: [
        'Bhuj-based start and end',
        'White Rann, handicraft villages & Dholavira option',
        'Local stays with comfort-first selection',
        'Efficient for Western India road travellers',
      ],
      sortOrder: 2,
    },
    {
      slug: 'premium-tent-city',
      name: 'Premium Tent City Package',
      category: 'premium',
      emoji: '🏜️',
      duration: '3 Days / 2 Nights',
      startingPrice: '₹28,999',
      featuredImage: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&h=900&fit=crop',
      shortDescription:
        'Elevated Rann Utsav stay with premium tent city nights, curated dining, and priority desert access.',
      highlights: [
        'Premium tent city accommodation',
        'Priority White Rann session planning',
        'Festival atmosphere with comfort upgrades',
        'Ideal for anniversary & celebration travel',
      ],
      sortOrder: 3,
    },
    {
      slug: 'customized-family-couple',
      name: 'Customized Family Tour',
      category: 'customized',
      emoji: '🏜️',
      duration: 'Flexible',
      startingPrice: 'On request',
      featuredImage: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1200&h=900&fit=crop',
      shortDescription:
        'Private itinerary for families and friend groups — custom dates, pacing, rooming, and kid-friendly planning.',
      highlights: [
        'Fully private route and dates',
        'Family rooming & senior-friendly pacing',
        'Mix of Rann, Mandvi, Dholavira & extensions',
        'Dedicated planner on WhatsApp',
      ],
      sortOrder: 4,
    },
  ],
  faqs: [
    {
      category: 'travel',
      question: 'What is the best time to visit Rann of Kutch?',
      answer:
        'November to early March during Rann Utsav. December–January is peak; book early for full moon batches.',
      sortOrder: 0,
    },
    {
      category: 'package',
      question: 'What is the difference between group and customized packages?',
      answer:
        'Group departures have fixed dates and shared batches; customized tours are private with flexible pacing.',
      sortOrder: 1,
    },
    {
      category: 'booking',
      question: 'How does early-bird / priority access work?',
      answer:
        'Submit the priority form to receive batch calendars, indicative pricing, and booking window alerts first.',
      sortOrder: 2,
    },
  ],
  testimonials: [],
};

async function main() {
  const existing = await prisma.landingPage.findUnique({ where: { slug: SLUG } });
  if (existing) {
    console.log(`Landing page "${SLUG}" already exists (${existing.id}). Skipping seed.`);
    return;
  }

  const { packages, faqs, testimonials, ...pageData } = payload;

  const page = await prisma.landingPage.create({
    data: {
      ...pageData,
      publishedAt: new Date(),
      packages: { create: packages },
      faqs: { create: faqs },
      testimonials: { create: testimonials },
    },
    include: { packages: true },
  });

  console.log(`Created landing page: ${page.title} (${page.slug}) with ${page.packages.length} packages.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
