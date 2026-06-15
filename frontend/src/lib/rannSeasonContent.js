import { RANN_SEASON_DATES, RANN_SEASON_PATH, RANN_SEASON_TITLE } from '@/lib/rannSeason';

export { RANN_SEASON_PATH, RANN_SEASON_TITLE, RANN_SEASON_DATES };

export const RANN_SLUG = 'rann-of-kutch-season-2026-27';

export const RANN_HERO_HEADING = "India's Most Magical Desert Festival Returns";

export const RANN_HERO_SUBHEADING =
  'Premium group departures from Pune & Mumbai | White Rann • Dholavira • Kutchi Culture • Full Moon Nights';

export const RANN_HERO_SOCIAL_PROOF = [
  '5+ years of group tours',
  '8,000+ happy travellers',
  'Trusted departures from Pune & Mumbai',
];

export const RANN_HERO_PRICING = 'Packages from ₹18,999 to ₹31,999';

export const RANN_PRIORITY_MONTH_OPTIONS = [
  'November 2026',
  'December 2026',
  'January 2027',
  'February 2027',
  'March 2027',
  'Flexible',
];

export const RANN_WA_GROUP_MESSAGE =
  'Hi, I would like to join the Happy Feet Travellers Rann of Kutch Season 2026–27 WhatsApp Priority Group.';

export const RANN_WA_PRIORITY_MESSAGE =
  'Hi, I submitted the Rann of Kutch Season 2026–27 priority form. Please share batch availability and early-bird pricing.';

const IMG = {
  hero: 'https://images.unsplash.com/photo-1516939884455-1445c8652f83?w=2400&h=1400&fit=crop',
  whiteDesert: 'https://images.unsplash.com/photo-1516939884455-1445c8652f83?w=1200&h=900&fit=crop',
  fullMoon: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=900&fit=crop',
  dholavira: 'https://images.unsplash.com/photo-1524499982521-1ffd58dd89ea?w=1200&h=900&fit=crop',
  mandvi: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=900&fit=crop',
  bhunga: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&h=900&fit=crop',
  road: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&h=900&fit=crop',
  culture: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&h=900&fit=crop',
  group: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200&h=900&fit=crop',
  ahmedabad: 'https://images.unsplash.com/photo-1564507004663-b6dfb3c824d5?w=1200&h=900&fit=crop',
  bhuj: 'https://images.unsplash.com/photo-1625505826533-5c80aca7d157?w=1200&h=900&fit=crop',
  tent: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&h=900&fit=crop',
  family: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1200&h=900&fit=crop',
  train: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&w=1200&q=80',
};

export const RANN_PLANNING_GUIDE = {
  enabled: true,
  eyebrow: 'Free download',
  title: 'Free Rann Utsav Planning Guide 2026–27',
  lede:
    'A practical PDF for travellers comparing Rann Utsav Packages from Mumbai and Pune — batch dates, White Desert tour tips, Dholavira add-ons, and full moon planning.',
  highlights: [
    'Month-by-month batch calendar & full moon windows',
    'Mumbai/Pune train booking checklist for group departures',
    'White Desert tour & Kutch tour package comparison',
    'Dholavira tour add-on ideas and packing essentials',
  ],
  pdfUrl: '/guides/rann-utsav-planning-guide-2026-27.pdf',
  pdfFileName: 'Happy-Feet-Rann-Utsav-Planning-Guide-2026-27.pdf',
  formTitle: 'Get your free planning guide',
  formLede:
    "Enter your details below. We'll send batch tips on WhatsApp and unlock your PDF instantly.",
  submitLabel: 'Download Free Guide',
  successTitle: 'Your guide is ready',
  successLede:
    'Your download should start automatically. Our team may also reach out on WhatsApp with batch updates.',
  downloadAgainLabel: 'Download PDF again',
  disclaimer: 'By downloading, you agree to receive Rann season updates on WhatsApp. Unsubscribe anytime.',
};

