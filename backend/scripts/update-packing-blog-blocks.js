/**
 * Updates the packing blog with paragraph + photo blocks (demo for blog editor).
 * Safe to re-run — updates by slug only.
 *
 * Usage: node scripts/update-packing-blog-blocks.js
 */
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const BLOG_SLUG = 'packing-smart-for-the-indian-mountains';

const IMG = {
  blogPacking:
    'https://images.unsplash.com/photo-1553531384-cc64ac80f931?auto=format&fit=crop&w=1200&q=80',
  snowMtn:
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
};

const BLOCKS_CONTENT = {
  version: 1,
  blocks: [
    {
      type: 'paragraph',
      text:
        'Layers beat one thick jacket. You will peel off by noon and need warmth again after sunset — especially in Sikkim, Spiti and Himachal. Think base layer + fleece + windproof shell rather than one heavy coat.',
    },
    {
      type: 'image',
      url: IMG.blogPacking,
      caption:
        'A compact duffel with layered clothing works better than one bulky suitcase on mountain roads.',
    },
    {
      type: 'paragraph',
      text:
        'Carry a dry bag for electronics during monsoon drives, and keep photocopies of ID separate from originals for permit checkpoints. Spiti and Ladakh batches need extra warm layers even in summer — nights drop quickly above 3,500m.',
    },
    {
      type: 'image',
      url: IMG.snowMtn,
      caption:
        'Broken-in trekking shoes with grip — wet stone steps are common at monasteries and village homestays.',
    },
    {
      type: 'paragraph',
      text:
        'Footwear matters most on the last mile. Pack light — porters are not part of our group departures and you will handle your own bag at some homestays. If you are unsure, message us on WhatsApp before departure week.',
    },
  ],
};

async function main() {
  const blog = await prisma.blog.findUnique({ where: { slug: BLOG_SLUG } });
  if (!blog) {
    console.log(`Blog not found: ${BLOG_SLUG} — run npm run prisma:seed first`);
    process.exit(1);
  }

  await prisma.blog.update({
    where: { id: blog.id },
    data: { content: BLOCKS_CONTENT },
  });

  console.log('Updated blog with paragraph + photo blocks:');
  console.log(`  /blog/${BLOG_SLUG}`);
  console.log(`  ${BLOCKS_CONTENT.blocks.filter((b) => b.type === 'image').length} photos, ${BLOCKS_CONTENT.blocks.filter((b) => b.type === 'paragraph').length} paragraphs`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
