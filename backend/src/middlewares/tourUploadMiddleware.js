const path = require('path');
const multer = require('multer');
const AppError = require('@/utils/AppError');
const {
  TOUR_DIR,
  ensureTourDir,
  isAllowedTourFile,
  assertTourFileSize,
  MAX_BYTES,
} = require('@/utils/tourMedia');

ensureTourDir();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    ensureTourDir();
    cb(null, TOUR_DIR);
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
    if (!isAllowedTourFile(file.mimetype, file.originalname)) {
      return cb(AppError.badRequest('Only JPG, PNG, and WebP images are allowed'));
    }
    return cb(null, true);
  },
});

function tourImageUpload(fieldName = 'image') {
  return (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
      if (!err) {
        if (req.file) {
          try {
            assertTourFileSize(req.file.size);
          } catch (sizeErr) {
            return next(sizeErr);
          }
        }
        return next();
      }
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(AppError.badRequest(`Image must be ${MAX_BYTES / (1024 * 1024)}MB or smaller`));
      }
      return next(err instanceof AppError ? err : AppError.badRequest(err.message || 'Upload failed'));
    });
  };
}

module.exports = { tourImageUpload };
