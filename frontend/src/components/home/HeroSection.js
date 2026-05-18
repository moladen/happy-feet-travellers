'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Typewriter from '@/components/common/Typewriter';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1486870591958-9b29d091d04a?auto=format&fit=crop&w=1920&q=80',
];

const QUICK_SEARCH = [
  { label: 'Goa', value: 'Goa' },
  { label: 'Himalayas', value: 'Himachal' },
  { label: 'Kerala', value: 'Kerala' },
  { label: 'Sikkim', value: 'Sikkim' },
];

function MountainSilhouette() {
  return (
    <svg
      className="pointer-events-none absolute bottom-0 left-0 z-[15] h-[min(34vh,300px)] w-full min-h-[160px] text-[#061525] sm:h-[min(32vh,280px)]"
      viewBox="0 0 1440 420"
      preserveAspectRatio="none"
      fill="currentColor"
      aria-hidden
    >
      <defs>
        <linearGradient id="heroMountainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0c2138" />
          <stop offset="100%" stopColor="#030a12" />
        </linearGradient>
      </defs>
      <path
        fill="url(#heroMountainGrad)"
        d="M0,420 L0,240 L120,180 L220,220 L340,120 L480,200 L620,80 L780,190 L920,100 L1080,210 L1240,140 L1320,200 L1440,160 L1440,420 Z"
      />
      <path
        className="opacity-[0.35]"
        fill="#1F4E79"
        d="M0,420 L0,280 L180,220 L280,260 L400,180 L520,240 L680,150 L840,230 L1000,170 L1160,240 L1280,200 L1440,250 L1440,420 Z"
      />
    </svg>
  );
}

const SLIDE_MS = 7000;

