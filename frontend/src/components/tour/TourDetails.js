'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import FAQAccordion from '@/components/common/FAQAccordion';
import TripGalleryReel from '@/components/tour/TripGalleryReel';
import { API_BASE_URL } from '@/constants/site';
import { openTourItineraryPrint } from '@/lib/tourItineraryPrint';
import { resolveTourPriceAmount } from '@/lib/tourPrice';
import {
  buildReserveSeatHref,
  formatReserveDepositInr,
  formatReserveSeatLabel,
  isGroupDepartureTour,
  resolveReserveDepositAmount,
} from '@/lib/tourReserve';
import { whatsappHref } from '@/lib/siteContact';
const FALLBACK_TOUR_IMAGE =
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=80';
const API_ASSET_BASE = (API_BASE_URL || '').replace(/\/api\/?$/, '').replace(/\/$/, '');

function resolveImageUrl(value) {
  const src = String(value || '').trim();
  if (!src) return '';
  if (/^(data:|blob:|https?:\/\/)/i.test(src)) return src;
  if (src.startsWith('/images/') || src.startsWith('/videos/') || src.startsWith('/happy-feet-logo')) return src;
  if (src.startsWith('/')) return API_ASSET_BASE ? `${API_ASSET_BASE}${src}` : src;
  return API_ASSET_BASE ? `${API_ASSET_BASE}/${src}` : `/${src}`;
}

function parseImageList(value) {
  if (Array.isArray(value)) return value;
  if (typeof value !== 'string') return value ? [value] : [];
  const trimmed = value.trim();
  if (!trimmed) return [];
  if (trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // Fall through to single/comma parsing.
    }
  }
  return trimmed.includes(',') ? trimmed.split(',') : [trimmed];
}

function getImageUrl(image) {
  if (typeof image === 'string') return resolveImageUrl(image);
  if (!image || typeof image !== 'object') return '';
  return resolveImageUrl(
    image.image ||
      image.url ||
      image.src ||
      image.path ||
      image.imageUrl ||
      image.imageURL ||
      image.secure_url ||
      image.coverImage ||
      image.thumbnail ||
      ''
  );
}

function getTourGalleryImages(tour) {
  if (Array.isArray(tour?.gallery) && tour.gallery.length) {
    return [...new Set(tour.gallery.map(getImageUrl).filter(Boolean))];
  }
  const values = [
    ...parseImageList(tour?.images),
    tour?.coverImage,
    tour?.image,
  ];
  return [...new Set(values.map(getImageUrl).filter(Boolean))];
}

