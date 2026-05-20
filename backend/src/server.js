const app = require('./app');
const env = require('@/config/env');
const logger = require('@/utils/logger');
const prisma = require('@/config/database');
const emailService = require('@/services/emailService');

const server = app.listen(env.port, () => {
  logger.success(`Server running on http://localhost:${env.port}`);
  logger.info(`Health check: http://localhost:${env.port}/api/health`);
  logger.info(`Environment: ${env.nodeEnv}`);
  emailService.verifyMailTransport().catch(() => {});
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    logger.error(
      `Port ${env.port} is already in use. Either stop the other process using it, or set a different PORT in backend/.env (e.g. PORT=5001).`
    );
    logger.info('Windows: netstat -ano | findstr :' + env.port + '  then taskkill /PID <pid> /F');
  } else {
    logger.error('Server failed to start:', err);
  }
  process.exit(1);
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
