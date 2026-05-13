const app = require('./app');
const env = require('@/config/env');
const logger = require('@/utils/logger');
const prisma = require('@/config/database');

const server = app.listen(env.port, () => {
  logger.success(`Server running on http://localhost:${env.port}`);
  logger.info(`Health check: http://localhost:${env.port}/api/health`);
  logger.info(`Environment: ${env.nodeEnv}`);
});

const shutdown = async (signal) => {
  logger.warn(`${signal} received — shutting down gracefully...`);
  server.close(async () => {
    try {
      await prisma.$disconnect();
      logger.success('Closed all connections, exiting.');
      process.exit(0);
    } catch (e) {
      logger.error('Error during shutdown', e);
      process.exit(1);
    }
  });

  setTimeout(() => {
    logger.error('Forcefully shutting down after 10s timeout');
    process.exit(1);
  }, 10000).unref();
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Promise Rejection:', reason);
});
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  shutdown('uncaughtException');
});
