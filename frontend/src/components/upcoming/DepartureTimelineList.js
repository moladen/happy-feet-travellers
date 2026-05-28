'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import DepartureTourCard from '@/components/tour/DepartureTourCard';

const INDICATOR_SIZE = { mobile: 24, desktop: 32 };

function useActiveTimelineIndex(itemRefs, count) {
  const [activeIndex, setActiveIndex] = useState(0);
  const ratiosRef = useRef({});

  useEffect(() => {
    const elements = itemRefs.current.filter(Boolean);
    if (!elements.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = Number(entry.target.dataset.timelineIndex);
          if (Number.isNaN(idx)) return;
          ratiosRef.current[idx] = entry.isIntersecting ? entry.intersectionRatio : 0;
        });

        let bestIdx = 0;
        let bestRatio = -1;
        for (let i = 0; i < count; i += 1) {
          const ratio = ratiosRef.current[i] ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestIdx = i;
          }
        }
        if (bestRatio > 0) setActiveIndex(bestIdx);
      },
      {
        root: null,
        rootMargin: '-18% 0px -22% 0px',
        threshold: [0, 0.12, 0.25, 0.4, 0.55, 0.7, 0.85, 1],
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [count]);

  return activeIndex;
}

export default function DepartureTimelineList({ tours = [], whatsappNumber }) {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef(null);
  const itemRefs = useRef([]);
  const anchorRefs = useRef([]);
  const [indicatorY, setIndicatorY] = useState(0);
  const [progressHeight, setProgressHeight] = useState(0);
  const [indicatorSize, setIndicatorSize] = useState(INDICATOR_SIZE.mobile);

  const activeIndex = useActiveTimelineIndex(itemRefs, tours.length);

  const measureIndicator = useCallback(() => {
    const container = containerRef.current;
    const anchor = anchorRefs.current[activeIndex];
    if (!container || !anchor) return;

    const containerRect = container.getBoundingClientRect();
    const anchorRect = anchor.getBoundingClientRect();
    const centerY = anchorRect.top + anchorRect.height / 2 - containerRect.top;

    setIndicatorY(centerY);
    setProgressHeight(Math.max(0, centerY));
    setIndicatorSize(
      typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches
        ? INDICATOR_SIZE.desktop
        : INDICATOR_SIZE.mobile
    );
  }, [activeIndex]);

  useLayoutEffect(() => {
    measureIndicator();
  }, [measureIndicator, tours.length]);

  useEffect(() => {
    const onScrollOrResize = () => measureIndicator();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [measureIndicator]);

  if (!tours.length) return null;

  const transition = reduceMotion
    ? { duration: 0 }
    : { type: 'spring', stiffness: 320, damping: 32, mass: 0.85 };

  const scrollToIndex = (index) => {
    itemRefs.current[index]?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
  };

  return (
    <div ref={containerRef} className="departure-timeline relative" aria-label="Departure timeline">
      <div className="departure-timeline__track" aria-hidden />
      <div
        className="departure-timeline__progress"
        style={{ height: `${progressHeight}px` }}
        aria-hidden
      />
      <motion.div
        className="departure-timeline__indicator"
        aria-hidden
        initial={false}
        animate={{
          y: indicatorY - indicatorSize / 2,
          width: indicatorSize,
          height: indicatorSize,
        }}
        transition={transition}
      >
        <span className="departure-timeline__indicator-ring" />
        <span className="departure-timeline__indicator-core" />
        <span className="departure-timeline__indicator-dot" />
      </motion.div>

      <ul className="departure-timeline__list space-y-6 md:space-y-7">
        {tours.map((tour, index) => {
          const isActive = index === activeIndex;
          return (
            <li
              key={tour.id}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              data-timeline-index={index}
              className={`departure-timeline__item relative pl-10 md:pl-12 ${
                isActive ? 'departure-timeline__item--active' : ''
              }`}
            >
              <span
                ref={(el) => {
                  anchorRefs.current[index] = el;
                }}
                className="departure-timeline__anchor pointer-events-none absolute left-0 top-8 md:top-10"
                aria-hidden
              />
              <button
                type="button"
                onClick={() => scrollToIndex(index)}
                className="departure-timeline__hit absolute left-0 top-6 z-[2] h-10 w-10 rounded-full md:top-8 md:h-12 md:w-12"
                aria-label={`Go to ${tour.title}`}
                aria-current={isActive ? 'step' : undefined}
              />
              <DepartureTourCard
                tour={tour}
                whatsappNumber={whatsappNumber}
                className="departure-tour-card--timeline"
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
