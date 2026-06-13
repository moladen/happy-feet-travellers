const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const {
  DEFAULT_CANCELLATION_HTML,
  DEFAULT_POLICIES_LAST_UPDATED,
  DEFAULT_PRIVACY_HTML,
  DEFAULT_TERMS_HTML,
} = require('../src/constants/defaultPolicies');

const DEFAULT_HERO_COMMUNITY_AVATARS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=128&h=128&fit=crop',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop',
];
require('dotenv').config();

const prisma = new PrismaClient();

const slugify = (s) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const IMG = {
  sikkim:
    'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
  himalayas:
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
  goa:
    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
  goaSunset:
    'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&w=1200&q=80',
  kerala:
    'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
  forest:
    'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
  snowMtn:
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
  spiti:
    'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
  ladakh:
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
  rajasthan:
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
  meghalaya:
    'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
  blogPacking:
    'https://images.unsplash.com/photo-1553531384-cc64ac80f931?auto=format&fit=crop&w=1200&q=80',
  blogNotes:
    'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?auto=format&fit=crop&w=1200&q=80',
};

const tours = [
  {
    title: 'Sikkim & Darjeeling Group Trip',
    departureCity: 'Pune',
    category: 'upcoming',
    subCategory: 'mountains',
    destination: 'Sikkim & Darjeeling',
    tags: ['Snow Lovers', 'Adventure'],
    groupSize: '12–18 travellers only',
    status: 'active',
    featured: true,
    price: 25000,
    startingPrice: 25000,
    coverImage: IMG.sikkim,
    images: [IMG.sikkim, IMG.himalayas, IMG.snowMtn],
    duration: 6,
    durationLabel: '5N6D',
    urgency: 'Only 4 seats left',
    bookingDeposit: 2000,
    rating: 4.8,
    reviewsCount: 234,
    description:
      'A relaxed-pace Himalayan circuit covering Gangtok and Darjeeling — verified hotels, smooth transfers and a trip captain travelling with the group.',
    highlights: [
      'Tiger Hill sunrise',
      'Tea estate walk in Darjeeling',
      'Rumtek monastery visit',
      'Cable car & Tsomgo Lake (subject to permits)',
    ],
    dateLabel: '5 Jun - 10 Jun 2026',
    startDate: new Date('2026-06-05'),
    endDate: new Date('2026-06-10'),
    itinerary: [
      { day: 'Day 1', title: 'Arrive Bagdogra · transfer to Gangtok', details: 'Group pickup at Bagdogra airport, scenic drive to Gangtok, hotel check-in and an evening MG Marg walk.' },
      { day: 'Day 2', title: 'Gangtok sightseeing', details: 'Cable car ride, Rumtek monastery, Banjhakri waterfalls and Tsomgo Lake (permits permitting).' },
      { day: 'Day 3', title: 'Transfer to Darjeeling', details: 'Drive across hill terrain with a tea garden stop. Evening at leisure on Mall Road.' },
      { day: 'Day 4', title: 'Darjeeling highlights', details: 'Tiger Hill sunrise, Batasia Loop, Himalayan Mountaineering Institute and the toy train joy ride.' },
      { day: 'Day 5', title: 'Cafés, shopping & rest', details: 'Free time for cafés, last-mile shopping and group photos.' },
      { day: 'Day 6', title: 'Departure', details: 'Hotel checkout and group transfer to Bagdogra for onward travel.' },
    ],
    inclusions: [
      '5 nights hotel stay (3★ category)',
      'Daily breakfast and dinner',
      'All inter-city transfers in private vehicles',
      'Trip captain travelling with the group',
      'Permits for Tsomgo Lake (subject to weather)',
    ],
    exclusions: [
      'Flights/trains to & from Bagdogra',
      'Lunches and personal expenses',
      'Cable car / monument entry tickets',
      'Travel insurance',
    ],
    faqs: [
      { question: 'Is this trip beginner-friendly?', answer: 'Yes. The pace is relaxed and there are no treks involved. It suits most age groups in reasonable health.' },
      { question: 'Can solo travellers join?', answer: 'Absolutely — solo travellers join almost every group. Twin-sharing rooms are arranged with someone of the same gender.' },
    ],
    thingsToCarry: [
      'Government photo ID (mandatory for permits)',
      'Comfortable walking shoes',
      'Warm layers — evenings get cold',
      'Power bank and basic medication',
    ],
    terms: [
      'Slot is confirmed only on receipt of advance payment.',
      'Schedule may shift due to weather or permit availability — we’ll communicate in advance.',
    ],
    offers: 'Book with ₹2,000 advance · limited early-bird seats',
    meals: 'Daily breakfast & dinner (veg / non-veg set menus)',
    stayType: '3-star category hotels · twin / triple sharing',
    transport: 'Private vehicle for all sightseeing & transfers on route',
    suitableFor: 'Beginners to Himalayas · adults & families in good health',
    pickupPoints: [
      { name: 'Pune — Shivajinagar', detail: '05:30 AM · main ST stand, Gate A' },
      { name: 'Pune — Wakad', detail: '06:00 AM · Mumbai–Pune expressway entry side' },
      { name: 'Pune — Viman Nagar', detail: '06:25 AM · near Phoenix Mall signal' },
    ],
    supplements: [
      { name: 'Single occupancy', price: '+ ₹6,000 for full trip', note: 'Subject to room availability' },
      { name: 'Flight / train to Bagdogra', price: 'At actual + ₹500 handling', note: 'Optional booking assistance' },
    ],
    cancellationPolicy:
      '45+ days before departure: 90% refund (excl. permits already paid).\n30–44 days: 60% refund.\n15–29 days: 40% refund.\nUnder 15 days: non-refundable except force-majeure cases reviewed individually.\nNo-show: full forfeiture.',
    bankDetails:
      'Happy Feet Travellers\nCurrent A/c: 40123456789 · ICICI Bank, Baner, Pune\nIFSC: ICIC0001234\nUPI: happyfeet@icici\n\nPlease mention: Tour name + departure date + lead traveller name in payment remarks.',
  },
  {
    title: 'Goa Beach Group Escape',
    departureCity: 'Pune',
    category: 'upcoming',
    subCategory: 'beaches',
    destination: 'Goa',
    tags: ['Best for Couples', 'Scenic'],
    groupSize: 'Comfortable group size',
    status: 'active',
    featured: false,
    seriesSlug: 'goa-beach-escape',
    price: 18999,
    startingPrice: 18999,
    coverImage: IMG.goa,
    images: [IMG.goa, IMG.goaSunset, IMG.forest],
    duration: 5,
    durationLabel: '4N5D',
    urgency: 'Booking fast',
    bookingDeposit: 5000,
    rating: 4.7,
    reviewsCount: 180,
    description:
      'A laid-back Goa break with handpicked stays, North & South Goa coverage and a sunset cruise — pickup right from Pune.',
    highlights: ['North Goa beach hopping', 'Mandovi sunset cruise', 'South Goa quiet beaches'],
    dateLabel: '10 Jun - 14 Jun 2026',
    startDate: new Date('2026-06-10'),
    endDate: new Date('2026-06-14'),
    itinerary: [
      { day: 'Day 1', title: 'Arrival in Goa', details: 'Hotel check-in and an evening beach stroll at Baga.' },
      { day: 'Day 2', title: 'North Goa', details: 'Calangute, Baga, Anjuna and the Saturday night market.' },
      { day: 'Day 3', title: 'South Goa', details: 'Palolem and Colva beaches, plus a Mandovi river cruise.' },
      { day: 'Day 4', title: 'Adventure & leisure', details: 'Optional water sports at Baga and free time.' },
      { day: 'Day 5', title: 'Departure', details: 'Checkout and group transfer for onward travel.' },
    ],
    inclusions: ['4 nights stay near Calangute', 'Daily breakfast', 'All local transfers in private vehicle'],
    exclusions: ['Flights/trains', 'Lunches & dinners', 'Watersports & entry fees'],
    faqs: [
      { question: 'Are watersports included?', answer: 'No — watersports are optional and charged at the operator on the day.' },
    ],
    thingsToCarry: ['Beachwear', 'SPF 50 sunscreen', 'Sunglasses & hat'],
    terms: [
      'Itinerary may be adjusted based on weather and sea conditions.',
      'Group movement timings must be followed.',
    ],
    offers: 'Monsoon special · couples discount on twin sharing',
    meals: 'Daily breakfast only (lunch & dinner on own / add-on)',
    stayType: 'Boutique stays near North Goa beaches · AC rooms',
    transport: 'AC private coach from Pune · local transfers in Goa',
    suitableFor: 'Weekend escape · friends & couples',
    pickupPoints: [
      { name: 'Pune — FC Road', detail: '06:00 PM · near Vaishali' },
      { name: 'Pune — Katraj', detail: '06:30 PM · old NH4 pickup point' },
    ],
    supplements: [
      { name: 'Mandovi sunset cruise', price: '₹550 per person', note: 'Pre-book with trip captain' },
      { name: 'Extra night in Goa', price: 'From ₹2,800 / room', note: 'Tell us before departure week' },
    ],
    cancellationPolicy:
      '30+ days: 75% refund.\n15–29 days: 50% refund.\n7–14 days: 25% refund.\nUnder 7 days: no refund.\nTransfers to another batch subject to seat availability + ₹500 fee.',
    bankDetails:
      'Happy Feet Travellers\nA/c: 40123456789 · ICICI Bank\nIFSC: ICIC0001234\nUPI: happyfeet@icici',
  },
  {
    title: 'Spiti Valley Group Expedition',
    slug: 'spiti-valley-group-expedition-jun-2026',
    departureCity: 'Pune',
    category: 'upcoming',
    subCategory: 'mountains',
    destination: 'Spiti Valley',
    tags: ['Adventure', 'High altitude'],
    groupSize: '14–16 travellers',
    status: 'active',
    featured: true,
    price: 32999,
    startingPrice: 32999,
    coverImage: IMG.spiti,
    images: [IMG.spiti, IMG.snowMtn, IMG.himalayas],
    duration: 8,
    durationLabel: '7N8D',
    urgency: '6 seats left',
    bookingDeposit: 5000,
    rating: 4.9,
    reviewsCount: 96,
    description:
      'A high-altitude Spiti circuit from Shimla — Key Monastery, Chandratal, fossil villages and a trip captain who knows every permit checkpoint.',
    highlights: ['Key Monastery', 'Chandratal Lake', 'Kaza market & cafés', 'Pin Valley'],
    dateLabel: '20 Jun - 27 Jun 2026',
    startDate: new Date('2026-06-20'),
    endDate: new Date('2026-06-27'),
    itinerary: [
      { day: 'Day 1', title: 'Pune to Shimla', details: 'Overnight Volvo to Shimla with dinner stop en route.' },
      { day: 'Day 2', title: 'Shimla to Sangla', details: 'Scenic drive into Kinnaur, check-in and riverside walk.' },
      { day: 'Day 3', title: 'Sangla to Tabo', details: 'Cross into Spiti valley, monastery visit at Tabo.' },
      { day: 'Day 4', title: 'Tabo to Kaza', details: 'Dhankar monastery stop, evening at Kaza.' },
      { day: 'Day 5', title: 'Key & Kibber', details: 'Key Monastery, Kibber village and optional hike.' },
      { day: 'Day 6', title: 'Chandratal', details: 'Drive to Chandratal campsite — stargazing night.' },
      { day: 'Day 7', title: 'Return leg', details: 'Begin descent towards Manali route (weather permitting).' },
      { day: 'Day 8', title: 'Arrive Pune', details: 'Morning drop-off in Pune.' },
    ],
    inclusions: ['7 nights stay (homestay / basic hotels)', 'Breakfast & dinner', 'Tempo traveller on route', 'Trip captain'],
    exclusions: ['Flights', 'Lunches', 'Personal permits if applicable', 'Travel insurance'],
    faqs: [
      { question: 'Is acclimatisation included?', answer: 'Yes — we build in slower ascent days and monitor everyone for altitude symptoms.' },
    ],
    thingsToCarry: ['Warm layers', 'Sunglasses', 'ID originals', 'Personal meds'],
    terms: ['Itinerary may change due to landslides or road closure — safety first.'],
    offers: 'Early bird · ₹5,000 advance to block seat',
    meals: 'Breakfast & dinner on travel days',
    stayType: 'Homestays & basic hotels in Spiti',
    transport: 'Tempo traveller · experienced hill driver',
    suitableFor: 'Fit adults · no serious altitude issues',
    pickupPoints: [{ name: 'Pune — Shivajinagar', detail: '05:00 PM departure' }],
    supplements: [{ name: 'Single room', price: '+ ₹8,000', note: 'Limited availability' }],
    cancellationPolicy: '45+ days: 80% refund · Under 15 days: non-refundable',
    bankDetails: 'Happy Feet Travellers · ICICI 40123456789 · IFSC ICIC0001234',
  },
  {
    title: 'Kerala Backwater Retreat',
    slug: 'kerala-backwater-retreat',
    departureCity: 'India',
    category: 'customized',
    subCategory: 'family',
    state: 'Kerala',
    destination: 'Munnar, Alleppey & Kochi',
    packageCategory: 'Family',
    status: 'active',
    featured: true,
    tags: ['Backwaters', 'Houseboat', 'Tea estates'],
    price: 22000,
    startingPrice: 22000,
    coverImage: IMG.kerala,
    images: [IMG.kerala],
    seoTitle: 'Kerala Backwater Retreat — Private Customized Trip',
    seoDescription:
      'A private Kerala journey for couples and families — Munnar tea estates, Alleppey houseboat nights, and Fort Kochi.',
    ctaData: {
      primaryLabel: 'Plan my Kerala trip',
      primaryHref: '/contact',
      headline: 'Your dates, your pace',
    },
    duration: 5,
    durationLabel: '4N5D',
    urgency: 'Popular pick',
    rating: 4.9,
    reviewsCount: 140,
    description:
      'A private Kerala journey for couples and families — Munnar tea estates, an Alleppey houseboat night and a slow finish at Kochi.',
    highlights: ['Houseboat night in Alleppey', 'Munnar tea plantations', 'Fort Kochi heritage walk'],
    dateLabel: 'Custom dates',
    startDate: new Date('2026-07-01'),
    endDate: new Date('2026-07-05'),
    itinerary: [
      { day: 'Day 1', title: 'Arrival & relax', details: 'Kochi airport pickup, transfer to Munnar, hotel check-in.' },
      { day: 'Day 2', title: 'Munnar sightseeing', details: 'Tea plantation walk, Eravikulam park and viewpoint stops.' },
      { day: 'Day 3', title: 'Transfer to Alleppey', details: 'Scenic drive to backwaters, board the private houseboat.' },
      { day: 'Day 4', title: 'Backwaters & Kochi', details: 'Slow morning on the houseboat, drive to Kochi, evening at Fort Kochi.' },
      { day: 'Day 5', title: 'Departure', details: 'Free morning, transfer to airport.' },
    ],
    inclusions: ['Hotels & 1 night houseboat', 'Daily breakfast', 'Private vehicle transfers'],
    exclusions: ['Flights to/from Kochi', 'Lunches & dinners (most days)'],
    faqs: [
      { question: 'Can this be customised?', answer: 'Yes — dates, hotels and pace can all be adjusted to your preference.' },
    ],
    thingsToCarry: ['Light cottons', 'Comfortable footwear', 'Mosquito repellent for backwaters'],
    terms: ['Final pricing depends on hotel category and travel season.'],
    offers: 'Custom dates · price varies by hotels & season',
    meals: 'Breakfast included · other meals as per chosen plan',
    stayType: 'Heritage / boutique / 4-star — you pick the tier',
    transport: 'Private AC car with driver throughout',
    suitableFor: 'Couples, families & small private groups',
    pickupPoints: [
      { name: 'Kochi airport / Ernakulam station', detail: 'As per your arrival time' },
      { name: 'Pune departure (if road package)', detail: 'On request for select routes' },
    ],
    supplements: [
      { name: 'Houseboat upgrade (premium)', price: 'From ₹4,500 / night', note: 'Subject to availability' },
      { name: 'Ayurveda session', price: 'From ₹1,800 / person', note: 'Partner spa in Kochi' },
    ],
    cancellationPolicy:
      'Customized tours: cancellation terms shared on final quotation. Typically 25% advance is non-refundable once hotels are blocked; balance refund depends on supplier policies.',
    bankDetails:
      'Happy Feet Travellers\nA/c: 40123456789 · ICICI Bank\nIFSC: ICIC0001234\nUPI: happyfeet@icici\n(Use only after you receive a formal quotation from us.)',
  },
  {
    title: 'Ladakh Honeymoon Escape',
    slug: 'ladakh-honeymoon-escape',
    departureCity: 'India',
    category: 'customized',
    subCategory: 'mountains',
    state: 'Ladakh',
    destination: 'Leh, Nubra & Pangong',
    packageCategory: 'Honeymoon',
    status: 'active',
    featured: true,
    tags: ['Romantic', 'High altitude', 'Private'],
    price: 45000,
    startingPrice: 45000,
    coverImage: IMG.ladakh,
    images: [IMG.ladakh, IMG.snowMtn, IMG.himalayas],
    duration: 6,
    durationLabel: '5N6D',
    rating: 4.9,
    reviewsCount: 88,
    description:
      'A slow, romantic Ladakh for two — boutique stays, private SUV, candle-lit dinners in Nubra and a sunrise at Pangong without the rush of a big group.',
    highlights: ['Pangong sunrise', 'Nubra sand dunes', 'Leh old town cafés', 'Private transfers'],
    dateLabel: 'Your dates',
    itinerary: [
      { day: 'Day 1', title: 'Arrive Leh', details: 'Airport pickup, rest day for acclimatisation, evening stroll on Shanti Stupa road.' },
      { day: 'Day 2', title: 'Leh heritage', details: 'Leh Palace, local market and a quiet café afternoon.' },
      { day: 'Day 3', title: 'Nubra Valley', details: 'Khardung La crossing, check-in, camel ride at Hunder dunes.' },
      { day: 'Day 4', title: 'Nubra to Pangong', details: 'Scenic drive, lakeside stay, stargazing.' },
      { day: 'Day 5', title: 'Pangong to Leh', details: 'Sunrise at the lake, return to Leh with photo stops.' },
      { day: 'Day 6', title: 'Departure', details: 'Airport drop as per flight.' },
    ],
    inclusions: ['Handpicked hotels', 'Private SUV with driver', 'Daily breakfast'],
    exclusions: ['Flights to Leh', 'Lunches & dinners', 'Monument fees'],
    faqs: [{ question: 'Can we add a photographer?', answer: 'Yes — we can arrange a half-day shoot at Pangong on request.' }],
    thingsToCarry: ['Warm layers', 'Sunscreen', 'Comfortable shoes'],
    terms: ['Final quote depends on hotel tier and season.'],
    offers: 'Honeymoon add-ons: cake, room décor on request',
    meals: 'Breakfast included',
    stayType: 'Boutique / 4-star — your choice',
    transport: 'Private Innova / Xylo with driver',
    suitableFor: 'Couples · newly-weds',
    pickupPoints: [{ name: 'Leh airport', detail: 'Meet & greet on arrival' }],
    supplements: [{ name: 'Premium lakeside camp', price: 'From ₹6,500 / night', note: 'Subject to availability' }],
    cancellationPolicy: 'Custom quote terms apply once hotels are blocked.',
    bankDetails: 'Happy Feet Travellers · ICICI 40123456789',
  },
  {
    title: 'Meghalaya Living Root Bridges',
    slug: 'meghalaya-living-root-bridges',
    departureCity: 'India',
    category: 'customized',
    subCategory: 'adventure',
    state: 'Meghalaya',
    destination: 'Shillong, Cherrapunji & Dawki',
    packageCategory: 'Adventure',
    status: 'active',
    featured: false,
    tags: ['Trekking', 'Waterfalls', 'Offbeat'],
    price: 28000,
    startingPrice: 28000,
    coverImage: IMG.meghalaya,
    images: [IMG.meghalaya, IMG.forest, IMG.himalayas],
    duration: 5,
    durationLabel: '4N5D',
    rating: 4.8,
    reviewsCount: 62,
    description:
      'Misty Khasi hills, double-decker root bridge trek, crystal-clear Dawki river and homestay nights — paced for curious travellers who like a little walk.',
    highlights: ['Double-decker root bridge', 'Nohkalikai Falls', 'Dawki river boating', 'Shillong cafés'],
    dateLabel: 'Flexible departures',
    itinerary: [
      { day: 'Day 1', title: 'Guwahati to Shillong', details: 'Pickup, Umiam Lake stop, evening in Shillong.' },
      { day: 'Day 2', title: 'Cherrapunji', details: 'Waterfalls circuit and Mawsmai caves.' },
      { day: 'Day 3', title: 'Root bridge trek', details: 'Guided trek to living root bridges — moderate fitness.' },
      { day: 'Day 4', title: 'Dawki & Mawlynnong', details: 'Boating on Umngot, cleanest village walk.' },
      { day: 'Day 5', title: 'Departure', details: 'Return to Guwahati airport.' },
    ],
    inclusions: ['Homestays & hotels', 'Breakfast', 'Private vehicle', 'Local guide on trek day'],
    exclusions: ['Flights', 'Lunches', 'Boating fees'],
    faqs: [{ question: 'How tough is the root bridge trek?', answer: 'Moderate — lots of steps. We can shorten the route for slower walkers.' }],
    thingsToCarry: ['Rain jacket', 'Trek shoes with grip', 'Dry bag'],
    terms: ['Monsoon months may adjust trek routes for safety.'],
    offers: 'Monsoon green season pricing available',
    meals: 'Breakfast daily',
    stayType: 'Homestays + 3-star in Shillong',
    transport: 'Private SUV from Guwahati',
    suitableFor: 'Friends · small groups · active couples',
    pickupPoints: [{ name: 'Guwahati airport', detail: 'Morning pickup preferred' }],
    supplements: [{ name: 'Extra night in Shillong', price: 'From ₹3,200', note: 'Tell us when quoting' }],
    cancellationPolicy: 'Standard customized trip terms on final quote.',
    bankDetails: 'Happy Feet Travellers · ICICI 40123456789',
  },
  {
    title: 'Rajasthan Palace & Desert Nights',
    slug: 'rajasthan-palace-desert-nights',
    departureCity: 'India',
    category: 'customized',
    subCategory: 'heritage',
    state: 'Rajasthan',
    destination: 'Jaipur, Jodhpur & Jaisalmer',
    packageCategory: 'Spiritual',
    status: 'active',
    featured: false,
    tags: ['Heritage', 'Desert camp', 'Forts'],
    price: 32000,
    startingPrice: 32000,
    coverImage: IMG.rajasthan,
    images: [IMG.rajasthan, IMG.forest],
    duration: 6,
    durationLabel: '5N6D',
    rating: 4.7,
    reviewsCount: 110,
    description:
      'Pink City mornings, blue-city lanes, and a camel sunset in the Thar — heritage hotels and slow temple evenings for travellers who love stories in stone.',
    highlights: ['Amber Fort', 'Mehrangarh Fort', 'Jaisalmer sand dunes', 'Haveli stays'],
    dateLabel: 'Pick your month',
    itinerary: [
      { day: 'Day 1', title: 'Jaipur arrival', details: 'City Palace area check-in, evening bazaar walk.' },
      { day: 'Day 2', title: 'Jaipur forts', details: 'Amber Fort, Hawa Mahal photo stops, local lunch.' },
      { day: 'Day 3', title: 'Jodhpur', details: 'Drive to Jodhpur, Mehrangarh Fort, blue city lanes.' },
      { day: 'Day 4', title: 'Jaisalmer', details: 'Golden fort walk, sunset at dunes, desert camp night.' },
      { day: 'Day 5', title: 'Leisure & crafts', details: 'Optional pottery / textile visit, slow morning.' },
      { day: 'Day 6', title: 'Departure', details: 'Transfer to Jaisalmer or Jodhpur airport.' },
    ],
    inclusions: ['Heritage / haveli hotels', 'Breakfast', 'AC car with driver'],
    exclusions: ['Flights / trains', 'Monument tickets', 'Camel ride fees'],
    faqs: [{ question: 'Is this good for families?', answer: 'Yes — we soften driving days and pick family-friendly hotels.' }],
    thingsToCarry: ['Cottons', 'Scarf for temples', 'Comfortable sandals'],
    terms: ['Festival season surcharges apply (Diwali, New Year).'],
    offers: 'Winter desert camp upgrade available',
    meals: 'Breakfast · dinner on desert camp night',
    stayType: 'Heritage havelis & desert camp',
    transport: 'Private AC sedan / SUV',
    suitableFor: 'Couples · families · culture lovers',
    pickupPoints: [{ name: 'Jaipur airport / station', detail: 'Any time' }],
    supplements: [{ name: 'Luxury tented camp', price: 'From ₹5,500 / night', note: 'Peak season' }],
    cancellationPolicy: 'As per customized quotation.',
    bankDetails: 'Happy Feet Travellers · ICICI 40123456789',
  },
];

