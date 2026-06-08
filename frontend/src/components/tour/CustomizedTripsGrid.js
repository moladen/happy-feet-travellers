'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getPersonalizedTrips } from '@/services/api';
import PersonalizedTourCard from '@/components/tour/PersonalizedTourCard';
import SectionState from '@/components/common/SectionState';
import { USER_MESSAGES } from '@/lib/userMessages';
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
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setFetchError(false);
      const search = parsePersonalizedSearchParams(Object.fromEntries(searchParams.entries()));
      try {
        const raw = await getPersonalizedTrips(buildApiPersonalizedQuery(search));
        if (cancelled) return;
        setTours(Array.isArray(raw) ? raw : []);
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('Error loading personalized tours:', error);
        }
        if (!cancelled) {
          setTours([]);
          setFetchError(true);
        }
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
      <div>
        <SectionState type="loading" loadingKey="experiences" className="mb-6" />
        <div className="personalized-trips-listing__grid" aria-hidden>
          {[0, 1, 2].map((i) => (
            <div key={i} className="personalized-trips-listing__skeleton" />
          ))}
        </div>
      </div>
    );
  }

  const search = parsePersonalizedSearchParams(Object.fromEntries(searchParams.entries()));
  const filtered = hasActivePersonalizedFilters(search);

  if (fetchError) {
    return (
      <SectionState
        type="error"
        className="personalized-trips-listing__empty"
        title="Journeys unavailable"
        message={USER_MESSAGES.serviceUnavailable}
        actionHref="/contact"
        actionLabel="Get in touch"
      />
    );
  }

  if (!tours.length) {
    return (
      <SectionState
        type="empty"
        className="personalized-trips-listing__empty"
        title={filtered ? 'No matching journeys' : 'Journeys coming soon'}
        message={
          filtered ? USER_MESSAGES.noPersonalizedTours : USER_MESSAGES.noContent
        }
        action={
          <Link href="/contact" className="section-state__action section-state__action--primary">
            Build your journey
          </Link>
        }
      />
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
