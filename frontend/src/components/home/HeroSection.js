'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { buildDeparturesUrl, monthInputToLabel } from '@/lib/departureSearch';
import { FALLBACK_HERO_SLIDES } from '@/lib/heroSlides';
import { fetchPublicHeroSlides } from '@/services/heroSlidesService';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Typewriter from '@/components/common/Typewriter';

const QUICK_SEARCH = [
  { label: 'Goa', value: 'Goa' },
  { label: 'Himalayas', value: 'Himachal' },
  { label: 'Kerala', value: 'Kerala' },
  { label: 'Sikkim', value: 'Sikkim' },
];

function buildHeroMonthOptions() {
  const options = [{ value: '', label: 'Select month' }];
  const start = new Date();
  start.setDate(1);
  for (let i = 0; i < 24; i += 1) {
    const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    options.push({ value, label });
  }
  return options;
}

const HERO_MONTH_OPTIONS = buildHeroMonthOptions();

const HERO_SEARCH_ICON =
  'grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#f0f6fc] text-primary ring-1 ring-[#dceaf7] sm:h-12 sm:w-12';
const HERO_SEARCH_LABEL =
  'mb-1 block text-[11px] font-semibold uppercase tracking-wide text-[#5f7b94]';
const HERO_SEARCH_INPUT =
  'hero-search-input block w-full border-0 bg-transparent p-0 text-base font-semibold leading-normal text-[#18324b] placeholder:font-normal placeholder:text-[#94a8b8] focus:outline-none focus:ring-0';
const HERO_SEARCH_FIELD =
  'hero-search-field flex min-w-0 flex-1 basis-0 items-center gap-2.5 border-[#e8edf2] p-3.5 sm:gap-3 sm:p-4';
const HERO_SEARCH_FIELD_DESKTOP =
  'md:min-w-0 md:flex-1 md:basis-0 md:max-w-none';
const HERO_SEARCH_SUBMIT_WRAP =
  'flex shrink-0 flex-col border-t border-[#e8edf2] p-3.5 sm:p-4 md:basis-[10.75rem] md:flex-[0_0_10.75rem] md:justify-stretch md:border-l md:border-t-0 md:p-3 md:pl-3 lg:basis-[11.5rem] lg:flex-[0_0_11.5rem] xl:basis-[12.25rem] xl:flex-[0_0_12.25rem]';
const HERO_SEARCH_SUBMIT_BTN =
  'flex min-h-[3rem] w-full flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-gradient-to-r from-cta via-[#e07a5a] to-[#c95a3a] px-4 py-3 text-[15px] font-bold text-white shadow-[0_8px_24px_-6px_rgba(231,111,81,0.65)] transition hover:from-[#d96545] hover:via-[#c95a3a] hover:to-[#b04a2e] hover:shadow-[0_12px_28px_-4px_rgba(231,111,81,0.75)] sm:min-h-[3.125rem] sm:px-5 sm:py-3.5 sm:text-base md:h-full md:min-h-[3.25rem] md:rounded-2xl';
const HERO_SEARCH_SELECT =
  `${HERO_SEARCH_INPUT} cursor-pointer appearance-none bg-[length:1.125rem] bg-[right_0.15rem_center] bg-no-repeat pr-8`;
const HERO_SELECT_ARROW = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%231F4E79'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`;

function HeroWaveFooter() {
  return (
    <svg
      className="hero-wave-footer pointer-events-none block w-full text-[#061525]"
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="heroWaveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0f2844" stopOpacity="0" />
          <stop offset="55%" stopColor="#0f2844" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#030a12" stopOpacity="0.92" />
        </linearGradient>
      </defs>
      <path
        fill="url(#heroWaveGrad)"
        d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,218.7C672,235,768,245,864,234.7C960,224,1056,192,1152,181.3C1248,171,1344,181,1392,186.7L1440,192L1440,320L0,320Z"
      />
      <path
        className="opacity-25"
        fill="#1F4E79"
        d="M0,288L60,272C120,256,240,224,360,213.3C480,203,600,213,720,229.3C840,245,960,267,1080,261.3C1200,256,1320,224,1380,208L1440,192L1440,320L0,320Z"
      />
    </svg>
  );
}

