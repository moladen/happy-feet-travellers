import Image from 'next/image';
import Link from 'next/link';
import RannHeroMiniForm from '@/components/rann/RannHeroMiniForm';
import RannPriorityForm from '@/components/forms/RannPriorityForm';
import RelatedBlogsSection from '@/components/content/RelatedBlogsSection';
import ExperienceGallery from '@/components/gallery/ExperienceGallery';
import LandingTestimonials from '@/components/landing/LandingTestimonials';
import TravellerTrustSection from '@/components/home/TravellerTrustSection';
import RannAddOnsSection from '@/components/rann/RannAddOnsSection';
import RannGuideLeadMagnet from '@/components/rann/RannGuideLeadMagnet';
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
  RANN_ADDONS,
  RANN_DHOLAVIRA,
  RANN_GROUP_BATCHES,
  RANN_TRAIN_INFO,
  RANN_UTSAV_INTRO,
  RANN_VIDEOS,
  RANN_HERO_SOCIAL_PROOF,
  RANN_WHY_VISIT_HEADING,
  RANN_WA_GROUP_MESSAGE,
  RANN_WA_PRIORITY_MESSAGE,
  resolvePlanningGuide,
} from '@/lib/rannSeasonContent';
import { groupFaqsByCategory } from '@/services/landingPageService';
import { SITE_WHATSAPP_GROUP_URL, whatsappHref } from '@/lib/siteContact';
import { sanitiseStockImageUrl } from '@/lib/stockImages';
import LandingHeroPricingBadge from '@/components/landing/LandingHeroPricingBadge';
import { resolveLandingHeroPricing } from '@/lib/landingHeroPricing';

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
 * @param {{ page: object; settings: object; relatedBlogs?: object[] }} props
 */
