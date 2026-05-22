'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import TourCard from '@/components/tour/TourCard';

const CARD_WRAP_CLASS = 'w-[min(88vw,300px)] shrink-0 sm:w-[320px] md:w-[340px]';
const SEQUENCE_GAP_CLASS = 'flex shrink-0 gap-5 md:gap-6';

/**
 * Continuous horizontal auto-scroll — one measured sequence width, duplicated
 * enough to cover the viewport (no white gap at loop reset).
 */
export default function TourCardsAutoScroll({
  tours = [],
  whatsappNumber,
  className = '',
  ariaLabel = 'Tour packages',
}) {
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

  const durationSec = Math.max(18, Math.min(48, tours.length * 6));

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
      className={`tour-cards-marquee relative overflow-hidden ${className}`.trim()}
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
        className={`flex w-max gap-5 px-1 py-2 md:gap-6 ${
          canMarquee && shiftPx > 0 ? 'tour-cards-marquee-track' : ''
        }`}
        style={trackStyle}
        aria-label={ariaLabel}
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
                <TourCard tour={tour} whatsappNumber={whatsappNumber} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
