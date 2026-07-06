const { PrismaClient } = require('@prisma/client');
const { getRelatedForTour } = require('../src/services/contentLinkingService');

const slug = process.argv[2] || 'spiti-valley-group-expedition-jun-2026';
const prisma = new PrismaClient();

async function main() {
  const tour = await prisma.tour.findFirst({ where: { slug } });
  if (!tour) {
    console.log('Tour not found for slug:', slug);
    process.exit(1);
  }
  console.log('Tour:', tour.title);
  console.log('relatedBlogSlugs:', tour.relatedBlogSlugs);
  console.log('topicKeys:', tour.topicKeys);
  const related = await getRelatedForTour(tour);
  console.log('Related blogs:', related.blogs.length);
  related.blogs.forEach((b) => console.log(`  - ${b.slug} | ${b.title}`));
}

main()
  .finally(() => prisma.$disconnect());
