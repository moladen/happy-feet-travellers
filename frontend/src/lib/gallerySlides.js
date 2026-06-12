import { RANN_SEASON_TITLE } from '@/lib/rannSeasonContent';
import { sanitiseStockImageUrl, TRAVEL_FALLBACK_IMAGE } from '@/lib/stockImages';

const FALLBACK = TRAVEL_FALLBACK_IMAGE;

const RANN_IMAGES = {
  whiteDesert: 'https://images.unsplash.com/photo-1516939884455-1445c8652f83?w=1600&h=1000&fit=crop',
  fullMoon: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=1000&fit=crop',
  tent: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600&h=1000&fit=crop',
  dholavira: 'https://images.unsplash.com/photo-1524499982521-1ffd58dd89ea?w=1600&h=1000&fit=crop',
  mandvi: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&h=1000&fit=crop',
  road: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&h=1000&fit=crop',
  culture: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1600&h=1000&fit=crop',
  group: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1600&h=1000&fit=crop',
  campfire: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=1600&h=1000&fit=crop',
  trek: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&h=1000&fit=crop',
};

/** Dedicated Rann of Kutch landing / campaign gallery */
export const RANN_GALLERY_SLIDES = [
  { image: RANN_IMAGES.whiteDesert, caption: 'White Desert — endless salt flats at sunrise', type: 'destination' },
  { image: RANN_IMAGES.fullMoon, caption: 'Rann Utsav Full Moon Experience', type: 'destination' },
  { image: RANN_IMAGES.tent, caption: 'Premium Tent City under desert stars', type: 'destination' },
  { image: RANN_IMAGES.dholavira, caption: 'Dholavira — ancient Harappan heritage', type: 'destination' },
  { image: RANN_IMAGES.mandvi, caption: 'Mandvi Beach — coastal calm after the Rann', type: 'destination' },
  { image: RANN_IMAGES.road, caption: 'Road to Heaven — iconic Rann corridor', type: 'destination' },
  { image: RANN_IMAGES.group, caption: 'Happy Feet group departure — Rann season', type: 'memory' },
  { image: RANN_IMAGES.culture, caption: 'Local crafts, folk music & Kutchi culture', type: 'memory' },
  { image: RANN_IMAGES.campfire, caption: 'Campfire evenings with fellow travellers', type: 'memory' },
  { image: RANN_IMAGES.trek, caption: 'Desert walks & curated festival experiences', type: 'memory' },
];

const MEMORY_CAPTIONS = [
  'Spiti Valley Group Departure',
  'Rann Utsav Full Moon Experience',
  'Kerala Houseboat Journey',
  'Kashmir Winter Escape',
  'Campfire moments with fellow travellers',
  'Trekking & adventure highlights',
  'Desert experiences under open skies',
  'Local cultural experiences on the road',
];

const DESTINATION_CAPTIONS = [
  'Landscape & scenic viewpoints',
  'Iconic attractions en route',
  'Local culture & heritage',
  'Authentic local experiences',
  'Adventure activities',
];

function normaliseSlide(raw, index, contextLabel) {
  if (!raw) return null;
  if (typeof raw === 'string') {
    const image = raw.trim();
    if (!image) return null;
    const type = index % 3 === 0 ? 'memory' : 'destination';
    const pool = type === 'memory' ? MEMORY_CAPTIONS : DESTINATION_CAPTIONS;
    return {
      image,
      caption: `${contextLabel} — ${pool[index % pool.length]}`,
      type,
    };
  }
  if (typeof raw === 'object') {
    const image = raw.image || raw.url || raw.src || raw.featuredImage || '';
    if (!image) return null;
    return {
      image: String(image).trim(),
      caption: raw.caption || raw.title || contextLabel,
      type: raw.type === 'memory' ? 'memory' : 'destination',
    };
  }
  return null;
}

