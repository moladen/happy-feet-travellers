import { Suspense } from 'react';
import Link from 'next/link';
import TourCard from '@/components/tour/TourCard';
import DepartureFilters from '@/components/upcoming/DepartureFilters';
import SearchQueryBanner from '@/components/upcoming/SearchQueryBanner';
import {
  buildApiTourQuery,
  parseDepartureSearchParams,
  tourMatchesDepartureSearch,
} from '@/lib/departureSearch';
import { getTours } from '@/services/api';
import { getPublicSettings } from '@/services/settingsService';

export const metadata = {
  title: 'Upcoming Departures - Happy Feet Travellers',
  description: 'Browse upcoming group tours and departures from Pune',
};

/** Always fetch fresh tours from the API (not a static build snapshot). */
export const dynamic = 'force-dynamic';

export default async function UpcomingDeparturesPage({ searchParams }) {
  const params = await searchParams;
  const search = parseDepartureSearchParams(params);
  const [raw, settings] = await Promise.all([
    getTours(buildApiTourQuery(search)),
    getPublicSettings(),
  ]);
  const tours = Array.isArray(raw) ? raw : [];

  const matchesDeparture = (tour) => {
    const c = String(tour.category ?? '')
      .trim()
      .toLowerCase();
    return c === 'upcoming' || c === 'customized' || Boolean(tour.startDate);
  };

  let upcomingTours = tours.filter(matchesDeparture);
  /* Older CMS rows may use different category strings — still list tours instead of an empty page */
  if (upcomingTours.length === 0 && tours.length > 0) {
    upcomingTours = tours;
  }

  upcomingTours = upcomingTours.filter((tour) => tourMatchesDepartureSearch(tour, search));

  const groupedTours = upcomingTours.reduce((acc, tour) => {
    const date = tour.startDate ? new Date(tour.startDate) : new Date();
    const monthYear = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(tour);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-primary to-secondary py-12 text-white">
        <div className="container mx-auto px-4">
          <h1 className="mb-2 text-4xl font-bold text-white">Upcoming Departures</h1>
          <p className="text-blue-100">Month-wise departures, ready for backend-driven updates.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <Suspense fallback={null}>
          <SearchQueryBanner />
        </Suspense>

        <Suspense fallback={<div className="mb-8 h-40 animate-pulse rounded-2xl bg-white/80" />}>
          <DepartureFilters />
        </Suspense>

        <div className="space-y-16">
          {Object.entries(groupedTours).map(([monthYear, monthTours]) => (
            <div key={monthYear} className="relative">
              <div className="mb-8 flex items-center gap-4">
                <span className="hidden h-px flex-1 bg-gradient-to-r from-transparent via-[#dceaf7] to-transparent sm:block" />
                <h2 className="shrink-0 text-2xl font-bold text-primary md:text-3xl">{monthYear}</h2>
                <span className="hidden h-px flex-1 bg-gradient-to-r from-transparent via-[#dceaf7] to-transparent sm:block" />
              </div>
              <div className="rounded-2xl border border-[#eaf4fb] bg-white/80 p-6 md:p-8">
                <p className="mb-8 text-sm text-foreground/75 md:hidden">
                  Each card shows price, full itinerary, and Reserve Seat on WhatsApp — we confirm availability before you pay.
                </p>
                <div className="relative">
                  <div
                    className="absolute bottom-2 left-[11px] top-2 w-0.5 bg-gradient-to-b from-secondary via-[#dceaf7] to-secondary md:left-[15px]"
                    aria-hidden
                  />
                  <ul className="space-y-10">
                    {monthTours.map((tour) => (
                      <li key={tour.id} className="relative pl-10 md:pl-12">
                        <span
                          className="absolute left-0 top-8 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-secondary shadow-sm ring-2 ring-[#eaf4fb] md:top-10 md:h-8 md:w-8"
                          aria-hidden
                        >
                          <span className="h-2 w-2 rounded-full bg-white" />
                        </span>
                        <TourCard tour={tour} whatsappNumber={settings?.whatsappNumber} variant="list" />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {upcomingTours.length === 0 && (
          <div className="py-16 text-center">
            <p className="mb-4 text-xl text-foreground">No tours found. Please try different filters.</p>
            <Link href="/contact" className="rounded-full bg-cta px-5 py-3 font-semibold text-primary">
              Contact Us
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