const blogs = [
  {
    title: '7 Group Trips from Pune That Actually Stay on Budget',
    category: 'Travel guide',
    coverImage: IMG.himalayas,
    publishedAt: new Date('2026-05-05'),
    authorName: 'Happy Feet Team',
    authorImage:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    authorInstagram: 'happyfeettravellers',
    excerpt:
      'From Spiti to Goa — short, honest notes on which group trips give you the best value when you’re leaving from Pune.',
    content: [
      'If you are booking a group tour from Pune, the sticker price is only half the story. What matters is what is included — transfers, meals, hotel category — and whether the operator is transparent when something changes.',
      'In this guide we compare seven popular routes we run as fixed departures: what you typically pay, what is worth upgrading, and where you can save without ruining the experience.',
      'Rule of thumb: if a brochure is vague about hotels, ask for names before you pay. We publish stay names after confirmation for every batch so you know exactly what you are getting.',
    ],
  },
  {
    title: 'Packing Smart for the Indian Mountains',
    category: 'Tips',
    coverImage: IMG.blogPacking,
    publishedAt: new Date('2026-04-28'),
    authorName: 'Trip Captain',
    authorImage:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    authorInstagram: null,
    excerpt:
      'What to actually pack for Sikkim, Spiti and Himachal — without overstuffing your duffel or freezing at 3,500m.',
    content: [
      'Layers beat one thick jacket. You will peel off by noon and need warmth again after sunset — especially in Sikkim and Himachal.',
      'Carry a dry bag for electronics during monsoon drives, and keep photocopies of ID separate from originals for permit checkpoints.',
      'Footwear: broken-in shoes with grip for wet stone steps. Pack light — porters are not part of our group departures and you will handle your own bag at some homestays.',
    ],
  },
  {
    title: 'When Should You Visit the Northeast?',
    category: 'Destination',
    coverImage: IMG.blogNotes,
    publishedAt: new Date('2026-04-18'),
    authorName: 'Happy Feet Team',
    authorImage:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    authorInstagram: 'happyfeettravellers',
    excerpt:
      'A month-by-month look at Sikkim, Meghalaya and Arunachal — when the trails are open and when to skip the rains.',
    content: [
      'Spring (March–May) brings rhododendrons and clearer views in Sikkim; expect cold mornings at altitude.',
      'Monsoon (June–September) is lush but landslide-prone on hill roads — we sometimes reroute or postpone batches for safety.',
      'Autumn and early winter are crowd favourites for Meghalaya living root bridges and clear skies — book departures at least six weeks ahead.',
    ],
  },
];