function Modal({ open, title, onClose, children }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-primary/20 p-4 backdrop-blur-xl backdrop-saturate-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <h3 id="modal-title" className="mb-4 text-xl font-bold text-primary">
          {title}
        </h3>
        <div className="text-foreground">{children}</div>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-lg bg-primary py-2.5 font-semibold text-white transition hover:opacity-90"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default function TourDetails({ tour, whatsappNumber }) {
  const [pickupOpen, setPickupOpen] = useState(false);
  const [inclusionsOpen, setInclusionsOpen] = useState(false);
  const [exclusionsOpen, setExclusionsOpen] = useState(false);
  const [carryOpen, setCarryOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  const gallery = getTourGalleryImages(tour);
  const displayGallery = gallery.length ? gallery : [FALLBACK_TOUR_IMAGE];
  const inclusions = tour.inclusions || [];
  const exclusions = tour.exclusions || [];
  const faqs = tour.faqs || [];
  const thingsToCarry = tour.thingsToCarry || [];
  const itinerary = tour.itinerary || [];
  const terms = tour.terms || [];
  const supplements = tour.supplements || [];
  const pickupPoints = tour.pickupPoints || [];
  const isCustomized = tour.category === 'customized';
  const showReserve = isGroupDepartureTour(tour);
  const reserveDeposit = resolveReserveDepositAmount(tour);
  const reserveHref = buildReserveSeatHref(tour, whatsappNumber);
  const waEnquiry = whatsappHref(
    whatsappNumber,
    `Hi, I'm interested in: ${tour.title} (${tour.date || tour.dateLabel || ''})`
  );

  return (
    <section className={`relative ${showReserve ? 'pb-28' : 'pb-12'}`}>
      <div className="sticky top-0 z-40 border-b border-[#dceaf7] bg-white/95 shadow-sm backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-primary md:text-3xl">{tour.title}</h1>
              {tour.offers && (
                <p className="mt-2 inline-flex max-w-full flex-wrap items-center gap-2 rounded-full border border-cta/40 bg-cta/15 px-3 py-1 text-xs font-semibold text-primary">
                  <span aria-hidden>✨</span>
                  {tour.offers}
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-foreground">
                <span>⏱️ {tour.duration}</span>
                {tour.departureCity ? <span>📍 {tour.departureCity}</span> : null}
                <span>📅 {tour.date || tour.dateLabel || tour.startDate || 'On request'}</span>
                {!isCustomized && tour.rating != null ? (
                  <span>
                    ⭐ {tour.rating}
                    {(tour.reviews ?? tour.reviewsCount) > 0
                      ? ` (${tour.reviews ?? tour.reviewsCount} reviews)`
                      : ''}
                  </span>
                ) : null}
              </div>
            </div>
            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
              <div className="text-right sm:mr-2">
                <div className="text-xs text-foreground/70">{isCustomized ? 'Starting from' : 'Per traveller'}</div>
                <div className="text-2xl font-bold text-primary">
                  ₹{resolveTourPriceAmount(tour.startingPrice, tour.price).toLocaleString('en-IN')}
                </div>
                {isCustomized && <p className="text-xs text-foreground/65">Contact us to curate your package</p>}
              </div>
              <div className="flex flex-wrap gap-2">
                {showReserve ? (
                  <a
                    href={reserveHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border-2 border-[#2E7D32] bg-white px-5 py-2.5 text-center text-sm font-semibold text-[#2E7D32] transition hover:bg-[#1B5E20] hover:text-white"
                  >
                    {formatReserveSeatLabel(tour)}
                  </a>
                ) : null}
                <a
                  href={waEnquiry}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border-2 border-primary/25 bg-white px-5 py-2.5 text-center text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
                >
                  Ask on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 lg:hidden">
          <Swiper
            modules={[Autoplay, Pagination]}
            loop={displayGallery.length > 1}
            autoplay={{ delay: 3200, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            spaceBetween={12}
            slidesPerView={1}
            className="overflow-hidden rounded-2xl border border-[#dceaf7] shadow-sm [&_.swiper-pagination-bullet-active]:bg-primary"
          >
            {displayGallery.map((img, idx) => (
              <SwiperSlide key={`m-${idx}`}>
                <div className="aspect-[16/10] w-full bg-section-alt">
                  <img
                    src={img}
                    alt=""
                    className="h-full w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.src = FALLBACK_TOUR_IMAGE;
                    }}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-28">
              <div className="rounded-2xl border border-[#dceaf7] bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-primary">Quick info</h2>
                <ul className="space-y-3 text-sm text-foreground">
                  <li className="flex gap-2">
                    <span className="text-secondary" aria-hidden>
                      •
                    </span>
                    <span>
                      <strong className="text-primary">Meals:</strong> {tour.meals || 'As per itinerary'}
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-secondary" aria-hidden>
                      •
                    </span>
                    <span>
                      <strong className="text-primary">Stay:</strong> {tour.stayType || 'Hotels as per plan'}
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-secondary" aria-hidden>
                      •
                    </span>
                    <span>
                      <strong className="text-primary">Transport:</strong> {tour.transport || 'Private / shared as per tour'}
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-secondary" aria-hidden>
                      •
                    </span>
                    <span>
                      <strong className="text-primary">Suitable for:</strong> {tour.suitableFor || 'Most travellers'}
                    </span>
                  </li>
                </ul>

                {tour.highlights?.length > 0 && (
                  <div className="mt-6 border-t border-[#eaf4fb] pt-6">
                    <h3 className="mb-2 text-sm font-bold text-primary">Tour highlights</h3>
                    <ul className="space-y-2 text-sm text-foreground">
                      {tour.highlights.map((h, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-green-600">✓</span>
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-6 border-t border-[#eaf4fb] pt-6">
                  <button
                    type="button"
                    onClick={() => setPickupOpen(true)}
                    className="w-full rounded-xl border border-primary/30 bg-section-alt py-2.5 text-sm font-semibold text-primary transition hover:bg-[#dceaf7]"
                  >
                    Pick-up points
                  </button>
                </div>

                <div className="mt-4 space-y-2">
                  <button
                    type="button"
                    onClick={() => openTourItineraryPrint(tour)}
                    className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    Download itinerary (PDF)
                  </button>
                  <Link
                    href="/contact"
                    className="block w-full rounded-xl bg-cta py-2.5 text-center text-sm font-semibold text-primary transition hover:bg-[#E76F51] hover:text-white"
                  >
                    {isCustomized ? 'Request custom quote' : 'Ask a question'}
                  </Link>
                </div>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-9">
            <div className="rounded-2xl border border-[#dceaf7] bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-2xl font-bold text-primary">Itinerary</h2>
              <div className="relative space-y-0 border-l-2 border-[#dceaf7] pl-6">
                {itinerary.map((item, idx) => (
                  <div key={`${item.day}-${idx}`} className="relative pb-8 last:pb-0">
                    <span className="absolute -left-[29px] top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-secondary bg-white ring-4 ring-white" />
                    <div className="text-xs font-bold uppercase tracking-wide text-secondary">{item.day}</div>
                    <h3 className="mt-1 text-lg font-bold text-primary">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-foreground">{item.details}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-[#dceaf7] bg-white p-5 shadow-sm">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary">Moments</p>
                  <h2 className="mt-1 text-xl font-bold text-primary">Trip gallery</h2>
                </div>
                <p className="text-sm font-medium text-foreground/65">Auto-scrolling photo reel</p>
              </div>

              <TripGalleryReel images={displayGallery} />
            </div>

            {supplements.length > 0 && (
              <div className="mt-8 rounded-2xl border border-[#dceaf7] bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-bold text-primary">Upgrades & add-ons</h2>
                <ul className="space-y-4">
                  {supplements.map((s, i) => (
                    <li key={i} className="rounded-xl border border-[#eaf4fb] bg-section-alt/50 p-4">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <span className="font-semibold text-primary">{s.name}</span>
                        <span className="text-sm font-bold text-primary">{s.price}</span>
                      </div>
                      {s.note && <p className="mt-1 text-xs text-foreground/75">{s.note}</p>}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-8 rounded-2xl border border-[#dceaf7] bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold text-primary">FAQs</h2>
              <FAQAccordion items={faqs} />
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setInclusionsOpen(true)}
                className="rounded-lg bg-[#EAF4FB] px-4 py-2 text-sm font-semibold text-primary transition hover:opacity-90"
              >
                Inclusions
              </button>
              <button
                type="button"
                onClick={() => setExclusionsOpen(true)}
                className="rounded-lg bg-[#fff3ed] px-4 py-2 text-sm font-semibold text-[#c05b1d] transition hover:opacity-90"
              >
                Exclusions
              </button>
              <button
                type="button"
                onClick={() => setCarryOpen(true)}
                className="rounded-lg border border-[#dceaf7] bg-white px-4 py-2 text-sm font-semibold text-primary transition hover:bg-section-alt"
              >
                Things to carry
              </button>
              <button
                type="button"
                onClick={() => setCancelOpen(true)}
                className="rounded-lg border border-[#dceaf7] bg-white px-4 py-2 text-sm font-semibold text-primary transition hover:bg-section-alt"
              >
                Cancellation & refund
              </button>
              <button
                type="button"
                onClick={() => setTermsOpen(true)}
                className="rounded-lg border border-[#dceaf7] bg-white px-4 py-2 text-sm font-semibold text-primary transition hover:bg-section-alt"
              >
                Terms & conditions
              </button>
            </div>
          </div>

        </div>
      </div>

      <Modal open={pickupOpen} title="Pick-up points" onClose={() => setPickupOpen(false)}>
        {pickupPoints.length === 0 ? (
          <p className="text-sm">Pick-up details are shared on your booking voucher. WhatsApp us for the latest list.</p>
        ) : (
          <ul className="space-y-4">
            {pickupPoints.map((p, i) => (
              <li key={i} className="rounded-lg border border-[#eaf4fb] p-3">
                <div className="font-semibold text-primary">{p.name}</div>
                <div className="mt-1 text-sm text-foreground/85">{p.detail}</div>
              </li>
            ))}
          </ul>
        )}
      </Modal>

      <Modal open={inclusionsOpen} title="What’s included" onClose={() => setInclusionsOpen(false)}>
        <ul className="space-y-2">
          {inclusions.map((item, idx) => (
            <li key={idx} className="flex gap-2 text-sm">
              <span className="text-green-600">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </Modal>

      <Modal open={exclusionsOpen} title="What’s not included" onClose={() => setExclusionsOpen(false)}>
        <ul className="space-y-2">
          {exclusions.map((item, idx) => (
            <li key={idx} className="flex gap-2 text-sm">
              <span className="text-red-500">✕</span>
              {item}
            </li>
          ))}
        </ul>
      </Modal>

      <Modal open={carryOpen} title="Things to carry" onClose={() => setCarryOpen(false)}>
        {thingsToCarry.length === 0 ? (
          <p className="text-sm">List will be updated before departure.</p>
        ) : (
          <ul className="space-y-2">
            {thingsToCarry.map((item, idx) => (
              <li key={idx} className="flex gap-2 text-sm">
                <span className="text-primary">•</span>
                {item}
              </li>
            ))}
          </ul>
        )}
      </Modal>

      <Modal open={cancelOpen} title="Cancellation & refund policy" onClose={() => setCancelOpen(false)}>
        <p className="whitespace-pre-line text-sm leading-relaxed">
          {tour.cancellationPolicy ||
            'Full policy is shared with your booking confirmation. Contact us for batch-specific rules.'}
        </p>
        <Link href="/policies/cancellation" className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">
          Read full cancellation policy →
        </Link>
      </Modal>

      <Modal open={termsOpen} title="Terms & conditions" onClose={() => setTermsOpen(false)}>
        <ul className="list-inside list-disc space-y-2 text-sm">
          {terms.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
        <div className="mt-4 flex flex-col gap-2 text-sm">
          <Link href="/policies/terms" className="font-semibold text-primary hover:underline">
            Full terms & conditions →
          </Link>
        </div>
      </Modal>

      {showReserve ? (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#dceaf7] bg-white/95 py-3 shadow-[0_-4px_20px_rgba(31,78,121,0.12)] backdrop-blur">
          <div className="container mx-auto flex flex-col items-stretch justify-between gap-3 px-4 sm:flex-row sm:items-center">
            <div className="text-center sm:text-left">
              <p className="text-sm font-semibold text-primary">
                Reserve your seat — <span className="text-cta">{formatReserveDepositInr(reserveDeposit)}</span> booking
                amount
              </p>
              <p className="mt-0.5 text-xs text-foreground/65">
                Pay the balance before the tour or while travelling · availability confirmed on WhatsApp or call
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 sm:justify-end">
              <a
                href={reserveHref}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border-2 border-[#2E7D32] bg-[#2E7D32] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#1B5E20]"
              >
                {formatReserveSeatLabel(tour)}
              </a>
              <a
                href={waEnquiry}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border-2 border-primary/20 bg-white px-5 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
              >
                General enquiry
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
