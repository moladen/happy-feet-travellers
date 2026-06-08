import { publicFetch } from '@/lib/publicApi';
import { isNotFoundError } from '@/lib/publicApiError';
import {
  BEST_TIME_TO_VISIT,
  RANN_ADDONS,
  RANN_DHOLAVIRA,
  RANN_FAQS,
  RANN_GROUP_BATCHES,
  FULL_MOON_CALENDAR,
  RANN_HERO_IMAGE,
  RANN_PACKAGES,
  RANN_SEO_KEYWORDS,
  RANN_SEASON_DATES,
  RANN_SEASON_TITLE,
  RANN_SLUG,
  RANN_TRAIN_INFO,
  RANN_UTSAV_INTRO,
  RANN_VIDEOS,
  WHY_EARLY_PLANNING,
  WHY_VISIT_RANN,
} from '@/lib/rannSeasonContent';

function mapPackages() {
  return RANN_PACKAGES.map((pkg, index) => ({
    id: pkg.slug,
    slug: pkg.slug,
    name: pkg.title,
    emoji: pkg.emoji,
    category: pkg.category,
    featuredImage: pkg.image,
    shortDescription: pkg.shortDescription,
    startingPrice: pkg.startingPrice,
    duration: pkg.duration,
    highlights: pkg.highlights,
    viewDetailsUrl: null,
    detailContent: { paragraphs: pkg.detailParagraphs, idealFor: pkg.idealFor },
    sortOrder: index,
    active: true,
  }));
}

function mapFaqs() {
  return [
    ...RANN_FAQS.travel.map((f, i) => ({ ...f, category: 'travel', sortOrder: i })),
    ...RANN_FAQS.package.map((f, i) => ({ ...f, category: 'package', sortOrder: i + 10 })),
    ...RANN_FAQS.booking.map((f, i) => ({ ...f, category: 'booking', sortOrder: i + 20 })),
  ].map((f) => ({ id: f.q, question: f.q, answer: f.a, category: f.category, sortOrder: f.sortOrder }));
}

/** Static master page when API/DB unavailable */
export function buildStaticRannPage() {
  return {
    id: 'static-rann',
    slug: RANN_SLUG,
    title: RANN_SEASON_TITLE,
    status: 'published',
    heroHeading: RANN_SEASON_TITLE,
    heroSubheading:
      'Premium White Desert journeys — 10 group batches, five package paths, and private family tours across the official Rann Utsav season.',
    heroBannerImage: RANN_HERO_IMAGE,
    seasonDates: RANN_SEASON_DATES,
    ctaButtonText: 'Get Priority Access',
    ctaButtonLink: '#priority-interest',
    whatsappCtaLink: null,
    whatsappGroupLink: null,
    whatsappGroupEnabled: true,
    introContent: RANN_UTSAV_INTRO,
    whyVisit: WHY_VISIT_RANN,
    bestTimeToVisit: BEST_TIME_TO_VISIT,
    destinationHighlights: null,
    fullMoonCalendar: FULL_MOON_CALENDAR,
    groupBatches: RANN_GROUP_BATCHES,
    earlyPlanning: WHY_EARLY_PLANNING,
    addOns: RANN_ADDONS,
    trainInfo: RANN_TRAIN_INFO,
    dholaviraSection: RANN_DHOLAVIRA,
    videos: RANN_VIDEOS,
    customBlocks: [],
    formConfig: {
      enabled: true,
      redirectToWhatsApp: true,
      successMessage:
        'Thank you — your request is received. Redirecting you to WhatsApp so our travel expert can share batch calendars and early-bird options.',
    },
    seoTitle: `${RANN_SEASON_TITLE} | Happy Feet Travellers`,
    seoDescription:
      'Master campaign page for Rann of Kutch Season 2026–27 — 10 group batches, package comparison, add-ons, train info, priority access, and WhatsApp updates.',
    seoKeywords: RANN_SEO_KEYWORDS,
    ogImage: RANN_HERO_IMAGE,
    packages: mapPackages(),
    faqs: mapFaqs(),
    testimonials: [],
  };
}

function matchesRannContent(item, slug) {
  const hay = [
    item.slug,
    item.title,
    item.destination,
    item.name,
    item.excerpt,
    item.category,
    item.landingPageSlug,
    ...(item.topicKeys || []),
    ...(item.tags || []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  if (item.landingPageSlug === slug) return true;
  return /rann|kutch|white desert|rann utsav|gujarat/.test(hay);
}

export async function fetchRannRelatedContent(slug = RANN_SLUG) {
  try {
    const [toursPayload, blogsPayload] = await Promise.all([
      publicFetch('/tours?limit=60'),
      publicFetch('/blogs?limit=40'),
    ]);
    const tours = (toursPayload?.tours || toursPayload || []).filter((t) => matchesRannContent(t, slug));
    const blogs = (blogsPayload?.blogs || blogsPayload || []).filter((b) => matchesRannContent(b, slug));
    return { tours: tours.slice(0, 6), blogs: blogs.slice(0, 6) };
  } catch {
    return { tours: [], blogs: [] };
  }
}

export async function fetchLandingPageBySlug(slug) {
  try {
    const page = await publicFetch(`/landing-pages/${encodeURIComponent(slug)}`);
    if (slug === RANN_SLUG) {
      const staticDefaults = buildStaticRannPage();
      return {
        ...staticDefaults,
        ...page,
        title: page.title || staticDefaults.title,
        heroHeading: page.heroHeading || staticDefaults.heroHeading,
        packages: staticDefaults.packages,
        faqs: staticDefaults.faqs,
        whyVisit: staticDefaults.whyVisit,
        groupBatches: staticDefaults.groupBatches,
        earlyPlanning: staticDefaults.earlyPlanning,
        addOns: staticDefaults.addOns,
        trainInfo: staticDefaults.trainInfo,
        introContent: staticDefaults.introContent,
        bestTimeToVisit: staticDefaults.bestTimeToVisit,
        fullMoonCalendar: staticDefaults.fullMoonCalendar,
        dholaviraSection: staticDefaults.dholaviraSection,
        videos: staticDefaults.videos,
      };
    }
    return page;
  } catch (err) {
    if (slug === RANN_SLUG) return buildStaticRannPage();
    if (isNotFoundError(err) || err?.status === 404) return null;
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[fetchLandingPageBySlug]', slug, err?.message || err);
    }
    return null;
  }
}

export async function fetchPublishedLandingSlugs() {
  try {
    const data = await publicFetch('/landing-pages?published=true&limit=100');
    const slugs = (data?.landingPages || []).map((p) => p.slug);
    return slugs.includes(RANN_SLUG) ? slugs : [RANN_SLUG, ...slugs];
  } catch {
    return [RANN_SLUG];
  }
}

export function packageDetailPath(landingSlug, packageSlug) {
  return `/${landingSlug}/packages/${packageSlug}`;
}

export function groupFaqsByCategory(faqs = []) {
  return {
    travel: faqs.filter((f) => f.category === 'travel'),
    package: faqs.filter((f) => f.category === 'package'),
    booking: faqs.filter((f) => f.category === 'booking'),
  };
}

export { RANN_SLUG };
