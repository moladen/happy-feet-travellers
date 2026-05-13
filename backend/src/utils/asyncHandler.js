/**
 * Wraps an async route handler so any thrown / rejected error is forwarded to
 * Express's `next()` and ultimately handled by the global error middleware.
 * Lets controllers stay free of try/catch boilerplate.
 *
 * @example
 *   router.get('/', asyncHandler(async (req, res) => { ... }));
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
