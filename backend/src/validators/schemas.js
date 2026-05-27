const Joi = require('joi');
const { CATEGORIES } = require('@/constants/tourCategories');
const { DEPARTURE_STATUS_VALUES } = require('@/constants/upcomingDepartures');

// Allow Indian phone numbers in common formats: 10 digits, optionally with +91/91 prefix and spaces/dashes.
const phonePattern = /^(?:\+?91[\s-]?)?[6-9]\d{9}$/;
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Optional phone — empty is OK; non-empty must match Indian mobile format. */
const optionalIndianPhone = Joi.string()
  .trim()
  .allow('', null)
  .custom((value, helpers) => {
    const normalised = String(value ?? '').replace(/[\s-]/g, '');
    if (!normalised) return '';
    if (!phonePattern.test(normalised)) {
      return helpers.error('any.custom', {
        message: 'Enter a valid 10-digit Indian mobile number',
      });
    }
    return normalised;
  });

const createTourSchema = Joi.object({
  title: Joi.string().required().min(3).max(150),
  slug: Joi.string().pattern(slugPattern).allow('', null),
  description: Joi.string().required().min(10),
  duration: Joi.number().required().min(1),
  durationLabel: Joi.string().allow('', null),
  price: Joi.number().required().min(0),
  startingPrice: Joi.number().min(0),
  departureCity: Joi.string().required(),
  category: Joi.string().required().valid(...CATEGORIES),
  subCategory: Joi.string().allow('', null),
  startDate: Joi.date(),
  endDate: Joi.date(),
  dateLabel: Joi.string().allow('', null),
  rating: Joi.number().min(0).max(5),
  reviewsCount: Joi.number().integer().min(0),
  urgency: Joi.string().allow('', null),
  bookingDeposit: Joi.number().integer().min(0).allow(null),
  offers: Joi.string().allow('', null),
  meals: Joi.string().allow('', null),
  stayType: Joi.string().allow('', null),
  transport: Joi.string().allow('', null),
  suitableFor: Joi.string().allow('', null),
  coverImage: Joi.string().allow('', null),
  images: Joi.array().items(Joi.string()),
  highlights: Joi.array().items(Joi.string()),
  inclusions: Joi.array().items(Joi.string()),
  exclusions: Joi.array().items(Joi.string()),
  thingsToCarry: Joi.array().items(Joi.string()),
  cancellationPolicy: Joi.string().allow('', null),
  bankDetails: Joi.string().allow('', null),
  itinerary: Joi.any(),
  faqs: Joi.any(),
  pickupPoints: Joi.any(),
  supplements: Joi.any(),
  terms: Joi.any(),
  destination: Joi.string().allow('', null),
  tags: Joi.array().items(Joi.string().trim()).max(16),
  groupSize: Joi.string().allow('', null),
  status: Joi.string().valid(...DEPARTURE_STATUS_VALUES),
  featured: Joi.boolean(),
  seriesSlug: Joi.string().pattern(slugPattern).allow('', null),
});

const createUpcomingDepartureSchema = createTourSchema
  .fork(['category'], (s) => s.optional().default('upcoming'))
  .custom((value, helpers) => {
    const status = String(value.status || 'active').toLowerCase();
    if (status === 'active') {
      const hasStart = value.startDate != null && String(value.startDate).trim() !== '';
      const hasLabel = String(value.dateLabel || '').trim().length > 0;
      if (!hasStart && !hasLabel) {
        return helpers.message(
          'Active departures need a start date (Dates & pricing step) or a date label so they appear on the website.'
        );
      }
    }
    return value;
  });

const personalizedTripExtras = {
  packageCategory: Joi.string().allow('', null),
  state: Joi.string().allow('', null),
  ctaData: Joi.object({
    primaryLabel: Joi.string().allow('', null),
    primaryHref: Joi.string().allow('', null),
    secondaryLabel: Joi.string().allow('', null),
    secondaryHref: Joi.string().allow('', null),
    headline: Joi.string().allow('', null),
  }).allow(null),
  seoTitle: Joi.string().allow('', null),
  seoDescription: Joi.string().allow('', null),
};

const createPersonalizedTripSchema = createTourSchema
  .keys(personalizedTripExtras)
  .fork(['category'], (s) => s.optional().default('customized'))
  .fork(['departureCity'], (s) => s.optional().default('India'));