/** CMS planning guide with static fallbacks. */
export function resolvePlanningGuide(page) {
  const fromBlocks =
    page?.customBlocks?.planningGuide && typeof page.customBlocks.planningGuide === 'object'
      ? page.customBlocks.planningGuide
      : page?.planningGuide && typeof page.planningGuide === 'object'
        ? page.planningGuide
        : null;

  if (!fromBlocks) return { ...RANN_PLANNING_GUIDE };
  if (fromBlocks.enabled === false) return { ...RANN_PLANNING_GUIDE, enabled: false };

  return {
    enabled: true,
    eyebrow: fromBlocks.eyebrow?.trim() || RANN_PLANNING_GUIDE.eyebrow,
    title: fromBlocks.title?.trim() || RANN_PLANNING_GUIDE.title,
    lede: fromBlocks.lede?.trim() || RANN_PLANNING_GUIDE.lede,
    highlights:
      Array.isArray(fromBlocks.highlights) && fromBlocks.highlights.length
        ? fromBlocks.highlights.filter(Boolean)
        : RANN_PLANNING_GUIDE.highlights,
    pdfUrl: String(fromBlocks.pdfUrl || '').trim() || RANN_PLANNING_GUIDE.pdfUrl,
    pdfFileName: String(fromBlocks.pdfFileName || '').trim() || RANN_PLANNING_GUIDE.pdfFileName,
    formTitle: fromBlocks.formTitle?.trim() || RANN_PLANNING_GUIDE.formTitle,
    formLede: fromBlocks.formLede?.trim() || RANN_PLANNING_GUIDE.formLede,
    submitLabel: fromBlocks.submitLabel?.trim() || RANN_PLANNING_GUIDE.submitLabel,
    successTitle: fromBlocks.successTitle?.trim() || RANN_PLANNING_GUIDE.successTitle,
    successLede: fromBlocks.successLede?.trim() || RANN_PLANNING_GUIDE.successLede,
    downloadAgainLabel: fromBlocks.downloadAgainLabel?.trim() || RANN_PLANNING_GUIDE.downloadAgainLabel,
    disclaimer: fromBlocks.disclaimer?.trim() || RANN_PLANNING_GUIDE.disclaimer,
  };
}

export const RANN_UTSAV_INTRO = {
  title: 'Introduction to Rann Utsav',
  paragraphs: [
    "Rann Utsav is Gujarat's signature winter celebration — a White Desert tour experience with folk music, handicraft villages, and thoughtfully paced travel across Kutch.",
    'Happy Feet Travellers designs each Kutch tour package around comfort-first movement, honest pricing, and practical expertise so you experience the desert without planning stress.',
  ],
  summary: [
    'White Rann under moonlit skies',
    'Dholavira UNESCO heritage & Mandvi coast',
    'Bhungas, tent city & Road to Heaven routes',
    '10 fixed group batches + private family journeys',
  ],
};

export const RANN_WHY_VISIT_HEADING =
  'Experience the Magic of the Kutchi Culture — Exclusive Village Experience';

export const WHY_VISIT_RANN = [
  {
    title: 'White Desert Tour',
    description:
      'Endless salt flats that glow at sunrise — the signature White Desert tour highlight under festival lights and full moon nights.',
    image: IMG.whiteDesert,
  },
  {
    title: 'Dholavira Tour',
    description:
      'UNESCO World Heritage Harappan site — the essential Dholavira tour layer on any well-planned Kutch itinerary.',
    image: IMG.dholavira,
  },
  {
    title: 'Mandvi Beach',
    description: 'Coastal calm, palace views, and gentle Arabian Sea breezes after the inland desert circuit.',
    image: IMG.mandvi,
  },
  {
    title: 'Bhungas',
    description: 'Traditional Kutchi circular homes — iconic architecture, craft villages, and living cultural heritage.',
    image: IMG.bhunga,
  },
  {
    title: 'Road to Heaven',
    description: "The elevated corridor through the Rann — one of India's most photographed desert drives.",
    image: IMG.road,
  },
];

