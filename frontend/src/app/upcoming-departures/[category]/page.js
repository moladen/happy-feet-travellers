import Link from 'next/link';
import DepartureTourCard from '@/components/tour/DepartureTourCard';
import SectionState from '@/components/common/SectionState';
import { isFetchFailure } from '@/lib/publicApiError';
import { USER_MESSAGES } from '@/lib/userMessages';
import { getTours } from '@/services/api';

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
    tours = await getTours(category);
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4">
          <Link href="/upcoming-departures" className="text-blue-100 hover:text-white mb-4 inline-flex items-center gap-2">
            ← Back to All Tours
          </Link>
          <h1 className="text-4xl font-bold mb-2">{categoryTitles[category] || 'Tours'}</h1>
          <p className="text-blue-100">Explore our collection of {category} tours</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
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
  );
}
