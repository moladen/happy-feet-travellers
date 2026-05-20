const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const UPLOADS_ROOT = path.resolve(__dirname, '../../uploads');
const HERO_DIR = path.join(UPLOADS_ROOT, 'hero');

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);
const EXT_BY_MIME = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

const MAX_BYTES = 8 * 1024 * 1024;

function ensureHeroDir() {
  fs.mkdirSync(HERO_DIR, { recursive: true });
}

function uploadsPublicPath() {
  return UPLOADS_ROOT;
}

function isAllowedHeroMime(mimetype) {
  return ALLOWED_MIME.has(mimetype);
}

function assertHeroFileSize(size) {
  if (size > MAX_BYTES) {
    const err = new Error(`Image must be ${MAX_BYTES / (1024 * 1024)}MB or smaller`);
    err.name = 'ValidationError';
    throw err;
  }
}

function saveHeroUpload(file) {
  if (!file?.path) {
    const err = new Error('Image file is required');
    err.name = 'ValidationError';
    throw err;
  }
  if (!isAllowedHeroMime(file.mimetype)) {
    const err = new Error('Only JPG, PNG, and WebP images are allowed');
    err.name = 'ValidationError';
    throw err;
  }
  assertHeroFileSize(file.size);

  ensureHeroDir();
  const ext = EXT_BY_MIME[file.mimetype] || path.extname(file.originalname || '').toLowerCase();
  const safeExt = ['.jpg', '.jpeg', '.png', '.webp'].includes(ext) ? ext.replace('.jpeg', '.jpg') : '.jpg';
  const filename = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${safeExt}`;
  const dest = path.join(HERO_DIR, filename);
  fs.renameSync(file.path, dest);
  return `/uploads/hero/${filename}`;
}

function deleteHeroFileIfStored(imageUrl) {
  if (!imageUrl || !imageUrl.startsWith('/uploads/hero/')) return;
  const absolute = path.join(UPLOADS_ROOT, imageUrl.replace('/uploads/', ''));
  if (!absolute.startsWith(HERO_DIR)) return;
  try {
    if (fs.existsSync(absolute)) fs.unlinkSync(absolute);
  } catch {
    /* ignore unlink errors */
  }
}

module.exports = {
  UPLOADS_ROOT,
  HERO_DIR,
  MAX_BYTES,
  ALLOWED_MIME,
  ensureHeroDir,
  uploadsPublicPath,
  isAllowedHeroMime,
  assertHeroFileSize,
  saveHeroUpload,
  deleteHeroFileIfStored,
};
