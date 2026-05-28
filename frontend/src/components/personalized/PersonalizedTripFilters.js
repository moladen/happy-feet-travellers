'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  buildCustomizedTripsUrl,
  DURATION_OPTIONS,
  PACKAGE_CATEGORY_OPTIONS,
  parsePersonalizedSearchParams,
  PRICE_OPTIONS,
} from '@/lib/personalizedTripSearch';

export default function PersonalizedTripFilters() {
  const searchParams = useSearchParams();
  const initial = parsePersonalizedSearchParams(Object.fromEntries(searchParams.entries()));
  return <PersonalizedTripFiltersForm key={searchParams.toString()} initial={initial} />;
}

function PersonalizedTripFiltersForm({ initial }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, setState] = useState(initial.state);
  const [category, setCategory] = useState(initial.category);
  const [price, setPrice] = useState(initial.price);
  const [duration, setDuration] = useState(initial.duration);
  const [featured, setFeatured] = useState(initial.featured);

  const applyFilters = (event) => {
    event.preventDefault();
    const current = parsePersonalizedSearchParams(Object.fromEntries(searchParams.entries()));
    const url = buildCustomizedTripsUrl({
      ...current,
      state,
      category,
      price,
      duration,
      featured,
    });
    router.push(url);
    router.refresh();
  };

  const clearFilters = () => {
    const current = parsePersonalizedSearchParams(Object.fromEntries(searchParams.entries()));
    const url = buildCustomizedTripsUrl({
      q: current.q,
      state: '',
      category: '',
      price: '',
      duration: '',
      featured: false,
    });
    router.push(url);
    router.refresh();
  };

  const hasActive = Boolean(state || category || price || duration || featured);

  return (
    <form onSubmit={applyFilters} className="personalized-trips-listing__filters mb-10 rounded-2xl border border-[#e8eef4] bg-white/90 p-5 shadow-[0_12px_32px_-20px_rgba(31,78,121,0.12)] backdrop-blur-sm md:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-bold text-primary">Refine your journey</h2>
        {hasActive ? (
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-semibold text-secondary underline hover:text-primary"
          >
            Clear filters
          </button>
        ) : null}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-foreground/80">State / region</span>
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="e.g. Kerala"
            className="w-full rounded-xl border border-[#dceaf7] px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-foreground/80">Experience</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-[#dceaf7] px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {PACKAGE_CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value || 'all'} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-foreground/80">Budget</span>
          <select
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full rounded-xl border border-[#dceaf7] px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {PRICE_OPTIONS.map((opt) => (
              <option key={opt.value || 'any'} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-foreground/80">Duration</span>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full rounded-xl border border-[#dceaf7] px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {DURATION_OPTIONS.map((opt) => (
              <option key={opt.value || 'any'} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <div className="flex flex-col justify-end gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-foreground/85">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-4 w-4 rounded border-[#c5d6e4] text-primary"
            />
            Featured only
          </label>
          <button type="submit" className="btn-travel-primary w-full py-2.5 text-sm">
            Apply filters
          </button>
        </div>
      </div>
    </form>
  );
}
