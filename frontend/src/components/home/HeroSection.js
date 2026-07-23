'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { buildCustomizedTripsUrl } from '@/lib/personalizedTripSearch';
import { FALLBACK_HERO_SLIDES, resolveHeroImageSrc } from '@/lib/heroSlides';
import { resolveHeroCommunity } from '@/lib/heroCommunity';
import { fetchPublicHeroSlides } from '@/services/heroSlidesService';
import { getPublicSettings } from '@/services/settingsService';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Typewriter from '@/components/common/Typewriter';

const JOURNEY_TYPES = [
  { value: '', label: 'Any experience' },
  { value: 'Honeymoon', label: 'Honeymoon' },
  { value: 'Adventure', label: 'Adventure' },
  { value: 'Spiritual', label: 'Spiritual' },
  { value: 'Family', label: 'Family' },
  { value: 'Wildlife', label: 'Wildlife' },
  { value: 'Road Trips', label: 'Road Trips' },
  { value: 'Mountains', label: 'Mountains' },
  { value: 'Beaches', label: 'Beaches' },
];

const QUICK_MOODS = [
  { label: 'Honeymoon', category: 'Honeymoon' },
  { label: 'Adventure', category: 'Adventure' },
  { label: 'Beaches', category: 'Beaches' },
  { label: 'Spiritual', category: 'Spiritual' },
  { label: 'Family', category: 'Family' },
  { label: 'Wildlife', category: 'Wildlife' },
];

const HERO_HIGHLIGHTS = [
  'Intimate groups · honest, transparent pricing',
  'Journeys designed entirely around you',
];

/** Rotating hero headline — typewriter cycles through accent words */
const HERO_HEADLINE_SEQUENCES = [
  [
    { text: 'Travel Beyond ', className: 'text-white' },
    { text: 'Ordinary', className: 'hero-headline__accent' },
  ],
  [
    { text: 'Travel Beyond ', className: 'text-white' },
    { text: 'Adventure', className: 'hero-headline__accent' },
  ],
  [
    { text: 'Curated Journeys ', className: 'text-white' },
    { text: 'For You', className: 'hero-headline__accent' },
  ],
  [
    { text: 'Explore ', className: 'text-white' },
    { text: 'India ', className: 'hero-headline__india' },
    { text: 'Together', className: 'hero-headline__accent' },
  ],
];

const DEFAULT_COMMUNITY = resolveHeroCommunity(null);

const HERO_SELECT_ARROW = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%231F4E79'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`;

const SLIDE_MS = 2000;
const HERO_AUTO_SLIDE = true;
const HERO_CROSSFADE_S = 1.35;
const HERO_EASE = [0.22, 1, 0.36, 1];

function HeroSlideLayer({ item, isActive, reduceMotion, priority }) {
  return (
    <motion.div
      className="hero-slide-layer absolute inset-0 overflow-hidden"
      initial={false}
      animate={{
        opacity: isActive ? 1 : 0,
        scale: reduceMotion ? 1 : isActive ? 1 : 1.03,
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
          unoptimized={String(item.src || '').includes('/uploads')}
          sizes="100vw"
          className="hero-slide-image object-cover object-[center_38%] sm:object-center"
        />
      </div>
    </motion.div>
  );
}

function HeroSlideSceneTag({ current, slide }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={current.id || slide}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.35 }}
        className="hero-scene-tag hero-scene-tag--card"
      >
        <span aria-hidden>{current.emoji}</span>
        <span>{current.tag}</span>
      </motion.div>
    </AnimatePresence>
  );
}

function HeroSlideDots({ slides, slide, setSlide }) {
  return (
    <div className="hero-slide-dots hero-slide-dots--premium" role="tablist" aria-label="Hero scenes">
      {slides.map((item, i) => (
        <button
          key={item.id || item.src}
          type="button"
          role="tab"
          aria-selected={i === slide}
          aria-label={`Scene ${i + 1}: ${item.tag}`}
          onClick={() => setSlide(i)}
          className={`hero-slide-dots__btn${i === slide ? ' is-active' : ''}`}
        />
      ))}
    </div>
  );
}

