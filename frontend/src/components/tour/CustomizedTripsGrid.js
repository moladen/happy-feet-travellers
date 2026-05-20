'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getTours } from '@/services/api';
import { getTourDetailHref, mapTourToPackageCard } from '@/lib/tourDisplay';

export default function CustomizedTripsGrid() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const tours = await getTours('customized');
      if (cancelled) return;
      setPackages(
        (Array.isArray(tours) ? tours : [])
          .map(mapTourToPackageCard)
          .filter(Boolean)
      );
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <p className="py-12 text-center text-gray-600">Loading customized packages…</p>;
  }

  if (!packages.length) {
    return (
      <div className="rounded-lg bg-white p-12 text-center shadow">
        <p className="mb-4 text-gray-600">No customized packages published yet.</p>
        <Link href="/contact" className="font-semibold text-blue-600 underline">
          Contact us for a bespoke itinerary
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {packages.map((pkg) => (
        <div key={pkg.id} className="overflow-hidden rounded-lg bg-white shadow-lg transition hover:shadow-xl">
          <div className="relative h-40 w-full overflow-hidden bg-gray-300">
            <img src={pkg.image} alt={pkg.title} className="h-full w-full object-cover" />
          </div>
          <div className="p-6">
            <h3 className="mb-2 text-xl font-bold text-gray-800">{pkg.title}</h3>
            <div className="mb-2 text-sm font-semibold text-blue-600">⏱️ {pkg.duration}</div>
            <p className="mb-4 line-clamp-3 text-sm text-gray-600">{pkg.detail}</p>
            <div className="mb-4 space-y-1">
              {pkg.highlights.slice(0, 4).map((highlight) => (
                <div key={highlight} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-green-500">✓</span>
                  {highlight}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <div className="text-lg font-bold text-green-600">{pkg.price}</div>
              <Link
                href={getTourDetailHref(pkg)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                {pkg.slug || pkg.id ? 'View details' : 'Customize'}
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