/**
 * Build carousel slides from tour media (images, gallery JSON, cover).
 * @param {object} tour
 * @returns {Array<{ image: string; caption: string; type: string }>}
 */
export function buildTourGallerySlides(tour, resolveUrl) {
  const contextLabel = tour?.destination || tour?.title || 'This journey';
  const resolve = typeof resolveUrl === 'function' ? resolveUrl : (url) => url;
  const rawItems = [];

  if (Array.isArray(tour?.gallery)) {
    tour.gallery.forEach((item) => rawItems.push(item));
  }
  if (Array.isArray(tour?.gallerySlides)) {
    tour.gallerySlides.forEach((item) => rawItems.push(item));
  }
  if (Array.isArray(tour?.images)) {
    tour.images.forEach((item) => rawItems.push(item));
  }

  const slides = rawItems
    .map((item, index) => {
      const slide = normaliseSlide(item, index, contextLabel);
      if (!slide) return null;
      return { ...slide, image: sanitiseStockImageUrl(resolve(slide.image) || slide.image) };
    })
    .filter(Boolean);

  const seen = new Set();
  const unique = slides.filter((s) => {
    if (seen.has(s.image)) return false;
    seen.add(s.image);
    return true;
  });

  if (unique.length >= 3) return unique;

  const fallbackImages = [
    tour?.coverImage,
    ...(Array.isArray(tour?.images) ? tour.images : []),
  ].filter(Boolean);

  return fallbackImages
    .map((img, index) => {
      const slide = normaliseSlide(img, index, contextLabel);
      if (!slide) return null;
      return { ...slide, image: sanitiseStockImageUrl(resolve(slide.image) || slide.image) };
    })
    .filter(Boolean)
    .filter((s, i, arr) => arr.findIndex((x) => x.image === s.image) === i);
}

/**
 * Landing page gallery — Rann slug uses curated set; others use whyVisit + highlights.
 */
export function buildLandingGallerySlides(page) {
  const apiGallery = page?.gallery || page?.customBlocks?.gallery;
  if (Array.isArray(apiGallery) && apiGallery.length) {
    return apiGallery
      .map((slide, index) => normaliseSlide(slide, index, page?.title || RANN_SEASON_TITLE))
      .filter(Boolean)
      .map((slide) => ({ ...slide, image: sanitiseStockImageUrl(slide.image) }));
  }

  const slug = String(page?.slug || '').toLowerCase();
  if (slug.includes('rann') || slug.includes('kutch')) {
    return RANN_GALLERY_SLIDES.map((slide) => ({
      ...slide,
      image: sanitiseStockImageUrl(slide.image),
    }));
  }

  const slides = [];
  const title = page?.title || RANN_SEASON_TITLE;

  (page?.whyVisit || []).forEach((item) => {
    if (item?.image) {
      slides.push({
        image: sanitiseStockImageUrl(item.image),
        caption: item.title || title,
        type: 'destination',
      });
    }
  });

  (page?.destinationHighlights || []).forEach((item, index) => {
    slides.push({
      image: sanitiseStockImageUrl(item.image || RANN_IMAGES.culture),
      caption: item.title || item.description?.slice(0, 60) || title,
      type: index % 2 === 0 ? 'destination' : 'memory',
    });
  });

  if (page?.heroBannerImage) {
    slides.unshift({
      image: sanitiseStockImageUrl(page.heroBannerImage),
      caption: page.heroHeading || title,
      type: 'destination',
    });
  }

  const seen = new Set();
  const unique = slides.filter((s) => {
    if (!s.image || seen.has(s.image)) return false;
    seen.add(s.image);
    return true;
  });

  return unique.length >= 4 ? unique : RANN_GALLERY_SLIDES;
}

export function withGalleryFallback(slides) {
  const list = Array.isArray(slides) ? slides.filter((s) => s?.image) : [];
  return list.length ? list : [{ image: FALLBACK, caption: 'Travel experience', type: 'destination' }];
}
