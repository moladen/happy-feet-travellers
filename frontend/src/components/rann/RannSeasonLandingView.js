import Image from 'next/image';
import Link from 'next/link';
import RannPriorityForm from '@/components/forms/RannPriorityForm';
import RelatedBlogsSection from '@/components/content/RelatedBlogsSection';
import RelatedToursSection from '@/components/content/RelatedToursSection';
import ExperienceGallery from '@/components/gallery/ExperienceGallery';
import LandingTestimonials from '@/components/landing/LandingTestimonials';
import Testimonials from '@/components/home/Testimonials';
import RannAddOnsSection from '@/components/rann/RannAddOnsSection';
import RannBatchCalendar from '@/components/rann/RannBatchCalendar';
import RannBestTimeSection from '@/components/rann/RannBestTimeSection';
import RannDholaviraSection from '@/components/rann/RannDholaviraSection';
import RannFullMoonSection from '@/components/rann/RannFullMoonSection';
import RannIntroSection from '@/components/rann/RannIntroSection';
import RannPackageTourCard from '@/components/rann/RannPackageTourCard';
import RannSectionHeading from '@/components/rann/RannSectionHeading';
import RannTrainSection from '@/components/rann/RannTrainSection';
import RannVideoGallery from '@/components/rann/RannVideoGallery';
import RannWhatsAppPriorityCta from '@/components/rann/RannWhatsAppPriorityCta';
import { buildLandingGallerySlides, withGalleryFallback } from '@/lib/gallerySlides';
import {
  BEST_TIME_TO_VISIT,
  FULL_MOON_CALENDAR,
  RANN_ADDONS,
  RANN_DHOLAVIRA,
  RANN_GROUP_BATCHES,
  RANN_TRAIN_INFO,
  RANN_UTSAV_INTRO,
  RANN_VIDEOS,
  RANN_WA_GROUP_MESSAGE,
  RANN_WA_PRIORITY_MESSAGE,
} from '@/lib/rannSeasonContent';
import { groupFaqsByCategory } from '@/services/landingPageService';
import { SITE_WHATSAPP_GROUP_URL, whatsappHref } from '@/lib/siteContact';
import { sanitiseStockImageUrl } from '@/lib/stockImages';

