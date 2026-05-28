import HeroSection from '@/components/home/HeroSection';
import TripsCarousel from '@/components/home/TripsCarousel';
import CustomizedTours from '@/components/home/CustomizedTours';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import Testimonials from '@/components/home/Testimonials';
import BlogSection from '@/components/home/BlogSection';
import Gallery from '@/components/home/Gallery';
import CTA from '@/components/home/CTA';

export default function Home() {
  return (
    <>
      <HeroSection />
      <div id="main-content-start" className="homepage-main scroll-mt-0">
        <TripsCarousel />
        <CustomizedTours />
        <WhyChooseUs />
        <Testimonials />
        <BlogSection />
        <CTA />
        <Gallery />
      </div>
    </>
  );
}
