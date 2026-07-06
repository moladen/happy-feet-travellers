const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const slug = process.argv[2] || 'packing-smart-for-the-indian-mountains';

async function main() {
  const blog = await prisma.blog.findFirst({ where: { slug } });
  if (!blog) {
    console.log('Blog not found:', slug);
    process.exit(1);
  }
  console.log('Title:', blog.title);
  console.log('Content type:', typeof blog.content, Array.isArray(blog.content) ? 'array' : '');
  console.log(JSON.stringify(blog.content, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