export const WHY_EARLY_PLANNING = {
  title: 'Why Early Planning Matters',
  points: [
    {
      title: 'Train inventory limitations',
      description:
        'Sleeper and 3AC berths on Mumbai/Pune–Bhuj routes sell out 60–90 days before peak Rann dates. Early tokens secure practical routing.',
      icon: '🚂',
    },
    {
      title: 'Peak season demand',
      description:
        'December–January full moon and holiday weeks see the highest demand. Priority access puts you ahead of open-market booking windows.',
      icon: '📅',
    },
    {
      title: 'Limited Bhunga inventory',
      description:
        'Authentic Bhunga stays and heritage homestays have finite rooms. Families and groups should block dates before inventory closes.',
      icon: '🏡',
    },
    {
      title: 'Early booking advantages',
      description:
        'Early-bird pricing, buddy discounts, and flexible payment milestones — plus first pick on batch dates and optional upgrades.',
      icon: '✨',
    },
  ],
};

export const RANN_GROUP_BATCHES = [
  {
    batch: 1,
    dates: '21 – 25 Nov 2026',
    departureName: 'Season Opener Full Moon Special Desert Escape',
    price: '₹21,499',
    highlight: 'Season opener full moon — White Rann under moonlit skies',
    category: 'special',
    tags: ['Full moon', 'Season opener'],
    specialTypes: ['full-moon'],
  },
  {
    batch: 2,
    dates: '23 – 27 Dec 2026',
    departureName: 'Christmas & Full Moon Special',
    price: '₹21,499',
    highlight: 'Christmas week + full moon window — festive tent city energy',
    category: 'special',
    tags: ['Christmas', 'Full moon'],
    specialTypes: ['christmas', 'full-moon'],
  },
  {
    batch: 3,
    dates: '1 – 5 Jan 2027',
    departureName: 'New Year Desert Getaway',
    price: '₹21,499',
    highlight: 'Ring in the New Year on the White Rann',
    category: 'special',
    badge: 'NEW YEAR',
    tags: ['New Year', 'High demand'],
  },
  {
    batch: 4,
    dates: '20 – 24 Jan 2027',
    departureName: 'Full Moon Super Night Edition',
    price: '₹21,499',
    highlight: 'Signature full moon supernight — flagship White Rann experience',
    category: 'special',
    tags: ['Full moon', 'Flagship'],
    specialTypes: ['full-moon'],
  },
  {
    batch: 5,
    dates: '20 – 24 Feb 2027',
    departureName: 'Last Full Moon Special',
    price: '₹21,499',
    highlight: 'Final full moon window of the season',
    category: 'special',
    tags: ['Full moon', 'Last chance'],
    specialTypes: ['full-moon'],
  },
  {
    batch: 6,
    dates: '5 – 9 Dec 2026',
    departureName: 'Early Winter Escape',
    price: '₹20,499',
    highlight: 'Pre-peak winter departure — craft villages & desert nights',
    category: 'regular',
    tags: ['Early season'],
  },
  {
    batch: 7,
    dates: '13 – 17 Jan 2027',
    departureName: 'Kite Festival Special',
    price: '₹20,499',
    highlight: 'Uttarayan week — kite festival atmosphere in Kutch',
    category: 'regular',
    tags: ['Kite festival'],
    specialTypes: ['kite-festival'],
  },
  {
    batch: 8,
    dates: '23 – 27 Jan 2027',
    departureName: 'Republic Day Special',
    price: '₹20,499',
    highlight: 'Republic Day long weekend batch — balanced pacing for families',
    category: 'regular',
    tags: ['Family friendly'],
  },
  {
    batch: 9,
    dates: '12 – 16 Feb 2027',
    departureName: "Valentine's on the Desert",
    price: '₹20,499',
    highlight: 'Valentine week — couples & small groups on the White Rann',
    category: 'regular',
    tags: ['Couples'],
    specialTypes: ['valentine'],
  },
  {
    batch: 10,
    dates: '27 Feb – 3 Mar 2027',
    departureName: 'Season Finale Special',
    price: '₹20,499',
    highlight: 'Last official Rann Utsav window of the season',
    category: 'regular',
    tags: ['Final batch'],
  },
];

/** Choice badges — shown on package cards instead of generic category labels. */
export const RANN_PACKAGE_BADGES = {
  'classic-group-departure': { emoji: '🔥', label: 'Most Popular', tone: 'popular' },
  'bhuj-package': { emoji: '💰', label: 'Best Value', tone: 'value' },
  'premium-tent-city': { emoji: '✨', label: 'Premium Experience', tone: 'premium' },
  'customized-family-couple': { emoji: '👨‍👩‍👧', label: 'Best for Families', tone: 'family' },
};

