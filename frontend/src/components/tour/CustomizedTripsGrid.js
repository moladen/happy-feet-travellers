'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getTours } from '@/services/api';
import { getPublicSettings } from '@/services/settingsService';
import TourCard from '@/components/tour/TourCard';

export default function CustomizedTripsGrid() {
  const [tours, setTours] = useState([]);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [raw, settings] = await Promise.all([getTours('customized'), getPublicSettings()]);
        if (cancelled) return;
        const list = (Array.isArray(raw) ? raw : []).filter(
          (t) => String(t.category || '').trim().toLowerCase() === 'customized'
        );
        setTours(list);
        setWhatsappNumber(settings?.whatsappNumber || '');
      } catch (error) {
        console.error('Error loading customized tours:', error);
        if (!cancelled) setTours([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 items-stretch gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex h-full min-h-[420px] animate-pulse overflow-hidden rounded-3xl border border-[#eaf4fb] bg-white/80"
            aria-hidden
          />
        ))}
      </div>
    );
  }

  if (!tours.length) {
    return (
      <div className="rounded-3xl border border-[#dceaf7] bg-white p-10 text-center shadow-sm md:p-12">
        <p className="mb-4 text-foreground/85">No customized packages published yet.</p>
        <Link href="/contact" className="btn-travel-primary px-6 py-3">
          Contact us for a bespoke itinerary
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 items-stretch gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {tours.map((tour) => (
        <TourCard key={tour.id} tour={tour} whatsappNumber={whatsappNumber} />
      ))}
    </div>
  );
}
