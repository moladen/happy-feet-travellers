'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import GalleryLightbox from '@/components/gallery/GalleryLightbox';
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

function GalleryCard({ image, onOpen }) {
  return (
    <article className="home-gallery-marquee__card group relative shrink-0 overflow-hidden rounded-2xl border border-[#eaf4fb] bg-white transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-12px_rgba(15,28,46,0.12)]">
      <button
        type="button"
        onClick={onOpen}
        className="relative block w-full cursor-zoom-in text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
        aria-label={`View full screen: ${image.alt}`}
      >
        <div className="card-shimmer-hover relative aspect-[4/3] w-full overflow-hidden bg-section-alt">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.src}
            alt={image.alt}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="home-gallery-marquee__img h-full w-full select-none object-cover transition duration-500 ease-out group-hover:scale-[1.08] group-hover:brightness-[1.04]"
            onError={(event) => {
              if (event.currentTarget.src !== FALLBACK_IMG) {
                event.currentTarget.src = FALLBACK_IMG;
              }
            }}
            onLoad={(event) => {
              event.currentTarget.dispatchEvent(new CustomEvent('gallery-image-loaded', { bubbles: true }));
            }}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent opacity-80 transition duration-500 group-hover:from-black/75 group-hover:opacity-100" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4 sm:p-5">
            <p className="text-sm font-bold leading-snug text-white drop-shadow-md md:text-base">{image.alt}</p>
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/90 backdrop-blur-sm">
              View
            </span>
          </div>
        </div>
      </button>
    </article>
  );
}

export default function Gallery() {
  const containerRef = useRef(null);
  const sequenceRef = useRef(null);
  const [images, setImages] = useState(PLACEHOLDER);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [shiftPx, setShiftPx] = useState(0);
  const [copyCount, setCopyCount] = useState(2);

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

  const measure = useCallback(() => {
    const container = containerRef.current;
    const sequence = sequenceRef.current;
    if (!container || !sequence || !images.length) return;

    const next = sequence.nextElementSibling;
    const step = next ? next.offsetLeft - sequence.offsetLeft : sequence.offsetWidth;
    if (step <= 0) return;

    const containerWidth = container.clientWidth;
    const copies = Math.max(2, Math.ceil((containerWidth * 2) / step) + 1);
    setShiftPx(step);
    setCopyCount(copies);
  }, [images.length]);

  useEffect(() => {
    measure();
    const container = containerRef.current;
    const sequence = sequenceRef.current;
    if (!container || !sequence) return undefined;

    const ro = new ResizeObserver(() => measure());
    ro.observe(container);
    ro.observe(sequence);
    container.addEventListener('gallery-image-loaded', measure);
    window.addEventListener('resize', measure, { passive: true });

    return () => {
      ro.disconnect();
      container.removeEventListener('gallery-image-loaded', measure);
      window.removeEventListener('resize', measure);
    };
  }, [measure, images]);

  const canMarquee = images.length > 0 && shiftPx > 0;
  const lightboxOpen = lightboxIndex != null;

  const copies = useMemo(
    () => (images.length ? Array.from({ length: copyCount }, (_, index) => index) : []),
    [images.length, copyCount]
  );

  const durationSec = Math.max(28, Math.min(56, images.length * 8));

  const trackStyle = canMarquee
    ? {
        '--gallery-marquee-shift': `${shiftPx}px`,
        '--gallery-marquee-duration': `${durationSec}s`,
      }
    : undefined;

  const trackClass = ['home-gallery-marquee__track', canMarquee ? 'home-gallery-marquee-track' : '']
    .filter(Boolean)
    .join(' ');

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
            From Goa shorelines to Sikkim valleys — glimpses of the landscapes and moments our travel community has
            shared with us.
          </p>
        </div>

        <div
          ref={containerRef}
          className={`home-gallery-marquee relative -mx-1 overflow-hidden rounded-2xl border border-[#dceaf5]/80 bg-white/40 py-2 md:rounded-3xl ${
            lightboxOpen ? 'is-paused' : ''
          }`}
        >
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-4 bg-gradient-to-r from-white from-55% to-transparent sm:w-6 md:w-8"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-4 bg-gradient-to-l from-white from-55% to-transparent sm:w-6 md:w-8"
            aria-hidden
          />

          <div className={trackClass} style={trackStyle} aria-label="Trip photo gallery">
            {copies.map((copyIndex) => (
              <div
                key={`gallery-seq-${copyIndex}`}
                ref={copyIndex === 0 ? sequenceRef : undefined}
                className="home-gallery-marquee__sequence"
                aria-hidden={copyIndex > 0 ? true : undefined}
              >
                {images.map((image, imageIndex) => (
                  <GalleryCard
                    key={`${copyIndex}-${image.id}`}
                    image={image}
                    onOpen={() => setLightboxIndex(imageIndex)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-foreground/60 md:text-sm">
          Click any photo for full screen · hover to pause scroll
        </p>
      </motion.div>

      <GalleryLightbox
        images={images}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onChangeIndex={setLightboxIndex}
      />
    </section>
  );
}
