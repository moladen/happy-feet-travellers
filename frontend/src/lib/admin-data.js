import { parsePriceInput, resolveTourPriceAmount } from '@/lib/tourPrice';
import {
  buildFullMoonCalendarEntries,
  FULL_MOON_SECTION,
  RANN_PLANNING_GUIDE,
  RANN_SLUG,
} from '@/lib/rannSeasonContent';
import {
  blogBlocksHaveMinContent,
  deserializeBlogContent,
  serializeBlogBlocks,
} from '@/lib/blogContent';

export { parsePriceInput, resolveTourPriceAmount };

export const navigationItems = [
  {
    href: "/admin",
    label: "Dashboard",
    caption: "Overview & operations",
    icon: "dashboard",
  },
  {
    href: "/admin/tours",
    label: "Tours",
    caption: "Upcoming & customised",
    icon: "tours",
  },
  {
    href: "/admin/departures",
    label: "Departures",
    caption: "Month-wise schedules",
    icon: "calendar",
  },
  {
    href: "/admin/blogs",
    label: "Blogs",
    caption: "Travel content CMS",
    icon: "blogs",
  },
  {
    href: "/admin/landing-pages",
    label: "Landing Pages",
    caption: "Campaign & seasonal pages",
    icon: "landing",
  },
  {
    href: "/admin/testimonials",
    label: "Testimonials",
    caption: "Guest trust signals",
    icon: "star",
  },
  {
    href: "/admin/gallery",
    label: "Gallery",
    caption: "Trip photo library",
    icon: "gallery",
  },
  {
    href: "/admin/hero",
    label: "Hero Section",
    caption: "Homepage banner & trust band",
    icon: "hero",
  },
  {
    href: "/admin/season-highlight",
    label: "Season Highlight",
    caption: "Featured campaign card",
    icon: "landing",
  },
  {
    href: "/admin/about",
    label: "About Us",
    caption: "Company story & page copy",
    icon: "team",
  },
  {
    href: "/admin/enquiries",
    label: "Enquiries",
    caption: "Lead pipeline",
    icon: "enquiries",
  },
  {
    href: "/admin/payment",
    label: "Payment",
    caption: "UPI QR & bank details",
    icon: "settings",
  },
  {
    href: "/admin/subscribers",
    label: "Subscribers",
    caption: "Newsletter sign-ups",
    icon: "blogs",
  },
  {
    href: "/admin/settings",
    label: "Settings",
    caption: "Contact, footer & policies",
    icon: "settings",
  },
];

export const tourCategoryOptions = [
  { value: "upcoming", label: "Upcoming Group Trip" },
  { value: "customized", label: "Customized Tour" },
];

export const packageCategoryOptions = [
  { value: "", label: "— Select experience —" },
  { value: "Honeymoon", label: "Honeymoon" },
  { value: "Adventure", label: "Adventure" },
  { value: "Spiritual", label: "Spiritual" },
  { value: "Family", label: "Family" },
  { value: "Wildlife", label: "Wildlife" },
  { value: "Road Trips", label: "Road Trips" },
  { value: "Mountains", label: "Mountains" },
  { value: "Beaches", label: "Beaches" },
];

export const enquiryStatusOptions = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "closed", label: "Closed" },
];

export const dashboardQuickActions = [
  { href: "/admin/tours/new?type=upcoming", label: "Add upcoming departure" },
  { href: "/admin/tours/new?type=customized", label: "Add personalized tour" },
  { href: "/admin/blogs/new", label: "Publish blog" },
  { href: "/admin/hero", label: "Hero banners" },
  { href: "/admin/gallery", label: "Upload gallery" },
  { href: "/admin/settings", label: "Update settings" },
];

export const emptyHeroSlideForm = {
  altText: "",
  tag: "",
  emoji: "✨",
  sortOrder: "",
  active: true,
  imageFile: null,
  previewUrl: "",
};

export const emptyTeamMemberForm = {
  fullName: "",
  role: "",
  bio: "",
  instagramUrl: "",
  linkedinUrl: "",
  sortOrder: "",
  active: true,
  imageFile: null,
  previewUrl: "",
};

export const emptyTourForm = {
  title: "",
  slug: "",
  description: "",
  category: "upcoming",
  subCategory: "group",
  duration: "5",
  durationLabel: "",
  price: "",
  startingPrice: "",
  departureCity: "Pune",
  destination: "",
  state: "",
  packageCategory: "",
  tagsText: "",
  topicKeysText: "",
  relatedBlogSlugsText: "",
  landingPageSlug: "",
  groupSize: "12–18 travellers only",
  status: "active",
  featured: false,
  seriesSlug: "",
  seoTitle: "",
  seoDescription: "",
  ctaPrimaryLabel: "Explore journey",
  ctaPrimaryHref: "/contact",
  ctaSecondaryLabel: "",
  ctaSecondaryHref: "",
  ctaHeadline: "",
  startDate: "",
  endDate: "",
  dateLabel: "",
  urgency: "",
  bookingDeposit: "",
  offers: "",
  meals: "",
  stayType: "",
  transport: "",
  suitableFor: "",
  coverImage: "",
  images: [],
  highlightsText: "",
  inclusionsText: "",
  exclusionsText: "",
  thingsToCarryText: "",
  cancellationPolicy: "",
  termsText: "",
  bankDetails: "",
  itinerary: [
    {
      day: "Day 1",
      title: "Explore the Historic Wonders of Hampi",
      details:
        "- Arrive at Hosapete railway station\n- Transfer to Hampi with photo stops\n- Check in and freshen up\n- Lunch at a local restaurant\n- Visit Virupaksha Temple and Hampi Bazaar\n- Sunset at Hemakuta Hill",
    },
    {
      day: "Day 2",
      title: "Temples & Return",
      details:
        "- Breakfast at the hotel\n- Vittala Temple and Stone Chariot\n- Lotus Mahal and Elephant Stables\n- Return transfer to Hosapete for onward journey",
    },
  ],
  faqs: [{ question: "", answer: "" }],
  pickupPoints: [{ name: "", detail: "" }],
  supplements: [{ name: "", price: "", note: "" }],
};

