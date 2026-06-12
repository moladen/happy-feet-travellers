import PolicyPageView from '@/components/policies/PolicyPageView';
import { resolvePolicyPage } from '@/lib/policyContent';
import { getPublicSettings } from '@/services/settingsService';

export const metadata = {
  title: 'Cancellation Policy - Happy Feet Travellers',
  description: 'Read our cancellation and refund policy',
};

export default async function CancellationPage() {
  const settings = await getPublicSettings();
  const page = resolvePolicyPage('cancellation', settings);

  return (
    <PolicyPageView
      title={page.title}
      lastUpdated={page.lastUpdated}
      html={page.html}
      currentSlug={page.currentSlug}
    />
  );
}
