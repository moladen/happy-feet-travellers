'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { getTourDetailHref } from '@/lib/tourDisplay';
import { resolveTourPriceAmount } from '@/lib/tourPrice';
import {
  buildReserveSeatHref,
  formatReserveDepositInr,
  formatReserveSeatLabel,
  isGroupDepartureTour,
  resolveReserveDepositAmount,
} from '@/lib/tourReserve';

const reserveBtnClass =
  'inline-flex w-full items-center justify-center gap-1.5 rounded-full border-2 border-[#2E7D32] bg-white px-4 py-2.5 text-sm font-semibold text-[#2E7D32] shadow-sm transition-all duration-300 hover:bg-[#1B5E20] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2E7D32] focus-visible:ring-offset-2 sm:w-auto';

const detailsBtnClass =
  'inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-cta px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-cta-hover hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-cta/50 focus-visible:ring-offset-2 sm:w-auto';

function CardFooter({ tour, detailHref, showReserve, reserveHref, depositLabel, compact }) {
  const safePrice = resolveTourPriceAmount(tour?.startingPrice, tour?.price);

  return (
    <div className="mt-auto border-t border-[#eaf4fb]/90 pt-4">
      <div
        className={
          compact
            ? 'flex flex-col gap-3'
            : 'flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'
        }
      >
        <div className="min-w-0">
          <div className="text-[11px] font-medium uppercase tracking-wide text-foreground/55">Starting from</div>
          <div className="text-2xl font-bold tracking-tight text-primary">
            ₹{safePrice.toLocaleString('en-IN')}
            <span className="ml-1 text-sm font-medium text-foreground/55">/ person</span>
          </div>
        </div>
        <div className={`flex flex-col gap-2 ${compact ? '' : 'sm:shrink-0 sm:flex-row sm:flex-wrap'}`}>
          <Link href={detailHref} className={detailsBtnClass}>
            View full details
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          {showReserve ? (
            <a href={reserveHref} target="_blank" rel="noopener noreferrer" className={reserveBtnClass}>
              {formatReserveSeatLabel(tour)}
            </a>
          ) : null}
        </div>
      </div>
      {showReserve ? (
        <p className="mt-3 text-xs leading-relaxed text-foreground/65">
          Pay {depositLabel} now to reserve your seat via WhatsApp — balance due before or during the tour. We&apos;ll
          confirm availability before you pay.
        </p>
      ) : null}
    </div>
  );
}

function CardBody({ tour, detailHref, rating }) {
  return (
    <>
      <div className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-secondary transition-colors group-hover:text-primary">
        {tour.subCategory || tour.category || 'Tour'}
      </div>
      <h3 className="mb-2 line-clamp-2 text-lg font-bold leading-snug text-primary transition-colors duration-300 group-hover:text-[#2a6094] md:text-xl">
        <Link
          href={detailHref}
          className="rounded-sm hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
        >
          {tour.title}
        </Link>
      </h3>
      <div className="mb-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-foreground/90">
        <span className="inline-flex items-center gap-1.5">📅 {tour.date || tour.dateLabel || 'Dates on request'}</span>
      </div>
      <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-foreground/85">
        <span>⏱️ {tour.durationLabel || tour.duration}</span>
        <span className="rounded-full bg-section-alt/90 px-2 py-0.5 text-xs font-semibold text-primary">⭐ {rating}</span>
      </div>
    </>
  );
}

export default function TourCard({ tour, whatsappNumber, variant = 'card' }) {
  const isList = variant === 'list';
  const imageSrc = tour?.image || tour?.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=80';
  const rating = tour?.rating != null ? tour.rating : '—';
  const detailHref = getTourDetailHref(tour);
  const showReserve = isGroupDepartureTour(tour);
  const reserveHref = buildReserveSeatHref(tour, whatsappNumber);
  const depositLabel = formatReserveDepositInr(resolveReserveDepositAmount(tour));

  if (isList) {
    return (
      <motion.article
        className="group grid h-full w-full overflow-hidden rounded-2xl border border-[#eaf4fb] bg-white shadow-sm transition-[box-shadow,border-color] duration-300 hover:border-cta/20 hover:shadow-[0_12px_32px_-14px_rgba(15,28,46,0.15)] md:grid-cols-[272px_minmax(0,1fr)] md:items-stretch"
        whileHover={{ y: -2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 26 }}
      >
        <Link
          href={detailHref}
          className="relative block h-52 w-full overflow-hidden bg-gradient-to-br from-section-alt to-[#dceaf7] md:h-full md:min-h-[248px]"
        >
          <img
            src={imageSrc}
            alt=""
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent md:bg-gradient-to-r md:from-black/45 md:to-transparent" />
          {tour.urgency ? (
            <span className="absolute right-3 top-3 rounded-full bg-cta/95 px-3 py-1 text-xs font-bold text-primary shadow-md">
              {tour.urgency}
            </span>
          ) : null}
        </Link>

        <div className="flex min-w-0 flex-col p-5 md:p-6">
          <CardBody tour={tour} detailHref={detailHref} rating={rating} />
          <CardFooter
            tour={tour}
            detailHref={detailHref}
            showReserve={showReserve}
            reserveHref={reserveHref}
            depositLabel={depositLabel}
            compact={false}
          />
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      className="glass-card group relative flex h-full w-full flex-col overflow-hidden rounded-3xl transition-[box-shadow,border-color,transform] duration-500 hover:border-cta/25 hover:shadow-[0_24px_52px_-14px_rgba(15,28,46,0.22)]"
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
      <Link
        href={detailHref}
        className="relative z-[1] block aspect-[4/3] max-h-56 w-full shrink-0 overflow-hidden bg-gradient-to-br from-section-alt to-[#dceaf7]"
      >
        <img
          src={imageSrc}
          alt=""
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.07]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        {tour.urgency ? (
          <span className="absolute right-3 top-3 rounded-full bg-cta/95 px-3 py-1 text-xs font-bold text-primary shadow-md backdrop-blur-sm">
            {tour.urgency}
          </span>
        ) : null}
      </Link>

      <div className="relative z-[2] flex min-h-0 flex-1 flex-col p-5 md:p-6">
        <CardBody tour={tour} detailHref={detailHref} rating={rating} />
        <CardFooter
          tour={tour}
          detailHref={detailHref}
          showReserve={showReserve}
          reserveHref={reserveHref}
          depositLabel={depositLabel}
          compact
        />
      </div>
    </motion.article>
  );
}
