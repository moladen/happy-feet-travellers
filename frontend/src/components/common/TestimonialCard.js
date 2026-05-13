'use client';

import { motion } from 'framer-motion';

export default function TestimonialCard({ testimonial }) {
  return (
    <motion.div
      className="group relative overflow-hidden rounded-2xl glass-card p-5 shadow-md ring-1 ring-primary/[0.06] transition-[box-shadow] duration-500 hover:shadow-[0_20px_44px_-14px_rgba(31,78,121,0.16)] md:rounded-3xl md:p-6"
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 360, damping: 26 }}
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-secondary/15 blur-2xl transition-opacity duration-500 group-hover:opacity-100" aria-hidden />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-cta/20 blur-2xl" aria-hidden />

      <div className="relative z-10 text-center">
        <motion.div
          className="mb-1 text-3xl text-secondary/45 md:text-4xl"
          aria-hidden
          initial={false}
          whileHover={{ scale: 1.08, rotate: -2 }}
        >
          &ldquo;
        </motion.div>

        <div className="mb-4 flex justify-center gap-0.5">
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <motion.span
              key={i}
              className="text-xl text-yellow-400 md:text-2xl"
              initial={false}
              whileHover={{ scale: 1.15, y: -2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              ⭐
            </motion.span>
          ))}
        </div>

        <blockquote className="mb-5 text-base font-medium leading-relaxed text-foreground md:text-lg">
          &ldquo;{testimonial.text}&rdquo;
        </blockquote>

        <div className="mb-1 flex items-center justify-center gap-3 border-b border-[#eaf4fb]/90 pb-4">
          <motion.img
            src={testimonial.image}
            alt={testimonial.name}
            className="h-16 w-16 rounded-full border-4 border-white/80 object-cover shadow-lg ring-2 ring-section-alt"
            whileHover={{ scale: 1.06 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          />
          <div className="text-left">
            <div className="text-lg font-bold text-primary">{testimonial.name}</div>
            <div className="font-semibold text-secondary">{testimonial.city}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
