'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PersonalizedTourCard from '@/components/tour/PersonalizedTourCard';

const CARD_WRAP_CLASS =
  'w-[min(90vw,328px)] shrink-0 sm:w-[340px] md:w-[360px] lg:w-[376px] xl:w-[388px]';
const SEQUENCE_GAP_CLASS = 'flex shrink-0 gap-7 md:gap-8 lg:gap-9';

/**
 * Continuous horizontal scroll for personalized tour cards (homepage section).
 */
export default function PersonalizedToursScroll({ tours = [], className = '', cardVariant = 'default' }) {
  const containerRef = useRef(null);
  const sequenceRef = useRef(null);
  const [shiftPx, setShiftPx] = useState(0);
  const [copyCount, setCopyCount] = useState(2);

  const canMarquee = tours.length >= 1;

  const measure = useCallback(() => {
    const container = containerRef.current;
    const sequence = sequenceRef.current;
    if (!container || !sequence || !tours.length) return;

    const next = sequence.nextElementSibling;
    const step = next ? next.offsetLeft - sequence.offsetLeft : sequence.offsetWidth;
    if (step <= 0) return;

    const containerWidth = container.clientWidth;
    const copies = Math.max(2, Math.ceil((containerWidth * 2) / step) + 1);
    setShiftPx(step);
    setCopyCount(copies);
  }, [tours.length]);

  useEffect(() => {
    measure();
    const container = containerRef.current;
    const sequence = sequenceRef.current;
    if (!container || !sequence) return undefined;

    const ro = new ResizeObserver(() => measure());
    ro.observe(container);
    ro.observe(sequence);
    window.addEventListener('resize', measure, { passive: true });

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [measure, tours]);

  const copies = useMemo(
    () => (canMarquee ? Array.from({ length: copyCount }, (_, i) => i) : [0]),
    [canMarquee, copyCount]
  );

  const durationSec = Math.max(22, Math.min(52, tours.length * 7));

  if (!tours.length) return null;

  const trackStyle =
    canMarquee && shiftPx > 0
      ? {
          '--tour-marquee-shift': `${shiftPx}px`,
          '--tour-marquee-duration': `${durationSec}s`,
        }
      : undefined;

  return (
    <div
      ref={containerRef}
      className={`personalized-tours-scroll tour-cards-marquee relative overflow-hidden ${className}`.trim()}
    >
      <div className="personalized-tours-scroll__fade personalized-tours-scroll__fade--left" aria-hidden />
      <div className="personalized-tours-scroll__fade personalized-tours-scroll__fade--right" aria-hidden />

      <div
        className={`flex w-max gap-7 px-5 py-2 sm:px-8 md:gap-8 lg:gap-9 lg:px-10 ${
          canMarquee && shiftPx > 0 ? 'tour-cards-marquee-track' : ''
        }`}
        style={trackStyle}
        aria-label="Personalized tour experiences"
      >
        {copies.map((copyIndex) => (
          <div
            key={`seq-${copyIndex}`}
            ref={copyIndex === 0 ? sequenceRef : undefined}
            className={SEQUENCE_GAP_CLASS}
            aria-hidden={copyIndex > 0 ? true : undefined}
          >
            {tours.map((tour) => (
              <div key={`${copyIndex}-${tour.id}`} className={CARD_WRAP_CLASS}>
                <PersonalizedTourCard tour={tour} variant={cardVariant} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
