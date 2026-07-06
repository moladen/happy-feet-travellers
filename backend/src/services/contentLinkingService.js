const prisma = require('@/config/database');
const { generateSlug } = require('@/utils/slugGenerator');

/** Extra keywords used when matching tours/blogs by topic key */
const TOPIC_ALIASES = {
  'rann-of-kutch': ['rann', 'kutch', 'rann of kutch', 'white desert', 'rann utsav', 'gujarat'],
  kashmir: ['kashmir', 'gulmarg', 'dal lake', 'srinagar'],
  'spiti-valley': ['spiti', 'spiti valley', 'kinnaur'],
  ladakh: ['ladakh', 'leh', 'nubra'],
  meghalaya: ['meghalaya', 'cherrapunji', 'shillong'],
  kerala: ['kerala', 'munnar', 'alleppey', 'backwaters'],
};

function normalizeTopic(value) {
  if (!value) return '';
  return generateSlug(String(value).trim());
}

function splitTopicKeys(values) {
  if (!Array.isArray(values)) return [];
  return [...new Set(values.map(normalizeTopic).filter(Boolean))];
}

function collectBlogTopics(blog) {
  const keys = new Set(splitTopicKeys(blog.topicKeys));
  const fromCategory = normalizeTopic(blog.category);
  if (fromCategory) keys.add(fromCategory);
  if (blog.landingPageSlug) {
    keys.add(normalizeTopic(blog.landingPageSlug));
    const base = String(blog.landingPageSlug).replace(/-season.*$/i, '').replace(/-\d{4}.*$/i, '');
    if (base) keys.add(normalizeTopic(base));
  }
  return [...keys];
}

function collectTourTopics(tour) {
  const keys = new Set(splitTopicKeys(tour.topicKeys));
  splitTopicKeys(tour.tags).forEach((k) => keys.add(k));
  const dest = normalizeTopic(tour.destination);
  if (dest) keys.add(dest);
  if (tour.landingPageSlug) {
    keys.add(normalizeTopic(tour.landingPageSlug));
    const base = String(tour.landingPageSlug).replace(/-season.*$/i, '').replace(/-\d{4}.*$/i, '');
    if (base) keys.add(normalizeTopic(base));
  }
  return [...keys];
}

