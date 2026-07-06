/**
 * One-time helper: link the packing blog ↔ Spiti tour for cross-link demo.
 * Safe to re-run — updates by slug only.
 *
 * Usage: node scripts/link-blog-tour-example.js
 */
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const BLOG_SLUG = 'packing-smart-for-the-indian-mountains';
const TOUR_SLUG = 'spiti-valley-group-expedition-jun-2026';

async function main() {
  const blog = await prisma.blog.findUnique({ where: { slug: BLOG_SLUG } });
  if (!blog) {
    console.log(`Blog not found: ${BLOG_SLUG} — create it in Admin → Blogs or run npm run prisma:seed`);
    process.exit(1);
  }

  const tour = await prisma.tour.findUnique({ where: { slug: TOUR_SLUG } });
  if (!tour) {
    console.log(`Tour not found: ${TOUR_SLUG} — add the Spiti departure or run npm run seed:tours`);
    process.exit(1);
  }

  await prisma.blog.update({
    where: { id: blog.id },
    data: {
      topicKeys: ['spiti-valley', 'spiti', 'sikkim'],
      relatedTourSlugs: [TOUR_SLUG],
    },
  });

  await prisma.tour.update({
    where: { id: tour.id },
    data: {
      topicKeys: ['spiti-valley', 'spiti'],
      relatedBlogSlugs: [BLOG_SLUG],
    },
  });

  console.log('Linked blog ↔ tour:');
  console.log(`  Blog:  /blog/${BLOG_SLUG}`);
  console.log(`  Tour:  /tour/${TOUR_SLUG}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
