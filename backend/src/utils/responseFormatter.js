const env = require('@/config/env');

function sendSuccess(res, data, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

function sendError(res, message = 'Error', statusCode = 500, details = null) {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(details ? { details } : {}),
    ...(env.isDevelopment && details && details.stack ? { stack: details.stack } : {}),
  });
}

module.exports = {
  sendSuccess,
  sendError,
};
