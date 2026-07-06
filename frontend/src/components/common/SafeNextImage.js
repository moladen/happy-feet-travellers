'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { sanitiseStockImageUrl, TRAVEL_FALLBACK_IMAGE } from '@/lib/stockImages';

/**
 * next/image with sanitised src + automatic fallback when a URL 404s or fails to optimise.
 */
export default function SafeNextImage({ src, fallback = TRAVEL_FALLBACK_IMAGE, ...props }) {
  const safeSrc = sanitiseStockImageUrl(src) || fallback;
  const [currentSrc, setCurrentSrc] = useState(safeSrc);

  useEffect(() => {
    setCurrentSrc(safeSrc);
  }, [safeSrc]);

  return (
    <Image
      {...props}
      src={currentSrc || fallback}
      onError={() => {
        if (currentSrc !== fallback) setCurrentSrc(fallback);
      }}
    />
  );
}
