import Link from 'next/link';
import TourDetails from '@/components/tour/TourDetails';
import TourCard from '@/components/tour/TourCard';
import { getTourById, getTours } from '@/services/api';

export const metadata = {
  title: 'Tour Details - Happy Feet Travellers',
  description: 'View detailed information about this tour',
};

export const dynamic = 'force-dynamic';

export default async function TourPage({ params }) {
  const { id } = await params;
  const tour = await getTourById(id);

  if (!tour) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-primary">Tour not found</h1>
          <p className="mb-6 text-foreground/80">The tour you&apos;re looking for doesn&apos;t exist or was removed.</p>
          <Link href="/upcoming-departures" className="font-bold text-secondary hover:text-primary">
            Browse all tours →
          </Link>
        </div>
      </div>
    );
  }

  const allTours = await getTours();
  const related = allTours.filter((t) => String(t.id) !== String(id)).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-[#dceaf7] bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center gap-2 text-sm text-foreground/75">
            <Link href="/" className="text-primary hover:text-secondary">
              Home
            </Link>
            <span aria-hidden>›</span>
            <Link href="/upcoming-departures" className="text-primary hover:text-secondary">
              Tours
            </Link>
            <span aria-hidden>›</span>
            <span className="font-medium text-foreground">{tour.title}</span>
          </div>
        </div>
      </div>

      <TourDetails tour={tour} />

      {related.length > 0 && (
        <div className="border-t border-[#dceaf7] bg-white py-14">
          <div className="container mx-auto px-4">
            <h2 className="mb-10 text-center text-2xl font-bold text-primary md:text-3xl">You might also like</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {related.map((t) => (
                <TourCard key={t.id} tour={t} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
