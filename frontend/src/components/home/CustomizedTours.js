'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { getPersonalizedTrips } from '@/services/api';
import { PERSONALIZED_SECTION_COPY } from '@/lib/personalizedTourCategories';
import PersonalizedCategoryChips from '@/components/personalized/PersonalizedCategoryChips';
import PersonalizedToursScroll from '@/components/tour/PersonalizedToursScroll';
import RannSeasonPromo from '@/components/campaign/RannSeasonPromo';
import SectionState from '@/components/common/SectionState';
import { USER_MESSAGES } from '@/lib/userMessages';

const EASE = [0.22, 1, 0.36, 1];

function SectionHeader() {
  const copy = PERSONALIZED_SECTION_COPY;
  return (
    <header className="personalized-tours-section__header">
      <p className="section-eyebrow mb-2">{copy.eyebrow}</p>
      <h2 className="section-title text-3xl md:text-4xl lg:text-[2.75rem]">{copy.title}</h2>
      <p className="personalized-tours-section__lede">{copy.lede}</p>
    </header>
  );
}

function LoadingSkeleton() {
  return (
    <div className="personalized-tours-section__skeleton" aria-hidden>
      <div className="personalized-tours-section__skeleton-card" />
      <div className="personalized-tours-section__skeleton-card hidden sm:block" />
      <div className="personalized-tours-section__skeleton-card hidden md:block" />
    </div>
  );
}

function DreamTripEnquiry() {
  const copy = PERSONALIZED_SECTION_COPY;
  const assurancePoints = ['Early-bird savings', 'Buddy/group offer', 'Fast WhatsApp support'];
  const trustPoints = ['1200+ happy travellers', 'Comfort-first stays', 'Transparent pricing'];

  return (
    <motion.aside
      className="personalized-tours-section__enquiry"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.5, ease: EASE }}
      aria-labelledby="personalized-enquiry-heading"
    >
      <div className="personalized-tours-section__enquiry-glow" aria-hidden />
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)] md:items-center">
        <div className="hidden md:block">
          <ul className="space-y-2 text-left">
            {assurancePoints.map((item) => (
              <li key={item} className="rounded-lg border border-white/18 bg-white/8 px-3 py-2 text-xs font-semibold text-white/90">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 id="personalized-enquiry-heading" className="personalized-tours-section__enquiry-headline">
            {copy.ctaHeadline}
          </h3>
          <p className="personalized-tours-section__enquiry-text">
            Share destinations, dates, and how you want the journey to feel. Our planners craft a private route with
            honest pricing and comfort at every step.
          </p>
          <div className="personalized-tours-section__enquiry-actions">
            <Link href="/contact" className="personalized-tours-section__enquiry-btn">
              {copy.ctaButton}
              <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link href="/customized-trips" className="personalized-tours-section__enquiry-link">
              View all personalized tours
            </Link>
          </div>
        </div>

        <div className="hidden md:block">
          <ul className="space-y-2 text-left">
            {trustPoints.map((item) => (
              <li key={item} className="rounded-lg border border-white/18 bg-white/8 px-3 py-2 text-xs font-semibold text-white/90">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.aside>
  );
}

export default function CustomizedTours() {
  const reduceMotion = useReducedMotion();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getPersonalizedTrips({ limit: 12, sort: 'featured' });
        if (cancelled) return;
        setTours(Array.isArray(data) ? data : []);
        setFetchError(false);
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('Error fetching personalized tours:', error);
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
  }, []);

  const list = tours.filter((t) => String(t.category || '').trim().toLowerCase() === 'customized');

  return (
    <motion.section
      id="personalized-tours"
      className="personalized-tours-section personalized-tours-section--cinematic customized-tours-section customized-tours-section--cinematic section-ambient section-tone-personalized relative overflow-hidden py-14 md:py-16 lg:py-[4.5rem]"
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.06 }}
      transition={{ duration: 0.55, ease: EASE }}
    >
      <div className="personalized-tours-section__texture customized-tours-section__texture" aria-hidden />
      <div className="personalized-tours-section__atmosphere customized-tours-section__atmosphere" aria-hidden />

      <div className="container relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader />
        <PersonalizedCategoryChips />
        <RannSeasonPromo className="mt-8" />
      </div>

      <div className="personalized-tours-section__cards relative z-10">
        <div className="personalized-tours-section__carousel-wrap customized-tours-section__carousel-wrap">
          {loading ? (
            <div className="container mx-auto max-w-6xl px-4 sm:px-6">
              <SectionState type="loading" loadingKey="experiences" className="mb-4" />
              <LoadingSkeleton />
            </div>
          ) : list.length === 0 ? (
            <div className="container mx-auto max-w-6xl px-4 sm:px-6">
              <SectionState
                type={fetchError ? 'error' : 'empty'}
                className="personalized-tours-section__empty max-w-lg"
                title={fetchError ? 'Journeys unavailable' : 'Your journey awaits'}
                message={
                  fetchError
                    ? USER_MESSAGES.serviceUnavailable
                    : 'Share your dream trip and we will shape a personalized route for you.'
                }
                actionHref="/contact"
                actionLabel="Tell us your dream trip"
              />
            </div>
          ) : (
            <PersonalizedToursScroll
              tours={list}
              cardVariant="experience"
            />
          )}
        </div>
      </div>

      <div className="container relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <DreamTripEnquiry />
      </div>
    </motion.section>
  );
}
