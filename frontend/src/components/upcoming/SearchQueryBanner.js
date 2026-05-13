'use client';

import { useSearchParams } from 'next/navigation';

export default function SearchQueryBanner() {
  const q = useSearchParams().get('q');
  if (!q?.trim()) return null;

  return (
    <div
      className="mb-6 rounded-2xl border border-secondary/40 bg-section-alt px-5 py-4 text-foreground shadow-sm"
      role="status"
    >
      <p className="text-sm">
        <span className="font-semibold text-primary">Search:</span>{' '}
        <span className="text-primary">&quot;{q.trim()}&quot;</span> — use filters below to narrow departures (full search
        plugs into your API later).
      </p>
    </div>
  );
}
