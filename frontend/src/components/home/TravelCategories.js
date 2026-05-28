'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { TRAVEL_CATEGORIES } from '@/lib/travelCategories';

const EASE = [0.22, 1, 0.36, 1];

function CategoryCard({ category, index, reduceMotion }) {
  return (
    <motion.li
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: reduceMotion ? 0 : index * 0.05, ease: EASE }}
      className="travel-categories__item"
    >
      <Link href={category.href} className="travel-category-card group">
        <div className="travel-category-card__media">
          <img
            src={category.image}
            alt=""
            className="travel-category-card__img"
            loading="lazy"
          />
          <div className="travel-category-card__overlay" aria-hidden />
          <div className="travel-category-card__shine" aria-hidden />
        </div>
        <div className="travel-category-card__content">
          <h3 className="travel-category-card__title">{category.label}</h3>
          <p className="travel-category-card__tagline">{category.tagline}</p>
          <span className="travel-category-card__cta">
            Explore
            <svg className="travel-category-card__cta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </div>
      </Link>
    </motion.li>
  );
}

export default function TravelCategories() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      id="travel-categories"
      className="travel-categories-section section-ambient section-tone-cream relative overflow-hidden py-12 md:py-14 lg:py-16"
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.06 }}
      transition={{ duration: 0.55, ease: EASE }}
    >
      <div
        className="pointer-events-none absolute -right-24 top-8 h-64 w-64 rounded-full bg-secondary/15 blur-[90px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-cta/10 blur-[80px]"
        aria-hidden
      />

      <div className="container relative z-10 mx-auto max-w-6xl px-4">
        <header className="travel-categories-section__header">
          <p className="section-eyebrow mb-2">Travel by mood</p>
          <h2 className="section-title text-3xl md:text-4xl lg:text-[2.75rem]">Explore travel categories</h2>
          <p className="travel-categories-section__lede">
            Choose the feeling you are chasing — misty mountains, golden beaches, sacred trails, or open-road
            adventures — and discover journeys curated for that vibe.
          </p>
        </header>

        <ul className="travel-categories__grid">
          {TRAVEL_CATEGORIES.map((category, index) => (
            <CategoryCard
              key={category.id}
              category={category}
              index={index}
              reduceMotion={reduceMotion}
            />
          ))}
        </ul>

        <motion.div
          className="travel-categories-section__footer"
          initial={reduceMotion ? false : { opacity: 0 }}
          whileInView={reduceMotion ? undefined : { opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.45, delay: 0.15, ease: EASE }}
        >
          <Link href="/upcoming-departures" className="travel-categories-section__all-link">
            View all departures
            <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}
