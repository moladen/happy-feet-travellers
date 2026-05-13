export const navigationItems = [
  {
    href: "/",
    label: "Dashboard",
    caption: "Overview & operations",
    icon: "dashboard",
  },
  {
    href: "/tours",
    label: "Tours",
    caption: "Upcoming & customised",
    icon: "tours",
  },
  {
    href: "/departures",
    label: "Departures",
    caption: "Month-wise schedules",
    icon: "calendar",
  },
  {
    href: "/blogs",
    label: "Blogs",
    caption: "Travel content CMS",
    icon: "blogs",
  },
  {
    href: "/testimonials",
    label: "Testimonials",
    caption: "Guest trust signals",
    icon: "star",
  },
  {
    href: "/gallery",
    label: "Gallery",
    caption: "Trip photo library",
    icon: "gallery",
  },
  {
    href: "/enquiries",
    label: "Enquiries",
    caption: "Lead pipeline",
    icon: "enquiries",
  },
  {
    href: "/settings",
    label: "Settings",
    caption: "Website contact data",
    icon: "settings",
  },
];

export const tourCategoryOptions = [
  { value: "upcoming", label: "Upcoming Group Trip" },
  { value: "customized", label: "Customized Tour" },
];

export const enquiryStatusOptions = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "closed", label: "Closed" },
];

export const dashboardQuickActions = [
  { href: "/tours/new", label: "Add tour" },
  { href: "/blogs/new", label: "Publish blog" },
  { href: "/gallery", label: "Upload gallery" },
  { href: "/settings", label: "Update settings" },
];

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
  startDate: "",
  endDate: "",
  dateLabel: "",
  urgency: "",
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

export function buildTourPayload(form) {
  const resolvedPrice = Number(form.startingPrice || form.price || 0);
  return {
    title: form.title.trim(),
    slug: generateSlug(form.slug || form.title),
    description: form.description.trim(),
    category: String(form.category ?? '')
      .trim()
      .toLowerCase() || 'upcoming',
    subCategory: form.subCategory.trim(),
    duration: Number(form.duration || 1),
    durationLabel: form.durationLabel.trim(),
    price: resolvedPrice,
    startingPrice: resolvedPrice,
    departureCity: form.departureCity.trim(),
    startDate: form.startDate || null,
    endDate: form.endDate || null,
    dateLabel: form.dateLabel.trim(),
    urgency: form.urgency.trim(),
    offers: form.offers.trim(),
    meals: form.meals.trim(),
    stayType: form.stayType.trim(),
    transport: form.transport.trim(),
    suitableFor: form.suitableFor.trim(),
    coverImage: form.coverImage || null,
    images: (Array.isArray(form.images) ? form.images : []).filter(Boolean),
    highlights: splitLines(form.highlightsText),
    inclusions: splitLines(form.inclusionsText),
    exclusions: splitLines(form.exclusionsText),
    thingsToCarry: splitLines(form.thingsToCarryText),
    cancellationPolicy: form.cancellationPolicy.trim(),
    terms: splitLines(form.termsText),
    bankDetails: form.bankDetails.trim(),
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
    price: String(record.price || record.startingPrice || ""),
    startingPrice: String(record.startingPrice || record.price || ""),
    startDate: record.startDate ? String(record.startDate).slice(0, 10) : "",
    endDate: record.endDate ? String(record.endDate).slice(0, 10) : "",
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

export function buildBlogPayload(form) {
  return {
    title: form.title.trim(),
    slug: generateSlug(form.slug || form.title),
    excerpt: form.excerpt.trim(),
    category: form.category.trim(),
    coverImage: form.coverImage || null,
    authorName: form.authorName.trim(),
    publishedAt: form.publishDate || null,
    content: form.content || "<p></p>",
    seoTitle: form.seoTitle.trim(),
    seoDescription: form.seoDescription.trim(),
  };
}

export function createBlogForm(record) {
  if (!record) return { ...emptyBlogForm };
  return {
    ...emptyBlogForm,
    ...record,
    slug: record.slug || generateSlug(record.title),
    publishDate: record.publishedAt ? String(record.publishedAt).slice(0, 10) : "",
    content:
      typeof record.content === "string"
        ? record.content
        : Array.isArray(record.content)
          ? record.content.map((item) => `<p>${item}</p>`).join("")
          : "<p>Start writing your travel story here...</p>",
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

export function normaliseSettings(payload) {
  return {
    ...emptySettings,
    ...(payload || {}),
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
