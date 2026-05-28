'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getPersonalizedTrips } from '@/services/api';
import PersonalizedTourCard from '@/components/tour/PersonalizedTourCard';
import {
  buildApiPersonalizedQuery,
  hasActivePersonalizedFilters,
  parsePersonalizedSearchParams,
} from '@/lib/personalizedTripSearch';

export default function CustomizedTripsGrid() {
  const searchParams = useSearchParams();
  const filterKey = searchParams.toString();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const search = parsePersonalizedSearchParams(Object.fromEntries(searchParams.entries()));
      try {
        const raw = await getPersonalizedTrips(buildApiPersonalizedQuery(search));
        if (cancelled) return;
        setTours(Array.isArray(raw) ? raw : []);
      } catch (error) {
        console.error('Error loading personalized tours:', error);
        if (!cancelled) setTours([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [filterKey]);

  if (loading) {
    return (
      <div className="personalized-trips-listing__grid" aria-hidden>
        {[0, 1, 2].map((i) => (
          <div key={i} className="personalized-trips-listing__skeleton" />
        ))}
      </div>
    );
  }

  const search = parsePersonalizedSearchParams(Object.fromEntries(searchParams.entries()));
  const filtered = hasActivePersonalizedFilters(search);

  if (!tours.length) {
    return (
      <div className="personalized-trips-listing__empty">
        <p>
          {filtered
            ? 'No journeys match these filters — try adjusting experience or region.'
            : 'New personalized journeys are being curated.'}
        </p>
        <Link href="/contact" className="personalized-tours-section__enquiry-btn mt-6 inline-flex">
          Build your journey
        </Link>
      </div>
    );
  }

  return (
    <div className="personalized-trips-listing__grid">
      {tours.map((tour) => (
        <PersonalizedTourCard key={tour.id} tour={tour} variant="experience" />
      ))}
    </div>
  );
}
