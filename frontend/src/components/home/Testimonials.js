'use client';

import { motion } from 'framer-motion';
import GoogleReviewsBadge from '@/components/home/GoogleReviewsBadge';
import GoogleReviewsCarousel from '@/components/home/GoogleReviewsCarousel';
import { getHomeTestimonials } from '@/lib/testimonialsDisplay';

export default function Testimonials({ apiTestimonials = [] }) {
  const reviews = getHomeTestimonials(apiTestimonials);
  const hasReviews = reviews.length > 0;

  return (
    <motion.section
      id="testimonials"
      className="testimonials-section section-tone-sand-soft scroll-mt-24 relative overflow-hidden py-12 md:py-16"
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
          <h2 className="section-title mb-3 text-2xl md:text-3xl lg:text-4xl">
            Explored India &amp; Beyond With Us
          </h2>
          <p className="testimonials-section__lede">
            Real stories from travellers who explored India and beyond with Happy Feet Travellers —
            moments of wonder, comfort, adventure, and meaningful connections along the way.
          </p>
        </motion.header>

        <div className="testimonials-section__google-wrap">
          <GoogleReviewsBadge className="testimonials-section__google-badge" />
          {hasReviews ? (
            <GoogleReviewsCarousel reviews={reviews} />
          ) : (
            <p className="mx-auto mt-8 max-w-xl text-center text-sm leading-relaxed text-foreground/70">
              Traveller stories will appear here once you add them in Admin → Testimonials.
            </p>
          )}
        </div>

        <p className="testimonials-section__footnote">
          {hasReviews
            ? 'Reviews curated from Admin → Testimonials'
            : 'Google rating above — add guest stories from Admin → Testimonials'}
        </p>
      </div>
    </motion.section>
  );
}