export function resolveRannPackageBadge(pkg) {
  if (!pkg) return null;
  const fromPkg = pkg.audienceBadge || pkg.detailContent?.audienceBadge;
  if (fromPkg?.label) return fromPkg;
  return RANN_PACKAGE_BADGES[pkg.slug] || null;
}

export const RANN_PACKAGES = [
  {
    slug: 'classic-group-departure',
    emoji: '🏜️',
    title: 'Group Departure from Mumbai/Pune',
    duration: '5 Days / 4 Nights',
    startingPrice: '₹24,999',
    image: IMG.group,
    shortDescription:
      'Rann Utsav Packages from Mumbai and Pune — fixed-date group journey with train coordination, curated sightseeing, and White Desert tour highlights.',
    highlights: [
      'Small-group pacing with experienced trip lead',
      'Sleeper train assistance from Mumbai / Pune',
      'White Rann, Bhuj, Mandvi & cultural evenings',
      'Transparent inclusions and optional upgrades',
    ],
    detailParagraphs: [
      'Our flagship group departure is built for travellers who want a ready-made Rann season plan with reliable train routing from Mumbai or Pune.',
      'Join a curated batch with fixed dates, community energy, and comfort-first hotels — ideal for first-time Kutch visitors.',
    ],
    idealFor: 'Solo travellers, friends, and couples who prefer fixed departures',
    category: 'group',
  },
  {
    slug: 'ahmedabad-joining',
    emoji: '🏜️',
    title: 'Ahmedabad Joining Package',
    duration: '4 Days / 3 Nights',
    startingPrice: '₹18,499',
    image: IMG.ahmedabad,
    shortDescription:
      'Join the circuit from Ahmedabad with seamless transfers into Kutch — perfect for flyers and Gujarat residents.',
    highlights: [
      'Ahmedabad pickup & drop coordination',
      'Flexible joining for flight travellers',
      'Core Rann + heritage route coverage',
      'Add Ahmedabad city extension on request',
    ],
    detailParagraphs: [
      'Start from Ahmedabad when flying in or travelling within Gujarat. We handle ground transfers and the Kutch loop so you focus on the experience.',
    ],
    idealFor: 'Fly-in travellers and Ahmedabad-based groups',
    category: 'joining',
  },
  {
    slug: 'bhuj-package',
    emoji: '🏜️',
    title: 'Bhuj Land Package',
    duration: '4 Days / 3 Nights',
    startingPrice: '₹16,999',
    image: IMG.bhuj,
    shortDescription:
      'Flexible Kutch tour package from Bhuj — ideal when you self-book transport and want local experts for your White Desert tour.',
    highlights: [
      'Bhuj-based start and end',
      'White Rann, handicraft villages & Dholavira option',
      'Local stays with comfort-first selection',
      'Efficient for Western India road travellers',
    ],
    detailParagraphs: [
      'Self-arrange your reach to Bhuj; we take over with desert entries, stays, guides, and daily pacing tuned to your batch dates.',
    ],
    idealFor: 'Self-planned transport with local ground support',
    category: 'land',
  },
  {
    slug: 'premium-tent-city',
    emoji: '🏜️',
    title: 'Premium Tent City Package',
    duration: '3 Days / 2 Nights',
    startingPrice: '₹28,999',
    image: IMG.tent,
    shortDescription:
      'Rann Utsav Full Moon Package upgrade — premium tent city nights, curated dining, and priority White Desert tour access.',
    highlights: [
      'Premium tent city accommodation',
      'Priority White Rann session planning',
      'Festival atmosphere with comfort upgrades',
      'Ideal for anniversary & celebration travel',
    ],
    detailParagraphs: [
      'Experience the Rann Utsav tent city at a premium tier — structured for travellers who want the festival highlight with elevated comfort.',
    ],
    idealFor: 'Celebration travel and premium experience seekers',
    category: 'premium',
  },
  {
    slug: 'customized-family-couple',
    emoji: '🏜️',
    title: 'Customized Family Tour',
    duration: 'Flexible',
    startingPrice: 'On request',
    image: IMG.family,
    shortDescription:
      'Private itinerary for families and couples — custom dates, pacing, rooming, and kid-friendly planning.',
    highlights: [
      'Fully private route and dates',
      'Family rooming & senior-friendly pacing',
      'Mix of Rann, Mandvi, Dholavira & extensions',
      'Dedicated planner on WhatsApp',
    ],
    detailParagraphs: [
      'Tell us your group size, ages, and travel style. We design a private Kutch journey with honest pricing and practical logistics.',
    ],
    idealFor: 'Families, couples, multi-gen groups, and private celebrations',
    category: 'customized',
  },
];

