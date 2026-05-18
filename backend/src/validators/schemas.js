const Joi = require('joi');
const { CATEGORIES } = require('@/constants/tourCategories');

// Allow Indian phone numbers in common formats: 10 digits, optionally with +91/91 prefix and spaces/dashes.
const phonePattern = /^(?:\+?91[\s-]?)?[6-9]\d{9}$/;
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

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
});

const schemas = {
  createTour: createTourSchema,
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
    name: Joi.string().required().min(2).max(100),
    phone: Joi.string().pattern(phonePattern).messages({
      'string.pattern.base': 'phone must be a valid Indian mobile number',
    }),
    whatsappNumber: Joi.string().pattern(phonePattern).messages({
      'string.pattern.base': 'whatsappNumber must be a valid Indian mobile number',
    }),
    email: Joi.string().email().allow('', null),
    message: Joi.string().required().min(5).max(2000),
    subject: Joi.string().allow('', null),
    source: Joi.string().allow('', null),
  })
    .or('phone', 'whatsappNumber')
    .custom((value, helpers) => {
      const { phone, whatsappNumber, email, ...rest } = value;
      const normalisedPhone = (phone || whatsappNumber || '').replace(/[\s-]/g, '');
      const normalisedEmail = (email || '').trim();
      if (!normalisedPhone && !normalisedEmail) {
        return helpers.error('any.custom', {
          message: 'Provide a phone number or email address',
        });
      }
      return {
        ...rest,
        phone: normalisedPhone,
        email:
          normalisedEmail ||
          (normalisedPhone ? `lead+${normalisedPhone}@happyfeet.in` : 'enquiry@happyfeet.in'),
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
