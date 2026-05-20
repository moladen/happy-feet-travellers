'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getTours } from '@/services/api';
import TourCardsAutoScroll from '@/components/tour/TourCardsAutoScroll';

export default function TripsCarousel() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const data = await getTours();
        setTours(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching tours:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  const list = tours
    .filter((t) => String(t.category || '').trim().toLowerCase() === 'upcoming')
    .sort((a, b) => {
      const ta = a.startDate ? new Date(a.startDate).getTime() : 0;
      const tb = b.startDate ? new Date(b.startDate).getTime() : 0;
      return ta - tb;
    });

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
        className="section-ambient section-tone-offwhite relative overflow-hidden py-14 md:py-16"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="container relative z-10 mx-auto px-4">
          <motion.div className="mb-8 text-center" variants={headerVariants}>
            <h2 className="section-title mb-2 text-4xl md:text-5xl">Upcoming group trips</h2>
            <p className="text-foreground/80">Loading departures…</p>
          </motion.div>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      className="section-ambient section-tone-offwhite relative overflow-hidden py-14 md:py-16"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="container relative z-10 mx-auto px-4">
        <motion.div className="mb-8 text-center" variants={headerVariants}>
          <p className="section-eyebrow mb-2">Upcoming departures</p>
          <h2 className="section-title mb-3 text-3xl md:text-4xl lg:text-5xl">Upcoming group trips</h2>
          <p className="mx-auto mb-6 max-w-2xl text-base text-foreground/85 md:text-lg">
            Fixed-date group tours with transparent pricing—cards scroll automatically so you can browse every
            departure without swiping.
          </p>
          <Link href="/upcoming-departures" className="btn-travel-primary px-8 py-3">
            View all departures
          </Link>
        </motion.div>

        {list.length === 0 ? (
          <p className="text-center text-foreground/75">No departures listed yet.</p>
        ) : (
          <TourCardsAutoScroll
            tours={list}
            ariaLabel="Upcoming group trip departures"
            className="[--marquee-fade:var(--color-off-white)]"
          />
        )}
      </div>
    </motion.section>
  );
}
