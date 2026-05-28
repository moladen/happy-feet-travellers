'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import DepartureTourCard from '@/components/tour/DepartureTourCard';

const CARD_WRAP_CLASS =
  'w-[min(86vw,300px)] shrink-0 sm:w-[312px] md:w-[332px] lg:w-[346px] xl:w-[346px]';
const SEQUENCE_GAP_CLASS = 'flex shrink-0 gap-6 md:gap-7 lg:gap-8';

export default function DepartureToursScroll({ tours = [], whatsappNumber, className = '' }) {
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

  const durationSec = Math.max(20, Math.min(48, tours.length * 6));

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
      className={`departure-tours-scroll tour-cards-marquee relative overflow-hidden ${className}`.trim()}
    >
      <div className="departure-tours-scroll__fade departure-tours-scroll__fade--left" aria-hidden />
      <div className="departure-tours-scroll__fade departure-tours-scroll__fade--right" aria-hidden />

      <div
        className={`flex w-max gap-6 px-4 py-2 sm:px-6 md:gap-7 lg:gap-8 lg:px-6 ${
          canMarquee && shiftPx > 0 ? 'tour-cards-marquee-track' : ''
        }`}
        style={trackStyle}
        aria-label="Upcoming group departures"
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
                <DepartureTourCard tour={tour} whatsappNumber={whatsappNumber} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