const testimonials = [
  {
    name: 'Aditi Joshi',
    city: 'Kothrud, Pune',
    rating: 5,
    review:
      'Booked the Sikkim group with friends. Pune pickup was on time, the captain was patient, and pricing matched the brochure exactly.',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Sameer Deshpande',
    city: 'Baner, Pune',
    rating: 5,
    review:
      'Family Goa trip was sorted end-to-end. No upselling on-trip and the WhatsApp support was genuinely quick.',
    image:
      'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=400&q=80',
  },
];

const galleryImages = [
  {
    title: "Kerala backwaters",
    altText: "Houseboat in the Kerala backwaters",
    category: "Kerala",
    image: IMG.kerala,
  },
  {
    title: "Himalayan lake",
    altText: "High-altitude lake in the Himalayas",
    category: "Himalayas",
    image: IMG.himalayas,
  },
  {
    title: "Goa shoreline",
    altText: "Quiet Goa shoreline at sunset",
    category: "Goa",
    image: IMG.goaSunset,
  },
  {
    title: "Sikkim monasteries",
    altText: "Monasteries and prayer flags in Sikkim",
    category: "Sikkim",
    image: IMG.sikkim,
  },
];

const siteSettings = {
  whatsappNumber: "+91 9876543210",
  email: "info@happyfeet.com",
  instagramUrl: "https://instagram.com/happyfeettravellers",
  facebookUrl: "https://facebook.com/happyfeettravellers",
  youtubeUrl: "https://youtube.com/@happyfeettravellers",
  officeAddress: "Pune, Maharashtra, India",
  paymentLink: "https://www.fundayoption.com/pay-online/",
  footerTagline: "Affordable group tours · Trusted local experts",
  footerDetails:
    "Pune-based small-group travel. Fixed departures and customised trips across India — run by people who've actually been there.",
  termsContent: DEFAULT_TERMS_HTML,
  privacyContent: DEFAULT_PRIVACY_HTML,
  cancellationPolicyContent: DEFAULT_CANCELLATION_HTML,
  policiesLastUpdated: DEFAULT_POLICIES_LAST_UPDATED,
  heroCommunityQuote:
    'Trusted by travelers who value comfort, transparency, and meaningful journeys.',
  heroCommunityBannerUrl: null,
  heroCommunityAvatars: JSON.stringify(DEFAULT_HERO_COMMUNITY_AVATARS),
  seasonPromoActive: true,
  seasonPromoBadge: 'Season 2026–27',
  seasonPromoEyebrow: 'Group departures & customized tours',
  seasonPromoTitle: 'Rann of Kutch Season 2026–2027',
  seasonPromoSubtitle: '5 November 2026 – 4 March 2027',
  seasonPromoDescription:
    'White Desert nights, curated group batches, and private journeys for families and friends — plan early for the best inventory and pricing.',
  seasonPromoImageUrl:
    'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=1400&h=700&fit=crop',
  seasonPromoTags: JSON.stringify([
    '10 group batches',
    'FIT & family packages',
    'Early-bird priority',
  ]),
  seasonPromoPrimaryCtaLabel: 'Explore season page',
  seasonPromoPrimaryCtaHref: '/rann-of-kutch-season-2026-27',
  seasonPromoSecondaryCtaLabel: 'Get priority access',
  seasonPromoSecondaryCtaHref: '/rann-of-kutch-season-2026-27#priority-interest',
};

