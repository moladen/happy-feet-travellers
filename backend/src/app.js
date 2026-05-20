const path = require('path');
require('module-alias').addAliases({
  '@': path.resolve(__dirname),
});

const env = require('@/config/env');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const apiRoutes = require('@/routes');
const { errorHandler, notFoundHandler } = require('@/middlewares/errorHandler');
const { uploadsPublicPath } = require('@/utils/heroMedia');

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '12mb' }));
app.use(express.urlencoded({ extended: true, limit: '12mb' }));

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || env.cors.origins.includes(origin)) return cb(null, true);
      return cb(null, false);
    },
    credentials: true,
  })
);

if (env.isDevelopment) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

const apiLimiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
if (!env.isDevelopment) {
  app.use('/api', apiLimiter);
}

app.use(
  '/uploads',
  express.static(uploadsPublicPath(), {
    maxAge: env.isProduction ? '7d' : 0,
    etag: true,
    fallthrough: false,
  })
);

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Happy Feet Travellers API',
    version: '1.0.0',
    health: '/api/health',
    docs: 'API documentation coming soon',
  });
});

app.use('/api', apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
