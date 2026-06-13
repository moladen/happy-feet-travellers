import HeroSection from '@/components/home/HeroSection';
import TripsCarousel from '@/components/home/TripsCarousel';
import CustomizedTours from '@/components/home/CustomizedTours';
import Testimonials from '@/components/home/Testimonials';
import BlogSection from '@/components/home/BlogSection';
import TravellerTrustSection from '@/components/home/TravellerTrustSection';
import CTA from '@/components/home/CTA';
import Gallery from '@/components/home/Gallery';
import JsonLd from '@/components/seo/JsonLd';
import { buildReviewSchema } from '@/lib/schema/reviews';
import { getTestimonials } from '@/services/testimonialsService';

export default async function Home() {
  const testimonials = await getTestimonials();
  const reviewSchema = buildReviewSchema({ apiTestimonials: testimonials });

  return (
    <>
      <JsonLd data={reviewSchema} />
      <HeroSection />
      <div id="main-content-start" className="homepage-main scroll-mt-0">
        <TripsCarousel />
        <CustomizedTours />
        <TravellerTrustSection />
        <Testimonials />
        <BlogSection />
        <CTA />
        <Gallery />
      </div>
    </>
  );
}
