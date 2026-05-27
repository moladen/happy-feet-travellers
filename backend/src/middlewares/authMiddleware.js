const { verifyToken } = require('@/utils/authUtils');
const AppError = require('@/utils/AppError');

const authMiddleware = (req, _res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) return next(AppError.unauthorized('No token provided'));

  const decoded = verifyToken(token);
  if (!decoded) return next(AppError.unauthorized('Invalid or expired token'));

  req.user = decoded;
  next();
};

/** Sets req.user when a valid Bearer token is present; does not fail when missing. */
const optionalAuthMiddleware = (req, _res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (token) {
    const decoded = verifyToken(token);
    if (decoded) req.user = decoded;
  }
  next();
};

module.exports = { authMiddleware, optionalAuthMiddleware };
