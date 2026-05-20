'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { buildDeparturesUrl, parseDepartureSearchParams } from '@/lib/departureSearch';

const PRICE_LABELS = {
  'under-10k': 'Under ₹10,000',
  '10-20k': '₹10,000 – ₹20,000',
  '20k-plus': '₹20,000+',
};

const DURATION_LABELS = {
  '3-4': '3–4 days',
  '5-6': '5–6 days',
  '7plus': '7+ days',
};

const SUB_LABELS = {
  beaches: 'Beaches',
  mountains: 'Mountains',
  cultural: 'Cultural',
  adventure: 'Adventure',
};

export default function SearchQueryBanner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = parseDepartureSearchParams(Object.fromEntries(searchParams.entries()));

  const terms = [
    search.q?.trim() ? `Destination: "${search.q.trim()}"` : '',
    search.month?.trim() ? `When: ${search.month.trim()}` : '',
    search.guests?.trim() ? `Guests: ${search.guests.trim()}` : '',
    search.sub ? `Category: ${SUB_LABELS[search.sub] || search.sub}` : '',
    search.price ? `Price: ${PRICE_LABELS[search.price] || search.price}` : '',
    search.duration ? `Duration: ${DURATION_LABELS[search.duration] || search.duration}` : '',
  ].filter(Boolean);

  if (!terms.length) return null;

  const clearAll = () => {
    router.push('/upcoming-departures');
    router.refresh();
  };

  return (
    <div
      className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-secondary/40 bg-section-alt px-5 py-4 text-foreground shadow-sm"
      role="status"
    >
      <p className="text-sm">
        <span className="font-semibold text-primary">Search:</span>{' '}
        <span className="text-primary">{terms.join(' · ')}</span>
      </p>
      <Link
        href="/upcoming-departures"
        onClick={(event) => {
          event.preventDefault();
          clearAll();
        }}
        className="text-sm font-semibold text-secondary underline hover:text-primary"
      >
        Clear all
      </Link>
    </div>
  );
}