function FaqGroup({ title, items }) {
  if (!items?.length) return null;
  return (
    <div className="rann-faq-group">
      <h3 className="mb-3 font-display text-lg font-bold text-primary">{title}</h3>
      <div className="space-y-3">
        {items.map((item) => (
          <details
            key={item.id || item.question}
            className="rann-faq-item rounded-2xl border border-[#dceaf5] bg-white p-4 open:shadow-sm"
          >
            <summary className="cursor-pointer list-none pr-4 text-sm font-semibold text-primary">
              {item.question}
            </summary>
            <p className="mt-2 text-sm leading-relaxed text-foreground/75">{item.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

/**
 * Master Rann season landing — section order matches client campaign brief.
 * @param {{ page: object; settings: object; relatedTours?: object[]; relatedBlogs?: object[] }} props
 */
export default function RannSeasonLandingView({ page, settings, relatedTours = [], relatedBlogs = [] }) {
  const whyVisit = Array.isArray(page.whyVisit) ? page.whyVisit : [];
  const packages = Array.isArray(page.packages) ? page.packages : [];
  const faqGroups = groupFaqsByCategory(page.faqs || []);
  const pageTestimonials = Array.isArray(page.testimonials) ? page.testimonials : [];
  const gallerySlides = withGalleryFallback(buildLandingGallerySlides(page));
  const formEnabled = page.formConfig?.enabled !== false;
  const intro = page.introContent || RANN_UTSAV_INTRO;
  const bestTime = page.bestTimeToVisit || BEST_TIME_TO_VISIT;
  const fullMoonCalendar = page.fullMoonCalendar?.length ? page.fullMoonCalendar : FULL_MOON_CALENDAR;
  const batches = page.groupBatches || RANN_GROUP_BATCHES;
  const addons = page.addOns || RANN_ADDONS;
  const trainInfo = page.trainInfo || RANN_TRAIN_INFO;
  const dholavira = page.dholaviraSection || RANN_DHOLAVIRA;
  const videos = page.videos || RANN_VIDEOS;

  const waChat =
    page.whatsappCtaLink || whatsappHref(settings?.whatsappNumber, RANN_WA_PRIORITY_MESSAGE);
  const waGroup =
    page.whatsappGroupEnabled !== false
      ? page.whatsappGroupLink || SITE_WHATSAPP_GROUP_URL || whatsappHref(settings?.whatsappNumber, RANN_WA_GROUP_MESSAGE)
      : waChat;

  const heroImage = sanitiseStockImageUrl(
    page.heroBannerImage ||
      'https://images.unsplash.com/photo-1516939884455-1445c8652f83?w=2400&h=1400&fit=crop'
  );

  const landingHub = {
    title: page.title,
    href: `/${page.slug}`,
    packages: packages.map((pkg) => ({
      ...pkg,
      href: `/${page.slug}/packages/${pkg.slug}`,
    })),
  };

  return (
    <div className="rann-landing bg-background">
      {/* Hero */}
      <section className="rann-landing-hero relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt={page.heroHeading || page.title}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#061525]/90 via-[#081a2d]/60 to-[#061525]/75" />
        </div>
        <div className="container relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/80">
              Happy Feet Travellers · Seasonal campaign
            </p>
            <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-white md:text-5xl lg:text-[3.25rem]">
              {page.heroHeading || page.title}
            </h1>
            {page.heroSubheading ? (
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/90 md:text-lg">
                {page.heroSubheading}
              </p>
            ) : null}
            {page.seasonDates ? (
              <p className="mt-4 inline-flex rounded-full border border-white/35 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
                Season {page.seasonDates}
              </p>
            ) : null}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#priority-interest"
                className="inline-flex rounded-xl bg-cta px-6 py-3.5 text-sm font-bold text-white shadow-[0_12px_28px_-12px_rgba(231,111,81,0.55)] transition hover:bg-cta-hover"
              >
                {page.ctaButtonText || 'Get Priority Access'}
              </Link>
              <Link
                href="#packages"
                className="inline-flex rounded-xl border border-white/45 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                Explore Packages
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction to Rann Utsav */}
      <RannIntroSection intro={intro} />

      {/* Why Visit */}
      {whyVisit.length > 0 ? (
        <section className="section-tone-sand-soft py-12 md:py-16">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6">
            <RannSectionHeading eyebrow="Experience" title="Why Visit Rann of Kutch" />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {whyVisit.map((item) => (
                <article
                  key={item.title}
                  className="rann-why-card overflow-hidden rounded-2xl border border-[#e5d4bc] bg-white shadow-sm"
                >
                  {item.image ? (
                    <div className="relative h-40">
                      <Image src={item.image} alt={item.title} fill className="object-cover" sizes="33vw" />
                    </div>
                  ) : null}
                  <div className="p-4">
                    <h3 className="font-display text-lg font-bold text-primary">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/75">{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Best Time to Visit */}
      <RannBestTimeSection bestTime={bestTime} />

      {/* Full Moon Calendar */}
      <RannFullMoonSection calendar={fullMoonCalendar} />

      {/* WhatsApp Priority Group CTA (first) */}
      {page.whatsappGroupEnabled !== false ? (
        <RannWhatsAppPriorityCta priorityHref={waChat} groupHref={waGroup} variant="sand" />
      ) : null}

      {/* Package cards — tour-card style, linking to individual package pages */}
      {packages.length > 0 ? (
        <section id="packages" className="container mx-auto max-w-6xl scroll-mt-24 px-4 py-12 sm:px-6 md:py-16">
          <RannSectionHeading
            eyebrow="Packages"
            title="Choose Your Rann Journey"
            lede="Five ways to experience the season — from fixed group departures to fully private family tours. Each package has its own detail page."
          />
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {packages.map((pkg) => (
              <RannPackageTourCard key={pkg.id || pkg.slug} pkg={pkg} landingSlug={page.slug} />
            ))}
          </div>
        </section>
      ) : null}

      {/* Priority Access Form */}
      {formEnabled ? (
        <section id="priority-interest" className="section-tone-sand-soft scroll-mt-24 py-12 md:py-16">
          <div className="container mx-auto max-w-5xl px-4 sm:px-6">
            <RannPriorityForm
              landingPageId={page.id?.startsWith('static') ? undefined : page.id}
              landingPageTitle={page.title}
              packageOptions={packages.map((p) => p.name)}
              whatsappChatHref={waChat}
              whatsappGroupHref={waGroup}
              successMessage={page.formConfig?.successMessage}
            />
          </div>
        </section>
      ) : null}

      {/* WhatsApp Priority Group CTA (second) */}
      {page.whatsappGroupEnabled !== false ? (
        <RannWhatsAppPriorityCta priorityHref={waChat} groupHref={waGroup} variant="dark" />
      ) : null}

      {/* FAQs */}
      {(faqGroups.travel.length || faqGroups.package.length || faqGroups.booking.length) > 0 ? (
        <section id="faq" className="section-tone-cream scroll-mt-24 py-12 md:py-16">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6">
            <RannSectionHeading eyebrow="Questions" title="Frequently Asked Questions" />
            <div className="grid gap-8 lg:grid-cols-3">
              <FaqGroup title="Travel questions" items={faqGroups.travel} />
              <FaqGroup title="Package questions" items={faqGroups.package} />
              <FaqGroup title="Booking questions" items={faqGroups.booking} />
            </div>
          </div>
        </section>
      ) : null}

      {/* Testimonials */}
      <section id="testimonials" className="rann-landing-testimonials scroll-mt-20">
        <div className="container mx-auto max-w-6xl px-4 pb-4 pt-12 sm:px-6 md:pt-16">
          <RannSectionHeading eyebrow="Social proof" title="Traveller Reviews" />
        </div>
        {pageTestimonials.length > 0 ? <LandingTestimonials items={pageTestimonials} /> : <Testimonials />}
      </section>

      {/* Supplementary planning resources */}
      <section className="section-tone-sand-soft border-t border-[#e5d4bc]/60 py-4">
        <div className="container mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <RannSectionHeading
            align="left"
            eyebrow="Plan deeper"
            title="Batch calendar, add-ons & travel logistics"
            lede="Everything you need after choosing a package path."
          />
        </div>
      </section>

      <div id="batch-calendar" className="scroll-mt-24">
        <RannBatchCalendar batches={batches} />
      </div>
      <RannAddOnsSection addons={addons} />
      <RannTrainSection trainInfo={trainInfo} />
      <RannDholaviraSection dholavira={dholavira} />

      {gallerySlides.length > 0 ? (
        <section className="section-tone-sand-soft py-12 md:py-16">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6">
            <ExperienceGallery
              slides={gallerySlides}
              eyebrow="Gallery"
              title="Photo Gallery"
              lede="White Desert, tent city, heritage routes, and Happy Feet group moments from the Rann season."
            />
          </div>
        </section>
      ) : null}

      <RannVideoGallery videos={videos} />

      {/* Internal SEO linking */}
      <div className="container mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <RelatedToursSection tours={relatedTours} landingPage={landingHub} title="Related tours & departures" />
        <RelatedBlogsSection blogs={relatedBlogs} landingPage={landingHub} title="Rann of Kutch travel guides" />
      </div>
    </div>
  );
}
