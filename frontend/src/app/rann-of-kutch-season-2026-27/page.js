import RannSeasonLandingView from '@/components/rann/RannSeasonLandingView';
import JsonLd from '@/components/seo/JsonLd';
import { buildFaqSchema } from '@/lib/schema/faq';
import { buildReviewSchema } from '@/lib/schema/reviews';
import {
  buildStaticRannPage,
  fetchLandingPageBySlug,
  fetchRannRelatedContent,
  RANN_SLUG,
} from '@/services/landingPageService';
import {
  RANN_SEASON_TITLE,
  RANN_SEO_DESCRIPTION,
  RANN_SEO_KEYWORDS,
  RANN_SEO_TITLE,
} from '@/lib/rannSeasonContent';
import { getPublicSettings } from '@/services/settingsService';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const page = await fetchLandingPageBySlug(RANN_SLUG).catch(() => buildStaticRannPage());
  const title = page?.seoTitle || RANN_SEO_TITLE;
  const description = page?.seoDescription || RANN_SEO_DESCRIPTION;
  return {
    title,
    description,
    keywords: page?.seoKeywords || RANN_SEO_KEYWORDS,
    openGraph: {
      title: page?.seoTitle || page?.title || RANN_SEASON_TITLE,
      description,
      type: 'website',
      images: page?.ogImage || page?.heroBannerImage ? [{ url: page.ogImage || page.heroBannerImage }] : undefined,
    },
  };
}

export default async function RannSeasonPage() {
  const [page, settings, related] = await Promise.all([
    fetchLandingPageBySlug(RANN_SLUG).catch(() => buildStaticRannPage()),
    getPublicSettings(),
    fetchRannRelatedContent(RANN_SLUG),
  ]);

  const resolved = page?.slug ? page : buildStaticRannPage();
  const structuredData = [
    buildFaqSchema(resolved.faqs),
    buildReviewSchema({ apiTestimonials: resolved.testimonials }),
  ].filter(Boolean);

  return (
    <>
      <JsonLd data={structuredData} />
      <RannSeasonLandingView
        page={resolved}
        settings={settings}
        relatedBlogs={related.blogs}
      />
    </>
  );
}
