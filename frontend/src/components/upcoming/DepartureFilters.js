'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { buildDeparturesUrl, parseDepartureSearchParams } from '@/lib/departureSearch';

const SUB_OPTIONS = [
  { value: '', label: 'All Categories' },
  { value: 'beaches', label: 'Beaches' },
  { value: 'mountains', label: 'Mountains' },
  { value: 'cultural', label: 'Cultural' },
  { value: 'adventure', label: 'Adventure' },
];

const PRICE_OPTIONS = [
  { value: '', label: 'Any Price' },
  { value: 'under-10k', label: 'Under ₹10,000' },
  { value: '10-20k', label: '₹10,000 - ₹20,000' },
  { value: '20k-plus', label: '₹20,000+' },
];

const DURATION_OPTIONS = [
  { value: '', label: 'Any Duration' },
  { value: '3-4', label: '3-4 Days' },
  { value: '5-6', label: '5-6 Days' },
  { value: '7plus', label: '7+ Days' },
];

export default function DepartureFilters() {
  const searchParams = useSearchParams();
  const initial = parseDepartureSearchParams(Object.fromEntries(searchParams.entries()));
  return <DepartureFiltersForm key={searchParams.toString()} initial={initial} />;
}

function DepartureFiltersForm({ initial }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sub, setSub] = useState(initial.sub);
  const [price, setPrice] = useState(initial.price);
  const [duration, setDuration] = useState(initial.duration);

  const applyFilters = (event) => {
    event.preventDefault();
    const current = parseDepartureSearchParams(Object.fromEntries(searchParams.entries()));
    const url = buildDeparturesUrl({ ...current, sub, price, duration });
    router.push(url);
    router.refresh();
  };

  const clearFilters = () => {
    const current = parseDepartureSearchParams(Object.fromEntries(searchParams.entries()));
    const url = buildDeparturesUrl({
      q: current.q,
      month: current.month,
      guests: current.guests,
      sub: '',
      price: '',
      duration: '',
    });
    router.push(url);
    router.refresh();
  };

  const hasActiveFilters = Boolean(sub || price || duration);

  return (
    <form onSubmit={applyFilters} className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-bold text-primary">Quick Filters</h2>
        {hasActiveFilters ? (
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-semibold text-secondary underline hover:text-primary"
          >
            Clear filters
          </button>
        ) : null}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <FilterSelect label="Category" value={sub} onChange={setSub} options={SUB_OPTIONS} />
        <FilterSelect label="Price Range" value={price} onChange={setPrice} options={PRICE_OPTIONS} />
        <FilterSelect label="Duration" value={duration} onChange={setDuration} options={DURATION_OPTIONS} />
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full rounded-lg bg-primary px-6 py-2 font-semibold text-white transition hover:opacity-90"
          >
            Search
          </button>
        </div>
      </div>
    </form>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-foreground">{label}</label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
      >
        {options.map((opt) => (
          <option key={opt.value || 'all'} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
