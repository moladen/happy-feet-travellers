import { headers } from 'next/headers';
import RannSeasonLandingView from '@/components/rann/RannSeasonLandingView';
import JsonLd from '@/components/seo/JsonLd';
import { buildFaqSchema } from '@/lib/schema/faq';
import { buildReviewSchema } from '@/lib/schema/reviews';
import { getSiteUrl } from '@/lib/schema/siteUrl';
import { buildLandingPageMetadata } from '@/lib/landingOpenGraph';
import {
  buildStaticRannPage,
  fetchLandingPageBySlug,
  fetchRannRelatedContent,
  RANN_SLUG,
} from '@/services/landingPageService';
import { getPublicSettings } from '@/services/settingsService';
import { getUpcomingDepartures } from '@/services/upcomingDeparturesService';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const requestHeaders = await headers();
  const siteUrl = getSiteUrl(requestHeaders);
  const page = await fetchLandingPageBySlug(RANN_SLUG).catch(() => buildStaticRannPage());
  return buildLandingPageMetadata(page, { siteUrl, slug: RANN_SLUG });
}

export default async function RannSeasonPage() {
  const [page, settings, related, calendarTours] = await Promise.all([
    fetchLandingPageBySlug(RANN_SLUG).catch(() => buildStaticRannPage()),
    getPublicSettings(),
    fetchRannRelatedContent(RANN_SLUG),
    getUpcomingDepartures({ limit: 100, sort: 'startDate' }).catch(() => []),
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
        calendarTours={calendarTours}
      />
    </>
  );
}
