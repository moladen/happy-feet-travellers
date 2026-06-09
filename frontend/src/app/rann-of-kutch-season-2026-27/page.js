import RannSeasonLandingView from '@/components/rann/RannSeasonLandingView';
import {
  buildStaticRannPage,
  fetchLandingPageBySlug,
  fetchRannRelatedContent,
  RANN_SLUG,
} from '@/services/landingPageService';
import { RANN_SEASON_TITLE, RANN_SEO_KEYWORDS } from '@/lib/rannSeasonContent';
import { getPublicSettings } from '@/services/settingsService';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: `${RANN_SEASON_TITLE} | Happy Feet Travellers`,
  description:
    'Master campaign page for Rann of Kutch Season 2026–27 — 10 group batches, package comparison, add-ons, train info, photo & video gallery, and priority access.',
  keywords: RANN_SEO_KEYWORDS,
  openGraph: {
    title: RANN_SEASON_TITLE,
    description: 'White Desert journeys, group departures, and customized Rann Utsav packages.',
    type: 'website',
  },
};

export default async function RannSeasonPage() {
  const [page, settings, related] = await Promise.all([
    fetchLandingPageBySlug(RANN_SLUG).catch(() => buildStaticRannPage()),
    getPublicSettings(),
    fetchRannRelatedContent(RANN_SLUG),
  ]);

  const resolved = page?.slug ? page : buildStaticRannPage();

  return (
    <RannSeasonLandingView
      page={resolved}
      settings={settings}
      relatedTours={related.tours}
      relatedBlogs={related.blogs}
    />
  );
}
