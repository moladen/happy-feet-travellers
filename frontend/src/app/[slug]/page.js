import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import RannSeasonLandingView from '@/components/rann/RannSeasonLandingView';
import LandingPageView from '@/components/landing/LandingPageView';
import JsonLd from '@/components/seo/JsonLd';
import { isReservedSlug } from '@/lib/reservedSlugs';
import { buildFaqSchema } from '@/lib/schema/faq';
import { buildReviewSchema } from '@/lib/schema/reviews';
import { getSiteUrl } from '@/lib/schema/siteUrl';
import { buildLandingPageMetadata } from '@/lib/landingOpenGraph';
import {
  fetchLandingPageBySlug,
  fetchPublishedLandingSlugs,
  fetchRannRelatedContent,
  RANN_SLUG,
} from '@/services/landingPageService';
import { getPublicSettings } from '@/services/settingsService';
import { getUpcomingDepartures } from '@/services/upcomingDeparturesService';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const slugs = await fetchPublishedLandingSlugs();
  return slugs.filter((slug) => slug !== RANN_SLUG).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const requestHeaders = await headers();
  const siteUrl = getSiteUrl(requestHeaders);
  const page = await fetchLandingPageBySlug(slug);
  if (!page) {
    return buildLandingPageMetadata(null, { siteUrl, slug });
  }
  return buildLandingPageMetadata(page, { siteUrl, slug });
}

export default async function DynamicLandingPage({ params }) {
  const { slug } = await params;
  if (isReservedSlug(slug)) notFound();

  const [page, settings, calendarTours] = await Promise.all([
    fetchLandingPageBySlug(slug),
    getPublicSettings(),
    getUpcomingDepartures({ limit: 100, sort: 'startDate' }).catch(() => []),
  ]);

  if (!page || page.status !== 'published') {
    notFound();
  }

  if (slug === RANN_SLUG) {
    const related = await fetchRannRelatedContent(slug);
    const structuredData = [
      buildFaqSchema(page.faqs),
      buildReviewSchema({ apiTestimonials: page.testimonials }),
    ].filter(Boolean);

    return (
      <>
        <JsonLd data={structuredData} />
        <RannSeasonLandingView
          page={page}
          settings={settings}
          relatedBlogs={related.blogs}
          calendarTours={calendarTours}
        />
      </>
    );
  }

  const structuredData = [
    buildFaqSchema(page.faqs),
    buildReviewSchema({ apiTestimonials: page.testimonials }),
  ].filter(Boolean);

  return (
    <>
      <JsonLd data={structuredData} />
      <LandingPageView page={page} settings={settings} calendarTours={calendarTours} />
    </>
  );
}
