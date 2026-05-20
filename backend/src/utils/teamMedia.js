const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const UPLOADS_ROOT = path.resolve(__dirname, '../../uploads');
const TEAM_DIR = path.join(UPLOADS_ROOT, 'team');

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);
const EXT_BY_MIME = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

const MAX_BYTES = 5 * 1024 * 1024;

function ensureTeamDir() {
  fs.mkdirSync(TEAM_DIR, { recursive: true });
}

function isAllowedTeamMime(mimetype) {
  return ALLOWED_MIME.has(mimetype);
}

function assertTeamFileSize(size) {
  if (size > MAX_BYTES) {
    const err = new Error(`Profile image must be ${MAX_BYTES / (1024 * 1024)}MB or smaller`);
    err.name = 'ValidationError';
    throw err;
  }
}

function saveTeamUpload(file) {
  if (!file?.path) {
    const err = new Error('Profile image is required');
    err.name = 'ValidationError';
    throw err;
  }
  if (!isAllowedTeamMime(file.mimetype)) {
    const err = new Error('Only JPG, PNG, and WebP images are allowed');
    err.name = 'ValidationError';
    throw err;
  }
  assertTeamFileSize(file.size);

  ensureTeamDir();
  const ext = EXT_BY_MIME[file.mimetype] || path.extname(file.originalname || '').toLowerCase();
  const safeExt = ['.jpg', '.jpeg', '.png', '.webp'].includes(ext) ? ext.replace('.jpeg', '.jpg') : '.jpg';
  const filename = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${safeExt}`;
  const dest = path.join(TEAM_DIR, filename);
  fs.renameSync(file.path, dest);
  return `/uploads/team/${filename}`;
}

function deleteTeamFileIfStored(imageUrl) {
  if (!imageUrl || !imageUrl.startsWith('/uploads/team/')) return;
  const absolute = path.join(UPLOADS_ROOT, imageUrl.replace('/uploads/', ''));
  if (!absolute.startsWith(TEAM_DIR)) return;
  try {
    if (fs.existsSync(absolute)) fs.unlinkSync(absolute);
  } catch {
    /* ignore */
  }
}

module.exports = {
  TEAM_DIR,
  MAX_BYTES,
  ALLOWED_MIME,
  ensureTeamDir,
  isAllowedTeamMime,
  assertTeamFileSize,
  saveTeamUpload,
  deleteTeamFileIfStored,
};
