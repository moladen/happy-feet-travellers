'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function FAQAccordion({ items = [], className = '' }) {
  const [openIdx, setOpenIdx] = useState(null);

  if (!items.length) return null;

  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((faq, idx) => {
        const open = openIdx === idx;
        return (
          <motion.div
            key={idx}
            layout
            className="overflow-hidden rounded-2xl border border-white/60 glass-card shadow-sm transition-shadow duration-300 hover:shadow-md data-[open=true]:border-secondary/25 data-[open=true]:shadow-[0_12px_32px_-12px_rgba(31,78,121,0.15)]"
            data-open={open}
            initial={false}
          >
            <button
              type="button"
              onClick={() => setOpenIdx(open ? null : idx)}
              className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-primary transition-colors hover:bg-white/50"
              aria-expanded={open}
              aria-controls={`faq-panel-${idx}`}
              id={`faq-trigger-${idx}`}
            >
              <span className="pr-2">{faq.question}</span>
              <motion.span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-section-alt text-secondary"
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                aria-hidden
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  id={`faq-panel-${idx}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${idx}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden border-t border-[#eaf4fb]/80"
                >
                  <motion.div
                    initial={{ y: -6 }}
                    animate={{ y: 0 }}
                    exit={{ y: -4 }}
                    transition={{ duration: 0.28, ease: 'easeOut' }}
                    className="px-5 pb-4 pt-3 text-sm leading-relaxed text-foreground md:text-[0.9375rem]"
                  >
                    {faq.answer}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
