/**
 * Operational error with an HTTP status code.
 * Throw or `next(new AppError(...))` from anywhere; the global error handler
 * will convert it to a JSON response.
 */
class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace?.(this, this.constructor);
  }

  static badRequest(message = 'Bad request', details) {
    return new AppError(message, 400, details);
  }

  static unauthorized(message = 'Unauthorized', details) {
    return new AppError(message, 401, details);
  }

  static forbidden(message = 'Forbidden', details) {
    return new AppError(message, 403, details);
  }

  static notFound(message = 'Resource not found', details) {
    return new AppError(message, 404, details);
  }

  static conflict(message = 'Conflict', details) {
    return new AppError(message, 409, details);
  }

  static serviceUnavailable(message = 'Service unavailable', details) {
    return new AppError(message, 503, details);
  }
}

module.exports = AppError;
