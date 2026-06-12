'use client';

import { useCallback, useEffect } from 'react';

/**
 * Fullscreen image viewer for gallery sections.
 * @param {{ images: Array<{ src: string; alt?: string }>; index: number | null; onClose: () => void; onChangeIndex: (index: number) => void }} props
 */
export default function GalleryLightbox({ images, index, onClose, onChangeIndex }) {
  const hasMultiple = images.length > 1;
  const current = index != null ? images[index] : null;

  const goPrev = useCallback(() => {
    if (index == null || !images.length) return;
    onChangeIndex((index - 1 + images.length) % images.length);
  }, [images.length, index, onChangeIndex]);

  const goNext = useCallback(() => {
    if (index == null || !images.length) return;
    onChangeIndex((index + 1) % images.length);
  }, [images.length, index, onChangeIndex]);

  useEffect(() => {
    if (index == null) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') goPrev();
      if (event.key === 'ArrowRight') goNext();
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [goNext, goPrev, index, onClose]);

  if (index == null || !current) return null;

  return (
    <div
      className="gallery-lightbox fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={current.alt || 'Gallery photo'}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-2xl leading-none text-white transition hover:bg-white/20"
        aria-label="Close gallery"
      >
        ×
      </button>

      {hasMultiple ? (
        <>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              goPrev();
            }}
            className="absolute left-3 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20 sm:grid"
            aria-label="Previous photo"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              goNext();
            }}
            className="absolute right-3 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20 sm:grid"
            aria-label="Next photo"
          >
            ›
          </button>
        </>
      ) : null}

      <div
        className="relative flex max-h-full max-w-full flex-col items-center"
        onClick={(event) => event.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current.src}
          alt={current.alt || 'Gallery photo'}
          draggable={false}
          className="max-h-[min(88vh,900px)] max-w-[min(96vw,1200px)] select-none object-contain"
        />
        {current.alt ? (
          <p className="mt-4 max-w-2xl text-center text-sm text-white/85 sm:text-base">{current.alt}</p>
        ) : null}
        {hasMultiple ? (
          <p className="mt-2 text-xs text-white/55">
            {index + 1} / {images.length}
          </p>
        ) : null}
      </div>
    </div>
  );
}