function haystackForTour(tour) {
  return [
    tour.slug,
    tour.title,
    tour.destination,
    tour.state,
    ...(tour.tags || []),
    ...(tour.topicKeys || []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function haystackForBlog(blog) {
  return [blog.slug, blog.title, blog.excerpt, blog.category, ...(blog.topicKeys || [])]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function topicMatchesHaystack(topic, haystack) {
  if (!topic) return false;
  if (haystack.includes(topic)) return true;
  const aliases = TOPIC_ALIASES[topic] || [topic.replace(/-/g, ' ')];
  return aliases.some((alias) => haystack.includes(String(alias).toLowerCase()));
}

function tourMatchesTopics(tour, topics) {
  if (!topics.length) return false;
  const hay = haystackForTour(tour);
  const tourTopics = collectTourTopics(tour);
  return topics.some(
    (topic) => tourTopics.includes(topic) || topicMatchesHaystack(topic, hay)
  );
}

function blogMatchesTopics(blog, topics) {
  if (!topics.length) return false;
  const hay = haystackForBlog(blog);
  const blogTopics = collectBlogTopics(blog);
  return topics.some(
    (topic) => blogTopics.includes(topic) || topicMatchesHaystack(topic, hay)
  );
}

function mapTourCard(tour) {
  return {
    id: tour.id,
    slug: tour.slug,
    title: tour.title,
    coverImage: tour.coverImage,
    image: tour.coverImage,
    startingPrice: tour.startingPrice ?? tour.price,
    price: tour.price,
    duration: tour.duration,
    durationLabel: tour.durationLabel,
    category: tour.category,
    destination: tour.destination,
    departureCity: tour.departureCity,
    dateLabel: tour.dateLabel,
    startDate: tour.startDate,
  };
}

function mapBlogCard(blog) {
  return {
    id: blog.id,
    slug: blog.slug,
    title: blog.title,
    excerpt: blog.excerpt,
    category: blog.category,
    coverImage: blog.coverImage,
    image: blog.coverImage,
    publishedAt: blog.publishedAt,
  };
}

function mapLandingPackage(pkg, landingSlug, landingTitle) {
  return {
    id: pkg.id,
    slug: pkg.slug,
    name: pkg.name,
    emoji: pkg.emoji,
    startingPrice: pkg.startingPrice,
    duration: pkg.duration,
    featuredImage: pkg.featuredImage,
    shortDescription: pkg.shortDescription,
    href: `/${landingSlug}/packages/${pkg.slug}`,
    landingSlug,
    landingTitle: landingTitle || null,
  };
}

function haystackForPackage(pkg) {
  const detail = pkg.detailContent && typeof pkg.detailContent === 'object' ? pkg.detailContent : {};
  return [
    pkg.slug,
    pkg.name,
    pkg.shortDescription,
    ...(pkg.highlights || []),
    ...(detail.topicKeys || []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function collectPackageTopics(pkg, landingSlug) {
  const keys = new Set(splitTopicKeys(pkg.topicKeys));
  const detail = pkg.detailContent && typeof pkg.detailContent === 'object' ? pkg.detailContent : {};
  splitTopicKeys(detail.topicKeys).forEach((key) => keys.add(key));
  const slugKey = normalizeTopic(pkg.slug);
  const nameKey = normalizeTopic(pkg.name);
  if (slugKey) keys.add(slugKey);
  if (nameKey) keys.add(nameKey);
  if (landingSlug) {
    keys.add(normalizeTopic(landingSlug));
    const base = String(landingSlug).replace(/-season.*$/i, '').replace(/-\d{4}.*$/i, '');
    if (base) keys.add(normalizeTopic(base));
  }
  return [...keys];
}

function packageMatchesTopics(pkg, topics) {
  if (!topics.length) return false;
  const hay = haystackForPackage(pkg);
  const pkgTopics = collectPackageTopics(pkg);
  return topics.some((topic) => pkgTopics.includes(topic) || topicMatchesHaystack(topic, hay));
}

async function fetchLandingPackagesContext(slug) {
  if (!slug) return null;
  const page = await prisma.landingPage.findFirst({
    where: { slug: String(slug), status: 'published' },
    include: {
      packages: { where: { active: true }, orderBy: { sortOrder: 'asc' }, take: 12 },
    },
  });
  if (!page) return null;
  return {
    slug: page.slug,
    title: page.title,
    href: `/${page.slug}`,
    packages: page.packages,
  };
}

async function fetchLandingWithPackages(slug) {
  const context = await fetchLandingPackagesContext(slug);
  if (!context) return null;
  return {
    slug: context.slug,
    title: context.title,
    href: context.href,
    packages: context.packages.map((pkg) => mapLandingPackage(pkg, context.slug, context.title)),
  };
}

function explicitSlugs(list) {
  if (!Array.isArray(list)) return [];
  return [...new Set(list.map((s) => String(s).trim()).filter(Boolean))];
}

function resolveRelatedPackages(blog, landingContext, topics) {
  if (!landingContext?.packages?.length) return [];

  const manualPackageSlugs = explicitSlugs(blog.relatedPackageSlugs);
  let selected = landingContext.packages;

  if (manualPackageSlugs.length) {
    selected = selected.filter((pkg) => manualPackageSlugs.includes(pkg.slug));
  } else if (topics.length) {
    const matched = selected.filter((pkg) => packageMatchesTopics(pkg, topics));
    if (matched.length) selected = matched;
  }

  return selected
    .slice(0, 6)
    .map((pkg) => mapLandingPackage(pkg, landingContext.slug, landingContext.title));
}

async function getRelatedForBlog(blog) {
  const topics = collectBlogTopics(blog);
  const manualTourSlugs = explicitSlugs(blog.relatedTourSlugs);
  const blogSlug = String(blog.slug || '').trim();

  const [explicitTours, reverseLinkedTours, activeTours, landingContext] = await Promise.all([
    manualTourSlugs.length
      ? prisma.tour.findMany({
          where: { slug: { in: manualTourSlugs }, status: 'active' },
          take: 12,
        })
      : [],
    blogSlug
      ? prisma.tour.findMany({
          where: { relatedBlogSlugs: { has: blogSlug }, status: 'active' },
          take: 12,
        })
      : [],
    prisma.tour.findMany({
      where: { status: 'active' },
      orderBy: [{ featured: 'desc' }, { updatedAt: 'desc' }],
      take: 80,
    }),
    fetchLandingPackagesContext(blog.landingPageSlug),
  ]);

  const seen = new Set();
  const tours = [];

  for (const tour of [...explicitTours, ...reverseLinkedTours]) {
    if (seen.has(tour.id)) continue;
    seen.add(tour.id);
    tours.push(mapTourCard(tour));
  }

  for (const tour of activeTours) {
    if (seen.has(tour.id) || tours.length >= 8) continue;
    if (!topics.length && !manualTourSlugs.length) continue;
    if (manualTourSlugs.includes(tour.slug) || tourMatchesTopics(tour, topics)) {
      seen.add(tour.id);
      tours.push(mapTourCard(tour));
    }
  }

  const packages = resolveRelatedPackages(blog, landingContext, topics);
  const landingPage = landingContext
    ? {
        slug: landingContext.slug,
        title: landingContext.title,
        href: landingContext.href,
        packages,
      }
    : null;

  return {
    tours,
    packages,
    landingPage,
    topicKeys: topics,
  };
}

async function getRelatedForLandingPackage(landingSlug, packageSlug) {
  const page = await prisma.landingPage.findFirst({
    where: { slug: String(landingSlug), status: 'published' },
    include: {
      packages: {
        where: { slug: String(packageSlug), active: true },
        take: 1,
      },
    },
  });

  const pkg = page?.packages?.[0];
  if (!page || !pkg) {
    return { blogs: [], landingPage: null, package: null };
  }

  const topics = collectPackageTopics(pkg, page.slug);
  const detail = pkg.detailContent && typeof pkg.detailContent === 'object' ? pkg.detailContent : {};
  const manualBlogSlugs = explicitSlugs(detail.relatedBlogSlugs);

  const [explicitBlogs, recentBlogs] = await Promise.all([
    manualBlogSlugs.length
      ? prisma.blog.findMany({
          where: { slug: { in: manualBlogSlugs } },
          orderBy: { publishedAt: 'desc' },
          take: 12,
        })
      : [],
    prisma.blog.findMany({
      orderBy: { publishedAt: 'desc' },
      take: 60,
    }),
  ]);

  const seen = new Set();
  const blogs = [];

  for (const blog of explicitBlogs) {
    if (seen.has(blog.id)) continue;
    seen.add(blog.id);
    blogs.push(mapBlogCard(blog));
  }

  for (const blog of recentBlogs) {
    if (seen.has(blog.id) || blogs.length >= 6) continue;
    if (!topics.length && !manualBlogSlugs.length) continue;
    if (manualBlogSlugs.includes(blog.slug) || blogMatchesTopics(blog, topics)) {
      seen.add(blog.id);
      blogs.push(mapBlogCard(blog));
    }
  }

  return {
    blogs,
    landingPage: {
      slug: page.slug,
      title: page.title,
      href: `/${page.slug}`,
    },
    package: mapLandingPackage(pkg, page.slug, page.title),
  };
}

async function getRelatedForTour(tour) {
  const topics = collectTourTopics(tour);
  const manualBlogSlugs = explicitSlugs(tour.relatedBlogSlugs);
  const tourSlug = String(tour.slug || '').trim();

  const [explicitBlogs, reverseLinkedBlogs, recentBlogs, landing] = await Promise.all([
    manualBlogSlugs.length
      ? prisma.blog.findMany({
          where: { slug: { in: manualBlogSlugs } },
          orderBy: { publishedAt: 'desc' },
          take: 12,
        })
      : [],
    tourSlug
      ? prisma.blog.findMany({
          where: { relatedTourSlugs: { has: tourSlug } },
          orderBy: { publishedAt: 'desc' },
          take: 12,
        })
      : [],
    prisma.blog.findMany({
      orderBy: { publishedAt: 'desc' },
      take: 60,
    }),
    fetchLandingWithPackages(tour.landingPageSlug),
  ]);

  const seen = new Set();
  const blogs = [];

  for (const blog of [...explicitBlogs, ...reverseLinkedBlogs]) {
    if (seen.has(blog.id)) continue;
    seen.add(blog.id);
    blogs.push(mapBlogCard(blog));
  }

  for (const blog of recentBlogs) {
    if (seen.has(blog.id) || blogs.length >= 8) continue;
    if (!topics.length && !manualBlogSlugs.length) continue;
    if (manualBlogSlugs.includes(blog.slug) || blogMatchesTopics(blog, topics)) {
      seen.add(blog.id);
      blogs.push(mapBlogCard(blog));
    }
  }

  return {
    blogs,
    landingPage: landing,
    topicKeys: topics,
  };
}

module.exports = {
  getRelatedForBlog,
  getRelatedForTour,
  getRelatedForLandingPackage,
  collectBlogTopics,
  collectTourTopics,
  collectPackageTopics,
};
