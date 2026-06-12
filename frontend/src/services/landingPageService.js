import { publicFetch } from '@/lib/publicApi';
import { isNotFoundError } from '@/lib/publicApiError';
import {
  BEST_TIME_TO_VISIT,
  RANN_ADDONS,
  RANN_DHOLAVIRA,
  RANN_FAQS,
  RANN_GROUP_BATCHES,
  FULL_MOON_CALENDAR,
  FULL_MOON_SECTION,
  RANN_HERO_IMAGE,
  RANN_HERO_HEADING,
  RANN_HERO_PRICING,
  RANN_HERO_SOCIAL_PROOF,
  RANN_HERO_SUBHEADING,
  RANN_PACKAGES,
  RANN_PACKAGE_BADGES,
  RANN_PLANNING_GUIDE,
  resolvePlanningGuide,
  RANN_SEO_BLOG_FALLBACKS,
  RANN_SEO_DESCRIPTION,
  RANN_SEO_KEYWORDS,
  RANN_SEO_TITLE,
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
    detailContent: {
      paragraphs: pkg.detailParagraphs,
      idealFor: pkg.idealFor,
      audienceBadge: RANN_PACKAGE_BADGES[pkg.slug] || null,
    },
    audienceBadge: RANN_PACKAGE_BADGES[pkg.slug] || null,
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
    heroHeading: RANN_HERO_HEADING,
    heroSubheading: RANN_HERO_SUBHEADING,
    heroSocialProof: RANN_HERO_SOCIAL_PROOF,
    heroPricing: RANN_HERO_PRICING,
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
    customBlocks: {
      planningGuide: RANN_PLANNING_GUIDE,
      fullMoonSection: FULL_MOON_SECTION,
    },
    formConfig: {
      enabled: true,
      redirectToWhatsApp: true,
      successMessage:
        'Thank you — your request is received. Redirecting you to WhatsApp so our travel expert can share batch calendars and early-bird options.',
    },
    seoTitle: RANN_SEO_TITLE,
    seoDescription: RANN_SEO_DESCRIPTION,
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

export async function fetchLandingPackageRelated(slug, packageSlug) {
  try {
    const data = await publicFetch(
      `/landing-pages/${encodeURIComponent(slug)}/packages/${encodeURIComponent(packageSlug)}/related`
    );
    return {
      blogs: data?.blogs || [],
      landingPage: data?.landingPage || null,
      package: data?.package || null,
    };
  } catch {
    return { blogs: [], landingPage: null, package: null };
  }
}

export async function fetchRannRelatedContent(slug = RANN_SLUG) {
  try {
    const blogsPayload = await publicFetch('/blogs?limit=40');
    const fromApi = (blogsPayload?.blogs || blogsPayload || []).filter((b) => matchesRannContent(b, slug));
    const blogs = fromApi.length >= 3 ? fromApi.slice(0, 6) : [...fromApi, ...RANN_SEO_BLOG_FALLBACKS].slice(0, 6);
    return { blogs };
  } catch {
    return { blogs: RANN_SEO_BLOG_FALLBACKS.slice(0, 6) };
  }
}

function hasItems(value) {
  return Array.isArray(value) && value.length > 0;
}

function pickApiOrFallback(apiValue, fallback) {
  if (apiValue === null || apiValue === undefined) return fallback;
  if (typeof apiValue === 'string' && !apiValue.trim()) return fallback;
  if (Array.isArray(apiValue) && !apiValue.length) return fallback;
  if (typeof apiValue === 'object' && !Array.isArray(apiValue) && !Object.keys(apiValue).length) {
    return fallback;
  }
  return apiValue;
}

/** API content wins; static defaults only fill gaps (used for Rann campaign). */
function mergeLandingWithStaticDefaults(page, staticDefaults) {
  const blocks = page.customBlocks && typeof page.customBlocks === 'object' ? page.customBlocks : {};
  return {
    ...staticDefaults,
    ...page,
    title: pickApiOrFallback(page.title, staticDefaults.title),
    heroHeading: pickApiOrFallback(page.heroHeading, staticDefaults.heroHeading),
    heroSubheading: pickApiOrFallback(page.heroSubheading, staticDefaults.heroSubheading),
    heroBannerImage: pickApiOrFallback(page.heroBannerImage, staticDefaults.heroBannerImage),
    seasonDates: pickApiOrFallback(page.seasonDates, staticDefaults.seasonDates),
    heroSocialProof: pickApiOrFallback(
      page.heroSocialProof ?? blocks.heroSocialProof,
      staticDefaults.heroSocialProof
    ),
    heroPricing: pickApiOrFallback(
      page.heroPricing ?? blocks.heroPricing,
      staticDefaults.heroPricing
    ),
    gallery: pickApiOrFallback(page.gallery ?? blocks.gallery, staticDefaults.gallery),
    introContent: pickApiOrFallback(page.introContent, staticDefaults.introContent),
    whyVisit: pickApiOrFallback(page.whyVisit, staticDefaults.whyVisit),
    bestTimeToVisit: pickApiOrFallback(page.bestTimeToVisit, staticDefaults.bestTimeToVisit),
    fullMoonCalendar: pickApiOrFallback(page.fullMoonCalendar, staticDefaults.fullMoonCalendar),
    groupBatches: pickApiOrFallback(page.groupBatches ?? blocks.groupBatches, staticDefaults.groupBatches),
    earlyPlanning: pickApiOrFallback(page.earlyPlanning, staticDefaults.earlyPlanning),
    addOns: pickApiOrFallback(page.addOns ?? blocks.addOns, staticDefaults.addOns),
    trainInfo: pickApiOrFallback(page.trainInfo ?? blocks.trainInfo, staticDefaults.trainInfo),
    dholaviraSection: pickApiOrFallback(
      page.dholaviraSection ?? blocks.dholaviraSection,
      staticDefaults.dholaviraSection
    ),
    videos: pickApiOrFallback(page.videos ?? blocks.videos, staticDefaults.videos),
    packages: Array.isArray(page.packages) ? page.packages : staticDefaults.packages,
    faqs: Array.isArray(page.faqs) ? page.faqs : staticDefaults.faqs,
    testimonials: Array.isArray(page.testimonials) ? page.testimonials : staticDefaults.testimonials,
    ctaButtonText: pickApiOrFallback(page.ctaButtonText, staticDefaults.ctaButtonText),
    ctaButtonLink: pickApiOrFallback(page.ctaButtonLink, staticDefaults.ctaButtonLink),
    seoTitle: pickApiOrFallback(page.seoTitle, staticDefaults.seoTitle),
    seoDescription: pickApiOrFallback(page.seoDescription, staticDefaults.seoDescription),
    ogImage: pickApiOrFallback(page.ogImage, staticDefaults.ogImage),
    planningGuide: resolvePlanningGuide({
      ...page,
      customBlocks: {
        ...(staticDefaults.customBlocks || {}),
        ...(typeof page.customBlocks === 'object' && !Array.isArray(page.customBlocks) ? page.customBlocks : {}),
      },
    }),
  };
}

export async function fetchLandingPageBySlug(slug) {
  try {
    const page = await publicFetch(`/landing-pages/${encodeURIComponent(slug)}`);
    if (slug === RANN_SLUG) {
      return mergeLandingWithStaticDefaults(page, buildStaticRannPage());
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
