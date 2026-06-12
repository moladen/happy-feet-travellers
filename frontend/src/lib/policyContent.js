import {
  DEFAULT_CANCELLATION_HTML,
  DEFAULT_POLICIES_LAST_UPDATED,
  DEFAULT_PRIVACY_HTML,
  DEFAULT_TERMS_HTML,
} from '@/lib/defaultPolicies';

const POLICY_PAGES = {
  terms: {
    title: 'Terms & Conditions',
    field: 'termsContent',
    defaultHtml: DEFAULT_TERMS_HTML,
  },
  privacy: {
    title: 'Privacy Policy',
    field: 'privacyContent',
    defaultHtml: DEFAULT_PRIVACY_HTML,
  },
  cancellation: {
    title: 'Cancellation Policy',
    field: 'cancellationPolicyContent',
    defaultHtml: DEFAULT_CANCELLATION_HTML,
  },
};

export function resolvePolicyPage(slug, settings) {
  const meta = POLICY_PAGES[slug];
  if (!meta) {
    return {
      title: 'Policy',
      lastUpdated: DEFAULT_POLICIES_LAST_UPDATED,
      html: '<p>Policy not found.</p>',
      currentSlug: slug,
    };
  }

  const stored = settings?.[meta.field];
  const html =
    typeof stored === 'string' && stored.trim() ? stored.trim() : meta.defaultHtml;
  const lastUpdated =
    typeof settings?.policiesLastUpdated === 'string' && settings.policiesLastUpdated.trim()
      ? settings.policiesLastUpdated.trim()
      : DEFAULT_POLICIES_LAST_UPDATED;

  return {
    title: meta.title,
    lastUpdated,
    html,
    currentSlug: slug,
  };
}
