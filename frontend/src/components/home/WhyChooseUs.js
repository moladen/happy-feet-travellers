'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { travelIconClassForEmoji } from '@/lib/travelIconAnimations';

const TRUST_PILLARS = [
  {
    icon: '🌄',
    label: 'Experience first',
    title: 'Journeys that feel alive',
    description:
      'Itineraries built around landscapes, culture, and pace — not rushed sightseeing or filler stops.',
  },
  {
    icon: '👥',
    label: 'Smaller groups',
    title: 'Intimate departures',
    description:
      'Right-sized groups so you actually connect with your route, guide, and fellow travellers.',
  },
  {
    icon: '✦',
    label: 'Honest pricing',
    title: 'Clear, fair costs',
    description:
      'Transparent inclusions and upfront clarity — no surprise fees hiding in the fine print.',
  },
  {
    icon: '🧭',
    label: 'Practical expertise',
    title: 'Guides who know the trail',
    description:
      'Leaders and planners who have travelled the routes themselves and anticipate what matters on the ground.',
  },
  {
    icon: '🛡️',
    label: 'Safety & comfort',
    title: 'Calm, cared-for travel',
    description:
      'Reliable transport, vetted stays, and steady support so you can focus on the experience.',
  },
  {
    icon: '✨',
    label: 'Curated experiences',
    title: 'Handpicked moments',
    description:
      'Stays, timings, and local touches chosen with intention — the kind of detail you feel, not just read.',
  },
];

const COMMUNITY_TAGS = ['Thoughtful planning', 'Transparent costs', 'Care on every route'];

const EASE = [0.22, 1, 0.36, 1];

export default function WhyChooseUs() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      id="why-choose-us"
      className="why-trust-section section-ambient section-tone-trust relative overflow-hidden py-14 md:py-16 lg:py-[4.5rem]"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.55, ease: EASE }}
    >
      <div className="container relative z-10 mx-auto max-w-6xl px-4">
        <header className="why-trust-section__header">
          <p className="section-eyebrow mb-2">The Happy Feet promise</p>
          <h2 className="section-title text-3xl md:text-4xl lg:text-[2.65rem]">Why travellers choose us</h2>
          <p className="why-trust-section__lede">
            We plan journeys the way we would want to take them — with room to breathe, honest
            communication, and a team that stays with you from enquiry to homecoming.
          </p>
        </header>

        <motion.ul
          className="why-trust-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.08 }}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: reduceMotion ? 0 : 0.07 },
            },
          }}
        >
          {TRUST_PILLARS.map((pillar) => (
            <motion.li
              key={pillar.label}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.45, ease: EASE },
                },
              }}
              className="why-trust-card"
            >
              <div className="why-trust-card__icon-wrap">
                <span
                  className={`why-trust-card__icon ${travelIconClassForEmoji(pillar.icon)}`}
                  role="img"
                  aria-hidden
                >
                  {pillar.icon}
                </span>
              </div>
              <p className="why-trust-card__label">{pillar.label}</p>
              <h3 className="why-trust-card__title">{pillar.title}</h3>
              <p className="why-trust-card__text">{pillar.description}</p>
            </motion.li>
          ))}
        </motion.ul>

        <motion.aside
          className="why-trust-community"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
        >
          <div className="why-trust-community__glow" aria-hidden />
          <p className="why-trust-community__eyebrow">A travel community, not a headcount</p>
          <p className="why-trust-community__quote">
            Families, couples, and solo explorers across India travel with us because the journey
            feels personal — planned with care, led with experience, and supported long after the
            bags are unpacked.
          </p>
          <ul className="why-trust-community__tags">
            {COMMUNITY_TAGS.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        </motion.aside>
      </div>
    </motion.section>
  );
}