export const RANN_ADDONS = [
  {
    title: 'Dwarka + Somnath Extension',
    description: 'Spiritual coastal circuit after Kutch — temple towns, ghats, and paced road transfers.',
    duration: '+2–3 days',
    fromPrice: 'From ₹8,500',
    icon: '🛕',
  },
  {
    title: 'Spiritual Circuit',
    description: 'Curated pilgrimage add-on combining key Gujarat temple stops with your Rann dates.',
    duration: '+2 days',
    fromPrice: 'From ₹6,500',
    icon: '🪔',
  },
  {
    title: 'Ahmedabad Extension',
    description: 'Heritage walk, Sabarmati, and city highlights before or after your desert journey.',
    duration: '+1 day',
    fromPrice: 'From ₹3,500',
    icon: '🏛️',
  },
  {
    title: 'Premium Tent City Upgrade',
    description: 'Upgrade select nights to premium tent city inventory with priority desert sessions.',
    duration: 'Per night',
    fromPrice: 'From ₹4,500',
    icon: '⛺',
  },
  {
    title: 'Heritage Circuit',
    description: 'Dholavira deep-dive, craft villages, and Bhunga stays woven into your core itinerary.',
    duration: '+1–2 days',
    fromPrice: 'From ₹5,500',
    icon: '🏺',
  },
];

export const RANN_TRAIN_INFO = {
  title: 'Train Information',
  image: IMG.train,
  points: [
    {
      title: 'Sleeper ticket included',
      description:
        'Classic group departures include sleeper class train assistance on the Mumbai/Pune ↔ Bhuj route (subject to availability at confirmation).',
    },
    {
      title: '3AC upgrade available',
      description:
        'Upgrade to 3AC at actual fare difference — recommended for senior travellers and peak holiday batches.',
    },
    {
      title: 'Book early for confirmed berths',
      description:
        'Indian Railways opens ~120 days ahead. Priority form submissions receive train planning support before public inventory thins out.',
    },
  ],
};

export const RANN_DHOLAVIRA = {
  title: 'Why Dholavira Belongs on Your Itinerary',
  eyebrow: 'UNESCO World Heritage',
  paragraphs: [
    'Dholavira is one of the largest and best-preserved Harappan cities — a UNESCO World Heritage Site that transforms a Rann trip from scenic travel into a journey through 4,000 years of civilization.',
    'Walk excavated streets, reservoirs, and citadel ruins that reveal advanced urban planning. Pair the White Desert with this archaeological anchor for a richer, more memorable Kutch experience.',
  ],
  highlights: [
    'UNESCO World Heritage Site (2021 inscription)',
    'Harappan Civilization — citadel, middle town & lower town',
    'Ideal add-on from Bhuj or integrated group routing',
  ],
  image: IMG.dholavira,
};

export const RANN_VIDEOS = [
  {
    id: 'rann-overview',
    title: 'White Desert at Rann Utsav',
    caption: 'Salt flats, festival lights, and moonlit horizons',
    embedUrl: 'https://www.youtube.com/embed/Scxs7L0vhZ4',
  },
  {
    id: 'kutch-culture',
    title: 'Kutch Culture & Crafts',
    caption: 'Village life, embroidery, and folk performances',
    embedUrl: 'https://www.youtube.com/embed/1La4QzGe55I',
  },
  {
    id: 'gujarat-travel',
    title: 'Gujarat Desert Routes',
    caption: 'Road journeys and heritage landscapes beyond the Rann',
    embedUrl: 'https://www.youtube.com/embed/3qS3vAfXyYk',
  },
];

