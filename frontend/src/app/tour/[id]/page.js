import Link from 'next/link';
import RelatedBlogsSection from '@/components/content/RelatedBlogsSection';
import TourDetails from '@/components/tour/TourDetails';
import RelatedToursScroll from '@/components/tour/RelatedToursScroll';
import JsonLd from '@/components/seo/JsonLd';
import { buildFaqSchema } from '@/lib/schema/faq';
import { getSiteUrl } from '@/lib/schema/siteUrl';
import { buildTourTravelPackageSchema } from '@/lib/schema/travelPackage';
import { getTourById, getTours, getPersonalizedTrips } from '@/services/api';
import { getPublicSettings } from '@/services/settingsService';
import SectionState from '@/components/common/SectionState';
import { USER_MESSAGES } from '@/lib/userMessages';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const tour = await getTourById(id);
  if (!tour) {
    return {
      title: 'Tour Details - Happy Feet Travellers',
      description: 'View detailed information about this tour',
    };
  }
  const description =
    tour.seoDescription ||
    (tour.description ? String(tour.description).trim().slice(0, 160) : '');
  return {
    title: tour.seoTitle || `${tour.title} - Happy Feet Travellers`,
    description: description || 'View detailed information about this tour',
  };
}

export default async function TourPage({ params }) {
  const { id } = await params;
  const [tour, settings] = await Promise.all([getTourById(id), getPublicSettings()]);

  if (!tour) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-background px-4 py-16">
        <SectionState
          type="empty"
          title="Tour not found"
          message={USER_MESSAGES.tourNotFound}
          action={
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/upcoming-departures" className="section-state__action section-state__action--primary">
                View departures
              </Link>
              <Link href="/customized-trips" className="section-state__action">
                Personalized tours
              </Link>
            </div>
          }
        />
      </div>
    );
  }

  const isCustomized = tour.category === 'customized';
  const allTours = isCustomized
    ? await getPersonalizedTrips({ limit: 24, sort: 'featured' })
    : await getTours({ category: 'upcoming', limit: 24 });
  const related = allTours.filter((t) => String(t.id) !== String(tour.id)).slice(0, 8);
  const toursListHref = isCustomized ? '/customized-trips' : '/upcoming-departures';
  const toursListLabel = isCustomized ? 'Personalized tours' : 'Upcoming departures';
  const tourKey = tour.slug || tour.id;
  const tourUrl = `${getSiteUrl()}/tour/${encodeURIComponent(tourKey)}`;
  const structuredData = [
    buildTourTravelPackageSchema(tour, tourUrl),
    buildFaqSchema(tour.faqs),
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={structuredData} />
      <div className="border-b border-[#dceaf7] bg-white">
        <div className="container mx-auto px-4 py-2.5 sm:px-6">
          <div className="flex flex-wrap items-center gap-2 text-sm text-foreground/75">
            <Link href="/" className="text-primary hover:text-secondary">
              Home
            </Link>
            <span aria-hidden>›</span>
            <Link href={toursListHref} className="text-primary hover:text-secondary">
              {toursListLabel}
            </Link>
            <span aria-hidden>›</span>
            <span className="font-medium text-foreground">{tour.title}</span>
          </div>
        </div>
      </div>

      <TourDetails tour={tour} whatsappNumber={settings?.whatsappNumber} />

      <RelatedBlogsSection
        blogs={tour.relatedBlogs || []}
        landingPage={tour.relatedLandingPage || null}
        title={
          tour.destination
            ? `Guides & stories — ${tour.destination}`
            : 'Related travel blogs'
        }
      />

      {related.length > 0 && (
        <div className="border-t border-[#dceaf7] bg-white py-14">
          <div className="container mx-auto px-4">
            <h2 className="mb-10 text-center text-2xl font-bold text-primary md:text-3xl">You might also like</h2>
            <RelatedToursScroll
              tours={related}
              whatsappNumber={settings?.whatsappNumber}
              tourKind={isCustomized ? 'personalized' : 'upcoming'}
            />
          </div>
        </div>
      )}
    </div>
  );
}
