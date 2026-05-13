'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import TestimonialCard from '@/components/common/TestimonialCard';

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: 'Aditi Joshi',
      city: 'Kothrud, Pune',
      rating: 5,
      text: 'Booked the Gangtok–Darjeeling departure with two friends. Pickup from Pune was on time, the trip captain was patient, and Tiger Hill at sunrise was the highlight. Pricing matched the brochure exactly.',
      longReview:
        'We were nervous about our first group tour from Pune, but Happy Feet made it effortless—from the first WhatsApp reply to the last drop-off. Pickup was punctual, the hotels were exactly as described, and Tiger Hill at sunrise was unforgettable. What stood out was transparency: no surprise costs, and the team checked in daily without being intrusive. We have already recommended them to family in Kothrud.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    },
    {
      id: 2,
      name: 'Sameer Deshpande',
      city: 'Baner, Pune',
      rating: 5,
      text: 'We did the Goa group trip as a family of four. Hotel was clean, transfers were sorted, and our questions on WhatsApp were answered the same day. No upselling on-trip — refreshing change.',
      longReview:
        'Travelling with two young kids is never “relaxing,” but this Goa departure came close. Transfers were on time, the property was genuinely family-friendly, and every doubt on WhatsApp got a clear answer the same day. On the trip there was zero pressure to buy add-ons—we only paid for what we had chosen upfront. That honesty is rare, and it is why we will book our next long weekend with them again.',
      image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=200&h=200&fit=crop',
    },
    {
      id: 3,
      name: 'Pooja Iyer',
      city: 'Wakad, Pune',
      rating: 5,
      text: 'Customised a Kerala backwaters trip for our anniversary. Houseboat was exactly what was promised. They even helped re-route once because of unexpected rain — small thing, big difference.',
      longReview:
        'We wanted a quiet Kerala anniversary with a houseboat night and tea-estate stays—nothing generic. The FIT itinerary felt personal: realistic driving times, hand-picked stays, and backup options when rain changed our route. The houseboat matched the photos, and the quick re-planning when weather shifted saved our mood more than they know. It felt like planners who actually travel, not a call centre.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    },
    {
      id: 4,
      name: 'Rahul Kulkarni',
      city: 'Hadapsar, Pune',
      rating: 4,
      text: 'Solo traveller here. Joined the Sikkim group and ended up making real friends. Group size was small, pace was relaxed, and the food choices were genuinely good.',
      longReview:
        'As a solo traveller I worried about fitting into a group, but the Sikkim batch was the right size and pace—not rushed, not dull. I made friends I still meet for coffee in Pune. Meals had real variety for vegetarians too, which sounds small until you have done tours that ignore it. I would join another Happy Feet departure without hesitation.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

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

  const carouselVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6 },
    },
  };

  const cardVariants = {
    enter: {
      x: 300,
      opacity: 0,
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: {
      zIndex: 0,
      x: -300,
      opacity: 0,
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
    },
  };

  const dotsVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.4, delay: 0.3 },
    },
  };

  return (
    <motion.section
      id="testimonials"
      className="section-ambient scroll-mt-24 relative overflow-hidden bg-section-alt/75 py-14 backdrop-blur-[2px] md:py-16"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="container relative z-10 mx-auto px-4">
        {/* Header */}
        <motion.div className="mb-8 text-center md:mb-10" variants={headerVariants}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-secondary">Social proof</p>
          <h2 className="mb-3 text-3xl font-bold text-primary md:text-4xl lg:text-5xl">Testimonials</h2>
          <p className="text-base text-foreground/80 md:text-lg">Honest words from Pune travellers who came back smiling.</p>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="max-w-2xl mx-auto relative">
          <motion.div
            key={currentIndex}
            variants={cardVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
          >
            <TestimonialCard testimonial={currentTestimonial} />
          </motion.div>

          {/* Navigation Buttons */}
          <motion.button
            onClick={handlePrev}
            aria-label="Previous testimonial"
            className="absolute -left-12 top-1/2 transform -translate-y-1/2 bg-primary text-white p-3 rounded-full hover:opacity-90 transition shadow-lg"
            variants={buttonVariants}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>

          <motion.button
            onClick={handleNext}
            aria-label="Next testimonial"
            className="absolute -right-12 top-1/2 transform -translate-y-1/2 bg-primary text-white p-3 rounded-full hover:opacity-90 transition shadow-lg"
            variants={buttonVariants}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>

        {/* Dots Indicator */}
        <motion.div className="mt-6 flex justify-center gap-2" variants={dotsVariants}>
          {testimonials.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-3 w-3 rounded-full transition ${
                index === currentIndex ? 'bg-primary' : 'bg-gray-300'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </motion.div>

        <motion.div
          className="mx-auto mt-12 max-w-6xl md:mt-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55 }}
        >
          <h3 className="mb-3 text-center text-2xl font-bold text-primary md:text-3xl">We&apos;ve got love from our clients</h3>
          <p className="mx-auto mb-6 max-w-2xl text-center text-sm text-foreground/80 md:text-base">
            Guest photos and longer notes from people who travelled with us—real detail, not one-liners.
          </p>
          <div className="grid gap-4 md:grid-cols-2 md:gap-5">
            {testimonials.map((t) => (
              <article
                key={`love-${t.id}`}
                className="glass-card flex flex-col gap-3 overflow-hidden rounded-2xl p-4 shadow-sm transition-shadow duration-300 hover:shadow-md md:flex-row md:items-start md:gap-4 md:p-5"
              >
                <img
                  src={t.image}
                  alt=""
                  className="mx-auto h-28 w-28 shrink-0 rounded-full border-4 border-section-alt object-cover shadow-md md:mx-0"
                />
                <div className="min-w-0 flex-1 text-left">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="font-bold text-primary">{t.name}</span>
                    <span className="text-sm text-secondary">{t.city}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/90">{t.longReview}</p>
                </div>
              </article>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
