const AppError = require('@/utils/AppError');
const logger = require('@/utils/logger');
const { sendError } = require('@/utils/responseFormatter');
const env = require('@/config/env');

const PRISMA_KNOWN = {
  P2002: { status: 409, message: 'A record with this value already exists' },
  P2025: { status: 404, message: 'Record not found' },
  P2003: { status: 400, message: 'Invalid relation reference' },
};

const errorHandler = (err, req, res, _next) => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let details = null;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
  } else if (err && err.code && PRISMA_KNOWN[err.code]) {
    const known = PRISMA_KNOWN[err.code];
    statusCode = known.status;
    message = known.message;
    details = err.meta || null;
  } else if (err && err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message || 'Validation failed';
    details = err.details || null;
  } else if (err && err.message) {
    message = err.message;
  }

  if (statusCode >= 500) {
    logger.error(`${req.method} ${req.originalUrl} →`, err);
  } else {
    logger.warn(`${req.method} ${req.originalUrl} →`, message);
  }

  const errorDetails =
    Array.isArray(details) && details.length
      ? details
      : env.isDevelopment
        ? { stack: err.stack, ...(details ? { meta: details } : {}) }
        : null;

  return sendError(res, message, statusCode, errorDetails);
};

const notFoundHandler = (req, _res, next) => {
  next(AppError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
