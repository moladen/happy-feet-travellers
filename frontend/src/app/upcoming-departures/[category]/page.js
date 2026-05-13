import Link from 'next/link';
import TourCard from '@/components/tour/TourCard';
import { getTours } from '@/services/api';

export const metadata = {
  title: 'Category Tours - Happy Feet Travellers',
  description: 'Browse category-specific tours',
};

export const dynamic = 'force-dynamic';

export default async function CategoryPage({ params }) {
  const { category } = await params;
  const tours = await getTours(category);

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
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>

        {/* Empty State */}
        {tours.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600 mb-4">No tours found in this category.</p>
            <Link href="/upcoming-departures" className="text-blue-600 hover:text-blue-700">
              View all tours
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
