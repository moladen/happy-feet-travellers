'use client';

import { motion } from 'framer-motion';
import { travelIconClassForEmoji } from '@/lib/travelIconAnimations';

export default function WhyChooseUs() {
  const reasons = [
    {
      icon: '🧳',
      title: '8000+ Happy Travelers',
      description: 'Trusted by thousands of travellers who have explored incredible destinations with us.',
    },
    {
      icon: '⭐',
      title: '100+ Successful Tours',
      description: 'Carefully organized trips with happy travellers and memorable experiences across destinations.',
    },
    {
      icon: '🧭',
      title: 'Experienced Tour Leaders',
      description: 'Our knowledgeable tour leaders ensure smooth travel, proper guidance, and a safe experience.',
    },
    {
      icon: '🚌',
      title: 'Comfortable Travel & Stays',
      description: 'Enjoy smooth journeys with comfortable vehicles and well-selected accommodations.',
    },
    {
      icon: '🤝',
      title: 'Trusted Travel Company',
      description: 'A reliable travel partner trusted by thousands of travellers for safe and memorable journeys.',
    },
    {
      icon: '🛡️',
      title: 'Safety and Security',
      description: 'Your safety is our top priority with reliable transport, trusted stays, and well-managed tours.',
    },
  ];

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
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.45 },
    },
  };

  const statsVariants = {
    hidden: { opacity: 0, scale: 0.96 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.55, delay: 0.2 },
    },
  };

  const statItemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <motion.section
      className="section-ambient section-tone-white relative overflow-hidden py-14 md:py-16"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="container relative z-10 mx-auto px-4">
        <motion.div className="mb-8 text-center md:mb-10" variants={headerVariants}>
          <h2 className="section-title text-3xl md:text-4xl lg:text-5xl">Why Choose Us</h2>
        </motion.div>

        <motion.div
          className="mx-auto mb-8 max-w-6xl rounded-[2rem] bg-sand/40 p-4 md:mb-10 md:p-6"
          variants={gridVariants}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reasons.map((reason, idx) => (
              <motion.div
                key={idx}
                variants={cardVariants}
                className="rounded-[1.6rem] border border-white/80 bg-white px-6 py-8 text-center shadow-[0_12px_32px_-16px_rgba(15,28,46,0.18)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-14px_rgba(15,28,46,0.24)]"
              >
                <span
                  className={`mb-4 inline-block text-4xl leading-none md:text-[2.6rem] ${travelIconClassForEmoji(reason.icon)}`}
                  role="img"
                  aria-hidden
                >
                  {reason.icon}
                </span>
                <h3 className="mb-3 text-xl font-bold text-[#1a1a1a]">{reason.title}</h3>
                <p className="mx-auto max-w-[15rem] text-sm leading-7 text-[#5f6368]">{reason.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="relative mt-10 overflow-hidden rounded-3xl bg-gradient-to-r from-[#1a2b3c] via-primary to-[#3d6a8a] p-6 text-white shadow-xl md:mt-12 md:p-8"
          variants={statsVariants}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_80%_60%_at_20%_0%,rgba(255,255,255,0.25),transparent)]"
            aria-hidden
          />
          <motion.div className="relative grid grid-cols-2 gap-4 text-center md:grid-cols-4 md:gap-6" variants={gridVariants}>
            {[
              { n: '1,000+', l: 'Travellers from Pune' },
              { n: '35+', l: 'Destinations covered' },
              { n: '120+', l: 'Group departures run' },
              { n: '4.8★', l: 'Average traveller rating' },
            ].map((s) => (
              <motion.div
                key={s.l}
                variants={statItemVariants}
                whileHover={{ scale: 1.06, y: -2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                className="rounded-2xl border border-white/15 bg-white/10 px-2 py-4 backdrop-blur-md md:py-5"
              >
                <div className="mb-2 text-3xl font-bold text-cta md:text-4xl lg:text-5xl">{s.n}</div>
                <div className="text-sm font-semibold text-white/90 md:text-base">{s.l}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
