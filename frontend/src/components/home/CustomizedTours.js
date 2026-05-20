'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { getTours } from '@/services/api';
import { getTourDetailHref, mapTourToPackageCard } from '@/lib/tourDisplay';

export default function CustomizedTours() {
  const [expandedId, setExpandedId] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const tours = await getTours('customized');
      if (cancelled) return;
      const cards = (Array.isArray(tours) ? tours : [])
        .map(mapTourToPackageCard)
        .filter(Boolean)
        .slice(0, 4);
      setPackages(cards);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 28, scale: 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.48 },
    },
  };

  const ctaVariants = {
    hidden: { opacity: 0, scale: 0.96 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, delay: 0.25 },
    },
  };

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
          <p className="mx-auto max-w-2xl text-base text-foreground/85 md:text-lg">
            These are sample packages to inspire your trip. Share your details and we&apos;ll draft a plan around your dates, pace, and budget—fully customised for you.
          </p>
        </motion.div>

        <motion.div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-4 lg:gap-5" variants={gridVariants}>
          {loading ? (
            <p className="col-span-full text-center text-sm text-foreground/70">Loading customized packages…</p>
          ) : packages.length === 0 ? (
            <p className="col-span-full text-center text-sm text-foreground/70">
              Custom packages coming soon —{' '}
              <Link href="/contact" className="font-semibold text-primary underline">
                contact us
              </Link>{' '}
              for a quote.
            </p>
          ) : null}
          {packages.map((pkg) => {
            const open = expandedId === pkg.id;
            return (
              <motion.div
                key={pkg.id}
                layout
                variants={cardVariants}
                className="group flex h-full flex-col overflow-hidden rounded-3xl glass-card shadow-sm transition-[box-shadow,border-color] duration-500 hover:border-secondary/25 hover:shadow-[0_22px_48px_-14px_rgba(31,78,121,0.18)] data-[open=true]:border-secondary/30 data-[open=true]:shadow-[0_26px_52px_-16px_rgba(31,78,121,0.2)]"
                data-open={open}
                whileHover={{ y: open ? 0 : -6 }}
                transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              >
                <div className="card-shimmer-hover relative h-44 w-full overflow-hidden bg-gradient-to-br from-section-alt to-[#dceaf7]">
                  <img
                    src={pkg.image}
                    alt=""
                    className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.08] group-hover:brightness-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent transition-opacity duration-300 group-hover:from-black/55" />
                  <span className="absolute bottom-3 left-3 rounded-full border border-white/35 bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-md">
                    Sample
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="mb-2 text-base font-bold leading-snug text-primary md:text-lg">{pkg.title}</h3>
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-secondary">
                    <span aria-hidden>⏱️</span>
                    {pkg.duration}
                  </div>

                  <ul className="mb-3 space-y-2">
                    {pkg.highlights.slice(0, 1).map((h, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-foreground/90">
                        <span className="mt-0.5 text-green-600">✓</span>
                        {h}
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={() => setExpandedId(open ? null : pkg.id)}
                    className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl border border-primary/15 bg-white/60 py-2.5 text-xs font-bold uppercase tracking-wide text-primary backdrop-blur-sm transition hover:bg-primary/10"
                    aria-expanded={open}
                  >
                    {open ? 'Hide details' : 'View highlights'}
                    <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ type: 'spring', stiffness: 280, damping: 20 }}>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <ul className="mb-3 space-y-2 border-t border-[#eaf4fb] pt-3">
                          {pkg.highlights.slice(1).map((h, idx) => (
                            <motion.li
                              key={idx}
                              initial={{ opacity: 0, x: -6 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.06, duration: 0.28 }}
                              className="flex items-start gap-2 text-sm text-foreground/90"
                            >
                              <span className="mt-0.5 text-green-600">✓</span>
                              {h}
                            </motion.li>
                          ))}
                        </ul>
                        <p className="mb-4 text-sm leading-relaxed text-foreground/80">{pkg.detail}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="mt-auto border-t border-[#eaf4fb]/90 pt-4">
                    <div className="mb-4 text-lg font-bold text-primary md:text-xl">{pkg.price}</div>
                    <Link
                      href={getTourDetailHref(pkg)}
                      className="block w-full rounded-xl bg-cta py-3 text-center text-sm font-semibold text-primary shadow-sm transition hover:bg-cta-hover hover:text-white hover:shadow-md"
                    >
                      {pkg.slug || pkg.id ? 'View package' : 'Contact Us'}
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div className="text-center" variants={ctaVariants}>
          <Link
            href="/customized-trips"
            className="inline-flex rounded-full border-2 border-primary/80 bg-white/95 px-8 py-3 text-sm font-semibold text-primary shadow-[0_8px_24px_-6px_rgba(15,28,46,0.15)] backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-cta hover:text-cta hover:shadow-[0_14px_32px_-8px_rgba(231,111,81,0.2)]"
          >
            View all customized packages
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}
