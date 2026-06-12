'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import FAQAccordion from '@/components/common/FAQAccordion';
import ExperienceGallery from '@/components/gallery/ExperienceGallery';
import TourExperienceHero from '@/components/tour/TourExperienceHero';
import { sanitiseStockImageUrl, TRAVEL_FALLBACK_IMAGE } from '@/lib/stockImages';
import { buildTourGallerySlides, withGalleryFallback } from '@/lib/gallerySlides';
import { API_BASE_URL } from '@/constants/site';
import { openTourItineraryPrint } from '@/lib/tourItineraryPrint';
import { getTourOverviewTeaser } from '@/lib/tourExperienceCopy';
import {
  buildReserveSeatHref,
  formatReserveDepositInr,
  formatReserveSeatLabel,
  isGroupDepartureTour,
  resolveReserveDepositAmount,
} from '@/lib/tourReserve';
import { whatsappHref } from '@/lib/siteContact';

const FALLBACK_TOUR_IMAGE = TRAVEL_FALLBACK_IMAGE;
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
      /* fall through */
    }
  }
  return trimmed.includes(',') ? trimmed.split(',') : [trimmed];
}

function getImageUrl(image) {
  if (typeof image === 'string') return sanitiseStockImageUrl(resolveImageUrl(image));
  if (!image || typeof image !== 'object') return '';
  return sanitiseStockImageUrl(
    resolveImageUrl(
      image.image || image.url || image.src || image.path || image.imageUrl || image.coverImage || image.thumbnail || ''
    )
  );
}

function getTourGalleryImages(tour) {
  if (Array.isArray(tour?.gallery) && tour.gallery.length) {
    return [...new Set(tour.gallery.map(getImageUrl).filter(Boolean))];
  }
  const values = [...parseImageList(tour?.images)];
  return [...new Set(values.map(getImageUrl).filter(Boolean))];
}