export const BEST_TIME_TO_VISIT = {
  season: RANN_SEASON_DATES,
  title: 'Best Time to Visit',
  lede: 'The official Rann Utsav window is when the White Desert is accessible, festivals are in full swing, and our group batches run on fixed dates.',
  highlights: [
    'November–March: official Rann Utsav season',
    'December–January: peak demand & full moon batches',
    'Book 60–90 days ahead for trains & Bhunga inventory',
    'Early tokens unlock buddy discounts & batch choice',
  ],
  points: WHY_EARLY_PLANNING.points.map((p) => p.description),
};

export const FULL_MOON_SECTION = {
  eyebrow: 'Rann Utsav Full Moon Package',
  title: 'Full Moon Calendar',
  lede:
    'Premium departures on full moon nights — when the White Rann is at its most magical. Moonlit salt flats, festival lights, and our most sought-after group batches.',
  backgroundImage: IMG.fullMoon,
  badgeLabel: 'Full Moon Special',
};

/** Fixed full-moon departure batches — shown in the Full Moon section. */
export const FULL_MOON_BATCH_NUMBERS = [1, 4, 5];

export function buildFullMoonCalendarEntries(entries, { useDefaults = true } = {}) {
  const hasEntries = Array.isArray(entries) && entries.length > 0;
  const byBatch = new Map(
    (hasEntries ? entries : [])
      .map((entry) => [Number(entry.batch), entry])
      .filter(([batch]) => FULL_MOON_BATCH_NUMBERS.includes(batch))
  );

  if (!hasEntries && !useDefaults) return [];

  return FULL_MOON_BATCH_NUMBERS.map((batchNum) => {
    const entry = byBatch.get(batchNum);
    const defaults = RANN_GROUP_BATCHES.find((row) => row.batch === batchNum);
    if (!defaults) return null;

    const dates = String(entry?.dates || entry?.date || defaults.dates || '').trim();
    return {
      batch: batchNum,
      dates,
      date: dates,
      price: String(entry?.price || defaults.price || '').trim() || null,
      highlight: String(entry?.highlight || entry?.label || defaults.departureName || defaults.highlight || '').trim() || null,
      label: String(entry?.highlight || entry?.label || defaults.departureName || defaults.highlight || '').trim() || null,
      tags: Array.isArray(entry?.tags) && entry.tags.length ? entry.tags : defaults.tags || [],
    };
  }).filter(Boolean);
}

export const FULL_MOON_CALENDAR = buildFullMoonCalendarEntries();

export function getRannPackageBySlug(slug) {
  return RANN_PACKAGES.find((p) => p.slug === slug) ?? null;
}

export function rannPackagePath(slug) {
  return `${RANN_SEASON_PATH}/packages/${slug}`;
}

export const RANN_FAQS = {
  travel: [
    {
      q: 'What is the best time to visit Rann of Kutch?',
      a: '5 November 2026 – 4 March 2027 during Rann Utsav. December–January is peak; book early for full moon batches.',
    },
    {
      q: 'How do I reach Kutch for a White Desert tour?',
      a: 'Via Bhuj (train/flight) or Ahmedabad with road transfer. Rann Utsav Packages from Mumbai and Pune include train coordination on group departures.',
    },
    {
      q: 'Is the White Desert suitable for families and seniors?',
      a: 'Yes, with paced itineraries, comfortable stays, Bhunga options, and private vehicle routing where needed.',
    },
    {
      q: 'What should I pack for desert nights?',
      a: 'Warm layers for evenings, comfortable walking shoes, sun protection, and personal medicines.',
    },
  ],
  package: [
    {
      q: 'What is the difference between Rann Utsav Packages from Pune and Mumbai?',
      a: 'Both join the same curated Kutch tour package and batch dates. We coordinate sleeper trains from your preferred city — Pune or Mumbai — with identical desert routing once you reach Bhuj.',
    },
    {
      q: 'What is included in a Rann Utsav Full Moon Package batch?',
      a: 'Full moon batches (December, January, February) include priority White Desert tour sessions under moonlit skies, with slightly elevated seasonal pricing and higher demand — book early for confirmed berths.',
    },
    {
      q: 'What is the difference between Group Departure and Customized tours?',
      a: 'Group Departure has fixed dates and shared batches; Customized Family tours are private Kutch tour packages with flexible pacing.',
    },
    {
      q: 'Can I join from Ahmedabad only?',
      a: 'Yes — the Ahmedabad Joining Package is designed for fly-in and Gujarat-based travellers.',
    },
    {
      q: 'Does the Bhuj package include transport to Bhuj?',
      a: 'Bhuj Land Package covers ground services from Bhuj onward; we guide you on train/flight options separately.',
    },
    {
      q: 'Can we add a Dholavira tour or Dwarka extensions?',
      a: 'Yes — see Add-On Experiences. Dholavira tour add-ons and spiritual extensions are subject to season dates and drive times.',
    },
  ],
  booking: [
    {
      q: 'How does priority access work?',
      a: 'Submit the priority form to receive batch calendars, indicative pricing, and booking window alerts first.',
    },
    {
      q: 'Is sleeper train included in group departures?',
      a: 'Yes for Group Departure batches — sleeper berths subject to availability. 3AC upgrade available at fare difference.',
    },
    {
      q: 'What payment terms do you follow?',
      a: 'Token + milestone schedule; early tokens accepted before September per season policy.',
    },
    {
      q: 'What happens after I submit the form?',
      a: 'Our team connects on WhatsApp with package options, batch dates, and next steps for confirmation.',
    },
  ],
};

