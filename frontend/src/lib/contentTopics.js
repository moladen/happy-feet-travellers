/** Example topic keys for admin cross-linking (blogs ↔ tours ↔ landing pages) */
export const CONTENT_TOPIC_EXAMPLES = [
  { key: 'rann-of-kutch', label: 'Rann of Kutch', landingSlug: 'rann-of-kutch-season-2026-27' },
  { key: 'kashmir', label: 'Kashmir' },
  { key: 'spiti-valley', label: 'Spiti Valley' },
  { key: 'ladakh', label: 'Ladakh' },
  { key: 'meghalaya', label: 'Meghalaya' },
  { key: 'kerala', label: 'Kerala' },
];

export function splitCommaList(value) {
  return String(value || '')
    .split(/[,;\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function joinCommaList(list) {
  return Array.isArray(list) ? list.join(', ') : '';
}

export function blogHref(blog) {
  return `/blog/${blog?.slug || blog?.id}`;
}
