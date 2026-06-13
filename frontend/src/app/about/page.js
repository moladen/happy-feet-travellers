import AboutPageView, { ABOUT_META } from '@/components/about/AboutPageView';
import { resolveAboutContent } from '@/lib/aboutContent';
import { getPublicSettings } from '@/services/settingsService';

export const metadata = {
  title: ABOUT_META.title,
  description: ABOUT_META.description,
};

export default async function AboutPage() {
  const settings = await getPublicSettings();
  const content = resolveAboutContent(settings?.aboutPageContent);

  return <AboutPageView content={content} />;
}