export const RANN_GALLERY = [
  IMG.whiteDesert,
  IMG.fullMoon,
  IMG.tent,
  IMG.dholavira,
  IMG.mandvi,
  IMG.road,
  IMG.bhunga,
  IMG.group,
];

export const RANN_HERO_IMAGE = IMG.hero;

export const PACKAGE_INTEREST_LABELS = RANN_PACKAGES.map((p) => p.title);

export const DEPARTURE_CITY_OPTIONS = [
  'Mumbai',
  'Pune',
  'Ahmedabad',
  'Bhuj',
  'Delhi',
  'Bangalore',
  'Hyderabad',
  'Other',
];

export const RANN_SEO_KEYWORDS = [
  'Rann of Kutch',
  'Rann Utsav 2026',
  'Rann Utsav 2027',
  'Rann Utsav Packages from Pune',
  'Rann Utsav Packages from Mumbai',
  'White Desert Tour',
  'Dholavira Tour',
  'Kutch Tour Package',
  'Rann Utsav Full Moon Package',
  'Kutch tour packages',
  'White Desert India',
  'Mandvi beach Kutch',
  'Rann group departure',
  'Bhuj Rann package',
  'Gujarat winter travel',
];

export const RANN_SEO_TITLE =
  'Rann Utsav Packages from Mumbai & Pune | White Desert Tour & Kutch Tour Package 2026–27';

export const RANN_SEO_DESCRIPTION =
  'Compare Rann Utsav Packages from Mumbai and Pune, White Desert tour dates, Dholavira tour add-ons, and Rann Utsav Full Moon Package batches for Season 2026–27. Priority access & free planning guide.';

/** SEO-rich blog cards when CMS has few Rann-tagged posts. */
export const RANN_SEO_BLOG_FALLBACKS = [
  {
    id: 'seo-rann-pune-packages',
    title: 'Rann Utsav Packages from Pune: Train Routes & Batch Planning',
    excerpt:
      'How Pune travellers can lock sleeper berths, compare Kutch tour package options, and pick the right White Desert tour dates.',
    category: 'Kutch',
    href: '/blog',
    image: IMG.whiteDesert,
  },
  {
    id: 'seo-rann-mumbai-packages',
    title: 'Rann Utsav Packages from Mumbai: What to Expect in 2026–27',
    excerpt:
      'A practical guide to Mumbai group departures, full moon batches, and when to book your Rann Utsav Full Moon Package.',
    category: 'Guides',
    href: '/blog',
    image: IMG.fullMoon,
  },
  {
    id: 'seo-dholavira-tour',
    title: 'Dholavira Tour Add-On: UNESCO Heritage on Your Kutch Itinerary',
    excerpt:
      'Why the Dholavira tour belongs on your Kutch tour package — routing tips, drive times, and pairing with the White Desert tour.',
    category: 'Heritage',
    href: '/blog',
    image: IMG.dholavira,
  },
];
