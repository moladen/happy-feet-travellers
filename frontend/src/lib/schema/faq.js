import { withSchemaContext } from '@/lib/schema/jsonLdUtils';

/**
 * Normalize FAQ rows from tours, landing pages, or admin CMS.
 * @param {Array<{ question?: string; answer?: string; q?: string; a?: string }>} faqs
 */
export function normalizeFaqItems(faqs) {
  if (!Array.isArray(faqs)) return [];
  return faqs
    .map((item) => ({
      question: String(item?.question || item?.q || '').trim(),
      answer: String(item?.answer || item?.a || '').trim(),
    }))
    .filter((item) => item.question && item.answer);
}

/**
 * FAQPage schema for rich results.
 * @param {Array<{ question?: string; answer?: string }>} faqs
 * @returns {object | null}
 */
export function buildFaqSchema(faqs) {
  const items = normalizeFaqItems(faqs);
  if (!items.length) return null;

  return withSchemaContext({
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  });
}
