import Link from 'next/link';
import DepartureTourCard from '@/components/tour/DepartureTourCard';
import SectionState from '@/components/common/SectionState';
import { isFetchFailure } from '@/lib/publicApiError';
import { USER_MESSAGES } from '@/lib/userMessages';
import { getUpcomingDepartures } from '@/services/upcomingDeparturesService';
import { tourMatchesSubCategory } from '@/lib/tourSearchKeywords';

export const metadata = {
  title: 'Category Tours - Happy Feet Travellers',
  description: 'Browse category-specific tours',
};

export const dynamic = 'force-dynamic';

export default async function CategoryPage({ params }) {
  const { category } = await params;
  let tours = [];
  let apiError = false;

  try {
    const all = await getUpcomingDepartures({ limit: 100, sort: 'startDate' });
    tours = (Array.isArray(all) ? all : []).filter((tour) => tourMatchesSubCategory(tour, category));
  } catch (err) {
    if (isFetchFailure(err)) {
      apiError = true;
    } else {
      throw err;
    }
  }

  const categoryTitles = {
    beaches: 'Beach Tours',
    mountains: 'Mountain Tours',
    cultural: 'Cultural Tours',
    adventure: 'Adventure Tours',
    backwaters: 'Backwater Tours',
  };

  return (
    <div className="page-shell">
      <div className="page-hero-brand py-10 md:py-14">
        <div className="container mx-auto px-4 md:px-6">
          <Link
            href="/upcoming-departures"
            className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition hover:text-white"
          >
            ← Back to All Tours
          </Link>
          <h1 className="font-display text-4xl font-bold text-white md:text-5xl">
            {categoryTitles[category] || 'Tours'}
          </h1>
          <p className="mt-2 text-white/90">Explore our collection of {category} tours</p>
        </div>
      </div>

      <div className="section-tone-cream py-10 md:py-14">
        <div className="container mx-auto px-4 md:px-6">
        {/* Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((tour) => (
            <DepartureTourCard key={tour.id} tour={tour} />
          ))}
        </div>

        {/* Empty State */}
        {apiError ? (
          <SectionState
            type="error"
            title="Tours unavailable"
            message={USER_MESSAGES.serviceUnavailable}
            actionHref="/contact"
            actionLabel="Contact our team"
          />
        ) : tours.length === 0 ? (
          <SectionState
            type="empty"
            title="No tours in this category"
            message={USER_MESSAGES.noTours}
            actionHref="/upcoming-departures"
            actionLabel="View all departures"
          />
        ) : null}
        </div>
      </div>
    </div>
  );
}
