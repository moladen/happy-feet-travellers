'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getTours } from '@/services/api';
import TourCardsAutoScroll from '@/components/tour/TourCardsAutoScroll';

export default function CustomizedTours() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getTours('customized');
        if (cancelled) return;
        setTours(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching customized tours:', error);
        if (!cancelled) setTours([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const list = tours.filter((t) => String(t.category || '').trim().toLowerCase() === 'customized');

  const sectionVariants = {
    hidden: { y: 28 },
    visible: {
      y: 0,
      transition: {
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.12,
      },
    },
  };

  const headerVariants = {
    hidden: { y: 16 },
    visible: {
      y: 0,
      transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
    },
  };

  if (loading) {
    return (
      <motion.section
        className="section-ambient section-tone-sand relative overflow-hidden py-14 md:py-16"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="container relative z-10 mx-auto px-4">
          <motion.div className="mb-8 text-center" variants={headerVariants}>
            <p className="section-eyebrow mb-2">Popular customized tours</p>
            <h2 className="section-title mb-2 text-3xl md:text-4xl lg:text-5xl">Personalized tour ideas</h2>
            <p className="text-foreground/80">Loading customized packages…</p>
          </motion.div>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      className="section-ambient section-tone-sand relative overflow-hidden py-14 md:py-16"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="container relative z-10 mx-auto px-4">
        <motion.div className="mb-8 text-center" variants={headerVariants}>
          <p className="section-eyebrow mb-2">Popular customized tours</p>
          <h2 className="section-title mb-3 text-3xl md:text-4xl lg:text-5xl">Personalized tour ideas</h2>
          <p className="mx-auto mb-6 max-w-2xl text-base text-foreground/85 md:text-lg">
            Sample packages to inspire your trip—cards scroll automatically so you can browse every idea. Share your
            dates and budget and we&apos;ll tailor the plan for you.
          </p>
          <Link
            href="/customized-trips"
            className="btn-travel-primary px-8 py-3"
          >
            View all customized packages
          </Link>
        </motion.div>

        {list.length === 0 ? (
          <p className="text-center text-foreground/75">
            Custom packages coming soon —{' '}
            <Link href="/contact" className="font-semibold text-primary underline">
              contact us
            </Link>{' '}
            for a quote.
          </p>
        ) : (
          <TourCardsAutoScroll
            tours={list}
            ariaLabel="Popular customized tour packages"
            className="[--marquee-fade:var(--color-off-white)]"
          />
        )}
      </div>
    </motion.section>
  );
}
