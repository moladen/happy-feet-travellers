import { notFound } from 'next/navigation';

import RannSeasonLandingView from '@/components/rann/RannSeasonLandingView';

import LandingPageView from '@/components/landing/LandingPageView';

import { isReservedSlug } from '@/lib/reservedSlugs';

import {

  fetchLandingPageBySlug,

  fetchPublishedLandingSlugs,

  fetchRannRelatedContent,

  RANN_SLUG,

} from '@/services/landingPageService';

import { getPublicSettings } from '@/services/settingsService';



export const dynamic = 'force-dynamic';



export async function generateStaticParams() {

  const slugs = await fetchPublishedLandingSlugs();

  return slugs.filter((slug) => slug !== RANN_SLUG).map((slug) => ({ slug }));

}



export async function generateMetadata({ params }) {

  const { slug } = await params;

  const page = await fetchLandingPageBySlug(slug);

  if (!page) return { title: 'Landing Page' };



  return {

    title: page.seoTitle || `${page.title} | Happy Feet Travellers`,

    description: page.seoDescription || page.heroSubheading || undefined,

    keywords: page.seoKeywords?.length ? page.seoKeywords : undefined,

    openGraph: {

      title: page.seoTitle || page.title,

      description: page.seoDescription || undefined,

      images: page.ogImage ? [{ url: page.ogImage }] : undefined,

    },

  };

}



export default async function DynamicLandingPage({ params }) {

  const { slug } = await params;

  if (isReservedSlug(slug)) notFound();



  const [page, settings] = await Promise.all([fetchLandingPageBySlug(slug), getPublicSettings()]);



  if (!page || page.status !== 'published') {

    notFound();

  }



  if (slug === RANN_SLUG) {

    const related = await fetchRannRelatedContent(slug);

    return (

      <RannSeasonLandingView

        page={page}

        settings={settings}

        relatedTours={related.tours}

        relatedBlogs={related.blogs}

      />

    );

  }



  return <LandingPageView page={page} settings={settings} />;

}

