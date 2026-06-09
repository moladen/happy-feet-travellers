import Image from 'next/image';
import Link from 'next/link';
import RannPriorityForm from '@/components/forms/RannPriorityForm';
import RannPackageGridCard from '@/components/rann/RannPackageGridCard';
import RannPackageShowcaseCard from '@/components/rann/RannPackageShowcaseCard';
import RannSectionHeading from '@/components/rann/RannSectionHeading';
import RannWhatsAppPriorityCta from '@/components/rann/RannWhatsAppPriorityCta';
import Testimonials from '@/components/home/Testimonials';
import LandingTestimonials from '@/components/landing/LandingTestimonials';
import ExperienceGallery from '@/components/gallery/ExperienceGallery';
import { buildLandingGallerySlides, withGalleryFallback } from '@/lib/gallerySlides';
import { groupFaqsByCategory } from '@/services/landingPageService';
import { RANN_WA_GROUP_MESSAGE, RANN_WA_PRIORITY_MESSAGE } from '@/lib/rannSeasonContent';
import { whatsappHref } from '@/lib/siteContact';

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
 * @param {{ page: object; settings: object }} props
 */
export default function LandingPageView({ page, settings }) {
  const intro = page.introContent || {};
  const bestTime = page.bestTimeToVisit || {};
  const whyVisit = Array.isArray(page.whyVisit) ? page.whyVisit : [];
  const highlights = Array.isArray(page.destinationHighlights) ? page.destinationHighlights : [];
  const customBlocks = Array.isArray(page.customBlocks) ? page.customBlocks : [];
  const fullMoon = Array.isArray(page.fullMoonCalendar) ? page.fullMoonCalendar : [];
  const packages = Array.isArray(page.packages) ? page.packages : [];
  const faqGroups = groupFaqsByCategory(page.faqs || []);
  const pageTestimonials = Array.isArray(page.testimonials) ? page.testimonials : [];
  const gallerySlides = withGalleryFallback(buildLandingGallerySlides(page));
  const formEnabled = page.formConfig?.enabled !== false;

  const waMessage = `Hi, I submitted the ${page.title} priority form. Please share batch availability and pricing.`;
  const waChat =
    page.whatsappCtaLink ||
    whatsappHref(settings?.whatsappNumber, waMessage || RANN_WA_PRIORITY_MESSAGE);
  const waGroup =
    page.whatsappGroupEnabled !== false
      ? page.whatsappGroupLink ||
        whatsappHref(settings?.whatsappNumber, RANN_WA_GROUP_MESSAGE)
      : waChat;

  const ctaHref = page.ctaButtonLink || '#priority-interest';
  const heroImage = page.heroBannerImage || 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=2400&h=1400&fit=crop';

  return (
    <div className="rann-landing bg-background">
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
          <div className="absolute inset-0 bg-gradient-to-r from-[#061525]/88 via-[#081a2d]/55 to-[#061525]/70" />
        </div>
        <div className="container relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/80">
              Happy Feet Travellers presents
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
                {page.seasonDates}
              </p>
            ) : null}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={ctaHref}
                className="inline-flex rounded-xl bg-cta px-6 py-3.5 text-sm font-bold text-white shadow-[0_12px_28px_-12px_rgba(231,111,81,0.55)] transition hover:bg-cta-hover"
              >
                {page.ctaButtonText || 'Get Priority Access'}
              </Link>
              {page.whatsappGroupEnabled !== false ? (
                <a
                  href={waGroup}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 text-sm font-bold text-white transition hover:brightness-110"
                >
                  Join WhatsApp Priority Group
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {intro?.paragraphs?.length ? (
        <section className="container mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <RannSectionHeading eyebrow="Overview" title={intro.title || 'Introduction'} align="left" />
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-start">
            <div className="space-y-4">
              {intro.paragraphs.map((p) => (
                <p key={p} className="text-sm leading-relaxed text-foreground/80 md:text-base">
                  {p}
                </p>
              ))}
            </div>
            {intro.summary?.length ? (
              <div className="rounded-2xl border border-[#e5d4bc] bg-[#fffdf9] p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-secondary">Destination summary</p>
                <ul className="mt-3 space-y-2.5">
                  {intro.summary.map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-foreground/85">
                      <span className="text-cta" aria-hidden>
                        ✦
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {whyVisit.length > 0 ? (
        <section className="section-tone-sand-soft py-12 md:py-16">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6">
            <RannSectionHeading eyebrow="Experience" title="Why Visit" />
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

      {highlights.length > 0 ? (
        <section className="container mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <RannSectionHeading eyebrow="Highlights" title="Destination Highlights" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {highlights.map((item) => (
              <article
                key={item.title || item.description}
                className="rounded-2xl border border-[#dceaf5] bg-[#f8fbff] p-5 shadow-sm"
              >
                {item.icon ? (
                  <p className="text-2xl" aria-hidden>
                    {item.icon}
                  </p>
                ) : null}
                <h3 className="mt-2 font-display text-lg font-bold text-primary">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/75">{item.description}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {gallerySlides.length > 0 ? (
        <section className="section-tone-sand-soft py-12 md:py-16">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6">
            <ExperienceGallery
              slides={gallerySlides}
              eyebrow="Visual storytelling"
              title="Experience the Rann before you book"
              lede="White Desert nights, tent city, heritage routes, and authentic Happy Feet group moments — see the journey come alive before packages and planning details."
            />
          </div>
        </section>
      ) : null}

      {bestTime?.points?.length ? (
        <section className="container mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <RannSectionHeading eyebrow="Planning" title="Best Time to Visit" />
          <div className="rounded-3xl border border-[#dceaf5] bg-[#f8fbff] p-6 md:p-8">
            {bestTime.season ? (
              <p className="text-sm font-semibold text-primary">
                Official season: <span className="text-cta">{bestTime.season}</span>
              </p>
            ) : null}
            <ul className="mt-5 grid gap-3 md:grid-cols-2">
              {bestTime.points.map((point) => (
                <li
                  key={point}
                  className="rounded-xl border border-white bg-white/80 px-4 py-3 text-sm text-foreground/80 shadow-sm"
                >
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {fullMoon.length > 0 ? (
        <section className="section-tone-cream py-12 md:py-16">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6">
            <RannSectionHeading eyebrow="Calendar" title="Full Moon Calendar" />
            <div className="overflow-hidden rounded-2xl border border-[#e5d4bc] bg-white shadow-sm">
              <ul className="divide-y divide-[#efe6d8]">
                {fullMoon.map((row) => (
                  <li
                    key={row.date}
                    className="grid gap-1 px-4 py-3 sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] sm:gap-4 sm:py-4 sm:pl-5"
                  >
                    <span className="text-sm font-bold text-primary">{row.date}</span>
                    <span className="text-sm text-foreground/78">{row.highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ) : null}

      {customBlocks.map((block) => {
        const paragraphs = Array.isArray(block.paragraphs)
          ? block.paragraphs
          : block.body
            ? [block.body]
            : [];
        if (!paragraphs.length && !block.image) return null;
        return (
          <section key={block.title || block.eyebrow} className="container mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
            <RannSectionHeading eyebrow={block.eyebrow || 'Info'} title={block.title || 'More information'} align="left" />
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-center">
              <div className="space-y-4">
                {paragraphs.map((p) => (
                  <p key={p} className="text-sm leading-relaxed text-foreground/80 md:text-base">
                    {p}
                  </p>
                ))}
              </div>
              {block.image ? (
                <div className="relative h-56 overflow-hidden rounded-2xl md:h-72">
                  <Image src={block.image} alt={block.title || ''} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 40vw" />
                </div>
              ) : null}
            </div>
          </section>
        );
      })}

      {page.whatsappGroupEnabled !== false ? (
        <RannWhatsAppPriorityCta priorityHref={waChat} groupHref={waGroup} variant="sand" />
      ) : null}

      {packages.length > 0 ? (
        <section id="packages" className="container mx-auto max-w-6xl scroll-mt-24 px-4 py-12 sm:px-6 md:py-16">
          <RannSectionHeading eyebrow="Packages" title="Choose Your Journey" />
          <div className="space-y-10">
            {packages.map((pkg) => (
              <RannPackageShowcaseCard key={pkg.id || pkg.slug} pkg={pkg} landingSlug={page.slug} />
            ))}
          </div>
        </section>
      ) : null}

      {formEnabled ? (
        <section className="section-tone-sand-soft py-12 md:py-16">
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

      {page.whatsappGroupEnabled !== false ? (
        <RannWhatsAppPriorityCta
          title="Still deciding? Talk to us on WhatsApp"
          priorityHref={waChat}
          groupHref={waGroup}
          variant="dark"
        />
      ) : null}

      {(faqGroups.travel.length || faqGroups.package.length || faqGroups.booking.length) > 0 ? (
        <section id="faq" className="container mx-auto max-w-6xl scroll-mt-24 px-4 py-12 sm:px-6 md:py-16">
          <RannSectionHeading eyebrow="Questions" title="Frequently Asked Questions" />
          <div className="grid gap-8 lg:grid-cols-3">
            <FaqGroup title="Travel questions" items={faqGroups.travel} />
            <FaqGroup title="Package questions" items={faqGroups.package} />
            <FaqGroup title="Booking questions" items={faqGroups.booking} />
          </div>
        </section>
      ) : null}

      <section id="testimonials" className="rann-landing-testimonials scroll-mt-20">
        <div className="container mx-auto max-w-6xl px-4 pb-4 pt-12 sm:px-6 md:pt-16">
          <RannSectionHeading eyebrow="Social proof" title="Traveller Reviews" />
        </div>
        {pageTestimonials.length > 0 ? (
          <LandingTestimonials items={pageTestimonials} />
        ) : (
          <Testimonials />
        )}
      </section>

      {packages.length > 0 ? (
        <section className="section-tone-cream py-12 md:py-16">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6">
            <RannSectionHeading eyebrow="Quick compare" title="All Packages at a Glance" />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {packages.map((pkg) => (
                <RannPackageGridCard key={pkg.id || pkg.slug} pkg={pkg} landingSlug={page.slug} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
