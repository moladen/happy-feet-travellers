const multer = require('multer');
const path = require('path');
const {
  HERO_DIR,
  ensureHeroDir,
  isAllowedHeroMime,
  assertHeroFileSize,
  MAX_BYTES,
} = require('@/utils/heroMedia');

ensureHeroDir();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    ensureHeroDir();
    cb(null, HERO_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    const suffix = ['.jpg', '.jpeg', '.png', '.webp'].includes(ext) ? ext : '.jpg';
    cb(null, `tmp-${Date.now()}-${Math.round(Math.random() * 1e9)}${suffix}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_BYTES, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!isAllowedHeroMime(file.mimetype)) {
      return cb(new Error('Only JPG, PNG, and WebP images are allowed'));
    }
    return cb(null, true);
  },
});

function heroImageUpload(fieldName = 'image') {
  return (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
      if (!err) {
        if (req.file) {
          try {
            assertHeroFileSize(req.file.size);
          } catch (sizeErr) {
            return next(sizeErr);
          }
        }
        return next();
      }
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(new Error(`Image must be ${MAX_BYTES / (1024 * 1024)}MB or smaller`));
      }
      return next(err);
    });
  };
}

module.exports = { heroImageUpload };
