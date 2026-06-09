'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PersonalizedTourCard from '@/components/tour/PersonalizedTourCard';

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

  const trackClass = [
    'tour-cards-marquee__track',
    canMarquee && shiftPx > 0 ? 'tour-cards-marquee-track' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={containerRef}
      className={`personalized-tours-scroll tour-cards-marquee tour-cards-marquee--personalized ${className}`.trim()}
    >
      <div className={trackClass} style={trackStyle} aria-label="Personalized tour experiences">
        {copies.map((copyIndex) => (
          <div
            key={`seq-${copyIndex}`}
            ref={copyIndex === 0 ? sequenceRef : undefined}
            className="tour-cards-marquee__sequence"
            aria-hidden={copyIndex > 0 ? true : undefined}
          >
            {tours.map((tour) => (
              <div key={`${copyIndex}-${tour.id}`} className="tour-cards-marquee__slot">
                <PersonalizedTourCard tour={tour} variant={cardVariant} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