export const emptyBlogForm = {
  title: "",
  slug: "",
  excerpt: "",
  category: "Travel guide",
  coverImage: "",
  authorName: "Happy Feet Team",
  publishDate: "",
  contentBlocks: [
    {
      type: "paragraph",
      text:
        "<h2>Start with a clear heading</h2>" +
        "<p>Hook the reader — <strong>where you went</strong>, why it matters, and what they will learn. Use <em>italic</em> for emphasis.</p>" +
        "<p><span style=\"color: #1f4e79\">Brand-colored highlights</span> and <span style=\"color: #E76F51\">accent text</span> draw the eye.</p>",
    },
    {
      type: "image",
      url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
      caption: "Caption under the photo — optional but recommended",
    },
    {
      type: "paragraph",
      text:
        "<h3>Sub-heading for the next section</h3>" +
        "<p>Continue your story here. Add another <strong>photo block</strong> below if you want a paragraph → photo → paragraph rhythm.</p>",
    },
  ],
  topicKeysText: "spiti-valley, sikkim",
  relatedTourSlugsText: "spiti-valley-group-expedition-jun-2026",
  relatedPackageSlugsText: "",
  landingPageSlug: "",
  seoTitle: "Example SEO title for search results",
  seoDescription: "Short meta description shown in Google — 150–160 characters works well.",
};

export const emptyTestimonialForm = {
  name: "",
  city: "Pune",
  image: "",
  review: "",
  rating: "5",
};

export const emptyGalleryForm = {
  title: "",
  altText: "",
  category: "",
  image: "",
};

export const emptySettings = {
  whatsappNumber: "",
  secondaryPhoneNumber: "",
  email: "",
  instagramUrl: "",
  facebookUrl: "",
  youtubeUrl: "",
  officeAddress: "",
  paymentLink: "",
  footerTagline: "",
  footerDetails: "",
  termsContent: "",
  privacyContent: "",
  cancellationPolicyContent: "",
  policiesLastUpdated: "",
  heroCommunityQuote: "",
  heroCommunityBannerUrl: "",
  heroCommunityAvatars: [],
  seasonPromoActive: true,
  seasonPromoBadge: "",
  seasonPromoEyebrow: "",
  seasonPromoTitle: "",
  seasonPromoSubtitle: "",
  seasonPromoDescription: "",
  seasonPromoImageUrl: "",
  seasonPromoTags: [],
  seasonPromoPrimaryCtaLabel: "",
  seasonPromoPrimaryCtaHref: "",
  seasonPromoSecondaryCtaLabel: "",
  seasonPromoSecondaryCtaHref: "",
};

