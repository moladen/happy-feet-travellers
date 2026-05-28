'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { getTestimonials } from '@/services/testimonialsService';
import {
  isTrustindexWidgetEnabled,
  TRUSTINDEX_PROFILE_URL,
} from '@/lib/trustindex';
import TrustindexWidget from '@/components/home/TrustindexWidget';
import TrustindexVerifiedBadge from '@/components/home/TrustindexVerifiedBadge';

function normalize(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const text = String(raw.review ?? raw.text ?? '').trim();
  const name = String(raw.name ?? '').trim();
  if (!name || !text) return null;
  const id = raw.id != null && String(raw.id) ? String(raw.id) : `${name}-${text.slice(0, 32)}`;
  return {
    id,
    name,
    city: String(raw.city ?? '').trim(),
    rating: Math.min(5, Math.max(1, Number(raw.rating) || 5)),
    text,
    image: raw.image ? String(raw.image) : null,
    createdAt: raw.createdAt ? String(raw.createdAt) : null,
  };
}

function formatReviewDate(createdAt, city) {
  if (createdAt) {
    const date = new Date(createdAt);
    if (!Number.isNaN(date.getTime())) {
      const days = Math.floor((Date.now() - date.getTime()) / 86400000);
      if (days < 1) return 'Recently';
      if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`;
      const months = Math.floor(days / 30);
      if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`;
      const years = Math.floor(months / 12);
      return `${years} year${years === 1 ? '' : 's'} ago`;
    }
  }
  return city || 'India';
}

function dedupeTestimonials(rows) {
  const seenContent = new Set();
  const out = [];
  for (const row of rows) {
    const n = normalize(row);
    if (!n) continue;
    const contentKey = `${n.name.toLowerCase()}|${n.text.slice(0, 160).toLowerCase()}`;
    if (seenContent.has(contentKey)) continue;
    seenContent.add(contentKey);
    out.push(n);
  }
  return out;
}

/** Repeat cards so one marquee set is wider than the viewport — prevents blank gap on loop. */
const MARQUEE_MIN_CARDS = 12;

function buildMarqueeSet(items) {
  if (!items.length) return [];
  const set = [];
  let round = 0;
  while (set.length < MARQUEE_MIN_CARDS) {
    for (let i = 0; i < items.length; i += 1) {
      set.push({
        ...items[i],
        marqueeKey: `${items[i].id}-marquee-${round}-${i}`,
      });
      if (set.length >= MARQUEE_MIN_CARDS) break;
    }
    round += 1;
  }
  return set;
}

function StarRating({ rating }) {
  return (
    <div className="testimonial-card__stars" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < rating ? 'is-filled' : ''} aria-hidden>
          ★
        </span>
      ))}
      <span className="testimonial-card__verified" aria-hidden>
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
          <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
        </svg>
      </span>
    </div>
  );
}

function TestimonialCard({ item }) {
  const subtitle = formatReviewDate(item.createdAt, item.city);

  return (
    <article className="testimonial-card testimonial-card--review">
      <header className="testimonial-card__header">
        <div className="testimonial-card__avatar">
          {item.image ? (
            <Image src={item.image} alt="" fill className="object-cover" sizes="96px" />
          ) : (
            <span className="testimonial-card__initial" aria-hidden>
              {item.name.slice(0, 1)}
            </span>
          )}
        </div>
        <div className="testimonial-card__meta">
          <p className="testimonial-card__name">{item.name}</p>
          <p className="testimonial-card__time">{subtitle}</p>
        </div>
        <span className="testimonial-card__source" aria-label="Happy Feet traveller review">
          <span className="testimonial-card__source-mark">HF</span>
        </span>
      </header>

      <StarRating rating={item.rating} />

      <p className="testimonial-card__quote">{item.text}</p>
    </article>
  );
}

function TestimonialMarquee({ items, reduceMotion }) {
  const marqueeSet = useMemo(() => buildMarqueeSet(items), [items]);
  const durationSec = useMemo(
    () => Math.max(36, Math.min(80, marqueeSet.length * 7)),
    [marqueeSet.length]
  );
  const animate = marqueeSet.length > 0 && !reduceMotion;

  if (!animate) {
    return (
      <div className="testimonial-marquee">
        <div className="testimonial-marquee__viewport" aria-label="Traveller stories">
          <div className="testimonial-marquee__track testimonial-marquee__track--static">
            <div className="testimonial-marquee__group testimonial-marquee__group--static">
              {items.map((item) => (
                <TestimonialCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="testimonial-marquee"
      style={{ '--testimonial-marquee-duration': `${durationSec}s` }}
    >
      <div className="testimonial-marquee__fade testimonial-marquee__fade--left" aria-hidden />
      <div className="testimonial-marquee__fade testimonial-marquee__fade--right" aria-hidden />

      <div className="testimonial-marquee__viewport is-animated" aria-label="Traveller stories scrolling">
        <div className="testimonial-marquee__track">
          {[0, 1].map((copy) => (
            <div
              key={`marquee-copy-${copy}`}
              className="testimonial-marquee__group"
              aria-hidden={copy === 1 ? true : undefined}
            >
              {marqueeSet.map((item) => (
                <TestimonialCard key={item.marqueeKey} item={item} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const reduceMotion = useReducedMotion();
  const [items, setItems] = useState([]);
  const useTrustindex = isTrustindexWidgetEnabled();
  const showTrustindexBadge = useTrustindex || Boolean(TRUSTINDEX_PROFILE_URL);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const raw = await getTestimonials();
      if (cancelled) return;
      const list = Array.isArray(raw) ? raw : [];
      setItems(dedupeTestimonials(list));
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!useTrustindex && !items.length) return null;

  return (
    <motion.section
      id="testimonials"
      className={`testimonials-section section-ambient section-tone-sand-soft scroll-mt-24 relative overflow-hidden py-12 md:py-16${useTrustindex && items.length ? ' testimonials-section--dual' : ''}`}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container relative z-10 mx-auto px-4">
        <motion.header
          className="testimonials-section__header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="section-eyebrow mb-2">Voices from the road</p>
          <h2 className="section-title mb-3 text-2xl md:text-3xl lg:text-4xl">Journeys remembered</h2>
          <p className="testimonials-section__lede">
            Real stories from travellers who explored India with us — moments of wonder, comfort, and
            connection along the way.
          </p>
        </motion.header>

        {useTrustindex ? (
          <div className="testimonials-section__trustindex-wrap">
            <TrustindexWidget className="testimonials-section__trustindex-widget" />
          </div>
        ) : null}

        {items.length ? (
          <div className="testimonials-section__admin-row">
            <TestimonialMarquee items={items} reduceMotion={reduceMotion} />
          </div>
        ) : null}

        {showTrustindexBadge ? (
          <div className="testimonials-section__trustindex-badge-wrap">
            <TrustindexVerifiedBadge />
          </div>
        ) : null}

        <p className="testimonials-section__footnote">
          {useTrustindex
            ? 'Reviews synced from Google · verified by Trustindex'
            : 'Trusted by families, couples, and solo explorers across India'}
        </p>
      </div>
    </motion.section>
  );
}
