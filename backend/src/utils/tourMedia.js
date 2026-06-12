const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const UPLOADS_ROOT = path.resolve(__dirname, '../../uploads');
const TOUR_DIR = path.join(UPLOADS_ROOT, 'tours');

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);
const EXT_BY_MIME = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

const MAX_BYTES = 8 * 1024 * 1024;

function ensureTourDir() {
  fs.mkdirSync(TOUR_DIR, { recursive: true });
}

function isAllowedTourMime(mimetype) {
  return ALLOWED_MIME.has(mimetype);
}

function isAllowedTourFile(mimetype, originalname = '') {
  if (isAllowedTourMime(mimetype)) return true;
  const ext = path.extname(originalname || '').toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
}

function inferTourMime(mimetype, originalname = '') {
  if (isAllowedTourMime(mimetype)) return mimetype;
  const ext = path.extname(originalname || '').toLowerCase();
  if (ext === '.png') return 'image/png';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  return mimetype;
}

function assertTourFileSize(size) {
  if (size > MAX_BYTES) {
    const err = new Error(`Image must be ${MAX_BYTES / (1024 * 1024)}MB or smaller`);
    err.name = 'ValidationError';
    throw err;
  }
}

function buildTourFilename(mimetype, originalExt = '') {
  const ext = EXT_BY_MIME[mimetype] || originalExt.toLowerCase();
  const safeExt = ['.jpg', '.jpeg', '.png', '.webp'].includes(ext) ? ext.replace('.jpeg', '.jpg') : '.jpg';
  return `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${safeExt}`;
}

function saveTourUpload(file) {
  if (!file?.path) {
    const err = new Error('Image file is required');
    err.name = 'ValidationError';
    throw err;
  }
  if (!isAllowedTourFile(file.mimetype, file.originalname)) {
    const err = new Error('Only JPG, PNG, and WebP images are allowed');
    err.name = 'ValidationError';
    throw err;
  }
  assertTourFileSize(file.size);

  ensureTourDir();
  const mime = inferTourMime(file.mimetype, file.originalname);
  const filename = buildTourFilename(mime, path.extname(file.originalname || ''));
  const dest = path.join(TOUR_DIR, filename);
  fs.renameSync(file.path, dest);
  return `/uploads/tours/${filename}`;
}

function saveTourDataUrl(dataUrl) {
  if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) {
    return dataUrl;
  }

  const match = /^data:(image\/(?:jpeg|png|webp));base64,(.+)$/i.exec(dataUrl);
  if (!match) return dataUrl;

  const mimetype = match[1].toLowerCase();
  const buffer = Buffer.from(match[2], 'base64');
  assertTourFileSize(buffer.length);

  ensureTourDir();
  const filename = buildTourFilename(mimetype);
  fs.writeFileSync(path.join(TOUR_DIR, filename), buffer);
  return `/uploads/tours/${filename}`;
}

function persistTourMediaValue(value) {
  if (!value || typeof value !== 'string') return value;
  if (value.startsWith('data:image/')) return saveTourDataUrl(value);
  return value;
}

function persistTourMediaInPayload(payload) {
  if (!payload || typeof payload !== 'object') return payload;
  const next = { ...payload };
  if (next.coverImage !== undefined) {
    next.coverImage = persistTourMediaValue(next.coverImage);
  }
  if (Array.isArray(next.images)) {
    next.images = next.images.map((item) => persistTourMediaValue(item)).filter(Boolean);
  }
  return next;
}

module.exports = {
  TOUR_DIR,
  MAX_BYTES,
  ALLOWED_MIME,
  ensureTourDir,
  isAllowedTourMime,
  isAllowedTourFile,
  inferTourMime,
  assertTourFileSize,
  saveTourUpload,
  saveTourDataUrl,
  persistTourMediaInPayload,
};
