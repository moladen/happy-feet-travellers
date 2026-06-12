/**
 * About Us page content — defaults from client write-up.
 * Admin can override via Settings → About Us (/admin/about).
 */

export const ABOUT_META = {
  title: 'About Us - Happy Feet Travellers',
  description:
    'Happy Feet Travellers offers curated group departures and personalized holidays across India and beyond — travel beyond destinations with a trusted Pune-based team.',
};

export const DEFAULT_ABOUT_CONTENT = {
  heroTitle: 'Travel Beyond Destinations',
  introParagraphs: [
    'At Happy Feet Travellers, we believe that travel is a lot more than just destinations. It\'s about creating memories, building friendships, unwinding life, and opening new horizons to your thought process limitations. Its also about experiences, the stories, and lifetime connections all along the way.',
    'Founded with a passion for exploration Happy Feet Travellers has grown into a trusted travel brand offering both expertly curated Group Departures and Personalized holidays.',
    'Whether you are looking to join a fun filled group adventure or planning a vacation with your friends or family, or partner, we are here to make your journey seamless, hassle free and memorable.',
    'From mountains of the Himalayas, to the deserts of Kutch, to the beaches that meet the Arabian sea, from cultural getaways to international vacations, we help Travellers discover the world in a way that suits their comforts.',
  ],
  mission:
    'To make travel accessible, memorable and hassle free by delivering thoughtfully designed experiences that inspires exploration and create lifelong happy memories. We strive to spread smiles and joy throughout the journey.',
  vision:
    "To become India's most trusted travel partner by building a community of passionate travelers and delivering exceptional travel experiences through innovation, personalization and genuine customer care.",
  whatWeDo: {
    groupDepartures:
      'Travel with likeminded explorers on our carefully and thoughtfully curated departures perfect for solo travelers, safe for women, couples, friends, and anyone looking to experience destinations with a vibrant travel community.',
    customizedHolidays:
      "Whether it's a honeymoon, anniversary, family vacation, friend's getaway, corporate retreat or a bucket list adventure, we design personalized itineraries tailored according to your preferences, and travel style.",
  },
  services: [
    'Domestic Tour Packages',
    'International Holidays',
    'Group Departures',
    'Customized FIT Packages',
    'Family Vacations',
    'Honeymoon Packages',
    'Weekend Getaways',
    'Corporate & Special Interest Groups',
    'Hotel Bookings',
    'Flight bookings',
    'Transportation & Sightseeing Arrangements',
    'Visa and Insurance',
  ],
  howWeWork: [
    {
      title: 'Understand your travel style',
      text: 'Every traveller is unique. We begin with understanding your interests, preferences, budget, and expectations.',
    },
    {
      title: 'Design meaningful experiences',
      text: 'Our team carefully plans itineraries that balance comfort, sightseeing, local experiences, and hidden gems, designed all around your travel styles.',
    },
    {
      title: 'Handle every detail',
      text: 'From transportation to accommodations to permit and on-ground support, we take care of all the logistics so you can travel stress-free.',
    },
    {
      title: 'Deliver reliable support',
      text: "Our relationship doesn't just end with bookings, we stay connected before, during, and after your trip to ensure a smooth travel experience.",
    },
  ],
  values: [
    {
      title: 'Expectational travel experiences',
      text: 'Every itinerary is designed to create moments worth remembering.',
    },
    {
      title: 'Trust and Transparency',
      text: 'Clear communication, honest pricing, and reliable service form the foundation of our business.',
    },
    {
      title: 'Customer satisfaction',
      text: 'Your happiness and travel experience are at the heart of everything we do.',
    },
    {
      title: 'Community and connections',
      text: 'Many travellers join us for destinations, but return for the friendships and memories they create along the way.',
    },
    {
      title: 'Responsible tourism',
      text: 'We encourage respectful and sustainable travel practices that benefit local communities and preserve destinations for future generations.',
    },
  ],
  stats: [
    { icon: '🌍', value: 'Thousands of Happy Travellers', label: 'And still counting' },
    { icon: '🗺️', value: 'Hundreds of Successful Tours', label: 'Operated' },
    { icon: '🤝', value: 'Growing Community', label: 'of Travel Enthusiasts' },
    { icon: '💙', value: 'High Rate of Repeat Travellers & Referrals', label: '' },
    { icon: '⭐', value: '4.8/5 Google Rating', label: '' },
    { icon: '⌛', value: '7+ Years of Industry Experience', label: '' },
  ],
  testimonials: [
    'Excellent planning and smooth execution from start to finish.',
    'Our customized holiday was perfectly planned and completely stress-free.',
    'Joined a group trip as a solo traveller and returned with lifelong friends.',
    'Professional, responsive, and genuinely passionate about travel.',
    "One of the most reliable travel companies we've travelled with.",
  ],
  whyChoose: [
    'Trusted Travel Experts',
    'Curated Group Departures',
    'Customized Holiday Planning',
    'Transparent Pricing',
    'Dedicated Customer Support',
    'Authentic Travel Experiences',
    'Strong Traveller Community',
  ],
  cta: {
    title: "Let's Plan Your Next Adventure",
    text: "Whether you're joining one of our exciting group departures or looking for a tailor-made holiday, Happy Feet Travellers is here to help you explore the world with confidence.",
    tagline: 'Travel Together. Travel Your Way. Travel with Happy Feet Travellers.',
  },
  storyImage: {
    src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80',
    alt: 'Travellers exploring scenic destinations with Happy Feet Travellers',
  },
};

