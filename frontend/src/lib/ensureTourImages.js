import { compressImageFile, dataUrlToFile } from '@/lib/compressImage';
import { isTemporaryImageUrl } from '@/lib/heroSlides';
import { uploadTourImage } from '@/services/adminService';

function isDataImageUrl(value) {
  return typeof value === 'string' && value.startsWith('data:image/');
}

async function persistImageValue(value) {
  if (!value || typeof value !== 'string') return value;
  if (isTemporaryImageUrl(value)) {
    throw new Error(
      'An image is still uploading or failed to upload. Wait on the Media step, or remove and re-add photos.'
    );
  }
  if (!isDataImageUrl(value)) return value;

  const file = await compressImageFile(await dataUrlToFile(value, 'embedded.jpg'));

  const result = await uploadTourImage(file);
  if (!result.success || !result.data?.url) {
    throw new Error(result.message || 'Could not upload an embedded image. Remove and re-add photos on the Media step.');
  }
  return result.data.url;
}

/** Replace any leftover base64 images with server URLs before admin save. */
export async function ensureTourImagesUploaded(form) {
  const coverImage = await persistImageValue(form.coverImage);
  const heroBannerImage = await persistImageValue(form.heroBannerImage);
  const ogImage = await persistImageValue(form.ogImage);
  const images = Array.isArray(form.images)
    ? await Promise.all(form.images.map((item) => persistImageValue(item)))
    : form.images;

  return {
    ...form,
    coverImage,
    heroBannerImage,
    ogImage,
    images: (images || []).filter(Boolean),
  };
}