function PanelBlock({ title, children, tone = 'default' }) {
  const tones = {
    default: 'border-[#dceaf7] bg-white',
    green: 'border-[#d8eadb] bg-[#f3fbf4]',
    amber: 'border-[#f1d9c9] bg-[#fff7f2]',
    sand: 'border-[#e5d4bc] bg-[#fffaf1]',
  };
  return (
    <div className={`rounded-2xl border p-4 shadow-sm ${tones[tone] || tones.default}`}>
      <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-primary">{title}</h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function BulletList({ items, type = 'check' }) {
  if (!items?.length) {
    return <p className="text-sm text-foreground/70">Details shared with your booking confirmation.</p>;
  }
  return (
    <ul className="space-y-2">
      {items.map((item, idx) => (
        <li key={`${item}-${idx}`} className="flex gap-2 text-sm text-foreground/85">
          <span className={`mt-0.5 shrink-0 ${type === 'check' ? 'text-green-600' : 'text-red-500'}`} aria-hidden>
            {type === 'check' ? '✓' : '✕'}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function TourDetails({ tour, whatsappNumber }) {
  const gallery = getTourGalleryImages(tour);
  const displayGallery = gallery.length ? gallery : [FALLBACK_TOUR_IMAGE];
  const heroImage =
    getImageUrl(tour?.coverImage) || getImageUrl(tour?.image) || displayGallery[0] || FALLBACK_TOUR_IMAGE;
  const experienceSlides = withGalleryFallback(
    buildTourGallerySlides(tour, (url) => getImageUrl(url) || url)
  );
  const destinationSlides = useMemo(
    () => experienceSlides.filter((s) => s.type !== 'memory').slice(0, 8),
    [experienceSlides]
  );
  const bottomGallerySlides = destinationSlides.length ? destinationSlides : experienceSlides;

  const inclusions = tour.inclusions || [];
  const exclusions = tour.exclusions || [];
  const faqs = tour.faqs || [];
  const thingsToCarry = tour.thingsToCarry || [];
  const itinerary = tour.itinerary || [];
  const terms = tour.terms || [];
  const supplements = tour.supplements || [];
  const isCustomized = tour.category === 'customized';
  const showReserve = isGroupDepartureTour(tour);
  const reserveDeposit = resolveReserveDepositAmount(tour);
  const reserveHref = buildReserveSeatHref(tour, whatsappNumber);
  const waEnquiry = whatsappHref(
    whatsappNumber,
    `Hi, I'm interested in: ${tour.title} (${tour.date || tour.dateLabel || ''})`
  );
  const seatsNote = String(tour.seatsLeft || tour.availableSeats || '').trim();
  const overview = getTourOverviewTeaser(tour);
  const socialProofPhotos = displayGallery.slice(0, 6);

  return (
    <section className={`tour-experience-page relative ${showReserve ? 'pb-24' : 'pb-10'}`}>
      <TourExperienceHero
        tour={tour}
        heroImage={heroImage}
        heroImages={displayGallery.slice(0, 6)}
        whatsappNumber={whatsappNumber}
      />

      <div className="container mx-auto max-w-6xl space-y-8 px-4 sm:px-6 md:space-y-10">
        {/* Highlights */}
        {tour.highlights?.length > 0 ? (
          <section className="pt-2">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary">Highlights</p>
            <h2 className="mt-2 font-display text-2xl font-bold text-primary md:text-3xl">
              Moments you will remember
            </h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {tour.highlights.map((h, i) => (
                <li
                  key={i}
                  className="tour-highlight-card rounded-2xl border border-[#dceaf5] bg-gradient-to-br from-[#f8fbff] to-white p-4 shadow-sm"
                >
                  <span className="text-lg" aria-hidden>
                    ✦
                  </span>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-foreground/88">{h}</p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* Journey gallery */}
        <section className="rounded-2xl border border-[#dceaf7] bg-[#f8fbff] p-4 shadow-sm md:p-5">
          <ExperienceGallery
            slides={experienceSlides}
            eyebrow=""
            title="See the journey before you book"
            lede="Destination landscapes, group moments, and real on-trip energy — the vibe of this tour in pictures."
          />
        </section>

        {/* Overview */}
        <section>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary">Overview</p>
          <h2 className="mt-2 font-display text-2xl font-bold text-primary md:text-3xl">The experience</h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-foreground/82">{overview}</p>
        </section>

        {/* Itinerary + side panel */}
        <section id="itinerary" className="scroll-mt-24 pb-12 md:pb-14">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary">Day by day</p>
            <h2 className="mt-2 font-display text-2xl font-bold text-primary md:text-3xl">Your itinerary</h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-12 lg:items-start lg:gap-8">
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-[#dceaf7] bg-white p-5 shadow-sm md:p-6">
                {itinerary.length ? (
                  <div className="relative space-y-0 border-l-2 border-[#dceaf7] pl-6">
                    {itinerary.map((item, idx) => (
                      <div key={`${item.day}-${idx}`} className="relative pb-8 last:pb-0">
                        <span className="absolute -left-[29px] top-1 flex h-4 w-4 rounded-full border-2 border-secondary bg-white ring-4 ring-white" />
                        <div className="text-xs font-bold uppercase tracking-wide text-secondary">{item.day}</div>
                        <h3 className="mt-1 text-lg font-bold text-primary">{item.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-foreground/85">{item.details}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-foreground/75">Detailed day plan shared on enquiry and booking.</p>
                )}
              </div>
            </div>

            <aside className="space-y-3 lg:col-span-5 lg:self-start">
              <PanelBlock title="Inclusions" tone="green">
                <BulletList items={inclusions} type="check" />
              </PanelBlock>

              <PanelBlock title="Exclusions" tone="amber">
                <BulletList items={exclusions} type="cross" />
              </PanelBlock>

              <PanelBlock title="Suitable for">
                <p className="text-sm leading-relaxed text-foreground/85">
                  {tour.suitableFor || 'Most travellers seeking a well-paced, comfort-first journey.'}
                </p>
                <ul className="mt-3 space-y-2 text-sm text-foreground/75">
                  {tour.meals ? (
                    <li>
                      <strong className="text-primary">Meals:</strong> {tour.meals}
                    </li>
                  ) : null}
                  {tour.stayType ? (
                    <li>
                      <strong className="text-primary">Stay:</strong> {tour.stayType}
                    </li>
                  ) : null}
                  {tour.transport ? (
                    <li>
                      <strong className="text-primary">Transport:</strong> {tour.transport}
                    </li>
                  ) : null}
                </ul>
              </PanelBlock>

              <PanelBlock title="Available offers" tone="sand">
                <ul className="space-y-2 text-sm text-foreground/85">
                  <li className="flex gap-2">
                    <span aria-hidden>🐦</span>
                    <span>{tour.offers || 'Early bird fares on first inventory release'}</span>
                  </li>
                  <li className="flex gap-2">
                    <span aria-hidden>👥</span>
                    <span>Buddy-up offer — bring a +1 friend on selected departures</span>
                  </li>
                  <li className="flex gap-2">
                    <span aria-hidden>⏳</span>
                    <span>{seatsNote ? `Limited seats — ${seatsNote}` : 'Limited seats on peak dates'}</span>
                  </li>
                </ul>
              </PanelBlock>

              {supplements.length > 0 ? (
                <PanelBlock title="Upgrades & add-ons">
                  <ul className="space-y-3">
                    {supplements.map((s, i) => (
                      <li key={i} className="rounded-xl border border-[#eaf4fb] bg-[#f8fbff] p-3">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <span className="text-sm font-semibold text-primary">{s.name}</span>
                          <span className="text-sm font-bold text-cta">{s.price}</span>
                        </div>
                        {s.note ? <p className="mt-1 text-xs text-foreground/70">{s.note}</p> : null}
                      </li>
                    ))}
                  </ul>
                </PanelBlock>
              ) : null}

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => openTourItineraryPrint(tour)}
                  className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Download itinerary (PDF)
                </button>
                <Link
                  href="/contact"
                  className="block w-full rounded-xl bg-cta py-3 text-center text-sm font-semibold text-primary transition hover:bg-[#E76F51] hover:text-white"
                >
                  {isCustomized ? 'Request custom quote' : 'Ask a question'}
                </Link>
                <a
                  href={waEnquiry}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-xl border border-[#25D366]/45 py-3 text-center text-sm font-semibold text-[#128C7E] transition hover:bg-[#25D366]/10"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </aside>
          </div>
        </section>

        {/* Offers & social proof */}
        <section className="rounded-2xl border border-[#e5d4bc] bg-gradient-to-br from-[#fffdf9] via-[#faf6ef] to-[#f5efe3] p-5 md:p-6">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b55b1e]">Book with confidence</p>
              <h2 className="mt-2 font-display text-xl font-bold text-primary md:text-2xl">
                Offers &amp; traveller momentum
              </h2>
              <ul className="mt-4 space-y-2 text-sm text-foreground/82">
                <li>🎁 Early bird savings when you confirm before public release dates</li>
                <li>💰 ₹1,000 off on select batches — ask our team for eligible departures</li>
                <li>👫 Buddy-up discount when you travel with a friend</li>
                <li>🔥 {seatsNote ? `${seatsNote} — high interest on this departure` : 'Recent enquiries on this route'}</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-[#e5d4bc] bg-white/80 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-primary/75">Traveller moments</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {socialProofPhotos.map((img, idx) => (
                  <img
                    key={`social-${idx}`}
                    src={img}
                    alt=""
                    className="h-16 w-16 rounded-xl border border-[#dceaf7] object-cover shadow-sm sm:h-20 sm:w-20"
                    onError={(event) => {
                      event.currentTarget.src = FALLBACK_TOUR_IMAGE;
                    }}
                  />
                ))}
              </div>
              <p className="mt-3 text-sm text-foreground/75">
                Real group energy from Happy Feet departures — couples, friends, and families who chose experience over
                rush.
              </p>
            </div>
          </div>
        </section>

        {/* Policies — lower priority */}
        <section className="space-y-3">
          <PanelBlock title="Things to carry">
            <BulletList items={thingsToCarry} type="check" />
          </PanelBlock>

          <PanelBlock title="Cancellation & refund policy">
            <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/85">
              {tour.cancellationPolicy ||
                'Full policy is shared with your booking confirmation. Contact us for batch-specific rules and refund timelines.'}
            </p>
            <Link href="/policies/cancellation" className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">
              Read full cancellation policy →
            </Link>
          </PanelBlock>

          <PanelBlock title="Terms & conditions">
            {terms.length ? (
              <ul className="list-inside list-disc space-y-2 text-sm text-foreground/85">
                {terms.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-foreground/75">Standard Happy Feet Travellers booking terms apply.</p>
            )}
            <Link href="/policies/terms" className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">
              Full terms & conditions →
            </Link>
          </PanelBlock>
        </section>

        {/* FAQ — near bottom */}
        {faqs.length > 0 ? (
          <section className="border-t border-[#dceaf7] pt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary">Good to know</p>
            <h2 className="mt-2 font-display text-2xl font-bold text-primary">FAQs</h2>
            <div className="mt-6">
              <FAQAccordion items={faqs} />
            </div>
          </section>
        ) : null}

        {/* Final destination gallery */}
        <section className="border-t border-[#dceaf7] pt-8">
          <ExperienceGallery
            slides={bottomGallerySlides}
            eyebrow="Destination vibes"
            title="Take the feeling with you"
            lede="One last look at the landscapes and experiences waiting on this journey."
            className="tour-experience-page__closing-gallery"
          />
        </section>
      </div>

      {showReserve ? (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#dceaf7] bg-white/95 py-3 shadow-[0_-4px_20px_rgba(31,78,121,0.12)] backdrop-blur">
          <div className="container mx-auto flex flex-col items-stretch justify-between gap-3 px-4 sm:flex-row sm:items-center">
            <div className="text-center sm:text-left">
              <p className="text-sm font-semibold text-primary">
                Reserve your seat — <span className="text-cta">{formatReserveDepositInr(reserveDeposit)}</span> booking
                amount
              </p>
              <p className="mt-0.5 text-xs text-foreground/65">
                Pay the balance before the tour · confirmed on WhatsApp or call
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
