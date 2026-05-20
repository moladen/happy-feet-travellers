'use client';

import TourCardsAutoScroll from '@/components/tour/TourCardsAutoScroll';

export default function RelatedToursScroll({ tours, whatsappNumber }) {
  if (!tours?.length) return null;

  return (
    <TourCardsAutoScroll
      tours={tours}
      whatsappNumber={whatsappNumber}
      ariaLabel="Related tours"
      className="[--marquee-fade:var(--color-off-white)]"
    />
  );
}
