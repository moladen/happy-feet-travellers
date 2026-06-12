const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const UPLOADS_ROOT = path.resolve(__dirname, '../../uploads');
const GUIDE_DIR = path.join(UPLOADS_ROOT, 'guides');

const ALLOWED_MIME = new Set(['application/pdf']);
const MAX_BYTES = 20 * 1024 * 1024;

function ensureGuideDir() {
  fs.mkdirSync(GUIDE_DIR, { recursive: true });
}

function isAllowedGuideMime(mimetype) {
  return ALLOWED_MIME.has(mimetype);
}

function assertGuideFileSize(size) {
  if (size > MAX_BYTES) {
    const err = new Error(`PDF must be ${MAX_BYTES / (1024 * 1024)}MB or smaller`);
    err.name = 'ValidationError';
    throw err;
  }
}

function saveGuideUpload(file) {
  if (!file?.path) {
    const err = new Error('PDF file is required');
    err.name = 'ValidationError';
    throw err;
  }
  if (!isAllowedGuideMime(file.mimetype)) {
    const err = new Error('Only PDF files are allowed');
    err.name = 'ValidationError';
    throw err;
  }
  assertGuideFileSize(file.size);

  ensureGuideDir();
  const filename = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}.pdf`;
  const dest = path.join(GUIDE_DIR, filename);
  fs.renameSync(file.path, dest);
  return `/uploads/guides/${filename}`;
}

module.exports = {
  GUIDE_DIR,
  MAX_BYTES,
  ensureGuideDir,
  isAllowedGuideMime,
  assertGuideFileSize,
  saveGuideUpload,
};