const schemas = {
  createTour: createTourSchema,
  createUpcomingDeparture: createUpcomingDepartureSchema,
  updateUpcomingDeparture: createUpcomingDepartureSchema.fork(
    ['title', 'description', 'duration', 'price', 'departureCity'],
    (s) => s.optional()
  ).min(1),
  createPersonalizedTrip: createPersonalizedTripSchema,
  updatePersonalizedTrip: createPersonalizedTripSchema.fork(
    ['title', 'description', 'duration', 'price', 'departureCity'],
    (s) => s.optional()
  ).min(1),
  updateTour: createTourSchema.fork(
    ['title', 'description', 'duration', 'price', 'departureCity', 'category'],
    (s) => s.optional()
  ).min(1),

  createBlog: Joi.object({
    title: Joi.string().required().min(5).max(200),
    slug: Joi.string().pattern(slugPattern).allow('', null),
    excerpt: Joi.string().allow('', null),
    category: Joi.string().allow('', null),
    content: Joi.alternatives()
      .try(Joi.string().min(20), Joi.array().items(Joi.string()), Joi.object())
      .required(),
    coverImage: Joi.string().required(),
    authorName: Joi.string().required().min(2),
    authorImage: Joi.string().allow('', null),
    authorInstagram: Joi.string().allow('', null),
    seoTitle: Joi.string().allow('', null),
    seoDescription: Joi.string().allow('', null),
    publishedAt: Joi.date(),
  }),

  updateBlog: Joi.object({
    title: Joi.string().min(5).max(200),
    slug: Joi.string().pattern(slugPattern).allow('', null),
    excerpt: Joi.string().allow('', null),
    category: Joi.string().allow('', null),
    content: Joi.alternatives().try(
      Joi.string().min(20),
      Joi.array().items(Joi.string().min(1)),
      Joi.object()
    ),
    coverImage: Joi.string().min(1),
    authorName: Joi.string().min(2),
    authorImage: Joi.string().allow('', null),
    authorInstagram: Joi.string().allow('', null),
    seoTitle: Joi.string().allow('', null),
    seoDescription: Joi.string().allow('', null),
    publishedAt: Joi.alternatives().try(Joi.date(), Joi.string().isoDate()),
  }).min(1),

  createTestimonial: Joi.object({
    name: Joi.string().required().min(2),
    city: Joi.string().allow('', null),
    image: Joi.string().allow('', null),
    review: Joi.string().required().min(10),
    rating: Joi.number().required().min(1).max(5),
  }),

  updateTestimonial: Joi.object({
    name: Joi.string().min(2),
    city: Joi.string().allow('', null),
    image: Joi.string().allow('', null),
    review: Joi.string().min(10),
    rating: Joi.number().min(1).max(5),
  }).min(1),

  // Accepts either `phone` or `whatsappNumber` (renamed → phone) for FE compatibility.
  createEnquiry: Joi.object({
    name: Joi.string().required().trim().min(2).max(100),
    phone: optionalIndianPhone,
    whatsappNumber: optionalIndianPhone,
    email: Joi.string().email({ tlds: { allow: false } }).allow('', null),
    message: Joi.string().required().trim().min(10).max(2000),
    subject: Joi.string().trim().max(200).allow('', null),
    destination: Joi.string().trim().max(200).allow('', null),
    source: Joi.string().trim().max(80).allow('', null),
    website: Joi.string().max(0).allow('', null),
    _honeypot: Joi.string().max(0).allow('', null),
  }).custom((value, helpers) => {
      const { phone, whatsappNumber, email, destination, subject, website, _honeypot, ...rest } =
        value;
      const normalisedPhone = (phone || whatsappNumber || '').replace(/[\s-]/g, '');
      const normalisedEmail = (email || '').trim();
      if (!normalisedPhone && !normalisedEmail) {
        return helpers.error('any.custom', {
          message: 'Provide a phone number or email address',
        });
      }
      const resolvedSubject =
        (subject || '').trim() || (destination || '').trim() || null;
      return {
        ...rest,
        phone: normalisedPhone,
        email:
          normalisedEmail ||
          (normalisedPhone ? `lead+${normalisedPhone}@happyfeet.in` : 'enquiry@happyfeet.in'),
        subject: resolvedSubject,
        website: website || '',
        _honeypot: _honeypot || '',
      };
    }, 'normalise enquiry contact'),

  createSubscriber: Joi.object({
    email: Joi.string().required().email(),
    source: Joi.string().allow('', null),
  }),

  createGalleryImage: Joi.object({
    title: Joi.string().allow('', null),
    altText: Joi.string().required().min(3),
    category: Joi.string().allow('', null),
    image: Joi.string().required(),
  }),

  updateGalleryImage: Joi.object({
    title: Joi.string().allow('', null),
    altText: Joi.string().min(3),
    category: Joi.string().allow('', null),
    image: Joi.string(),
  }).min(1),

  createHeroSlide: Joi.object({
    altText: Joi.string().required().min(3).max(240),
    tag: Joi.string().allow('', null).max(80),
    emoji: Joi.string().allow('', null).max(8),
    sortOrder: Joi.alternatives().try(Joi.number().integer().min(0), Joi.string().pattern(/^\d+$/)),
    active: Joi.alternatives().try(Joi.boolean(), Joi.string().valid('true', 'false', '1', '0')),
  }),

  updateHeroSlide: Joi.object({
    altText: Joi.string().min(3).max(240),
    tag: Joi.string().allow('', null).max(80),
    emoji: Joi.string().allow('', null).max(8),
    sortOrder: Joi.alternatives().try(Joi.number().integer().min(0), Joi.string().pattern(/^\d+$/)),
    active: Joi.alternatives().try(Joi.boolean(), Joi.string().valid('true', 'false', '1', '0')),
  }),

  reorderHeroSlides: Joi.object({
    order: Joi.array().items(Joi.string().required()).min(1).required(),
  }),

  createTeamMember: Joi.object({
    fullName: Joi.string().required().min(2).max(120),
    role: Joi.string().required().min(2).max(120),
    bio: Joi.string().required().min(10).max(2000),
    instagramUrl: Joi.alternatives().try(
      Joi.string().uri({ scheme: ['http', 'https'] }),
      Joi.string().valid(''),
      Joi.valid(null)
    ),
    linkedinUrl: Joi.alternatives().try(
      Joi.string().uri({ scheme: ['http', 'https'] }),
      Joi.string().valid(''),
      Joi.valid(null)
    ),
    sortOrder: Joi.alternatives().try(Joi.number().integer().min(0), Joi.string().pattern(/^\d+$/)),
    active: Joi.alternatives().try(Joi.boolean(), Joi.string().valid('true', 'false', '1', '0')),
  }),

  updateTeamMember: Joi.object({
    fullName: Joi.string().min(2).max(120),
    role: Joi.string().min(2).max(120),
    bio: Joi.string().min(10).max(2000),
    instagramUrl: Joi.alternatives().try(
      Joi.string().uri({ scheme: ['http', 'https'] }),
      Joi.string().valid(''),
      Joi.valid(null)
    ),
    linkedinUrl: Joi.alternatives().try(
      Joi.string().uri({ scheme: ['http', 'https'] }),
      Joi.string().valid(''),
      Joi.valid(null)
    ),
    sortOrder: Joi.alternatives().try(Joi.number().integer().min(0), Joi.string().pattern(/^\d+$/)),
    active: Joi.alternatives().try(Joi.boolean(), Joi.string().valid('true', 'false', '1', '0')),
  }),

  reorderTeamMembers: Joi.object({
    order: Joi.array().items(Joi.string().required()).min(1).required(),
  }),

  updateSettings: Joi.object({
    whatsappNumber: Joi.string().allow('', null).max(30),
    email: Joi.alternatives().try(
      Joi.string().email({ tlds: { allow: false } }),
      Joi.string().valid(''),
      Joi.valid(null)
    ),
    instagramUrl: Joi.alternatives().try(
      Joi.string().uri({ scheme: ['http', 'https'] }),
      Joi.string().valid(''),
      Joi.valid(null)
    ),
    facebookUrl: Joi.alternatives().try(
      Joi.string().uri({ scheme: ['http', 'https'] }),
      Joi.string().valid(''),
      Joi.valid(null)
    ),
    youtubeUrl: Joi.alternatives().try(
      Joi.string().uri({ scheme: ['http', 'https'] }),
      Joi.string().valid(''),
      Joi.valid(null)
    ),
    officeAddress: Joi.string().allow('', null).max(2000),
    paymentLink: Joi.alternatives().try(
      Joi.string().uri({ scheme: ['http', 'https'] }),
      Joi.string().valid(''),
      Joi.valid(null)
    ),
    footerTagline: Joi.string().allow('', null).max(300),
    footerDetails: Joi.string().allow('', null).max(2000),
  }),

  adminLogin: Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
};

module.exports = schemas;
