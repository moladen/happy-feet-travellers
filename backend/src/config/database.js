const { PrismaClient } = require('@prisma/client');
const env = require('@/config/env');

let prisma;

if (env.isProduction) {
  prisma = new PrismaClient();
} else {
  const staleClient =
    global.__prisma &&
    (typeof global.__prisma.heroSlide === 'undefined' ||
      typeof global.__prisma.teamMember === 'undefined');
  if (staleClient) {
    global.__prisma.$disconnect().catch(() => {});
    delete global.__prisma;
  }
  if (!global.__prisma) {
    global.__prisma = new PrismaClient({ log: ['warn', 'error'] });
  }
  prisma = global.__prisma;
}

module.exports = prisma;
