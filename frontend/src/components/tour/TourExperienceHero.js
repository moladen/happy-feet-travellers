'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import SafeNextImage from '@/components/common/SafeNextImage';
import { sanitiseStockImageUrl, TRAVEL_FALLBACK_IMAGE } from '@/lib/stockImages';
import { getStartingLocation, getWhyTourIsSpecial } from '@/lib/tourExperienceCopy';
import { resolveTourPriceAmount } from '@/lib/tourPrice';
import {
  buildReserveSeatHref,
  formatReserveSeatLabel,
  isGroupDepartureTour,
} from '@/lib/tourReserve';
import { getTourDateLabelLines, getTourDurationDisplay } from '@/lib/departureExperience';
import { whatsappHref } from '@/lib/siteContact';

const SLIDE_INTERVAL_MS = 4800;

/**
 * @param {{ tour: object; heroImage: string; heroImages?: string[]; whatsappNumber?: string }} props
 */
export default function TourExperienceHero({ tour, heroImage, heroImages = [], whatsappNumber }) {
  const why = getWhyTourIsSpecial(tour);
  const isCustomized = tour.category === 'customized';
  const showReserve = isGroupDepartureTour(tour);
  const price = resolveTourPriceAmount(tour.startingPrice, tour.price);
  const startLocation = getStartingLocation(tour);
  const dateLines = getTourDateLabelLines(tour);
  const durationDisplay = getTourDurationDisplay(tour);
  const dateLabelForMessage = dateLines.join(', ');

  const slides = useMemo(() => {
    const list = [...new Set([heroImage, ...heroImages].map((url) => sanitiseStockImageUrl(url)).filter(Boolean))];
    return list.length ? list : [TRAVEL_FALLBACK_IMAGE];
  }, [heroImage, heroImages]);

  const [activeIndex, setActiveIndex] = useState(0);
  const canSlide = slides.length > 1;

  useEffect(() => {
    if (!canSlide) return undefined;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, SLIDE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [canSlide, slides.length]);

  const waEnquiry = whatsappHref(
    whatsappNumber,
    `Hi, I'm interested in: ${tour.title} (${dateLabelForMessage})`
  );
  const reserveHref = buildReserveSeatHref(tour, whatsappNumber);

  return (
    <section className="tour-experience-hero relative overflow-hidden">
      <div className="tour-experience-hero__media absolute inset-0">
        {slides.map((src, index) => (
          <div
            key={`${src}-${index}`}
            className={`tour-experience-hero__slide ${index === activeIndex ? 'is-active' : ''}`}
            aria-hidden={index !== activeIndex}
          >
            <SafeNextImage
              src={src}
              alt=""
              fill
              priority={index === 0}
              className="tour-experience-hero__slide-img object-cover object-center"
              sizes="100vw"
            />
          </div>
        ))}
        <div className="tour-experience-hero__overlay absolute inset-0" />
      </div>

      <div className="container relative z-10 mx-auto flex min-h-[inherit] max-w-6xl flex-col justify-end px-4 pb-8 pt-16 sm:px-6 md:pb-10 md:pt-20">
        <div className="grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-10">
          <div className="max-w-2xl">
            <p className="tour-experience-hero__eyebrow text-[11px] font-bold uppercase tracking-[0.28em] text-white drop-shadow-sm">
              Happy Feet Travellers
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {why.tags.map((tag) => (
                <span
                  key={tag.label}
                  className="rounded-full border border-white/40 bg-black/25 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm"
                >
                  {tag.icon} {tag.label}
                </span>
              ))}
            </div>

            <h1 className="mt-3 font-display text-[2rem] font-bold leading-[1.08] text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.45)] sm:text-4xl lg:text-[2.75rem] xl:text-5xl">
              {tour.title}
            </h1>

            <p className="mt-3 max-w-xl text-base font-medium leading-relaxed text-white/95 drop-shadow-sm md:text-lg">
              {why.headline}
            </p>

            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-white/95">
              {durationDisplay ? <li>⏱ {durationDisplay}</li> : null}
              <li>📍 Starts {startLocation}</li>
            </ul>

            {dateLines.length ? (
              <div className="tour-experience-hero__dates mt-3 max-w-xl text-sm font-medium text-white/95">
                <span className="tour-experience-hero__dates-icon" aria-hidden>
                  📅
                </span>
                <div className="tour-experience-hero__dates-list">
                  <p className="tour-experience-hero__dates-heading">Dates</p>
                  <ul className="tour-experience-hero__dates-items">
                    {dateLines.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <div className="rounded-xl bg-white px-4 py-2.5 shadow-lg">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary/60">
                  {isCustomized ? 'Starting from' : 'Per traveller'}
                </p>
                <p className="text-2xl font-bold text-primary md:text-3xl">
                  ₹{price.toLocaleString('en-IN')}
                </p>
              </div>
              {tour.offers ? (
                <span className="rounded-full bg-cta px-3 py-1.5 text-xs font-bold text-white shadow-md">
                  {tour.offers}
                </span>
              ) : null}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {showReserve ? (
                <a
                  href={reserveHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-xl bg-[#2E7D32] px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-[#1B5E20]"
                >
                  {formatReserveSeatLabel(tour)}
                </a>
              ) : (
                <a
                  href={waEnquiry}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-xl bg-cta px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-cta-hover"
                >
                  {isCustomized ? 'Plan this journey' : 'Enquire now'}
                </a>
              )}
              <a
                href={waEnquiry}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-xl border border-white/50 bg-white/15 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/25"
              >
                Ask on WhatsApp
              </a>
              <Link
                href="#itinerary"
                className="inline-flex rounded-xl border border-white/35 bg-black/20 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-black/30"
              >
                View itinerary
              </Link>
            </div>

            <ul className="mt-4 flex flex-wrap gap-2">
              {why.vibes.map((vibe) => (
                <li
                  key={vibe}
                  className="rounded-lg border border-white/30 bg-black/20 px-2.5 py-1 text-[11px] font-semibold text-white/95 backdrop-blur-sm"
                >
                  {vibe}
                </li>
              ))}
            </ul>
          </div>

          {canSlide ? (
            <div className="tour-experience-hero__thumbs w-full lg:w-auto">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/90 drop-shadow-sm">
                Photo gallery
              </p>
              <div className="flex max-h-[17rem] gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-y-auto lg:overflow-x-visible">
                {slides.map((src, index) => (
                  <button
                    key={`thumb-${src}-${index}`}
                    type="button"
                    aria-label={`Show photo ${index + 1}`}
                    aria-current={index === activeIndex ? 'true' : undefined}
                    onClick={() => setActiveIndex(index)}
                    className={`tour-experience-hero__thumb relative h-16 w-[5.5rem] shrink-0 overflow-hidden rounded-xl border-2 transition-all sm:h-[4.5rem] sm:w-24 lg:h-[3.75rem] lg:w-[5.75rem] ${
                      index === activeIndex
                        ? 'border-white shadow-[0_8px_24px_rgba(0,0,0,0.35)] ring-2 ring-white/50'
                        : 'border-white/40 opacity-90 hover:border-white/70 hover:opacity-100'
                    }`}
                  >
                    <SafeNextImage src={src} alt="" fill sizes="96px" className="object-cover" />
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
