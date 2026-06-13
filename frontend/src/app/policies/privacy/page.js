import PolicyPageView from '@/components/policies/PolicyPageView';
import { resolvePolicyPage } from '@/lib/policyContent';
import { getPublicSettings } from '@/services/settingsService';

export const metadata = {
  title: 'Privacy Policy - Happy Feet Travellers',
  description: 'Read our privacy policy',
};

export default async function PrivacyPage() {
  const settings = await getPublicSettings();
  const page = resolvePolicyPage('privacy', settings);

  return (
    <PolicyPageView
      title={page.title}
      lastUpdated={page.lastUpdated}
      html={page.html}
      currentSlug={page.currentSlug}
    />
  );
}