export default function HeroSection() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [slides, setSlides] = useState(FALLBACK_HERO_SLIDES);
  const [slide, setSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [journeyType, setJourneyType] = useState('');
  const [activeMood, setActiveMood] = useState(null);
  const [community, setCommunity] = useState(DEFAULT_COMMUNITY);

  useEffect(() => {
    let active = true;
    (async () => {
      const next = await fetchPublicHeroSlides();
      if (!active || !next?.length) return;
      setSlides(next);
      setSlide(0);
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      const settings = await getPublicSettings();
      if (!active) return;
      setCommunity(resolveHeroCommunity(settings));
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!HERO_AUTO_SLIDE || !slides.length || reduceMotion) return undefined;
    const id = setInterval(() => {
      setSlide((s) => (s + 1) % slides.length);
    }, SLIDE_MS);
    return () => clearInterval(id);
  }, [slides.length, reduceMotion]);

  const runSearch = (overrides = {}) => {
    const q = (overrides.q ?? searchQuery).trim();
    const category = overrides.category ?? journeyType;
    router.push(buildCustomizedTripsUrl({ q, category }));
    router.refresh();
  };

  const onSubmitSearch = (e) => {
    e.preventDefault();
    runSearch();
  };

  const onMoodSelect = (mood) => {
    setActiveMood(mood.label);
    if (mood.q) setSearchQuery(mood.q);
    if (mood.category) setJourneyType(mood.category);
  };

  const current = slides[slide] || slides[0];
  if (!current) return null;

  return (
    <section className="hero-section hero-section--premium relative z-0 overflow-x-hidden bg-[#050d18]">
      <div className="hero-stage relative flex min-h-0 flex-col overflow-hidden">
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

        <div className="hero-overlays hero-overlays--premium pointer-events-none absolute inset-0 z-[8]" aria-hidden>
          <div className="absolute inset-0 bg-[#030712]/10" />
          <div className="hero-overlay-left absolute inset-y-0 left-0 w-[min(100%,52rem)] bg-gradient-to-r from-[#010408]/55 via-[#02060c]/28 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628]/16 via-transparent to-[#030712]/08" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_18%_35%,rgba(231,111,81,0.08),transparent_62%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_88%_30%,rgba(126,200,227,0.1),transparent_58%)]" />
          <div className="hero-bottom-scrim absolute inset-x-0 bottom-0 h-[18%] bg-gradient-to-t from-[#02060c]/22 via-transparent to-transparent" />
          <div className="absolute inset-x-0 top-0 h-[18%] bg-gradient-to-b from-[#02060c]/28 to-transparent" />
          <div className="hero-vignette hero-vignette--soft absolute inset-0" />
        </div>

        <div className="hero-content-shell hero-content-shell--premium relative z-30 w-full flex-1">
          <div className="hero-inner hero-inner--premium">
            <div className="hero-layout">
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, ease: HERO_EASE }}
                className="hero-layout__main hero-copy-block hero-copy-container min-w-0"
              >
                <p className="hero-eyebrow">
                  <span className="hero-eyebrow__dot" aria-hidden />
                  Experience-first travel · India &amp; beyond
                </p>

                <h1 className="hero-headline">
                  <span className="hero-headline__primary block" aria-live="polite">
                    {reduceMotion ? (
                      <>
                        Travel Beyond <span className="hero-headline__accent">Ordinary</span>
                      </>
                    ) : (
                      <Typewriter
                        sequences={HERO_HEADLINE_SEQUENCES}
                        speed={72}
                        deleteSpeed={38}
                        pauseAfterType={2400}
                        pauseAfterDelete={420}
                        loop
                        cursorClassName="typing-cursor typing-cursor--hero"
                      />
                    )}
                  </span>
                </h1>

                <p className="hero-subline">
                  Curated journeys for travellers who want more than{' '}
                  <span className="hero-text-accent">ordinary vacations</span> — thoughtfully planned, deeply felt,
                  and designed around you.
                </p>

                <ul className="hero-highlights">
                  {HERO_HIGHLIGHTS.map((text) => (
                    <li key={text}>{text}</li>
                  ))}
                </ul>

                <div className="hero-cta-row">
                  <Link href="/customized-trips" className="btn-hero-primary btn-hero-glow btn-hero-primary--lift">
                    Explore Personalized Tours
                    <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                  <Link href="/contact" className="btn-hero-secondary btn-hero-secondary--lift">
                    Plan Your Journey
                  </Link>
                </div>

                <div
                  className={`hero-community hero-community--premium${community.bannerUrl ? ' hero-community--banner' : ''}`}
                  style={
                    community.bannerUrl
                      ? { backgroundImage: `url(${resolveHeroImageSrc(community.bannerUrl)})` }
                      : undefined
                  }
                >
                  <div className="hero-community__glass">
                    <div className="hero-community__collage" aria-hidden>
                      {(community.avatars.length ? community.avatars : DEFAULT_COMMUNITY.avatars)
                        .map((src) => resolveHeroImageSrc(src))
                        .filter(Boolean)
                        .slice(0, 12)
                        .map((src, i) => (
                          <span
                            key={`${src}-${i}`}
                            className="hero-community__avatar"
                            style={{ zIndex: 12 - i }}
                          >
                            <Image
                              src={resolveHeroImageSrc(src)}
                              alt=""
                              width={64}
                              height={64}
                              unoptimized
                              className="h-full w-full object-cover"
                            />
                          </span>
                        ))}
                    </div>
                    <p className="hero-community__quote">{community.quote}</p>
                  </div>
                </div>
              </motion.div>

              <motion.aside
                id="hero-search"
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.12, ease: HERO_EASE }}
                className="hero-layout__aside hero-journey min-w-0"
              >
                <div className="hero-journey__glow" aria-hidden />
                <div className={`hero-journey-card${reduceMotion ? '' : ' hero-journey-card--float'}`}>
                  <div className="hero-journey-card__header">
                    <h2 className="hero-journey-card__title">Start Your Personalized Journey</h2>
                    <p className="hero-journey-card__lead">
                      Share a dream destination — we&apos;ll craft a curated experience around you.
                    </p>
                    <div className="hero-journey-card__scene" aria-live="polite">
                      <HeroSlideSceneTag current={current} slide={slide} />
                    </div>
                  </div>

                  <form
                    onSubmit={onSubmitSearch}
                    className="hero-journey-form"
                    role="search"
                    aria-label="Begin your personalized journey"
                  >
                    <label htmlFor="hero-search-q" className="hero-journey-field">
                      <span className="hero-journey-field__label">Dream destination</span>
                      <span className="hero-journey-field__control">
                        <svg className="hero-journey-field__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <input
                          id="hero-search-q"
                          type="text"
                          name="q"
                          role="searchbox"
                          placeholder="e.g. Goa, Ladakh, Andaman…"
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setActiveMood(null);
                          }}
                          className="hero-journey-field__input"
                          autoComplete="off"
                        />
                      </span>
                    </label>

                    <label htmlFor="hero-journey-type" className="hero-journey-field">
                      <span className="hero-journey-field__label">Experience</span>
                      <span className="hero-journey-field__control">
                        <svg className="hero-journey-field__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <select
                          id="hero-journey-type"
                          value={journeyType}
                          onChange={(e) => {
                            setJourneyType(e.target.value);
                            setActiveMood(null);
                          }}
                          className="hero-journey-field__select"
                          style={{ backgroundImage: HERO_SELECT_ARROW }}
                          aria-label="Journey experience type"
                        >
                          {JOURNEY_TYPES.map((opt) => (
                            <option key={opt.value || 'any'} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </span>
                    </label>

                    <div className="hero-moods hero-moods--journey">
                      <p className="hero-moods__label">Explore by mood</p>
                      <div className="hero-moods__chips" role="group" aria-label="Quick mood picks">
                        {QUICK_MOODS.map((mood) => (
                          <button
                            key={mood.label}
                            type="button"
                            className={`hero-mood-chip${activeMood === mood.label ? ' is-active' : ''}`}
                            aria-pressed={activeMood === mood.label}
                            onClick={() => onMoodSelect(mood)}
                          >
                            {mood.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button type="submit" className="hero-journey-form__cta">
                      Begin Your Journey
                      <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </form>
                </div>

                <HeroSlideDots slides={slides} slide={slide} setSlide={setSlide} />
              </motion.aside>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
