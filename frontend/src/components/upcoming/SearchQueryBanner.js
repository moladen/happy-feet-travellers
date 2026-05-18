'use client';

import { useSearchParams } from 'next/navigation';

export default function SearchQueryBanner() {
  const params = useSearchParams();
  const q = params.get('q');
  const month = params.get('month');
  const guests = params.get('guests');

  const terms = [
    q?.trim() ? `Destination: "${q.trim()}"` : '',
    month?.trim() ? `When: ${month.trim()}` : '',
    guests?.trim() ? `Guests: ${guests.trim()}` : '',
  ].filter(Boolean);

  if (!terms.length) return null;

  return (
    <div
      className="mb-6 rounded-2xl border border-secondary/40 bg-section-alt px-5 py-4 text-foreground shadow-sm"
      role="status"
    >
      <p className="text-sm">
        <span className="font-semibold text-primary">Search:</span>{' '}
        <span className="text-primary">{terms.join(' · ')}</span>
      </p>
    </div>
  );
}
