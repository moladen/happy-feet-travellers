import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import RannPriorityForm from '@/components/forms/RannPriorityForm';
import RannWhatsAppPriorityCta from '@/components/rann/RannWhatsAppPriorityCta';
import { isReservedSlug } from '@/lib/reservedSlugs';
import { fetchLandingPageBySlug } from '@/services/landingPageService';
import { RANN_WA_GROUP_MESSAGE, RANN_WA_PRIORITY_MESSAGE } from '@/lib/rannSeasonContent';
import { getPublicSettings } from '@/services/settingsService';
import { whatsappHref } from '@/lib/siteContact';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug, packageSlug } = await params;
  const page = await fetchLandingPageBySlug(slug);
  const pkg = page?.packages?.find((p) => p.slug === packageSlug);
  if (!pkg) return { title: 'Package' };
  return {
    title: `${pkg.name} | ${page.title}`,
    description: pkg.shortDescription || undefined,
  };
}

export default async function LandingPackagePage({ params }) {
  const { slug, packageSlug } = await params;
  if (isReservedSlug(slug)) notFound();

  const [page, settings] = await Promise.all([fetchLandingPageBySlug(slug), getPublicSettings()]);

  if (!page || page.status !== 'published') notFound();

  const pkg = page.packages?.find((p) => p.slug === packageSlug && p.active !== false);
  if (!pkg) notFound();

  const detail = pkg.detailContent || {};
  const paragraphs = detail.paragraphs || (pkg.shortDescription ? [pkg.shortDescription] : []);

  const waChat = whatsappHref(
    settings?.whatsappNumber,
    `Hi, I am interested in ${pkg.name} (${page.title}). ${RANN_WA_PRIORITY_MESSAGE}`
  );
  const waGroup =
    page.whatsappGroupLink || whatsappHref(settings?.whatsappNumber, RANN_WA_GROUP_MESSAGE);

  return (
    <div className="rann-package-detail min-h-screen bg-background">
      <section className="relative overflow-hidden bg-[#0f2844] py-12 text-white md:py-16">
        <div className="container relative z-10 mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
          <div>
            <Link href={`/${slug}`} className="text-xs font-semibold uppercase tracking-wider text-white/70 hover:text-white">
              ← Back to {page.title}
            </Link>
            {pkg.emoji ? (
              <p className="mt-4 text-2xl" aria-hidden>
                {pkg.emoji}
              </p>
            ) : null}
            <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">{pkg.name}</h1>
            <p className="mt-3 text-sm text-white/88 md:text-base">{pkg.shortDescription}</p>
            <p className="mt-4 text-2xl font-bold text-[#ffc98a]">{pkg.startingPrice}</p>
            <p className="text-sm text-white/75">{pkg.duration}</p>
            {detail.idealFor ? <p className="mt-2 text-sm text-white/70">Ideal for: {detail.idealFor}</p> : null}
          </div>
          {pkg.featuredImage ? (
            <div className="relative h-64 overflow-hidden rounded-3xl lg:h-80">
              <Image src={pkg.featuredImage} alt={pkg.name} fill className="object-cover" priority />
            </div>
          ) : null}
        </div>
      </section>

      <section className="container mx-auto max-w-4xl px-4 py-10 sm:px-6 md:py-14">
        {paragraphs.map((para) => (
          <p key={para} className="mb-4 text-sm leading-relaxed text-foreground/80 md:text-base">
            {para}
          </p>
        ))}
        {pkg.highlights?.length ? (
          <>
            <h2 className="mt-6 font-display text-xl font-bold text-primary">Key highlights</h2>
            <ul className="mt-3 space-y-2">
              {pkg.highlights.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-foreground/80">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cta" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </>
        ) : null}
        <div className="mt-8">
          <Link
            href={`/${slug}#priority-interest`}
            className="inline-flex rounded-xl bg-cta px-5 py-3 text-sm font-bold text-white transition hover:bg-cta-hover"
          >
            Get Priority Access
          </Link>
        </div>
      </section>

      {page.formConfig?.enabled !== false ? (
        <section className="section-tone-sand-soft py-10 md:py-12">
          <div className="container mx-auto max-w-5xl px-4 sm:px-6">
            <RannPriorityForm
              landingPageId={page.id?.startsWith('static') ? undefined : page.id}
              landingPageTitle={page.title}
              packageOptions={page.packages?.map((p) => p.name) || []}
              defaultPackage={pkg.name}
              whatsappChatHref={waChat}
              whatsappGroupHref={waGroup}
            />
          </div>
        </section>
      ) : null}

      <RannWhatsAppPriorityCta priorityHref={waChat} groupHref={waGroup} variant="dark" />
    </div>
  );
}
