import { parsePriceInput, resolveTourPriceAmount } from '@/lib/tourPrice';

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
    caption: "Homepage banner slides",
    icon: "hero",
  },
  {
    href: "/admin/team",
    label: "Team Management",
    caption: "About us · introductions",
    icon: "team",
  },
  {
    href: "/admin/enquiries",
    label: "Enquiries",
    caption: "Lead pipeline",
    icon: "enquiries",
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
    caption: "Website contact data",
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
  itinerary: [{ day: "Day 1", title: "", details: "" }],
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
  content: "<p>Start writing your travel story here...</p>",
  topicKeysText: "",
  relatedTourSlugsText: "",
  landingPageSlug: "",
  seoTitle: "",
  seoDescription: "",
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
  email: "",
  instagramUrl: "",
  facebookUrl: "",
  youtubeUrl: "",
  officeAddress: "",
  paymentLink: "",
  footerTagline: "",
  footerDetails: "",
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
    topicKeys: splitLines(form.topicKeysText),
    relatedBlogSlugs: splitLines(form.relatedBlogSlugsText),
    landingPageSlug: (form.landingPageSlug || "").trim() || null,
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

const BLOG_CONTENT_FALLBACK = "<p>Start writing your travel story here...</p>";

/** API requires non-empty cover URL and content (min ~20 chars after HTML). */
export function normalizeBlogContentForForm(content) {
  if (typeof content === "string" && content.trim()) return content;
  if (Array.isArray(content) && content.length) {
    return content
      .filter(Boolean)
      .map((item) => `<p>${String(item).replace(/</g, "&lt;")}</p>`)
      .join("");
  }
  if (content && typeof content === "object") {
    try {
      return `<pre>${JSON.stringify(content, null, 2)}</pre>`;
    } catch {
      return BLOG_CONTENT_FALLBACK;
    }
  }
  return BLOG_CONTENT_FALLBACK;
}

export function normalizeBlogContentForApi(content) {
  const html = normalizeBlogContentForForm(content);
  const plain = html.replace(/<[^>]+>/g, "").trim();
  if (plain.length >= 3) return html;
  return BLOG_CONTENT_FALLBACK;
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
    content: normalizeBlogContentForApi(form.content),
    seoTitle: (form.seoTitle || "").trim(),
    seoDescription: (form.seoDescription || "").trim(),
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
    content: normalizeBlogContentForForm(record.content),
    topicKeysText: joinLines(record.topicKeys),
    relatedTourSlugsText: joinLines(record.relatedTourSlugs),
    landingPageSlug: record.landingPageSlug || "",
  };
}

export function buildTestimonialPayload(form) {
  return {
    name: form.name.trim(),
    city: form.city.trim(),
    image: form.image || null,
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
    out[key] = value == null ? "" : String(value);
  }
  return out;
}

/** Strip read-only API fields before PUT /settings. */
export function buildSettingsPayload(form) {
  const normalised = normaliseSettings(form);
  return {
    whatsappNumber: normalised.whatsappNumber.trim(),
    email: normalised.email.trim(),
    instagramUrl: normalised.instagramUrl.trim(),
    facebookUrl: normalised.facebookUrl.trim(),
    youtubeUrl: normalised.youtubeUrl.trim(),
    officeAddress: normalised.officeAddress.trim(),
    paymentLink: normalised.paymentLink.trim(),
    footerTagline: normalised.footerTagline.trim(),
    footerDetails: normalised.footerDetails.trim(),
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