const heroSlides = [
  {
    imageUrl: '/hero/tropical-paradise.jpg',
    altText: 'Crystal-clear turquoise beach and palm-lined coast',
    tag: 'Beach escapes',
    emoji: '🏖️',
    sortOrder: 0,
  },
  {
    imageUrl: '/hero/mountain-golden.jpg',
    altText: 'Dramatic mountain peaks above a sea of clouds at sunrise',
    tag: 'Hill stations',
    emoji: '⛰️',
    sortOrder: 1,
  },
  {
    imageUrl: '/hero/desert-road-trip.jpg',
    altText: 'Open highway through bold desert and canyon landscapes',
    tag: 'Road trips',
    emoji: '🛣️',
    sortOrder: 2,
  },
  {
    imageUrl: '/hero/backpacker-sunset.jpg',
    altText: 'Solo traveller admiring a lake and mountain horizon',
    tag: 'Adventure tours',
    emoji: '🥾',
    sortOrder: 3,
  },
  {
    imageUrl: '/hero/resort-pool.jpg',
    altText: 'Infinity pool overlooking a vibrant tropical coastline',
    tag: 'Luxury getaways',
    emoji: '✨',
    sortOrder: 4,
  },
  {
    imageUrl: '/hero/starry-peaks.jpg',
    altText: 'Starry night sky over snow-capped mountain silhouettes',
    tag: 'Himalayan nights',
    emoji: '🌌',
    sortOrder: 5,
  },
  {
    imageUrl: '/hero/travel-passport.jpg',
    altText: 'Passport, map and camera ready for the next journey',
    tag: 'Plan your trip',
    emoji: '🧳',
    sortOrder: 6,
  },
];

