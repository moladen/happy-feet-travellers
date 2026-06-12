/** Target size safe for Vercel /api proxy (~4.5 MB request cap incl. multipart overhead). */
export const TOUR_IMAGE_TARGET_BYTES = 1.4 * 1024 * 1024;
export const TOUR_IMAGE_MAX_DIMENSION = 1920;

function isCompressibleImage(file) {
  if (!file) return false;
  const type = String(file.type || '').toLowerCase();
  if (type.startsWith('image/')) return type !== 'image/gif';
  return /\.(jpe?g|png|webp)$/i.test(String(file.name || ''));
}

/**
 * Resize and re-encode travel photos in the browser before admin upload.
 * Keeps quality high while staying under reverse-proxy body limits.
 */
export async function compressImageFile(
  file,
  { maxBytes = TOUR_IMAGE_TARGET_BYTES, maxDimension = TOUR_IMAGE_MAX_DIMENSION } = {}
) {
  if (!isCompressibleImage(file)) return file;
  const type = String(file.type || '').toLowerCase();
  if (type === 'image/gif') return file;
  if (file.size <= maxBytes && (type === 'image/jpeg' || type === 'image/webp')) {
    return file;
  }

  let bitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    const err = new Error(
      'This photo could not be read. Use JPG or PNG, or on iPhone turn off "High Efficiency" in Camera settings.'
    );
    err.name = 'UnsupportedImageError';
    throw err;
  }

  const scale = Math.min(1, maxDimension / bitmap.width, maxDimension / bitmap.height);
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    bitmap.close();
    return file;
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  let quality = 0.88;
  let blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
  while (blob && blob.size > maxBytes && quality > 0.45) {
    quality -= 0.07;
    blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
  }
  if (!blob) return file;

  const baseName = String(file.name || 'image').replace(/\.[^.]+$/, '') || 'image';
  return new File([blob], `${baseName}.jpg`, { type: 'image/jpeg', lastModified: Date.now() });
}

export async function dataUrlToFile(dataUrl, name = 'image.jpg') {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  return new File([blob], name, { type: blob.type || 'image/jpeg' });
}
