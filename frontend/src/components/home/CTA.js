'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CTA() {
  return (
    <motion.section
      className="relative overflow-hidden bg-gradient-to-br from-primary via-[#2a6094] to-secondary py-14 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] md:py-16"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.6 }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_-20%,rgba(255,255,255,0.15),transparent_55%)]" />
      <div className="pointer-events-none absolute -right-24 top-0 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-cta/25 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4 text-center">
        <motion.h2
          className="text-3xl font-bold leading-[1.15] tracking-tight text-white drop-shadow-sm md:text-4xl lg:text-5xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          Not sure where to begin?
        </motion.h2>
        <motion.p
          className="mx-auto mt-4 max-w-2xl text-base text-white/90 md:text-lg"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.08 }}
        >
          Explore ideas by talking to our team—handpicked inspirations and a journey that&apos;s completely yours.
        </motion.p>
        <motion.div
          className="mt-7"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <Link
            href="/contact"
            className="inline-flex rounded-full bg-cta px-10 py-4 text-base font-semibold text-primary shadow-[0_14px_36px_-8px_rgba(0,0,0,0.35)] ring-2 ring-white/25 transition hover:-translate-y-0.5 hover:bg-[#E76F51] hover:text-white hover:shadow-[0_18px_44px_-8px_rgba(0,0,0,0.4)]"
          >
            Contact Us
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}
