'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function TourCard({ tour }) {
  const price = Number(tour?.price ?? tour?.startingPrice ?? 0);
  const safePrice = Number.isFinite(price) ? price : 0;
  const imageSrc = tour?.image || tour?.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=80';
  const rating = tour?.rating != null ? tour.rating : '—';

  return (
    <Link
      href={`/tour/${tour.id}`}
      className="group block h-full rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <motion.article
        className="glass-card relative flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl transition-[box-shadow,border-color] duration-500 group-hover:border-secondary/35 group-hover:shadow-[0_22px_48px_-14px_rgba(31,78,121,0.22)]"
        whileHover={{ y: -6 }}
        transition={{ type: 'spring', stiffness: 400, damping: 26 }}
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(120% 80% at 10% 0%, rgba(79, 163, 209, 0.18), transparent 50%), radial-gradient(100% 60% at 100% 100%, rgba(244, 162, 97, 0.12), transparent 45%)',
          }}
          aria-hidden
        />
        <div className="card-shimmer-hover relative z-[1] h-56 w-full overflow-hidden bg-gradient-to-br from-section-alt to-[#dceaf7]">
          <img
            src={imageSrc}
            alt=""
            className="h-full w-full object-cover transition-[transform,filter] duration-500 ease-out group-hover:scale-[1.07] group-hover:brightness-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent transition-opacity duration-300 group-hover:from-black/65" />
          {tour.urgency && (
            <motion.span
              className="absolute right-3 top-3 rounded-full bg-cta/95 px-3 py-1 text-xs font-bold text-primary shadow-md backdrop-blur-sm"
              initial={false}
              whileHover={{ scale: 1.05 }}
            >
              {tour.urgency}
            </motion.span>
          )}
        </div>

        <div className="relative z-[2] flex flex-1 flex-col p-5 md:p-6">
          <div className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-secondary transition-colors group-hover:text-primary">
            {tour.subCategory || tour.category || 'Tour'}
          </div>
          <h3 className="mb-3 line-clamp-2 text-lg font-bold text-primary transition-colors duration-300 group-hover:text-[#2a6094] md:text-xl">
            {tour.title}
          </h3>
          <div className="mb-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-foreground/90">
            <span className="inline-flex items-center gap-1.5 transition-transform duration-300 group-hover:translate-x-0.5">
              📅 {tour.date}
            </span>
          </div>
          <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-foreground/85">
            <span>⏱️ {tour.duration}</span>
            <span className="rounded-full bg-section-alt/90 px-2 py-0.5 text-xs font-semibold text-primary">⭐ {rating}</span>
          </div>
          <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#eaf4fb]/90 pt-4">
            <div>
              <div className="text-[11px] font-medium uppercase tracking-wide text-foreground/55">Starting from</div>
              <div className="text-2xl font-bold tracking-tight text-primary md:text-[1.65rem]">
                ₹{safePrice.toLocaleString('en-IN')}
              </div>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 group-hover:bg-[#2a6094] group-hover:shadow-md">
              View full details
              <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