export default function RannSeasonLandingView({ page, settings, relatedBlogs = [] }) {
  const whyVisit = Array.isArray(page.whyVisit) ? page.whyVisit : [];
  const packages = Array.isArray(page.packages) ? page.packages : [];
  const faqGroups = groupFaqsByCategory(page.faqs || []);
  const pageTestimonials = Array.isArray(page.testimonials) ? page.testimonials : [];
  const gallerySlides = withGalleryFallback(buildLandingGallerySlides(page));
  const formEnabled = page.formConfig?.enabled !== false;
  const intro = page.introContent || RANN_UTSAV_INTRO;
  const customBlocks =
    page.customBlocks && typeof page.customBlocks === 'object' ? page.customBlocks : {};
  const whyVisitHeading = customBlocks.whyVisitHeading || RANN_WHY_VISIT_HEADING;
  const bestTime = page.bestTimeToVisit || BEST_TIME_TO_VISIT;
  const batches = page.groupBatches || RANN_GROUP_BATCHES;
  const addons = page.addOns || RANN_ADDONS;
  const trainInfo = page.trainInfo || RANN_TRAIN_INFO;
  const dholavira = page.dholaviraSection || RANN_DHOLAVIRA;
  const videos = page.videos || RANN_VIDEOS;
  const heroSocialProof =
    page.heroSocialProof ||
    page.customBlocks?.heroSocialProof ||
    RANN_HERO_SOCIAL_PROOF;
  const planningGuide = page.planningGuide || resolvePlanningGuide(page);
  const heroPricing = resolveLandingHeroPricing(page, packages);

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
  };

  return (
    <div className="rann-landing bg-background">
      {/* Hero */}
      <section className="rann-landing-hero relative overflow-hidden">
        <div className="rann-landing-hero__media absolute inset-0">
          <Image
            src={heroImage}
            alt={page.heroHeading || page.title}
            fill
            priority
            className="object-cover object-center scale-105 rann-landing-hero__img"
            sizes="100vw"
          />
          <div className="rann-landing-hero__overlay absolute inset-0" aria-hidden />
          <div className="rann-landing-hero__glow rann-landing-hero__glow--coral" aria-hidden />
          <div className="rann-landing-hero__glow rann-landing-hero__glow--navy" aria-hidden />
        </div>
        <div className="container relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20 lg:min-h-[inherit] lg:py-24">
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:items-center lg:gap-12">
            <div className="max-w-3xl">
              <p className="landing-hero-eyebrow">
                <span className="landing-hero-eyebrow__dot" aria-hidden />
                Happy Feet Travellers · Seasonal campaign
              </p>
              <h1 className="rann-landing-hero__title mt-4 font-display text-4xl font-bold leading-[1.08] text-white md:text-5xl lg:text-[3.35rem]">
                {page.heroHeading || page.title}
              </h1>
              <LandingHeroPricingBadge pricing={heroPricing} />
              {page.heroSubheading ? (
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/90 md:text-lg">
                  {page.heroSubheading}
                </p>
              ) : null}

              {formEnabled ? (
                <div className="mt-6 lg:hidden">
                  <RannHeroMiniForm
                    landingPageId={page.id?.startsWith('static') ? undefined : page.id}
                    landingPageTitle={page.title}
                    whatsappChatHref={waChat}
                    successMessage={page.formConfig?.successMessage}
                  />
                </div>
              ) : null}

              {heroSocialProof?.length ? (
                <ul className="landing-hero-proof mt-5">
                  {heroSocialProof.map((item) => (
                    <li key={item} className="landing-hero-proof__item">
                      <span className="landing-hero-proof__icon" aria-hidden>
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}
              {page.seasonDates ? (
                <p className="landing-hero-season-pill mt-4">
                  Season {page.seasonDates}
                </p>
              ) : null}
              <div className="landing-hero-actions mt-8">
                <Link href="#rann-planning-guide" className="landing-hero-cta landing-hero-cta--primary">
                  Download Free Guide
                </Link>
                <Link href="#priority-interest" className="landing-hero-cta landing-hero-cta--glass">
                  Get Priority Access
                </Link>
                {page.whatsappGroupEnabled !== false ? (
                  <a
                    href={waGroup}
                    target="_blank"
                    rel="noreferrer"
                    className="landing-hero-cta landing-hero-cta--whatsapp"
                  >
                    Join WhatsApp Updates
                  </a>
                ) : null}
                <Link href="#packages" className="landing-hero-cta landing-hero-cta--ghost">
                  Explore Packages
                </Link>
              </div>
            </div>

            {formEnabled ? (
              <div className="hidden lg:block">
                <RannHeroMiniForm
                  landingPageId={page.id?.startsWith('static') ? undefined : page.id}
                  landingPageTitle={page.title}
                  whatsappChatHref={waChat}
                  successMessage={page.formConfig?.successMessage}
                />
              </div>
            ) : null}
          </div>
        </div>
        <div className="rann-landing-hero__scroll-cue hidden lg:flex" aria-hidden>
          <span className="rann-landing-hero__scroll-line" />
          Scroll to explore
        </div>
      </section>

      {/* Introduction to Rann Utsav */}
      <RannIntroSection intro={intro} />

      {planningGuide.enabled !== false ? (
        <RannGuideLeadMagnet
          guide={planningGuide}
          landingPageId={page.id}
          landingPageTitle={page.title}
          priorityHref="#priority-interest"
          whatsappGroupHref={page.whatsappGroupEnabled !== false ? waGroup : undefined}
        />
      ) : null}

      {/* Why Visit */}
      {whyVisit.length > 0 ? (
        <section className="rann-landing-section rann-landing-section--elevated py-12 md:py-16">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6">
            <RannSectionHeading eyebrow="Experience" title={whyVisitHeading} />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {whyVisit.map((item) => (
                <article key={item.title} className="rann-why-card">
                  {item.image ? (
                    <div className="rann-why-card__media relative h-44">
                      <Image src={item.image} alt={item.title} fill className="object-cover" sizes="33vw" />
                    </div>
                  ) : null}
                  <div className="rann-why-card__body p-5">
                    <h3 className="rann-why-card__title font-display text-lg font-bold text-primary">{item.title}</h3>
                    <p className="rann-why-card__text mt-2 text-sm leading-relaxed text-foreground/75">{item.description}</p>
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
      <RannFullMoonSection page={page} />

      {/* WhatsApp Priority Group CTA (first) */}
      {page.whatsappGroupEnabled !== false ? (
        <RannWhatsAppPriorityCta priorityHref={waChat} groupHref={waGroup} variant="sand" />
      ) : null}

      <RannBatchCalendar batches={batches} />

      {/* Package cards — tour-card style, linking to individual package pages */}
      {packages.length > 0 ? (
        <section id="packages" className="rann-landing-section rann-landing-section--packages scroll-mt-24 py-12 md:py-16 lg:py-20">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <RannSectionHeading
            eyebrow="Kutch tour packages"
            title="Choose Your Rann Journey"
            lede="Compare Rann Utsav Packages from Mumbai and Pune, land-only Bhuj options, and private family itineraries — each Kutch tour package has its own detail page."
          />
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {packages.map((pkg) => (
              <RannPackageTourCard key={pkg.id || pkg.slug} pkg={pkg} landingSlug={page.slug} />
            ))}
          </div>
          </div>
        </section>
      ) : null}

      <RannAddOnsSection addons={addons} />

      <TravellerTrustSection />

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
        {pageTestimonials.length > 0 ? (
          <LandingTestimonials items={pageTestimonials} />
        ) : (
          <p className="container mx-auto max-w-6xl px-4 pb-14 text-center text-sm text-foreground/65 sm:px-6">
            Landing reviews will appear here once added in Admin → Landing Pages → Testimonials.
          </p>
        )}
      </section>

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
        <RelatedBlogsSection
          blogs={relatedBlogs}
          landingPage={landingHub}
          title="Rann Utsav travel guides & White Desert tour tips"
        />
      </div>
    </div>
  );
}