const SLIDE_MS = 7000;
const HERO_CROSSFADE_S = 1.35;
const HERO_EASE = [0.22, 1, 0.36, 1];

function HeroSlideLayer({ item, isActive, reduceMotion, priority }) {
  return (
    <motion.div
      className="hero-slide-layer absolute inset-0 overflow-hidden"
      initial={false}
      animate={{
        opacity: isActive ? 1 : 0,
        scale: reduceMotion ? 1 : isActive ? 1 : 1.05,
      }}
      transition={{
        opacity: { duration: reduceMotion ? 0.25 : HERO_CROSSFADE_S, ease: HERO_EASE },
        scale: { duration: reduceMotion ? 0.25 : HERO_CROSSFADE_S, ease: HERO_EASE },
      }}
      style={{ zIndex: isActive ? 2 : 1 }}
      aria-hidden={!isActive}
    >
      <div
        key={isActive ? `ken-${item.id || item.src}` : `idle-${item.id || item.src}`}
        className={`absolute inset-0 ${isActive && !reduceMotion ? 'hero-ken-burns' : ''}`}
      >
        <Image
          src={item.src}
          alt={isActive ? item.alt : ''}
          fill
          priority={priority}
          sizes="100vw"
          className="object-cover object-[center_38%] saturate-[1.12] contrast-[1.05] sm:object-center"
        />
      </div>
    </motion.div>
  );
}

function HeroDestinationBadge({ current, slide }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={current.id || slide}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.35 }}
        className="inline-flex max-w-full items-center gap-2 rounded-2xl border border-white/25 bg-black/40 px-3.5 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md sm:gap-2.5 sm:px-4 sm:py-2.5"
      >
        <span className="text-lg sm:text-xl" aria-hidden>
          {current.emoji}
        </span>
        <span className="text-[10px] font-bold uppercase leading-snug tracking-wide text-white/95 sm:text-xs sm:whitespace-nowrap">
          {current.tag}
        </span>
      </motion.div>
    </AnimatePresence>
  );
}

