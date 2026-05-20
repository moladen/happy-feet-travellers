'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { getGalleryImages } from '@/services/galleryService';

const PLACEHOLDER = [
  {
    id: 'ph-1',
    src: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=80',
    alt: 'Houseboat in the Kerala backwaters',
  },
  {
    id: 'ph-2',
    src: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=900&q=80',
    alt: 'Mountain road in Sikkim',
  },
  {
    id: 'ph-3',
    src: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=80',
    alt: 'Goa coastline',
  },
  {
    id: 'ph-4',
    src: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=900&q=80',
    alt: 'Rajasthan fort at golden hour',
  },
  {
    id: 'ph-5',
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80',
    alt: 'Snow-covered mountain trail',
  },
];

const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=80';

export default function Gallery() {
  const [images, setImages] = useState(PLACEHOLDER);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const rows = await getGalleryImages();
      if (cancelled) return;
      setImages(rows.length > 0 ? rows : PLACEHOLDER);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const loop = useMemo(() => {
    if (!images.length) return [];
    return [...images, ...images];
  }, [images]);

  const canMarquee = images.length > 0;

  return (
    <section
      id="gallery"
      className="section-ambient section-tone-white relative overflow-hidden pb-14 pt-12 md:pb-16 md:pt-14"
    >
      <motion.div
        className="container relative z-10 mx-auto px-4"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-7 text-center md:mb-9">
          <p className="section-eyebrow mb-2">Gallery</p>
          <h2 className="section-title mb-2.5 text-3xl md:text-4xl lg:text-5xl">Postcards from our trips</h2>
          <p className="mx-auto max-w-2xl text-base text-foreground/85 md:text-lg">
            From Goa shorelines to Sikkim valleys — a peek into the places our Pune travellers have explored with us.
          </p>
        </div>

        <div className="home-gallery-marquee relative -mx-1 overflow-hidden rounded-2xl border border-[#dceaf5]/80 bg-white/40 py-2 md:rounded-3xl">
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-4 bg-gradient-to-r from-white from-55% to-transparent sm:w-6 md:w-8"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-4 bg-gradient-to-l from-white from-55% to-transparent sm:w-6 md:w-8"
            aria-hidden
          />

          <div
            className={`flex w-max gap-4 px-2 py-1 md:gap-5 ${canMarquee ? 'home-gallery-marquee-track' : ''}`}
            aria-label="Trip photo gallery"
          >
            {loop.map((image, index) => (
              <article
                key={`${image.id}-${index}`}
                aria-hidden={index >= images.length ? true : undefined}
                className="group relative w-[min(78vw,260px)] shrink-0 overflow-hidden rounded-2xl border border-[#eaf4fb] bg-white transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-12px_rgba(15,28,46,0.12)] sm:w-[300px] md:w-[320px]"
              >
                <div className="card-shimmer-hover relative aspect-[4/3] w-full overflow-hidden bg-section-alt">
                  <img
                    src={image.src}
                    alt={image.alt}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.08] group-hover:brightness-[1.04]"
                    onError={(event) => {
                      if (event.currentTarget.src !== FALLBACK_IMG) {
                        event.currentTarget.src = FALLBACK_IMG;
                      }
                    }}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent opacity-80 transition duration-500 group-hover:from-black/75 group-hover:opacity-100" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-start p-4 sm:p-5">
                    <p className="text-sm font-bold leading-snug text-white drop-shadow-md md:text-base">{image.alt}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-foreground/60 md:text-sm">Hover to pause · photos scroll automatically</p>
      </motion.div>
    </section>
  );
}
