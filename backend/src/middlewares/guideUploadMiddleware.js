const multer = require('multer');
const path = require('path');
const AppError = require('@/utils/AppError');
const {
  GUIDE_DIR,
  ensureGuideDir,
  isAllowedGuideMime,
  assertGuideFileSize,
  MAX_BYTES,
} = require('@/utils/guideMedia');

ensureGuideDir();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    ensureGuideDir();
    cb(null, GUIDE_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    const suffix = ext === '.pdf' ? ext : '.pdf';
    cb(null, `tmp-${Date.now()}-${Math.round(Math.random() * 1e9)}${suffix}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_BYTES, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!isAllowedGuideMime(file.mimetype)) {
      return cb(AppError.badRequest('Only PDF files are allowed'));
    }
    return cb(null, true);
  },
});

function guidePdfUpload(fieldName = 'pdf') {
  return (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
      if (!err) {
        if (req.file) {
          try {
            assertGuideFileSize(req.file.size);
          } catch (sizeErr) {
            return next(sizeErr);
          }
        }
        return next();
      }
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(AppError.badRequest(`PDF must be ${MAX_BYTES / (1024 * 1024)}MB or smaller`));
      }
      return next(err instanceof AppError ? err : AppError.badRequest(err.message || 'Upload failed'));
    });
  };
}

module.exports = { guidePdfUpload };
