'use client';

import TourCard from '@/components/tour/TourCard';

/**
 * Continuous horizontal auto-scroll for tour cards (no paginated 3-up swiper).
 */
export default function TourCardsAutoScroll({
  tours = [],
  whatsappNumber,
  className = '',
  ariaLabel = 'Tour packages',
}) {
  if (!tours.length) return null;

  const canMarquee = tours.length >= 2;
  const loop = canMarquee ? [...tours, ...tours] : tours;
  const durationSec = Math.max(14, Math.min(32, tours.length * 5));

  return (
    <div
      className={`tour-cards-marquee relative overflow-hidden ${className}`.trim()}
      style={canMarquee ? { '--tour-marquee-duration': `${durationSec}s` } : undefined}
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-4 bg-gradient-to-r from-[var(--marquee-fade,#faf8f4)] from-55% to-transparent sm:w-6 md:w-8"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-4 bg-gradient-to-l from-[var(--marquee-fade,#faf8f4)] from-55% to-transparent sm:w-6 md:w-8"
        aria-hidden
      />

      <div
        className={`flex w-max gap-5 px-1 py-2 md:gap-6 ${canMarquee ? 'tour-cards-marquee-track' : ''}`}
        aria-label={ariaLabel}
      >
        {loop.map((tour, index) => (
          <div
            key={`${tour.id}-${index}`}
            aria-hidden={canMarquee && index >= tours.length ? true : undefined}
            className="w-[min(88vw,300px)] shrink-0 sm:w-[320px] md:w-[340px]"
          >
            <TourCard tour={tour} whatsappNumber={whatsappNumber} />
          </div>
        ))}
      </div>
    </div>
  );
}