export default function HeroSection() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [slides, setSlides] = useState(FALLBACK_HERO_SLIDES);
  const [slide, setSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [monthInput, setMonthInput] = useState('');
  const [datesFlexible, setDatesFlexible] = useState(false);
  const [guests, setGuests] = useState('2');

  useEffect(() => {
    let active = true;
    (async () => {
      const next = await fetchPublicHeroSlides();
      if (!active || !next.length) return;
      setSlides(next);
      setSlide(0);
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!slides.length) return undefined;
    const id = setInterval(() => {
      setSlide((s) => (s + 1) % slides.length);
    }, SLIDE_MS);
    return () => clearInterval(id);
  }, [slides.length]);

  const runSearch = (rawDest) => {
    const dest = (rawDest ?? searchQuery).trim();
    const month = datesFlexible ? '' : monthInputToLabel(monthInput);
    const url = buildDeparturesUrl({
      q: dest,
      month,
      guests,
    });
    router.push(url);
    router.refresh();
  };

  const onSubmitSearch = (e) => {
    e.preventDefault();
    runSearch();
  };

  const current = slides[slide] || slides[0];
  if (!current) return null;

  return (
    <section className="hero-section relative z-0 flex min-h-[100dvh] flex-col bg-[#0a1628]">
      <div className="hero-stage relative min-h-0 flex-1 overflow-hidden">
      {!reduceMotion && (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-[55] h-[3px] bg-black/20"
          aria-hidden
        >
          <motion.div
            key={slide}
            className="h-full bg-gradient-to-r from-cta via-[#7ec8e3] to-cta"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: SLIDE_MS / 1000, ease: 'linear' }}
          />
        </div>
      )}

      {/* Background slides — layered crossfade (entering slide fades in on top) */}
      <div className="hero-slides absolute inset-0 z-0" aria-hidden>
        {slides.map((item, index) => (
          <HeroSlideLayer
            key={item.id || item.src}
            item={item}
            isActive={index === slide}
            reduceMotion={reduceMotion}
            priority={index === 0}
          />
        ))}
      </div>

      {/* Readability overlays — light vignette; bottom scrim only in lower third */}
      <div className="hero-overlays pointer-events-none absolute inset-0 z-[8]" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f1c2e]/48 via-[#1a1030]/18 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_10%_20%,rgba(231,111,81,0.18),transparent_52%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_60%_at_92%_35%,rgba(126,200,227,0.22),transparent_50%)]" />
        <div className="hero-bottom-scrim absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#030712]/80 via-[#030712]/28 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[38%] max-h-[280px] bg-[radial-gradient(ellipse_90%_70%_at_50%_100%,rgba(255,180,120,0.1),transparent_68%)]" />
        <div className="absolute inset-x-0 top-0 h-[22%] bg-gradient-to-b from-[#1a2b3c]/35 to-transparent" />
        <div
          className="hero-mesh-blob animate-blob -left-24 top-1/4 h-64 w-64 bg-cta/30"
          aria-hidden
        />
        <div
          className="hero-mesh-blob animate-blob animation-delay-2000 -right-16 top-[42%] h-72 w-72 bg-[#5a8fa8]/32"
          aria-hidden
        />
      </div>

      {/* Destination tag — desktop: floating right; hidden on smaller screens */}
      <div
        className="pointer-events-none absolute right-6 top-[7.5rem] z-40 hidden lg:block xl:right-10 xl:top-32"
        aria-hidden
      >
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
        >
          <HeroDestinationBadge current={current} slide={slide} />
        </motion.div>
      </div>

      <div className="absolute inset-0 z-30 flex flex-col px-4 pb-6 pt-24 md:px-8 md:pb-8 md:pt-28">
        <div className="container mx-auto flex max-w-6xl flex-1 flex-col justify-end">
          <div className="mb-5 flex flex-col gap-5 sm:mb-6 sm:gap-6 lg:mb-8 lg:gap-7">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="min-w-0 max-w-xl lg:max-w-2xl xl:max-w-3xl"
            >
              <p className="mb-2 inline-flex max-w-full flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.85)] sm:text-[11px] sm:tracking-[0.28em]">
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-cta ring-2 ring-black/40 shadow-[0_0_12px_rgba(231,111,81,0.85)]"
                  aria-hidden
                />
                <span>Happy Feet Travellers</span>
                <span className="rounded-full bg-white/10 px-2 py-0.5 font-bold tracking-[0.18em] text-[#FFE0C2] backdrop-blur-sm">
                  Pune
                </span>
              </p>
              <h1 className="font-display text-[1.5rem] font-bold leading-[1.14] tracking-wide text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)] sm:text-3xl md:text-4xl lg:pr-4 lg:text-[2.35rem] xl:text-5xl">
                <span className="block break-words">
                  {reduceMotion ? (
                    <>
                      Travel Beyond{' '}
                      <span className="bg-gradient-to-r from-[#FFD4A8] via-[#FFE8CF] to-[#7ec8e3] bg-clip-text font-extrabold text-transparent">
                        Ordinary
                      </span>
                    </>
                  ) : (
                    <Typewriter
                      parts={[
                        { text: 'Travel Beyond ', className: 'text-white' },
                        {
                          text: 'Ordinary',
                          className:
                            'bg-gradient-to-r from-[#FFD4A8] via-[#FFE8CF] to-[#7ec8e3] bg-clip-text font-extrabold text-transparent',
                        },
                      ]}
                      speed={115}
                    />
                  )}
                </span>
                <span className="mt-1.5 block text-base font-semibold leading-snug text-[#EAF4FB] sm:mt-2 sm:text-xl md:text-2xl lg:text-[1.65rem] xl:text-3xl">
                  Premium Group Tours &amp; Customized Holidays Across India &amp; Beyond
                </span>
              </h1>

              {/* Mobile / tablet — in-flow badge below title (no overlap) */}
              <div className="mt-3 sm:mt-3.5 lg:hidden" aria-live="polite">
                <HeroDestinationBadge current={current} slide={slide} />
              </div>

              <p className="mt-3 max-w-md text-[0.9375rem] leading-relaxed text-[#EAF4FB]/95 sm:mt-4 sm:text-base">
                Small-group departures from Pune, honest pricing, and custom trips planned by people who&apos;ve travelled
                the route. You bring the dates — we&apos;ll handle the rest.
              </p>
              <div className="mt-4 flex w-full flex-wrap items-stretch gap-2.5 sm:mt-5 sm:items-center sm:gap-3">
                <Link
                  href="/upcoming-departures"
                  className="btn-travel-primary min-h-[2.75rem] flex-1 justify-center px-4 py-2.5 sm:flex-none sm:px-6 sm:py-3"
                >
                  View Tours
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M7 7h10v10" />
                  </svg>
                </Link>
                <Link
                  href="/contact"
                  className="btn-travel-outline min-h-[2.75rem] flex-1 justify-center px-4 py-2.5 sm:flex-none sm:px-5 sm:py-3"
                >
                  Talk to us
                </Link>
              </div>
            </motion.div>

            <motion.div
              id="hero-search"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="w-full min-w-0"
            >
              <div className="mb-3.5 flex items-center gap-2.5 sm:mb-4">
                <motion.span
                  className="inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-cta shadow-[0_0_16px_rgba(231,111,81,0.95)]"
                  animate={reduceMotion ? false : { opacity: [0.65, 1, 0.65], scale: [1, 1.12, 1] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                  aria-hidden
                />
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.55)] sm:text-[13px]">
                  Find your trip
                </p>
              </div>

              <div className="relative w-full">
                <div
                  className="pointer-events-none absolute -inset-1.5 rounded-[1.35rem] bg-gradient-to-br from-cta/50 via-[#7ec8e3]/30 to-[#1F4E79]/40 opacity-90 blur-md sm:-inset-2 sm:rounded-[1.5rem]"
                  aria-hidden
                />
                <motion.form
                  onSubmit={onSubmitSearch}
                  className="hero-search-form relative w-full rounded-2xl bg-white shadow-[0_24px_56px_-14px_rgba(0,0,0,0.5)] ring-1 ring-black/[0.06] transition-shadow focus-within:shadow-[0_28px_60px_-12px_rgba(231,111,81,0.35)] focus-within:ring-2 focus-within:ring-cta/55 sm:rounded-[1.35rem] lg:rounded-3xl"
                  role="search"
                  aria-label="Search trips"
                >
                  <div className="hero-search-bar flex flex-col rounded-2xl sm:rounded-[1.35rem] md:flex-row md:flex-nowrap md:items-stretch lg:rounded-3xl">
                    <label
                      htmlFor="hero-search-q"
                      className={`${HERO_SEARCH_FIELD} ${HERO_SEARCH_FIELD_DESKTOP} cursor-text border-b border-[#e8edf2] focus-within:bg-[#f8fbff] md:border-b-0 md:border-r`}
                    >
                      <span className={HERO_SEARCH_ICON}>
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={HERO_SEARCH_LABEL}>Location</span>
                        <input
                          id="hero-search-q"
                          type="text"
                          name="q"
                          role="searchbox"
                          placeholder="Where to go?"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className={HERO_SEARCH_INPUT}
                          autoComplete="off"
                        />
                      </span>
                    </label>

                    <div
                      className={`${HERO_SEARCH_FIELD} ${HERO_SEARCH_FIELD_DESKTOP} border-b border-[#e8edf2] focus-within:bg-[#f8fbff] md:border-b-0 md:border-r`}
                    >
                      <span className={HERO_SEARCH_ICON}>
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="mb-1 flex items-center justify-between gap-2">
                          <span className={HERO_SEARCH_LABEL}>When</span>
                          <button
                            type="button"
                            onClick={() => {
                              setDatesFlexible((f) => !f);
                              if (!datesFlexible) setMonthInput('');
                            }}
                            className="shrink-0 whitespace-nowrap text-[11px] font-semibold text-secondary underline-offset-2 hover:text-primary hover:underline"
                          >
                            {datesFlexible ? 'Pick month' : 'Flexible?'}
                          </button>
                        </span>
                        {datesFlexible ? (
                          <p className={HERO_SEARCH_INPUT}>Flexible dates</p>
                        ) : (
                          <select
                            id="hero-travel-month"
                            value={monthInput}
                            onChange={(e) => setMonthInput(e.target.value)}
                            className={HERO_SEARCH_SELECT}
                            style={{ backgroundImage: HERO_SELECT_ARROW }}
                            aria-label="Travel month"
                          >
                            {HERO_MONTH_OPTIONS.map((opt) => (
                              <option key={opt.value || 'any'} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        )}
                      </span>
                    </div>

                    <div
                      className={`${HERO_SEARCH_FIELD} ${HERO_SEARCH_FIELD_DESKTOP} border-b border-[#e8edf2] focus-within:bg-[#f8fbff] md:border-b-0 md:border-r`}
                    >
                      <span className={HERO_SEARCH_ICON}>
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={HERO_SEARCH_LABEL}>Guests</span>
                        <select
                          value={guests}
                          onChange={(e) => setGuests(e.target.value)}
                          className={HERO_SEARCH_SELECT}
                          style={{ backgroundImage: HERO_SELECT_ARROW }}
                          aria-label="Number of guests"
                        >
                          <option value="1">1 guest</option>
                          <option value="2">2 guests</option>
                          <option value="3">3 guests</option>
                          <option value="4">4 guests</option>
                          <option value="5">5+ guests</option>
                        </select>
                      </span>
                    </div>

                    <div className={HERO_SEARCH_SUBMIT_WRAP}>
                      <button type="submit" className={HERO_SEARCH_SUBMIT_BTN}>
                        Search trips
                        <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.form>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-2 sm:mt-3.5">
                <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-white/45">
                  Popular
                </span>
                {QUICK_SEARCH.map((chip) => (
                  <motion.button
                    key={chip.value}
                    type="button"
                    whileHover={reduceMotion ? undefined : { y: -1 }}
                    whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                    onClick={() => {
                      setSearchQuery(chip.value);
                      runSearch(chip.value);
                    }}
                    className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm transition hover:border-cta/50 hover:bg-cta/25"
                  >
                    {chip.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="mt-5 flex flex-col gap-4 border-t border-white/15 pt-5 text-white/85 md:mt-6 md:flex-row md:items-center md:justify-between md:gap-6 md:pt-6"
          >
            <div className="flex flex-wrap items-center gap-3 md:gap-4">
              <div className="flex items-center gap-2">
                {slides.map((item, i) => (
                  <button
                    key={item.id || item.src}
                    type="button"
                    onClick={() => setSlide(i)}
                    className={`relative h-11 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all sm:h-12 sm:w-[4.5rem] ${
                      i === slide
                        ? 'hero-thumb-ring border-cta scale-105'
                        : 'border-white/25 opacity-75 hover:border-white/50 hover:opacity-100'
                    }`}
                    aria-label={`Show ${item.tag}`}
                    aria-current={i === slide ? 'true' : undefined}
                  >
                    <Image src={item.src} alt="" fill sizes="72px" className="object-cover" />
                  </button>
                ))}
              </div>
              <p className="text-xs font-semibold text-white sm:text-sm">1000+ travellers · 35+ routes</p>
              <div className="flex -space-x-2">
                {slides.map((item) => (
                  <span
                    key={item.id || item.emoji}
                    className={`grid h-8 w-8 place-items-center rounded-full border-2 border-[#0a1628] bg-white/95 text-xs shadow-sm sm:h-9 sm:w-9 sm:text-sm ${
                      item.emoji === current.emoji ? 'ring-2 ring-cta' : ''
                    }`}
                    aria-hidden
                  >
                    {item.emoji}
                  </span>
                ))}
              </div>
            </div>
            <p className="max-w-md text-xs leading-relaxed text-white/70 sm:text-sm md:text-right">
              Clear inclusions, vetted stays, and WhatsApp support before and during every trip — so you travel with
              confidence.
            </p>
          </motion.div>
        </div>
      </div>
      </div>

      {/* In-flow wave — ends hero cleanly without overlapping the next section */}
      <div className="hero-wave-cap relative z-[5] shrink-0 leading-[0]" aria-hidden>
        <HeroWaveFooter />
      </div>
    </section>
  );
}