export default function HeroSection() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [slide, setSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [travelMonth, setTravelMonth] = useState('');
  const [guests, setGuests] = useState('2');

  useEffect(() => {
    const id = setInterval(() => {
      setSlide((s) => (s + 1) % HERO_IMAGES.length);
    }, SLIDE_MS);
    return () => clearInterval(id);
  }, [slide]);

  const runSearch = (rawDest) => {
    const dest = (rawDest ?? searchQuery).trim();
    const params = new URLSearchParams();
    if (dest) params.set('q', dest);
    if (travelMonth.trim()) params.set('month', travelMonth.trim());
    if (guests) params.set('guests', guests);

    if (params.toString()) {
      router.push(`/upcoming-departures?${params.toString()}`);
      return;
    }
    router.push('/upcoming-departures');
  };

  const onSubmitSearch = (e) => {
    e.preventDefault();
    runSearch();
  };

  return (
    <section className="relative min-h-[min(100dvh,920px)] overflow-hidden bg-[#0a1628] md:min-h-screen">
      {!reduceMotion && (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-[55] h-[3px] bg-black/20"
          aria-hidden
        >
          <motion.div
            key={slide}
            className="h-full bg-gradient-to-r from-cta via-[#ffc078] to-cta"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: SLIDE_MS / 1000, ease: 'linear' }}
          />
        </div>
      )}

      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={slide}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMAGES[slide]})` }}
        />
      </AnimatePresence>

      {/* Readability: soft top, stronger bottom like reference */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/75" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-[#1F4E79]/28" />

      {/* Light depth layer behind mountains (no competing headline text) */}
      <div
        className="pointer-events-none absolute inset-0 z-[5] bg-[radial-gradient(ellipse_80%_60%_at_50%_35%,rgba(255,255,255,0.06),transparent_65%)]"
        aria-hidden
      />

      {/* Soft spotlight toward bottom-right — guides eye to search without extra UI chrome */}
      <div
        className="pointer-events-none absolute inset-0 z-[8] bg-[radial-gradient(ellipse_70%_50%_at_82%_58%,rgba(255,200,140,0.1),transparent_55%)] md:bg-[radial-gradient(ellipse_65%_48%_at_78%_56%,rgba(255,210,160,0.11),transparent_52%)]"
        aria-hidden
      />

      <MountainSilhouette />

      <div className="absolute inset-0 z-30 flex flex-col px-4 pb-8 pt-24 md:px-8 md:pb-10 md:pt-28">
        <div className="container mx-auto flex max-w-6xl flex-1 flex-col justify-end">
          {/* Document headline + booking (tight vertical rhythm) */}
          <div className="mb-6 grid gap-6 lg:mb-8 lg:grid-cols-2 lg:items-end lg:gap-8 xl:gap-10">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="max-w-xl lg:max-w-lg xl:max-w-xl"
            >
              <p className="mb-2 inline-flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.85)]">
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-cta ring-2 ring-black/40 shadow-[0_0_0_1px_rgba(255,255,255,0.25)]"
                  aria-hidden
                />
                <span>Happy Feet Travellers</span>
                <span className="font-bold tracking-[0.22em] text-[#FFE0C2] [text-shadow:0_1px_3px_rgba(0,0,0,0.9),0_0_12px_rgba(0,0,0,0.45)]">
                  · Pune
                </span>
              </p>
              <h1 className="text-[1.65rem] font-extrabold leading-[1.12] tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)] sm:text-3xl md:text-4xl lg:text-[2.35rem] xl:text-5xl">
                <span className="block">
                  <Typewriter
                    parts={[
                      { text: 'Affordable Group Tours from ', className: 'text-white' },
                      {
                        text: 'Pune',
                        className:
                          'font-extrabold text-[#FFD4A8] [text-shadow:0_1px_0_rgba(0,0,0,0.9),0_2px_14px_rgba(0,0,0,0.75),0_0_1px_rgba(0,0,0,0.9)] sm:text-[#FFE8CF]',
                      },
                    ]}
                    speed={115}
                  />
                </span>
                <span className="mt-1.5 block sm:mt-2">
                  <span className="text-white/95">Trusted by </span>
                  <span className="font-extrabold text-[#D4EDFF] [text-shadow:0_1px_0_rgba(0,0,0,0.75),0_2px_12px_rgba(0,0,0,0.65)]">
                    1000+ Travelers
                  </span>
                </span>
              </h1>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-[#EAF4FB]/95 sm:mt-4 sm:text-base">
                Small-group departures from Pune, honest pricing, and custom trips planned by people who&apos;ve travelled
                the route. You bring the dates — we&apos;ll handle the rest.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2.5 sm:mt-5 sm:gap-3">
                <Link
                  href="/upcoming-departures"
                  className="inline-flex items-center gap-2 rounded-full bg-cta px-5 py-2.5 text-sm font-semibold text-[#1F4E79] shadow-md ring-2 ring-black/10 transition hover:bg-[#E76F51] hover:text-white hover:ring-white/20 sm:px-6 sm:py-3"
                >
                  View Tours
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M7 7h10v10" />
                  </svg>
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/95 shadow-sm backdrop-blur-sm transition hover:border-white/55 hover:bg-white/12 sm:px-5 sm:py-3"
                >
                  Talk to us
                </Link>
              </div>
              <p className="mt-2.5 hidden max-w-sm text-[11px] leading-snug text-white/55 sm:block lg:mt-3">
                Have dates in mind? Use the search on the right — we&apos;ll match departures from Pune.
              </p>
            </motion.div>

            <motion.div
              id="hero-search"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="w-full min-w-0 lg:justify-self-end"
            >
              <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 lg:mb-3">
                <div className="flex items-center gap-2">
                  <motion.span
                    className="inline-flex h-2 w-2 shrink-0 rounded-full bg-cta shadow-[0_0_14px_rgba(247,147,30,0.9)]"
                    animate={
                      reduceMotion
                        ? false
                        : { opacity: [0.65, 1, 0.65], scale: [1, 1.08, 1] }
                    }
                    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                    aria-hidden
                  />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.55)]">
                    Find your trip
                  </p>
                </div>
                <p className="max-w-[14rem] text-[11px] font-medium leading-snug tracking-wide text-white/65 sm:max-w-none lg:ml-auto lg:text-right">
                  Step 1: place &amp; month · Step 2: guests · Step 3: search trips.
                </p>
              </div>
              <div className="relative">
                <div
                  className="pointer-events-none absolute -inset-[2px] rounded-[1.1rem] bg-gradient-to-br from-cta/45 via-white/25 to-[#1F4E79]/35 opacity-80 blur-[1.5px] lg:-inset-[3px] lg:rounded-[1.65rem]"
                  aria-hidden
                />
                <motion.form
                  onSubmit={onSubmitSearch}
                  initial={{ boxShadow: '0 12px 32px -14px rgba(0,0,0,0.35)' }}
                  animate={{ boxShadow: '0 22px 50px -18px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.12)' }}
                  transition={{ duration: 0.85, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="relative rounded-2xl bg-white shadow-[0_16px_40px_-12px_rgba(0,0,0,0.4)] ring-1 ring-black/5 transition-shadow duration-300 focus-within:ring-2 focus-within:ring-cta/55 focus-within:ring-offset-2 focus-within:ring-offset-[#0a1628]/80 lg:rounded-3xl lg:shadow-2xl"
                  role="search"
                  aria-label="Search trips"
                >
                {/* Below lg: vertical stack. lg+: balanced columns — avoid max(8rem) on guests (was clipping words). */}
                <div className="grid grid-cols-1 divide-y divide-[#e8edf2] overflow-hidden rounded-2xl lg:grid-cols-[minmax(12rem,1.55fr)_minmax(10rem,1.05fr)_minmax(11.5rem,0.95fr)_minmax(10.5rem,max-content)] lg:divide-x lg:divide-y-0 lg:items-stretch lg:rounded-3xl">
                  <label className="group flex min-h-[3.9rem] cursor-text items-center gap-3 px-4 py-3 transition-colors focus-within:bg-[#f8fbff] sm:px-5 lg:min-h-[4.25rem] lg:pl-6 lg:pr-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#f4f9fd] text-primary ring-1 ring-[#dceaf7] transition group-focus-within:bg-white md:h-10 md:w-10">
                      <svg className="h-[18px] w-[18px] md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </span>
                    <span className="min-w-0 flex-1 py-0.5">
                      <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#5f7b94]">
                        Location
                      </span>
                      <input
                        type="text"
                        name="q"
                        role="searchbox"
                        inputMode="search"
                        enterKeyHint="search"
                        placeholder="Where do you want to go?"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full min-w-0 appearance-none border-0 bg-transparent p-0 text-[0.95rem] font-semibold text-[#18324b] placeholder:font-normal placeholder:text-[#8ba0b2] focus:outline-none focus:ring-0"
                        autoComplete="off"
                        spellCheck={false}
                      />
                    </span>
                  </label>

                  <label className="flex min-h-[3.75rem] cursor-text items-center gap-3 px-4 py-3 sm:px-5 lg:min-h-[4.25rem] lg:px-4">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-section-alt text-primary md:h-10 md:w-10">
                      <svg className="h-[18px] w-[18px] md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <span className="min-w-0 flex-1 py-0.5">
                      <span className="mb-0.5 block text-[10px] font-bold uppercase tracking-wider text-[#2B2B2B]/50">
                        When
                      </span>
                      <input
                        type="text"
                        placeholder="May 2026 · flexible"
                        value={travelMonth}
                        onChange={(e) => setTravelMonth(e.target.value)}
                        className="w-full min-w-0 border-0 bg-transparent p-0 text-sm font-semibold text-[#2B2B2B] placeholder:font-normal placeholder:text-gray-400 focus:outline-none lg:text-[0.9375rem]"
                      />
                    </span>
                  </label>

                  <div className="flex min-h-[3.75rem] items-center gap-3 px-4 py-3 sm:px-5 lg:min-h-[4.25rem] lg:px-4">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-section-alt text-primary md:h-10 md:w-10">
                      <svg className="h-[18px] w-[18px] md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </span>
                    <span className="min-w-0 flex-1 py-0.5">
                      <span className="mb-0.5 block text-[10px] font-bold uppercase tracking-wider text-[#2B2B2B]/50">
                        Guests
                      </span>
                      <select
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        className="w-full min-w-0 max-w-full cursor-pointer appearance-none border-0 bg-transparent bg-[length:1rem] bg-[right_0.1rem_center] bg-no-repeat p-0 pr-6 text-sm font-semibold text-[#2B2B2B] focus:outline-none focus:ring-0 lg:text-[0.9375rem]"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%231F4E79'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                        }}
                      >
                        <option value="1">1 guest</option>
                        <option value="2">2 guests</option>
                        <option value="3">3 guests</option>
                        <option value="4">4 guests</option>
                        <option value="5">5+ guests</option>
                      </select>
                    </span>
                  </div>

                  <div className="flex items-stretch p-3 sm:p-3.5 lg:shrink-0 lg:items-center lg:justify-center lg:px-3 lg:py-2.5 lg:pr-4">
                    <button
                      type="submit"
                      className="w-full whitespace-nowrap rounded-xl bg-[#1F4E79] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#163a5c] lg:w-auto lg:min-w-[10.5rem] lg:rounded-2xl lg:px-6 lg:py-3 lg:text-[0.9375rem]"
                    >
                      Search trips
                    </button>
                  </div>
                </div>
                </motion.form>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2 sm:mt-3.5">
                <span className="mr-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/45">
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
                    className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm transition hover:border-white/40 hover:bg-white/20"
                  >
                    {chip.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Bottom strip — reference style */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="mt-5 flex flex-col gap-4 border-t border-white/15 pt-5 text-white/85 md:mt-6 md:flex-row md:items-center md:justify-between md:gap-6 md:pt-6"
          >
            <div className="flex flex-wrap items-center gap-3 md:gap-4">
              <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-black/20 px-2 py-1 backdrop-blur-sm">
                {HERO_IMAGES.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSlide(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === slide ? 'w-5 bg-cta' : 'w-1.5 bg-white/35 hover:bg-white/55'
                    }`}
                    aria-label={`Show hero image ${i + 1}`}
                    aria-current={i === slide ? 'true' : undefined}
                  />
                ))}
              </div>
              <p className="text-xs font-semibold text-white sm:text-sm">1000+ travellers · 35+ routes</p>
              <div className="flex -space-x-2">
                {['🏔️', '🚌', '🏖️', '🛕'].map((emoji) => (
                  <span
                    key={emoji}
                    className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#0a1628] bg-white/95 text-xs shadow-sm sm:h-9 sm:w-9 sm:text-sm"
                    aria-hidden
                  >
                    {emoji}
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
    </section>
  );
}
