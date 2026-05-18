import { Suspense } from 'react';
import Link from 'next/link';
import TourCard from '@/components/tour/TourCard';
import SearchQueryBanner from '@/components/upcoming/SearchQueryBanner';
import { getTours } from '@/services/api';

export const metadata = {
  title: 'Upcoming Departures - Happy Feet Travellers',
  description: 'Browse upcoming group tours and departures from Pune',
};

/** Always fetch fresh tours from the API (not a static build snapshot). */
export const dynamic = 'force-dynamic';

function normaliseSearch(value) {
  return String(value || '').trim().toLowerCase();
}

function monthLabel(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' }).toLowerCase();
}

function tourMatchesSearch(tour, query, month) {
  const q = normaliseSearch(query);
  const m = normaliseSearch(month);
  const haystack = [
    tour.title,
    tour.slug,
    tour.description,
    tour.category,
    tour.subCategory,
    tour.departureCity,
    tour.date,
    tour.dateLabel,
    tour.duration,
    tour.durationLabel,
    tour.urgency,
    tour.offers,
    tour.meals,
    tour.stayType,
    tour.transport,
    tour.suitableFor,
    monthLabel(tour.startDate),
    ...(Array.isArray(tour.highlights) ? tour.highlights : []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  const words = q ? q.split(/\s+/).filter(Boolean) : [];
  const queryMatch =
    words.length === 0 || words.every((w) => haystack.includes(w));
  return queryMatch && (!m || haystack.includes(m));
}

export default async function UpcomingDeparturesPage({ searchParams }) {
  const params = await searchParams;
  const query = params?.q || '';
  const month = params?.month || '';
  const raw = await getTours();
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

  upcomingTours = upcomingTours.filter((tour) => tourMatchesSearch(tour, query, month));

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

        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-primary">Quick Filters (UI ready)</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">Category</label>
              <select className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary">
                <option>All Categories</option>
                <option>Beaches</option>
                <option>Mountains</option>
                <option>Cultural</option>
                <option>Adventure</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">Price Range</label>
              <select className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary">
                <option>Any Price</option>
                <option>Under ₹10,000</option>
                <option>₹10,000 - ₹20,000</option>
                <option>₹20,000+</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">Duration</label>
              <select className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary">
                <option>Any Duration</option>
                <option>3-4 Days</option>
                <option>5-6 Days</option>
                <option>7+ Days</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full rounded-lg bg-primary px-6 py-2 text-white transition hover:opacity-90">
                Search
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-16">
          {Object.entries(groupedTours).map(([monthYear, monthTours]) => (
            <div key={monthYear} className="relative">
              <div className="mb-8 flex items-center gap-4">
                <span className="hidden h-px flex-1 bg-gradient-to-r from-transparent via-[#dceaf7] to-transparent sm:block" />
                <h2 className="shrink-0 text-2xl font-bold text-primary md:text-3xl">{monthYear}</h2>
                <span className="hidden h-px flex-1 bg-gradient-to-r from-transparent via-[#dceaf7] to-transparent sm:block" />
              </div>
              <div className="rounded-2xl border border-[#eaf4fb] bg-white/80 p-6 shadow-sm md:p-8">
                <p className="mb-8 text-sm text-foreground/75 md:hidden">
                  Scroll the list—each card shows dates, price, urgency and a link to full details.
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
                        <TourCard tour={tour} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {upcomingTours.length === 0 && (
          <div className="text-center py-16">
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
