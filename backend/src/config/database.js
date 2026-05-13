const { PrismaClient } = require('@prisma/client');
const env = require('@/config/env');

let prisma;

if (env.isProduction) {
  prisma = new PrismaClient();
} else {
  if (!global.__prisma) {
    global.__prisma = new PrismaClient({ log: ['warn', 'error'] });
  }
  prisma = global.__prisma;
}

module.exports = prisma;
