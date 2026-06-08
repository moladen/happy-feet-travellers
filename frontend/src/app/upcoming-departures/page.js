import { Suspense } from 'react';
import Link from 'next/link';
import DepartureTimelineList from '@/components/upcoming/DepartureTimelineList';
import DepartureFilters from '@/components/upcoming/DepartureFilters';
import SearchQueryBanner from '@/components/upcoming/SearchQueryBanner';
import {
  buildApiTourQuery,
  parseDepartureSearchParams,
  tourMatchesDepartureSearch,
} from '@/lib/departureSearch';
import { isFetchFailure } from '@/lib/publicApiError';
import { getUpcomingDepartures } from '@/services/api';
import { getPublicSettings } from '@/services/settingsService';
import RannSeasonPromo from '@/components/campaign/RannSeasonPromo';
import SectionState from '@/components/common/SectionState';
import { USER_MESSAGES } from '@/lib/userMessages';

export const metadata = {
  title: 'Upcoming Departures - Happy Feet Travellers',
  description:
    'Browse upcoming curated group departures across India — honest pricing, full itineraries, and reserve on WhatsApp.',
};

export const dynamic = 'force-dynamic';

export default async function UpcomingDeparturesPage({ searchParams }) {
  const params = await searchParams;
  const search = parseDepartureSearchParams(params);
  let apiError = false;
  let raw = [];
  const settings = await getPublicSettings();

  try {
    raw = await getUpcomingDepartures({
      ...buildApiTourQuery(search),
      limit: 100,
      sort: 'startDate',
    });
  } catch (err) {
    if (isFetchFailure(err)) {
      apiError = true;
      if (process.env.NODE_ENV !== 'production') {
        console.error('[upcoming-departures]', err.message, err.cause);
      }
    } else {
      throw err;
    }
  }

  const tours = Array.isArray(raw) ? raw : [];
  const upcomingTours = tours
    .filter((tour) => String(tour.category ?? '').trim().toLowerCase() === 'upcoming')
    .filter((tour) => tourMatchesDepartureSearch(tour, search));

  const groupedTours = upcomingTours.reduce((acc, tour) => {
    const date = tour.startDate ? new Date(tour.startDate) : new Date();
    const monthYear = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(tour);
    return acc;
  }, {});

  const hasFilters = Boolean(
    search.q?.trim() ||
      search.month?.trim() ||
      search.guests?.trim() ||
      (search.sub && search.sub !== 'all') ||
      search.price ||
      search.duration
  );

  return (
    <div className="upcoming-departures-page min-h-screen">
      <div className="bg-gradient-to-r from-primary to-secondary py-12 text-white">
        <div className="container mx-auto px-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/80">Group departures</p>
          <h1 className="mb-2 font-display text-4xl font-bold text-white md:text-5xl">Upcoming departures</h1>
          <p className="max-w-2xl text-base text-white/88 md:text-lg">
            Curated journeys across India — browse by month, explore full itineraries, and reserve your seat with
            confidence.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-10">
        <RannSeasonPromo variant="page" className="mb-8" />
        <Suspense fallback={null}>
          <SearchQueryBanner />
        </Suspense>

        <Suspense fallback={<div className="mb-8 h-40 animate-pulse rounded-2xl bg-white/80" />}>
          <DepartureFilters />
        </Suspense>

        <div className="upcoming-departures-page__months space-y-10 md:space-y-12">
          {Object.entries(groupedTours).map(([monthYear, monthTours]) => (
            <section key={monthYear} className="upcoming-departures-page__month">
              <div className="upcoming-departures-page__month-head mb-5 flex items-center gap-3 md:mb-6">
                <span className="hidden h-px flex-1 bg-gradient-to-r from-transparent via-[#d4c4a8] to-transparent sm:block" />
                <h2 className="shrink-0 font-display text-xl font-bold text-primary md:text-2xl">{monthYear}</h2>
                <span className="hidden h-px flex-1 bg-gradient-to-r from-transparent via-[#d4c4a8] to-transparent sm:block" />
              </div>
              {monthTours.length > 0 ? (
                <DepartureTimelineList tours={monthTours} whatsappNumber={settings?.whatsappNumber} />
              ) : null}
            </section>
          ))}
        </div>

        {apiError && (
          <SectionState
            type="error"
            className="mb-8 max-w-lg"
            title="Departures unavailable"
            message={USER_MESSAGES.serviceUnavailable}
            actionHref="/contact"
            actionLabel="Contact our team"
          />
        )}

        {!apiError && upcomingTours.length === 0 && (
          <SectionState
            type="empty"
            className="py-4"
            title={hasFilters ? 'No matching departures' : 'No departures scheduled'}
            message={
              hasFilters ? USER_MESSAGES.noDepartures : USER_MESSAGES.noDeparturesScheduled
            }
            action={
              <div className="flex flex-wrap justify-center gap-3">
                {hasFilters ? (
                  <Link href="/upcoming-departures" className="section-state__action">
                    Clear filters
                  </Link>
                ) : null}
                <Link href="/contact" className="section-state__action section-state__action--primary">
                  Plan your journey
                </Link>
              </div>
            }
          />
        )}
      </div>
    </div>
  );
}
