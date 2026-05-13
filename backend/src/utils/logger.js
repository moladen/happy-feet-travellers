const env = require('@/config/env');

const COLORS = {
  reset: '\x1b[0m',
  gray: '\x1b[90m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
};

const fmt = (level, color, args) => {
  const ts = new Date().toISOString();
  if (env.isProduction) {
    return [`[${ts}] [${level}]`, ...args];
  }
  return [`${COLORS.gray}[${ts}]${COLORS.reset} ${color}[${level}]${COLORS.reset}`, ...args];
};

const logger = {
  info: (...args) => console.log(...fmt('INFO', COLORS.cyan, args)),
  warn: (...args) => console.warn(...fmt('WARN', COLORS.yellow, args)),
  error: (...args) => console.error(...fmt('ERROR', COLORS.red, args)),
  success: (...args) => console.log(...fmt('OK', COLORS.green, args)),
};

module.exports = logger;