function mergeStringList(saved, fallback) {
  const list = Array.isArray(saved) ? saved.map((item) => String(item || '').trim()).filter(Boolean) : [];
  return list.length ? list : fallback;
}

function mergeItems(saved, fallback) {
  if (!Array.isArray(saved) || !saved.length) return fallback;
  const merged = saved
    .map((item, index) => ({
      title: String(item?.title || fallback[index]?.title || '').trim(),
      text: String(item?.text || fallback[index]?.text || '').trim(),
    }))
    .filter((item) => item.title || item.text);
  return merged.length ? merged : fallback;
}

function mergeStats(saved, fallback) {
  if (!Array.isArray(saved) || !saved.length) return fallback;
  const merged = saved
    .map((item, index) => ({
      icon: String(item?.icon || fallback[index]?.icon || '✦').trim(),
      value: String(item?.value || fallback[index]?.value || '').trim(),
      label: String(item?.label ?? fallback[index]?.label ?? '').trim(),
    }))
    .filter((item) => item.value);
  return merged.length ? merged : fallback;
}

/** Merge API/admin saved content with document defaults. */
export function resolveAboutContent(saved) {
  const base = DEFAULT_ABOUT_CONTENT;
  if (!saved || typeof saved !== 'object') return { ...base };

  return {
    heroTitle: String(saved.heroTitle || base.heroTitle).trim() || base.heroTitle,
    introParagraphs: mergeStringList(saved.introParagraphs, base.introParagraphs),
    mission: String(saved.mission || base.mission).trim() || base.mission,
    vision: String(saved.vision || base.vision).trim() || base.vision,
    whatWeDo: {
      groupDepartures:
        String(saved.whatWeDo?.groupDepartures || base.whatWeDo.groupDepartures).trim() ||
        base.whatWeDo.groupDepartures,
      customizedHolidays:
        String(saved.whatWeDo?.customizedHolidays || base.whatWeDo.customizedHolidays).trim() ||
        base.whatWeDo.customizedHolidays,
    },
    services: mergeStringList(saved.services, base.services),
    howWeWork: mergeItems(saved.howWeWork, base.howWeWork),
    values: mergeItems(saved.values, base.values),
    stats: mergeStats(saved.stats, base.stats),
    testimonials: mergeStringList(saved.testimonials, base.testimonials),
    whyChoose: mergeStringList(saved.whyChoose, base.whyChoose),
    cta: {
      title: String(saved.cta?.title || base.cta.title).trim() || base.cta.title,
      text: String(saved.cta?.text || base.cta.text).trim() || base.cta.text,
      tagline: String(saved.cta?.tagline || base.cta.tagline).trim() || base.cta.tagline,
    },
    storyImage: {
      src: String(saved.storyImage?.src || base.storyImage.src).trim() || base.storyImage.src,
      alt: String(saved.storyImage?.alt || base.storyImage.alt).trim() || base.storyImage.alt,
    },
  };
}

export function aboutContentToForm(content) {
  const resolved = resolveAboutContent(content);
  return {
    heroTitle: resolved.heroTitle,
    introParagraphs: resolved.introParagraphs.join('\n\n'),
    mission: resolved.mission,
    vision: resolved.vision,
    groupDepartures: resolved.whatWeDo.groupDepartures,
    customizedHolidays: resolved.whatWeDo.customizedHolidays,
    services: resolved.services.join('\n'),
    howWeWork: resolved.howWeWork.map((item) => `${item.title} | ${item.text}`).join('\n'),
    values: resolved.values.map((item) => `${item.title} | ${item.text}`).join('\n'),
    stats: resolved.stats.map((item) => `${item.icon} | ${item.value} | ${item.label}`).join('\n'),
    testimonials: resolved.testimonials.join('\n'),
    whyChoose: resolved.whyChoose.join('\n'),
    ctaTitle: resolved.cta.title,
    ctaText: resolved.cta.text,
    ctaTagline: resolved.cta.tagline,
    storyImageSrc: resolved.storyImage.src,
    storyImageAlt: resolved.storyImage.alt,
  };
}

function parsePipeItems(text, { titleKey = 'title', textKey = 'text' } = {}) {
  return String(text || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title, ...rest] = line.split('|');
      return {
        [titleKey]: String(title || '').trim(),
        [textKey]: rest.join('|').trim(),
      };
    })
    .filter((item) => item[titleKey] || item[textKey]);
}

function parseStats(text) {
  return String(text || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [icon, value, ...labelParts] = line.split('|');
      return {
        icon: String(icon || '✦').trim(),
        value: String(value || '').trim(),
        label: labelParts.join('|').trim(),
      };
    })
    .filter((item) => item.value);
}

export function aboutFormToContent(form) {
  return {
    heroTitle: form.heroTitle.trim(),
    introParagraphs: form.introParagraphs
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean),
    mission: form.mission.trim(),
    vision: form.vision.trim(),
    whatWeDo: {
      groupDepartures: form.groupDepartures.trim(),
      customizedHolidays: form.customizedHolidays.trim(),
    },
    services: form.services
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean),
    howWeWork: parsePipeItems(form.howWeWork),
    values: parsePipeItems(form.values),
    stats: parseStats(form.stats),
    testimonials: form.testimonials
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean),
    whyChoose: form.whyChoose
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean),
    cta: {
      title: form.ctaTitle.trim(),
      text: form.ctaText.trim(),
      tagline: form.ctaTagline.trim(),
    },
    storyImage: {
      src: form.storyImageSrc.trim(),
      alt: form.storyImageAlt.trim(),
    },
  };
}

export function emptyAboutForm() {
  return aboutContentToForm(DEFAULT_ABOUT_CONTENT);
}
