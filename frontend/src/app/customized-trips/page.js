import { Suspense } from 'react';
import Link from 'next/link';
import CustomizedTripsGrid from '@/components/tour/CustomizedTripsGrid';
import PersonalizedTripFilters from '@/components/personalized/PersonalizedTripFilters';
import PersonalizedCategoryChips from '@/components/personalized/PersonalizedCategoryChips';
import { PERSONALIZED_SECTION_COPY } from '@/lib/personalizedTourCategories';
import RannSeasonPromo from '@/components/campaign/RannSeasonPromo';
import SectionState from '@/components/common/SectionState';

export const metadata = {
  title: 'Personalized Tours - Happy Feet Travellers',
  description:
    'Journeys crafted around your kind of escape — personalized itineraries, comfort-first planning, and curated experiences across India.',
};

export default function CustomizedTripsPage() {
  const copy = PERSONALIZED_SECTION_COPY;

  return (
    <div className="personalized-trips-listing min-h-screen bg-background">
      <section className="personalized-trips-listing-hero personalized-tours-section--cinematic section-ambient section-tone-sand-soft relative overflow-hidden py-14 md:py-16 lg:py-[4.25rem]">
        <div className="personalized-tours-section__texture" aria-hidden />
        <div className="personalized-tours-section__atmosphere" aria-hidden />
        <div className="container relative z-10 mx-auto max-w-6xl px-4 text-center sm:px-6">
          <p className="section-eyebrow mb-2">{copy.eyebrow}</p>
          <h1 className="section-title text-3xl text-primary md:text-4xl lg:text-[2.75rem]">{copy.title}</h1>
          <p className="personalized-tours-section__lede mx-auto mt-3">{copy.lede}</p>
          <div className="mt-8">
            <PersonalizedCategoryChips />
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
        <RannSeasonPromo variant="page" className="mb-10" />
        <Suspense
          fallback={
            <div className="mb-10 h-32 animate-pulse rounded-2xl bg-white/80" aria-hidden />
          }
        >
          <PersonalizedTripFilters />
        </Suspense>

        <Suspense
          fallback={
            <div>
              <SectionState type="loading" loadingKey="experiences" className="mb-6" />
              <div className="personalized-trips-listing__grid" aria-hidden>
                {[0, 1, 2].map((i) => (
                  <div key={i} className="personalized-trips-listing__skeleton" />
                ))}
              </div>
            </div>
          }
        >
          <CustomizedTripsGrid />
        </Suspense>

        <aside className="personalized-tours-section__enquiry mt-12 md:mt-14">
          <div className="personalized-tours-section__enquiry-glow" aria-hidden />
          <h2 className="personalized-tours-section__enquiry-headline">{copy.ctaHeadline}</h2>
          <p className="personalized-tours-section__enquiry-text">
            Share destinations, dates, and how you want the journey to feel. Our planners shape a private route with
            honest pricing and comfort at every step.
          </p>
          <div className="personalized-tours-section__enquiry-actions">
            <Link href="/contact" className="personalized-tours-section__enquiry-btn">
              {copy.ctaButton}
              <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
