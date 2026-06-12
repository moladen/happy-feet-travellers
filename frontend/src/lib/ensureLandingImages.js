import { compressImageFile, dataUrlToFile } from '@/lib/compressImage';
import { uploadTourImage } from '@/services/adminService';

async function persistImageValue(value) {
  if (!value || typeof value !== 'string') return value;
  if (!value.startsWith('data:image/')) return value;

  const file = await compressImageFile(await dataUrlToFile(value, 'landing.jpg'));
  const result = await uploadTourImage(file);
  if (!result.success || !result.data?.url) {
    throw new Error(result.message || 'Could not upload image.');
  }
  return result.data.url;
}

async function mapImageField(rows, field) {
  if (!Array.isArray(rows)) return rows;
  return Promise.all(
    rows.map(async (row) => ({
      ...row,
      [field]: await persistImageValue(row[field]),
    }))
  );
}

/** Upload any embedded base64 images in landing page nested content before save. */
export async function ensureLandingImagesUploaded(form) {
  const heroBannerImage = await persistImageValue(form.heroBannerImage);
  const ogImage = await persistImageValue(form.ogImage);

  const [_packages, _gallerySlides, _whyVisit, _testimonials] = await Promise.all([
    mapImageField(form._packages, 'featuredImage'),
    mapImageField(form._gallerySlides, 'image'),
    mapImageField(form._whyVisit, 'image'),
    mapImageField(form._testimonials, 'image'),
  ]);

  return {
    ...form,
    heroBannerImage,
    ogImage,
    _packages,
    _gallerySlides,
    _whyVisit,
    _testimonials,
  };
}
