'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { getTours } from '@/services/api';
import TourCard from '@/components/tour/TourCard';

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

  // Show every tour from the API: upcoming first, then customized / others (avoid hiding new tours).
  const list = [...tours].sort((a, b) => {
    const rank = (t) =>
      String(t.category || '')
        .toLowerCase() === 'upcoming'
        ? 0
        : String(t.category || '')
            .toLowerCase() === 'customized'
          ? 1
          : 2;
    const ra = rank(a);
    const rb = rank(b);
    if (ra !== rb) return ra - rb;
    const ta = a.startDate ? new Date(a.startDate).getTime() : 0;
    const tb = b.startDate ? new Date(b.startDate).getTime() : 0;
    return ta - tb;
  });

  /* Do not animate parent opacity to 0 — Swiper measures width while hidden and renders zero-height slides. */
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
        className="section-ambient relative overflow-hidden py-14 md:py-16"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="container relative z-10 mx-auto px-4">
          <motion.div className="mb-8 text-center" variants={headerVariants}>
            <h2 className="mb-2 text-4xl font-bold text-primary md:text-5xl">Upcoming group trips</h2>
            <p className="text-foreground/80">Loading departures…</p>
          </motion.div>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      className="section-ambient relative overflow-hidden py-14 md:py-16"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="container relative z-10 mx-auto px-4">
        <motion.div className="mb-8 text-center" variants={headerVariants}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-secondary">Upcoming departures</p>
          <h2 className="mb-3 text-3xl font-bold text-primary md:text-4xl lg:text-5xl">Upcoming group trips</h2>
          <p className="mx-auto mb-6 max-w-2xl text-base text-foreground/85 md:text-lg">
            Fixed-date group tours with transparent pricing—curated stays, transfers, and trip support included. Swipe on
            mobile to browse departures (synced from your tour list when the API is connected).
          </p>
          <Link
            href="/upcoming-departures"
            className="inline-flex rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_-6px_rgba(31,78,121,0.45)] ring-1 ring-white/20 transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-6px_rgba(31,78,121,0.5)]"
          >
            View all departures
          </Link>
        </motion.div>

        {list.length === 0 ? (
          <p className="text-center text-foreground/75">No departures listed yet.</p>
        ) : (
          <div className="min-h-[280px]">
            <Swiper
              key={list.map((t) => t.id).join('-')}
              modules={[Autoplay, Pagination]}
              spaceBetween={20}
              slidesPerView={1}
              loop={list.length > 3}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              observer
              observeParents
              watchOverflow
              breakpoints={{
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="!pb-10 [&_.swiper-pagination-bullet-active]:bg-primary"
            >
              {list.map((tour) => (
                <SwiperSlide key={tour.id} className="!h-auto">
                  <div className="h-full py-1">
                    <TourCard tour={tour} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>
    </motion.section>
  );
}
