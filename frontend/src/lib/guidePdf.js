import { getApiOrigin } from '@/lib/heroSlides';
import { RANN_PLANNING_GUIDE } from '@/lib/rannSeasonContent';

/** Normalize CMS PDF paths for browser fetch/download. */
export function resolveGuidePdfUrl(pdfUrl) {
  const raw = String(pdfUrl || '').trim();
  if (!raw) return '';
  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw.startsWith('/uploads') && typeof window === 'undefined') {
    return `${getApiOrigin()}${raw}`;
  }
  if (raw.startsWith('/')) return raw;
  return `/${raw.replace(/^\/+/, '')}`;
}

export function resolveGuidePdfHref(pdfUrl) {
  const resolved = resolveGuidePdfUrl(pdfUrl);
  if (!resolved) return RANN_PLANNING_GUIDE.pdfUrl;
  if (resolved.startsWith('/uploads') && typeof window !== 'undefined') {
    return resolved;
  }
  if (resolved.startsWith('/uploads')) {
    return `${getApiOrigin()}${resolved}`;
  }
  return resolved;
}

/** Download after async form submit — fetch blob first, then open tab as fallback. */
export async function downloadGuidePdf(pdfUrl, fileName = 'planning-guide.pdf') {
  const href = resolveGuidePdfHref(pdfUrl || RANN_PLANNING_GUIDE.pdfUrl);
  if (!href) return false;

  try {
    const response = await fetch(href, { credentials: 'same-origin' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = blobUrl;
    anchor.download = fileName || 'planning-guide.pdf';
    anchor.rel = 'noopener';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
    return true;
  } catch {
    window.open(href, '_blank', 'noopener,noreferrer');
    return true;
  }
}