const teamMembers = [
  {
    fullName: 'Aniket Patil',
    role: 'Founder · Trip planning',
    bio: 'Designs fixed departures and custom routes from Pune — obsessed with honest pricing and small-group pacing.',
    instagramUrl: 'https://instagram.com/',
    linkedinUrl: 'https://linkedin.com/',
    imageUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    sortOrder: 0,
  },
  {
    fullName: 'Sneha Kelkar',
    role: 'Operations · Stays & transfers',
    bio: 'Coordinates hotels, drivers and on-ground vendors so every batch runs smoothly from pickup to drop-off.',
    instagramUrl: 'https://instagram.com/',
    linkedinUrl: 'https://linkedin.com/',
    imageUrl:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80',
    sortOrder: 1,
  },
  {
    fullName: 'Vivek Joshi',
    role: 'Trip captain · Northeast & Spiti',
    bio: 'Leads high-altitude batches with a calm, safety-first style — the person you message when plans change on the road.',
    instagramUrl: 'https://instagram.com/',
    linkedinUrl: 'https://linkedin.com/',
    imageUrl:
      'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=400&q=80',
    sortOrder: 2,
  },
];

async function main() {
  console.log('🌱 Seeding database...');

  await prisma.siteSettings.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.heroSlide.deleteMany();
  await prisma.galleryImage.deleteMany();
  await prisma.subscriber.deleteMany();
  await prisma.enquiry.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.blog.deleteMany();
  await prisma.tour.deleteMany();
  await prisma.admin.deleteMany();

  for (const t of tours) {
    await prisma.tour.create({ data: { ...t, slug: t.slug || slugify(t.title) } });
  }
  console.log(`  ✓ Tours seeded (${tours.length})`);

  for (const b of blogs) {
    await prisma.blog.create({ data: { ...b, slug: slugify(b.title) } });
  }
  console.log(`  ✓ Blogs seeded (${blogs.length})`);

  for (const tm of testimonials) {
    await prisma.testimonial.create({ data: tm });
  }
  console.log(`  ✓ Testimonials seeded (${testimonials.length})`);

  for (const image of galleryImages) {
    await prisma.galleryImage.create({ data: image });
  }
  console.log(`  ✓ Gallery images seeded (${galleryImages.length})`);

  for (const slide of heroSlides) {
    await prisma.heroSlide.create({ data: slide });
  }
  console.log(`  ✓ Hero slides seeded (${heroSlides.length})`);

  for (const member of teamMembers) {
    await prisma.teamMember.create({ data: member });
  }
  console.log(`  ✓ Team members seeded (${teamMembers.length})`);

  await prisma.siteSettings.create({ data: siteSettings });
  console.log('  ✓ Site settings seeded');

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@happyfeet.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.admin.create({
    data: { email: adminEmail, password: passwordHash },
  });
  console.log(`  ✓ Admin seeded (${adminEmail})`);

  console.log('✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
