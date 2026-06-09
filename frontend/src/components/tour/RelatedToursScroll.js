'use client';

import DepartureToursScroll from '@/components/tour/DepartureToursScroll';
import PersonalizedToursScroll from '@/components/tour/PersonalizedToursScroll';

/**
 * @param {{ tours: object[]; whatsappNumber?: string; tourKind?: 'personalized' | 'upcoming' }} props
 */
export default function RelatedToursScroll({ tours, whatsappNumber, tourKind = 'upcoming' }) {
  if (!tours?.length) return null;

  if (tourKind === 'personalized') {
    return <PersonalizedToursScroll tours={tours} cardVariant="experience" />;
  }

  return <DepartureToursScroll tours={tours} whatsappNumber={whatsappNumber} />;
}