export function generateSlug(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function formatCurrency(value) {
  const amount = Number(value || 0);
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatDate(value) {
  if (!value) return "TBD";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "TBD";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(value) {
  if (!value) return "TBD";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "TBD";
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatMonth(value) {
  if (!value) return "Flexible dates";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Flexible dates";
  return date.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

export function splitLines(value) {
  return String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

/** Splits comma, semicolon, or newline separated admin list fields. */
export function splitListInput(value) {
  return String(value || "")
    .split(/[\n,;]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function stripSlugPath(raw) {
  let slug = String(raw || "").trim();
  slug = slug.replace(/^https?:\/\/[^/]+/i, "");
  slug = slug.replace(/^\/blog\//i, "").replace(/^\/tour\//i, "").replace(/^\//, "");
  return slug.split("?")[0].split("#")[0].trim();
}

export function normalizeSlugList(value) {
  return [...new Set(splitListInput(value).map(stripSlugPath).filter(Boolean))];
}

export function normalizeSingleSlug(value) {
  const [slug] = normalizeSlugList(value);
  return slug || null;
}

function joinLines(list) {
  return Array.isArray(list) ? list.filter(Boolean).join("\n") : "";
}

function cleanObjectList(list) {
  return (Array.isArray(list) ? list : [])
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const next = Object.fromEntries(
        Object.entries(item).map(([key, value]) => [key, typeof value === "string" ? value.trim() : value])
      );
      return Object.values(next).some(Boolean) ? next : null;
    })
    .filter(Boolean);
}

function tourWouldBeVisibleOnSite(form) {
  const hasStart = Boolean(String(form.startDate || "").trim());
  const hasLabel = Boolean(String(form.dateLabel || "").trim());
  if (!hasStart && !hasLabel) return false;

  if (hasStart) {
    const start = new Date(`${form.startDate}T12:00:00`);
    if (Number.isNaN(start.getTime())) return hasLabel;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endRaw = String(form.endDate || "").trim();
    const compare = endRaw ? new Date(`${endRaw}T12:00:00`) : start;
    return compare >= today;
  }

  return hasLabel;
}

/**
 * Client-side checks before saving an upcoming departure.
 * @returns {string|null} Error message or null if OK
 */
export function validateUpcomingDepartureForSite(form) {
  const status = String(form.status || "active").toLowerCase();
  const hasStart = Boolean(String(form.startDate || "").trim());
  const hasLabel = Boolean(String(form.dateLabel || "").trim());

  if (status === "draft") {
    return null;
  }

  if (!hasStart && !hasLabel) {
    return "Add a Start date or Date label (Dates & pricing step). Without dates, the departure will not appear on the website.";
  }

  if (status === "active" && hasStart && !tourWouldBeVisibleOnSite(form)) {
    return "These dates are in the past — the trip will be hidden. Pick a future start/end date, or save as Archived.";
  }

  return null;
}

/**
 * Normalise admin form → API payload for upcoming departures (category + publish status).
 */
/**
 * Client-side checks before saving a personalized / customized tour.
 * @returns {string|null}
 */
export function validatePersonalizedTripForSite(form) {
  const status = String(form.status || "active").toLowerCase();
  if (status === "draft") return null;

  if (!String(form.description || "").trim()) {
    return "Add a description (Trip content step) — it powers emotional copy on the website.";
  }

  if (!String(form.coverImage || "").trim() && !(form.images || []).length) {
    return "Add a cover image (Media step) so the tour appears with cinematic visuals on the site.";
  }

  return null;
}

/**
 * Normalise admin form → API payload for personalized tours (category + status).
 */
export function preparePersonalizedTripPayload(form) {
  const payload = buildTourPayload(form);
  payload.category = "customized";

  const status = String(form.status || "active").toLowerCase();
  if (status === "draft") {
    payload.status = "draft";
  } else if (status === "archived") {
    payload.status = "archived";
  } else {
    payload.status = "active";
  }

  return payload;
}

export function prepareTourPayloadForAdmin(form) {
  const cat = String(form.category || "").toLowerCase();
  if (cat === "upcoming") return prepareUpcomingDeparturePayload(form);
  if (cat === "customized") return preparePersonalizedTripPayload(form);
  return buildTourPayload(form);
}

export function validateTourForAdminSite(form) {
  const cat = String(form.category || "").toLowerCase();
  if (cat === "upcoming") return validateUpcomingDepartureForSite(form);
  if (cat === "customized") return validatePersonalizedTripForSite(form);
  return null;
}

export function prepareUpcomingDeparturePayload(form) {
  const payload = buildTourPayload(form);
  payload.category = "upcoming";

  const status = String(form.status || "active").toLowerCase();
  if (status === "draft") {
    payload.status = "draft";
    return payload;
  }

  if (tourWouldBeVisibleOnSite(form)) {
    payload.status = "active";
  } else if (status === "archived") {
    payload.status = "archived";
  }

  return payload;
}

export function buildTourPayload(form) {
  const resolvedPrice = resolveTourPriceAmount(form.startingPrice, form.price);
  return {
    title: (form.title ?? "").trim(),
    slug: generateSlug(form.slug || form.title),
    description: (form.description ?? "").trim(),
    category: String(form.category ?? '')
      .trim()
      .toLowerCase() || 'upcoming',
    subCategory: (form.subCategory ?? "").trim(),
    duration: Number(form.duration || 1),
    durationLabel: (form.durationLabel ?? "").trim(),
    price: resolvedPrice,
    startingPrice: resolvedPrice,
    departureCity: (form.departureCity ?? "").trim(),
    destination: (form.destination || "").trim() || null,
    state: (form.state || "").trim() || null,
    packageCategory: (form.packageCategory || "").trim() || null,
    seoTitle: (form.seoTitle || "").trim() || null,
    seoDescription: (form.seoDescription || "").trim() || null,
    ctaData: (() => {
      const primaryLabel = (form.ctaPrimaryLabel || "").trim();
      const primaryHref = (form.ctaPrimaryHref || "").trim();
      if (!primaryLabel && !primaryHref) return null;
      return {
        primaryLabel: primaryLabel || "Explore journey",
        primaryHref: primaryHref || "/contact",
        secondaryLabel: (form.ctaSecondaryLabel || "").trim() || null,
        secondaryHref: (form.ctaSecondaryHref || "").trim() || null,
        headline: (form.ctaHeadline || "").trim() || null,
      };
    })(),
    tags: splitLines(form.tagsText),
    topicKeys: splitListInput(form.topicKeysText),
    relatedBlogSlugs: normalizeSlugList(form.relatedBlogSlugsText),
    landingPageSlug: normalizeSingleSlug(form.landingPageSlug),
    groupSize: (form.groupSize || "").trim() || null,
    status: (form.status || "active").trim().toLowerCase(),
    featured: Boolean(form.featured),
    seriesSlug: generateSlug(form.seriesSlug || ""),
    startDate: String(form.startDate || "").trim() || null,
    endDate: String(form.endDate || "").trim() || null,
    dateLabel: String(form.dateLabel || "").trim() || null,
    urgency: (form.urgency ?? "").trim(),
    bookingDeposit: (() => {
      const amount = Number(String(form.bookingDeposit || "").replace(/,/g, ""));
      return Number.isFinite(amount) && amount > 0 ? Math.round(amount) : null;
    })(),
    offers: (form.offers ?? "").trim(),
    meals: (form.meals ?? "").trim(),
    stayType: (form.stayType ?? "").trim(),
    transport: (form.transport ?? "").trim(),
    suitableFor: (form.suitableFor ?? "").trim(),
    coverImage: form.coverImage || null,
    images: (Array.isArray(form.images) ? form.images : []).filter(Boolean),
    highlights: splitLines(form.highlightsText),
    inclusions: splitLines(form.inclusionsText),
    exclusions: splitLines(form.exclusionsText),
    thingsToCarry: splitLines(form.thingsToCarryText),
    cancellationPolicy: (form.cancellationPolicy ?? "").trim(),
    terms: splitLines(form.termsText),
    bankDetails: (form.bankDetails ?? "").trim(),
    itinerary: cleanObjectList(form.itinerary),
    faqs: cleanObjectList(form.faqs),
    pickupPoints: cleanObjectList(form.pickupPoints),
    supplements: cleanObjectList(form.supplements),
  };
}

export function createTourForm(record) {
  if (!record) return { ...emptyTourForm };
  return {
    ...emptyTourForm,
    ...record,
    category: String(record.category || emptyTourForm.category).toLowerCase(),
    slug: record.slug || generateSlug(record.title),
    duration: String(record.duration || emptyTourForm.duration),
    ...(() => {
      const amount = resolveTourPriceAmount(record.startingPrice, record.price);
      const priceStr = amount > 0 ? String(amount) : "";
      return { price: priceStr, startingPrice: priceStr };
    })(),
    startDate: record.startDate ? String(record.startDate).slice(0, 10) : "",
    endDate: record.endDate ? String(record.endDate).slice(0, 10) : "",
    tagsText: joinLines(record.tags),
    topicKeysText: joinLines(record.topicKeys),
    relatedBlogSlugsText: joinLines(record.relatedBlogSlugs),
    landingPageSlug: record.landingPageSlug || "",
    featured: Boolean(record.featured),
    status: record.status || "active",
    destination: record.destination || "",
    state: record.state || "",
    packageCategory: record.packageCategory || record.experienceCategory || "",
    seoTitle: record.seoTitle || "",
    seoDescription: record.seoDescription || "",
    ctaPrimaryLabel: record.ctaData?.primaryLabel || "",
    ctaPrimaryHref: record.ctaData?.primaryHref || "",
    ctaSecondaryLabel: record.ctaData?.secondaryLabel || "",
    ctaSecondaryHref: record.ctaData?.secondaryHref || "",
    ctaHeadline: record.ctaData?.headline || "",
    groupSize: record.groupSize || "",
    seriesSlug: record.seriesSlug || "",
    bookingDeposit:
      record.bookingDeposit != null && Number(record.bookingDeposit) > 0
        ? String(record.bookingDeposit)
        : "",
    coverImage: record.coverImage || record.image || "",
    images: Array.isArray(record.images)
      ? record.images
      : Array.isArray(record.gallery)
        ? record.gallery
        : [],
    highlightsText: joinLines(record.highlights),
    inclusionsText: joinLines(record.inclusions),
    exclusionsText: joinLines(record.exclusions),
    thingsToCarryText: joinLines(record.thingsToCarry),
    termsText: joinLines(Array.isArray(record.terms) ? record.terms : []),
    itinerary: Array.isArray(record.itinerary) && record.itinerary.length
      ? record.itinerary
      : emptyTourForm.itinerary,
    faqs: Array.isArray(record.faqs) && record.faqs.length ? record.faqs : emptyTourForm.faqs,
    pickupPoints: Array.isArray(record.pickupPoints) && record.pickupPoints.length
      ? record.pickupPoints
      : emptyTourForm.pickupPoints,
    supplements: Array.isArray(record.supplements) && record.supplements.length
      ? record.supplements
      : emptyTourForm.supplements,
  };
}

/** API requires non-empty cover URL and content (min ~20 chars). */
export function normalizeBlogContentForApi(contentBlocks) {
  const blocks = Array.isArray(contentBlocks) ? contentBlocks : deserializeBlogContent(contentBlocks);
  if (!blogBlocksHaveMinContent(blocks)) {
    return serializeBlogBlocks([{ type: "paragraph", text: "Travel story coming soon." }]);
  }
  return serializeBlogBlocks(blocks);
}

export function buildBlogPayload(form) {
  const coverImage = String(form.coverImage || "").trim();
  const payload = {
    title: form.title.trim(),
    slug: generateSlug(form.slug || form.title),
    excerpt: (form.excerpt || "").trim(),
    category: (form.category || "").trim(),
    coverImage,
    authorName: form.authorName.trim(),
    content: normalizeBlogContentForApi(form.contentBlocks),
    seoTitle: (form.seoTitle || "").trim(),
    seoDescription: (form.seoDescription || "").trim(),
    topicKeys: splitListInput(form.topicKeysText),
    relatedTourSlugs: normalizeSlugList(form.relatedTourSlugsText),
    relatedPackageSlugs: normalizeSlugList(form.relatedPackageSlugsText),
    landingPageSlug: normalizeSingleSlug(form.landingPageSlug),
  };
  if (form.publishDate) {
    payload.publishedAt = form.publishDate;
  }
  return payload;
}

export function createBlogForm(record) {
  if (!record) return { ...emptyBlogForm };
  return {
    ...emptyBlogForm,
    ...record,
    slug: record.slug || generateSlug(record.title),
    publishDate: record.publishedAt ? String(record.publishedAt).slice(0, 10) : "",
    coverImage: record.coverImage || record.image || "",
    contentBlocks: deserializeBlogContent(record.content),
    topicKeysText: joinLines(record.topicKeys),
    relatedTourSlugsText: joinLines(record.relatedTourSlugs),
    relatedPackageSlugsText: joinLines(record.relatedPackageSlugs),
    landingPageSlug: record.landingPageSlug || "",
  };
}

export function buildTestimonialPayload(form) {
  const image = String(form.image || '').trim();
  return {
    name: form.name.trim(),
    city: form.city.trim(),
    image: image && !image.startsWith('blob:') ? image : null,
    review: form.review.trim(),
    rating: Number(form.rating || 5),
  };
}

export function buildGalleryPayload(form) {
  return {
    title: form.title.trim(),
    altText: form.altText.trim() || form.title.trim(),
    category: form.category.trim(),
    image: form.image || null,
  };
}

/** Form state: always strings (never null) so controlled inputs stay valid. */
export function normaliseSettings(payload) {
  const out = { ...emptySettings };
  if (!payload || typeof payload !== "object") return out;
  for (const key of Object.keys(emptySettings)) {
    const value = payload[key];
    if (key === "heroCommunityAvatars" || key === "seasonPromoTags") {
      out[key] = Array.isArray(value)
        ? value.map((item) => String(item || "").trim()).filter(Boolean)
        : [];
      continue;
    }
    if (key === "seasonPromoActive") {
      out[key] = value === true || value === "true" || value === 1 || value === "1";
      continue;
    }
    out[key] = value == null ? "" : String(value);
  }
  return out;
}

/** Strip read-only API fields before PUT /settings. */
export function buildSettingsPayload(form) {
  const normalised = normaliseSettings(form);
  return {
    whatsappNumber: normalised.whatsappNumber.trim(),
    secondaryPhoneNumber: normalised.secondaryPhoneNumber.trim(),
    email: normalised.email.trim(),
    instagramUrl: normalised.instagramUrl.trim(),
    facebookUrl: normalised.facebookUrl.trim(),
    youtubeUrl: normalised.youtubeUrl.trim(),
    officeAddress: normalised.officeAddress.trim(),
    paymentLink: normalised.paymentLink.trim(),
    footerTagline: normalised.footerTagline.trim(),
    footerDetails: normalised.footerDetails.trim(),
    termsContent: normalised.termsContent.trim(),
    privacyContent: normalised.privacyContent.trim(),
    cancellationPolicyContent: normalised.cancellationPolicyContent.trim(),
    policiesLastUpdated: normalised.policiesLastUpdated.trim(),
    heroCommunityQuote: normalised.heroCommunityQuote.trim(),
    heroCommunityBannerUrl: normalised.heroCommunityBannerUrl.trim(),
    heroCommunityAvatars: normalised.heroCommunityAvatars,
    seasonPromoActive: Boolean(normalised.seasonPromoActive),
    seasonPromoBadge: normalised.seasonPromoBadge.trim(),
    seasonPromoEyebrow: normalised.seasonPromoEyebrow.trim(),
    seasonPromoTitle: normalised.seasonPromoTitle.trim(),
    seasonPromoSubtitle: normalised.seasonPromoSubtitle.trim(),
    seasonPromoDescription: normalised.seasonPromoDescription.trim(),
    seasonPromoImageUrl: normalised.seasonPromoImageUrl.trim(),
    seasonPromoTags: normalised.seasonPromoTags,
    seasonPromoPrimaryCtaLabel: normalised.seasonPromoPrimaryCtaLabel.trim(),
    seasonPromoPrimaryCtaHref: normalised.seasonPromoPrimaryCtaHref.trim(),
    seasonPromoSecondaryCtaLabel: normalised.seasonPromoSecondaryCtaLabel.trim(),
    seasonPromoSecondaryCtaHref: normalised.seasonPromoSecondaryCtaHref.trim(),
    ...(form.aboutPageContent !== undefined && form.aboutPageContent !== null
      ? { aboutPageContent: form.aboutPageContent }
      : {}),
    ...(form.paymentPageContent !== undefined && form.paymentPageContent !== null
      ? { paymentPageContent: form.paymentPageContent }
      : {}),
  };
}

export function groupDeparturesByMonth(tours) {
  return (Array.isArray(tours) ? tours : []).reduce((groups, tour) => {
    const key = formatMonth(tour.startDate);
    if (!groups[key]) groups[key] = [];
    groups[key].push(tour);
    return groups;
  }, {});
}

export const landingStatusOptions = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
];

export const emptyLandingPackage = {
  slug: "",
  name: "",
  emoji: "🏜️",
  featuredImage: "",
  shortDescription: "",
  startingPrice: "",
  duration: "",
  highlightsText: "",
  audienceBadge: "",
  topicKeysText: "",
  relatedBlogSlugsText: "",
  active: true,
};

export const emptyLandingGallerySlide = {
  image: "",
  caption: "",
  type: "destination",
};

export const emptyLandingWhyVisit = {
  title: "",
  description: "",
  image: "",
};

export const emptyLandingFaq = {
  category: "travel",
  question: "",
  answer: "",
};

export const emptyLandingTestimonial = {
  name: "",
  city: "",
  image: "",
  review: "",
  rating: "5",
  active: true,
};

export const emptyLandingFullMoon = {
  batch: "",
  date: "",
  price: "",
  highlight: "",
};

export const emptyLandingForm = {
  title: "",
  slug: "",
  status: "draft",
  heroHeading: "",
  heroSubheading: "",
  heroBannerImage: "",
  seasonDates: "",
  heroSocialProofText: "",
  introTitle: "",
  introParagraphsText: "",
  introSummaryText: "",
  bestTimeSeason: "",
  bestTimePointsText: "",
  ctaButtonText: "",
  ctaButtonLink: "",
  whatsappCtaLink: "",
  whatsappGroupLink: "",
  whatsappGroupEnabled: true,
  seoTitle: "",
  seoDescription: "",
  ogImage: "",
  _customBlocks: {},
  _packages: [],
  _gallerySlides: [],
  _whyVisit: [],
  _fullMoonCalendar: [],
  fullMoonEnabled: true,
  fullMoonEyebrow: "",
  fullMoonTitle: "",
  fullMoonLede: "",
  fullMoonBackgroundImage: "",
  fullMoonBadgeLabel: "",
  _faqs: [],
  _testimonials: [],
  planningGuideEnabled: true,
  planningGuideEyebrow: "",
  planningGuideTitle: "",
  planningGuideLede: "",
  planningGuideHighlightsText: "",
  planningGuidePdfUrl: "",
  planningGuidePdfFileName: "",
  planningGuideFormTitle: "",
  planningGuideFormLede: "",
  planningGuideSubmitLabel: "",
  planningGuideSuccessLede: "",
  planningGuideDisclaimer: "",
};

function mapPlanningGuideForForm(guide, slug) {
  const defaults = slug === RANN_SLUG ? RANN_PLANNING_GUIDE : {};
  const g = guide && typeof guide === "object" ? guide : {};

  return {
    planningGuideEnabled: g.enabled !== false,
    planningGuideEyebrow: g.eyebrow || defaults.eyebrow || "",
    planningGuideTitle: g.title || defaults.title || "",
    planningGuideLede: g.lede || defaults.lede || "",
    planningGuideHighlightsText: joinLines(
      Array.isArray(g.highlights) && g.highlights.length ? g.highlights : defaults.highlights || []
    ),
    planningGuidePdfUrl: g.pdfUrl || defaults.pdfUrl || "",
    planningGuidePdfFileName: g.pdfFileName || defaults.pdfFileName || "",
    planningGuideFormTitle: g.formTitle || defaults.formTitle || "",
    planningGuideFormLede: g.formLede || defaults.formLede || "",
    planningGuideSubmitLabel: g.submitLabel || defaults.submitLabel || "",
    planningGuideSuccessLede: g.successLede || defaults.successLede || "",
    planningGuideDisclaimer: g.disclaimer || defaults.disclaimer || "",
  };
}

export const landingFaqCategoryOptions = [
  { value: "travel", label: "Travel" },
  { value: "package", label: "Package" },
  { value: "booking", label: "Booking" },
];

export const landingGalleryTypeOptions = [
  { value: "destination", label: "Destination" },
  { value: "memory", label: "Traveller memory" },
];

function mapLandingPackageForForm(pkg) {
  return {
    slug: pkg.slug || "",
    name: pkg.name || "",
    emoji: pkg.emoji || "🏜️",
    featuredImage: pkg.featuredImage || "",
    shortDescription: pkg.shortDescription || "",
    startingPrice: pkg.startingPrice || "",
    duration: pkg.duration || "",
    highlightsText: joinLines(pkg.highlights),
    audienceBadge: pkg.detailContent?.audienceBadge || pkg.audienceBadge || "",
    topicKeysText: joinLines(pkg.detailContent?.topicKeys),
    relatedBlogSlugsText: joinLines(pkg.detailContent?.relatedBlogSlugs),
    active: pkg.active !== false,
  };
}

export function createLandingForm(record) {
  if (!record) return { ...emptyLandingForm };
  const intro = record.introContent && typeof record.introContent === "object" ? record.introContent : {};
  const bestTime =
    record.bestTimeToVisit && typeof record.bestTimeToVisit === "object" ? record.bestTimeToVisit : {};
  const blocks = record.customBlocks && typeof record.customBlocks === "object" ? record.customBlocks : {};
  const socialProof = blocks.heroSocialProof || record.heroSocialProof || [];
  const gallery = blocks.gallery || record.gallery || [];

  return {
    ...emptyLandingForm,
    title: record.title || "",
    slug: record.slug || generateSlug(record.title),
    status: record.status || "draft",
    heroHeading: record.heroHeading || "",
    heroSubheading: record.heroSubheading || "",
    heroBannerImage: record.heroBannerImage || "",
    seasonDates: record.seasonDates || "",
    heroSocialProofText: joinLines(socialProof),
    introTitle: intro.title || "",
    introParagraphsText: joinLines(intro.paragraphs),
    introSummaryText: joinLines(intro.summary),
    bestTimeSeason: bestTime.season || "",
    bestTimePointsText: joinLines(bestTime.points || bestTime.highlights),
    ctaButtonText: record.ctaButtonText || "",
    ctaButtonLink: record.ctaButtonLink || "",
    whatsappCtaLink: record.whatsappCtaLink || "",
    whatsappGroupLink: record.whatsappGroupLink || "",
    whatsappGroupEnabled: record.whatsappGroupEnabled !== false,
    seoTitle: record.seoTitle || "",
    seoDescription: record.seoDescription || "",
    ogImage: record.ogImage || "",
    _customBlocks: blocks,
    _packages: Array.isArray(record.packages) ? record.packages.map(mapLandingPackageForForm) : [],
    _gallerySlides: Array.isArray(gallery) ? gallery.map((slide) => ({ ...emptyLandingGallerySlide, ...slide })) : [],
    _whyVisit: Array.isArray(record.whyVisit) ? record.whyVisit.map((item) => ({ ...emptyLandingWhyVisit, ...item })) : [],
    _fullMoonCalendar: (() => {
      const rows = Array.isArray(record.fullMoonCalendar) ? record.fullMoonCalendar : [];
      const useDefaults = record.slug === RANN_SLUG;
      return buildFullMoonCalendarEntries(rows.length ? rows : undefined, { useDefaults }).map((item) => ({
        batch: item.batch != null ? String(item.batch) : "",
        date: item.date || item.dates || "",
        price: item.price || "",
        highlight: item.highlight || item.label || "",
      }));
    })(),
    fullMoonEnabled: blocks.fullMoonSection?.enabled !== false,
    fullMoonEyebrow: blocks.fullMoonSection?.eyebrow || FULL_MOON_SECTION.eyebrow || "",
    fullMoonTitle: blocks.fullMoonSection?.title || FULL_MOON_SECTION.title || "",
    fullMoonLede: blocks.fullMoonSection?.lede || FULL_MOON_SECTION.lede || "",
    fullMoonBackgroundImage: blocks.fullMoonSection?.backgroundImage || FULL_MOON_SECTION.backgroundImage || "",
    fullMoonBadgeLabel: blocks.fullMoonSection?.badgeLabel || FULL_MOON_SECTION.badgeLabel || "",
    _faqs: Array.isArray(record.faqs)
      ? record.faqs.map((faq) => ({
          category: faq.category || "travel",
          question: faq.question || "",
          answer: faq.answer || "",
        }))
      : [],
    _testimonials: Array.isArray(record.testimonials)
      ? record.testimonials.map((item) => ({
          name: item.name || "",
          city: item.city || "",
          image: item.image || "",
          review: item.review || "",
          rating: String(item.rating || 5),
          active: item.active !== false,
        }))
      : [],
    ...mapPlanningGuideForForm(blocks.planningGuide, record.slug),
  };
}

export function buildLandingPayload(form) {
  const heroSocialProof = splitLines(form.heroSocialProofText);
  const customBlocks = { ...(form._customBlocks || {}) };
  if (heroSocialProof.length) customBlocks.heroSocialProof = heroSocialProof;
  if (Array.isArray(form._gallerySlides) && form._gallerySlides.length) {
    customBlocks.gallery = form._gallerySlides
      .filter((slide) => String(slide.image || "").trim())
      .map((slide) => ({
        image: String(slide.image || "").trim(),
        caption: String(slide.caption || "").trim(),
        type: slide.type === "memory" ? "memory" : "destination",
      }));
  }

  const planningHighlights = splitLines(form.planningGuideHighlightsText);
  customBlocks.fullMoonSection = {
    enabled: form.fullMoonEnabled !== false,
    eyebrow: (form.fullMoonEyebrow || "").trim() || null,
    title: (form.fullMoonTitle || "").trim() || null,
    lede: (form.fullMoonLede || "").trim() || null,
    backgroundImage: (form.fullMoonBackgroundImage || "").trim() || null,
    badgeLabel: (form.fullMoonBadgeLabel || "").trim() || null,
  };

  customBlocks.planningGuide = {
    enabled: form.planningGuideEnabled !== false,
    eyebrow: (form.planningGuideEyebrow || "").trim() || null,
    title: (form.planningGuideTitle || "").trim() || null,
    lede: (form.planningGuideLede || "").trim() || null,
    highlights: planningHighlights.length ? planningHighlights : null,
    pdfUrl:
      (form.planningGuidePdfUrl || "").trim() ||
      (form.planningGuideEnabled !== false ? RANN_PLANNING_GUIDE.pdfUrl : null),
    pdfFileName:
      (form.planningGuidePdfFileName || "").trim() ||
      (form.planningGuideEnabled !== false ? RANN_PLANNING_GUIDE.pdfFileName : null),
    formTitle: (form.planningGuideFormTitle || "").trim() || null,
    formLede: (form.planningGuideFormLede || "").trim() || null,
    submitLabel: (form.planningGuideSubmitLabel || "").trim() || null,
    successLede: (form.planningGuideSuccessLede || "").trim() || null,
    disclaimer: (form.planningGuideDisclaimer || "").trim() || null,
  };

  const payload = {
    title: (form.title || "").trim(),
    slug: generateSlug(form.slug || form.title),
    status: String(form.status || "draft").toLowerCase(),
    heroHeading: (form.heroHeading || "").trim() || null,
    heroSubheading: (form.heroSubheading || "").trim() || null,
    heroBannerImage: (form.heroBannerImage || "").trim() || null,
    seasonDates: (form.seasonDates || "").trim() || null,
    ctaButtonText: (form.ctaButtonText || "").trim() || null,
    ctaButtonLink: (form.ctaButtonLink || "").trim() || null,
    whatsappCtaLink: (form.whatsappCtaLink || "").trim() || null,
    whatsappGroupLink: (form.whatsappGroupLink || "").trim() || null,
    whatsappGroupEnabled: Boolean(form.whatsappGroupEnabled),
    introContent: {
      title: (form.introTitle || "").trim(),
      paragraphs: splitLines(form.introParagraphsText),
      summary: splitLines(form.introSummaryText),
    },
    bestTimeToVisit: {
      season: (form.bestTimeSeason || "").trim(),
      points: splitLines(form.bestTimePointsText),
    },
    whyVisit: (form._whyVisit || [])
      .filter((item) => String(item.title || "").trim())
      .map((item) => ({
        title: String(item.title || "").trim(),
        description: String(item.description || "").trim(),
        image: String(item.image || "").trim() || null,
      })),
    fullMoonCalendar: buildFullMoonCalendarEntries(form._fullMoonCalendar || []).map((item) => ({
      batch: item.batch,
      dates: item.dates,
      date: item.date,
      price: item.price,
      highlight: item.highlight,
    })),
    customBlocks: Object.keys(customBlocks).length ? customBlocks : null,
    seoTitle: (form.seoTitle || "").trim() || null,
    seoDescription: (form.seoDescription || "").trim() || null,
    ogImage: (form.ogImage || "").trim() || null,
  };

  if (Array.isArray(form._packages)) {
    payload.packages = form._packages
      .filter((pkg) => String(pkg.name || "").trim())
      .map((pkg, index) => {
        const audienceBadge = String(pkg.audienceBadge || "").trim();
        const topicKeys = splitLines(pkg.topicKeysText);
        const relatedBlogSlugs = normalizeSlugList(pkg.relatedBlogSlugsText);
        const detailContent = {};
        if (audienceBadge) detailContent.audienceBadge = audienceBadge;
        if (topicKeys.length) detailContent.topicKeys = topicKeys;
        if (relatedBlogSlugs.length) detailContent.relatedBlogSlugs = relatedBlogSlugs;
        return {
          slug: generateSlug(pkg.slug || pkg.name),
          name: String(pkg.name || "").trim(),
          emoji: String(pkg.emoji || "").trim() || null,
          featuredImage: String(pkg.featuredImage || "").trim() || null,
          shortDescription: String(pkg.shortDescription || "").trim() || null,
          startingPrice: String(pkg.startingPrice || "").trim() || null,
          duration: String(pkg.duration || "").trim() || null,
          highlights: splitLines(pkg.highlightsText),
          active: pkg.active !== false,
          sortOrder: index,
          detailContent: Object.keys(detailContent).length ? detailContent : null,
        };
      });
  }

  if (Array.isArray(form._faqs)) {
    payload.faqs = form._faqs
      .filter((faq) => String(faq.question || "").trim() && String(faq.answer || "").trim())
      .map((faq, index) => ({
        category: String(faq.category || "travel").toLowerCase(),
        question: String(faq.question || "").trim(),
        answer: String(faq.answer || "").trim(),
        sortOrder: index,
      }));
  }

  if (Array.isArray(form._testimonials)) {
    payload.testimonials = form._testimonials
      .filter((item) => String(item.name || "").trim() && String(item.review || "").trim())
      .map((item, index) => ({
        name: String(item.name || "").trim(),
        city: String(item.city || "").trim() || null,
        image: String(item.image || "").trim() || null,
        review: String(item.review || "").trim(),
        rating: Math.min(5, Math.max(1, parseInt(item.rating, 10) || 5)),
        active: item.active !== false,
        sortOrder: index,
      }));
  }

  return payload;
}
