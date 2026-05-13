const schemas = require('@/validators/schemas');
const AppError = require('@/utils/AppError');

/**
 * Returns a middleware that validates `req.body` against the named schema
 * and replaces `req.body` with the cleaned/validated payload.
 */
const validate = (schemaKey) => (req, _res, next) => {
  const schema = schemas[schemaKey];
  if (!schema) return next(new Error(`Unknown validation schema: ${schemaKey}`));

  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const messages = error.details.map((d) => d.message);
    return next(AppError.badRequest('Validation failed', messages));
  }

  req.body = value;
  next();
};

module.exports = { validate };
