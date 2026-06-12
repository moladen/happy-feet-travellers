'use client';

import { motion, useReducedMotion } from 'framer-motion';

const TRUST_POINTS = [
  { label: 'Fixed Departure Guarantee', icon: 'departure' },
  { label: 'Tour Leader Throughout', icon: 'leader' },
  { label: 'No Hidden Charges', icon: 'pricing' },
  { label: 'Verified Stays', icon: 'stays' },
  { label: 'Local Support', icon: 'support' },
  { label: 'Comfortable Transport', icon: 'transport' },
  { label: 'Family-Friendly Groups', icon: 'family' },
];

const EASE = [0.22, 1, 0.36, 1];

function TrustPointIcon({ type }) {
  const shared = {
    className: 'traveller-trust-point__icon-svg',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.75,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  };

  switch (type) {
    case 'departure':
      return (
        <svg {...shared}>
          <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
          <path d="m9 16 2 2 4-4" />
        </svg>
      );
    case 'leader':
      return (
        <svg {...shared}>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 20v-1.5a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4V20" />
          <path d="M16 3.5 18 6l3-3" />
        </svg>
      );
    case 'pricing':
      return (
        <svg {...shared}>
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      );
    case 'stays':
      return (
        <svg {...shared}>
          <path d="M3 10.5 12 4l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
          <path d="m9 14 2 2 4-4" />
        </svg>
      );
    case 'support':
      return (
        <svg {...shared}>
          <path d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      );
    case 'transport':
      return (
        <svg {...shared}>
          <path d="M8 6v8M16 6v8M4 10h16v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
          <circle cx="7.5" cy="18" r="1.5" />
          <circle cx="16.5" cy="18" r="1.5" />
        </svg>
      );
    case 'family':
      return (
        <svg {...shared}>
          <circle cx="9" cy="7" r="2.5" />
          <circle cx="16" cy="8" r="2" />
          <path d="M4 20v-1.5a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3V20M14 20v-1a2.5 2.5 0 0 1 2.5-2.5H20" />
        </svg>
      );
    default:
      return (
        <svg {...shared}>
          <path d="m5 12 5 5L20 7" />
        </svg>
      );
  }
}

export default function TravellerTrustSection() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      id="why-travellers-choose-us"
      className="traveller-trust-section section-ambient section-tone-trust relative overflow-hidden py-14 md:py-16 lg:py-[4.5rem]"
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.55, ease: EASE }}
      aria-labelledby="traveller-trust-heading"
    >
      <div className="container relative z-10 mx-auto max-w-6xl px-4">
        <header className="traveller-trust-section__header">
          <p className="section-eyebrow mb-2">Trusted across India</p>
          <h2 id="traveller-trust-heading" className="section-title text-3xl md:text-4xl lg:text-[2.5rem]">
            Why 5000+ Travellers Choose Happy Feet Travellers
          </h2>
          <p className="traveller-trust-section__lede">
            Clear promises on every route — fixed departures, honest pricing, and a team that stays
            with you from booking to homecoming.
          </p>
        </header>

        <motion.ul
          className="traveller-trust-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.08 }}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: reduceMotion ? 0 : 0.06 },
            },
          }}
        >
          {TRUST_POINTS.map((point) => (
            <motion.li
              key={point.label}
              variants={{
                hidden: { opacity: 0, y: 18 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.42, ease: EASE },
                },
              }}
              className="traveller-trust-point"
            >
              <span className="traveller-trust-point__icon-wrap" aria-hidden>
                <TrustPointIcon type={point.icon} />
              </span>
              <span className="traveller-trust-point__label">{point.label}</span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </motion.section>
  );
}
