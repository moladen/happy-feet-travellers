'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { getUpcomingDepartures } from '@/services/api';
import { getPublicSettings } from '@/services/settingsService';
import DepartureToursScroll from '@/components/tour/DepartureToursScroll';

const EASE = [0.22, 1, 0.36, 1];

const TRUST_PILLARS = [
  {
    id: 'batches',
    label: 'Small curated batches',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" aria-hidden>
        <circle cx="7" cy="7" r="2.25" stroke="currentColor" strokeWidth="1.35" />
        <circle cx="13" cy="7" r="2.25" stroke="currentColor" strokeWidth="1.35" />
        <path d="M3.5 15.5c.8-2.2 2.4-3.5 4.5-3.5s3.7 1.3 4.5 3.5" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
        <path d="M11.5 12c.9-1.6 2.1-2.5 3.5-2.5 2 0 3.4 1.4 4 3.5" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'comfort',
    label: 'Comfort-first group travel',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" aria-hidden>
        <path d="M4 10.5 10 5l6 5.5" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6.5 10v5.5h7V10" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 15.5h14" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'experience',
    label: 'Experience over checklists',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" aria-hidden>
        <path d="M10 3.5l1.4 3.8 4 .35-3 2.6.9 3.9L10 12.2 6.7 14.1l.9-3.9-3-2.6 4-.35L10 3.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
    ),
  },
];

function TrustRibbon() {
  return (
    <div className="upcoming-departures-section__trust-ribbon" role="list" aria-label="Group travel promise">
      {TRUST_PILLARS.map((pillar, index) => (
        <div key={pillar.id} className="upcoming-departures-section__trust-item-wrap" role="listitem">
          {index > 0 ? (
            <span className="upcoming-departures-section__trust-divider" aria-hidden />
          ) : null}
          <span className="upcoming-departures-section__trust-item">
            <span className="upcoming-departures-section__trust-icon">{pillar.icon}</span>
            <span className="upcoming-departures-section__trust-label">{pillar.label}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

function SectionHeader({ lede }) {
  return (
    <header className="upcoming-departures-section__header">
      <p className="section-eyebrow mb-2">Curated group journeys</p>
      <h2 className="section-title text-3xl md:text-4xl lg:text-[2.75rem]">Upcoming group departures</h2>
      <p className="upcoming-departures-section__lede">{lede}</p>
      <TrustRibbon />
    </header>
  );
}

function LoadingSkeleton() {
  return (
    <div className="upcoming-departures-section__skeleton" aria-hidden>
      <div className="upcoming-departures-section__skeleton-card" />
      <div className="upcoming-departures-section__skeleton-card hidden sm:block" />
      <div className="upcoming-departures-section__skeleton-card hidden md:block" />
    </div>
  );
}

export default function TripsCarousel() {
  const reduceMotion = useReducedMotion();
  const [tours, setTours] = useState([]);
  const [whatsappNumber, setWhatsappNumber] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [data, settings] = await Promise.all([
          getUpcomingDepartures({ limit: 50, sort: 'startDate' }),
          getPublicSettings(),
        ]);
        if (cancelled) return;
        setTours(Array.isArray(data) ? data : []);
        setWhatsappNumber(settings?.whatsappNumber ?? null);
        setFetchError(false);
      } catch (error) {
        console.error('Error fetching tours:', error);
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
  }, []);

  const list = [...tours].sort((a, b) => {
    const ta = a.startDate ? new Date(a.startDate).getTime() : 0;
    const tb = b.startDate ? new Date(b.startDate).getTime() : 0;
    return ta - tb;
  });

  const lede = loading
    ? 'Fixed-date journeys across India — intimate groups, honest pricing, and routes chosen for how they feel.'
    : 'Join a small, well-paced group for landscapes you have only dreamed about. Every departure is planned for connection and comfort — not just filling seats.';

  return (
    <motion.section
      id="upcoming-departures"
      className="upcoming-departures-section upcoming-departures-section--cinematic section-ambient section-tone-departures relative z-[1] overflow-hidden py-14 md:py-16 lg:py-[4.5rem]"
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.55, ease: EASE }}
    >
      <div className="upcoming-departures-section__texture" aria-hidden />
      <div className="upcoming-departures-section__atmosphere" aria-hidden />
      <div className="container relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader lede={lede} />
      </div>

      <div className="upcoming-departures-section__carousel-wrap upcoming-departures-section__carousel-wrap--fullbleed relative z-10">
        {loading ? (
          <div className="container mx-auto max-w-6xl px-4 sm:px-6">
            <LoadingSkeleton />
          </div>
          ) : list.length === 0 ? (
            <p className="upcoming-departures-section__empty container mx-auto max-w-6xl px-4 sm:px-6">
              {fetchError ? (
                <>
                  Could not reach the API — start the backend (<code className="text-sm">npm run dev</code> in{' '}
                  <code className="text-sm">backend</code>) and check{' '}
                  <code className="text-sm">frontend/.env.local</code>.
                </>
              ) : (
                <>
                  New departures are being curated —{' '}
                  <Link href="/contact" className="font-semibold text-primary underline-offset-2 hover:underline">
                    tell us where you want to go
                  </Link>
                  .
                </>
              )}
            </p>
          ) : (
          <DepartureToursScroll
            tours={list}
            whatsappNumber={whatsappNumber}
            className="[--marquee-fade:var(--departures-fade,#ede5d6)]"
          />
        )}
      </div>

      {!loading && list.length > 0 ? (
        <div className="container relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            className="upcoming-departures-section__footer-cta"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <Link href="/upcoming-departures" className="upcoming-departures-section__view-all">
              Discover every departure
              <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      ) : null}
    </motion.section>
  );
}
