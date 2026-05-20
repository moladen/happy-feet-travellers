'use client';

const FALLBACK =
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=80';

function GalleryImage({ src, alt, className = '' }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={`block w-full object-cover ${className}`}
      onError={(event) => {
        if (event.currentTarget.src !== FALLBACK) {
          event.currentTarget.src = FALLBACK;
        }
      }}
    />
  );
}

export default function TripGalleryReel({ images = [] }) {
  const slides = (Array.isArray(images) ? images : []).filter(Boolean);
  const display = slides.length ? slides : [FALLBACK];
  const canAnimate = display.length > 1;
  const loopSets = canAnimate ? [0, 1] : [0];

  if (!canAnimate) {
    return (
      <div className="trip-gallery-marquee flex h-[min(22rem,45vh)] items-center justify-center overflow-hidden rounded-2xl border border-[#eaf4fb] bg-section-alt/45 p-3 shadow-inner sm:h-[26rem]">
        <div className="h-full w-full overflow-hidden rounded-xl border border-white/70 bg-white shadow-sm ring-1 ring-primary/[0.04]">
          <GalleryImage src={display[0]} alt="Trip gallery" className="h-full min-h-[14rem]" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="trip-gallery-marquee relative h-[min(28rem,52vh)] overflow-hidden rounded-2xl border border-[#eaf4fb] bg-section-alt/45 px-3 py-2 shadow-inner sm:h-[32rem]"
      aria-label="Trip gallery photos"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-12 bg-gradient-to-b from-[#eef6fb] via-[#eef6fb]/85 to-transparent sm:h-14"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-12 bg-gradient-to-t from-[#eef6fb] via-[#eef6fb]/85 to-transparent sm:h-14"
        aria-hidden
      />
      <div className="trip-gallery-marquee-track relative z-[1] flex flex-col gap-3 md:gap-4">
        {loopSets.map((setIndex) =>
          display.map((src, idx) => (
            <div
              key={`gallery-${setIndex}-${idx}`}
              aria-hidden={setIndex === 1 ? true : undefined}
              className="shrink-0 overflow-hidden rounded-xl border border-white/70 bg-white shadow-sm ring-1 ring-primary/[0.04]"
            >
              <GalleryImage
                src={src}
                alt={setIndex === 0 ? `Trip photo ${idx + 1}` : ''}
                className="h-40 w-full sm:h-44 md:h-48"
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
