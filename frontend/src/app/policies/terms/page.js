import PolicyPageView from '@/components/policies/PolicyPageView';
import { resolvePolicyPage } from '@/lib/policyContent';
import { getPublicSettings } from '@/services/settingsService';

export const metadata = {
  title: 'Terms & Conditions - Happy Feet Travellers',
  description: 'Read our terms and conditions',
};

export default async function TermsPage() {
  const settings = await getPublicSettings();
  const page = resolvePolicyPage('terms', settings);

  return (
    <PolicyPageView
      title={page.title}
      lastUpdated={page.lastUpdated}
      html={page.html}
      currentSlug={page.currentSlug}
    />
  );
}
