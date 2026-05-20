'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { getTestimonials } from '@/services/testimonialsService';

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
  };
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

export default function Testimonials() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const raw = await getTestimonials();
      if (cancelled) return;
      const list = Array.isArray(raw) ? raw : [];
      const unique = dedupeTestimonials(list);
      setItems(unique);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  /** One sequence for display; duplicate only for seamless CSS marquee (-50% translate). */
  const loop = useMemo(() => {
    if (!items.length) return [];
    return [...items, ...items];
  }, [items]);

  if (!items.length) return null;

  return (
    <motion.section
      id="testimonials"
      className="section-ambient section-tone-sand-soft scroll-mt-24 relative overflow-hidden py-10 md:py-12"
      initial={{ opacity: 0, y: 42 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55 }}
    >
      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          className="mx-auto mb-6 max-w-3xl text-center md:mb-7"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.45 }}
        >
          <p className="section-eyebrow mb-2">Social proof</p>
          <h2 className="section-title mb-2 text-2xl md:text-3xl lg:text-4xl">Testimonials</h2>
          <p className="text-sm text-foreground/80 md:text-base">
            Honest words from Pune travellers who came back smiling.
          </p>
        </motion.div>

        <div className="relative -mx-1 overflow-hidden rounded-2xl border border-[#dceaf5]/80 bg-white/25 py-1 md:-mx-0 md:rounded-3xl">
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-4 bg-gradient-to-r from-[#f0f6fb] from-55% to-transparent sm:w-6 md:w-8"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-4 bg-gradient-to-l from-[#f0f6fb] from-55% to-transparent sm:w-6 md:w-8"
            aria-hidden
          />

          <div
            className="testimonial-marquee-track flex w-max gap-3 py-2 pl-1 pr-1 will-change-transform md:gap-4"
            aria-label="Traveller testimonials"
          >
            {loop.map((item, index) => (
              <article
                key={`${item.id}-${index}`}
                aria-hidden={index >= items.length}
                className="flex w-[min(78vw,260px)] shrink-0 flex-col gap-2.5 overflow-hidden rounded-xl border border-[#eaf4fb] bg-white p-3 sm:w-[280px] sm:rounded-2xl sm:p-3.5 md:w-[300px] md:gap-3 md:p-4"
              >
                <div className="flex items-center gap-2.5">
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-white ring-1 ring-primary/10 sm:h-12 sm:w-12">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 44px, 48px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-section-alt text-xs font-bold text-primary">
                        {item.name.slice(0, 1)}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-bold text-primary sm:text-base">{item.name}</div>
                    <div className="truncate text-xs font-semibold text-secondary sm:text-sm">{item.city || 'Pune'}</div>
                  </div>
                  <div className="shrink-0 text-xs text-yellow-500 sm:text-sm" aria-label={`${item.rating} star rating`}>
                    {'★'.repeat(item.rating)}
                  </div>
                </div>
                <p className="line-clamp-3 text-xs leading-relaxed text-foreground/85 sm:line-clamp-4 sm:text-[13px] sm:leading-6 md:text-[14px]">
                  &ldquo;{item.text}&rdquo;
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
