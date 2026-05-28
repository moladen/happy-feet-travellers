'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { getBlogs } from '@/services/api';
import BlogCard from '@/components/common/BlogCard';

export default function BlogSection() {
  const reduceMotion = useReducedMotion();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await getBlogs();
        setBlogs(Array.isArray(data) ? data.slice(0, 8) : []);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const canLoop = blogs.length >= 4;
  const useSlider = blogs.length > 0;

  return (
    <section className="blog-journal-section section-ambient section-tone-cream relative overflow-hidden py-14 md:py-16 lg:py-[4.5rem]">
      <motion.div
        className="container relative z-10 mx-auto px-4"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <header className="blog-journal-section__header">
          <p className="section-eyebrow mb-2">Travel journal</p>
          <h2 className="section-title mb-3 text-3xl md:text-4xl lg:text-[2.75rem]">Stories from the road</h2>
          <p className="blog-journal-section__lede">
            Field notes, destination diaries, and curated inspiration — written for travellers who want more
            than a checklist.
          </p>
        </header>

        {loading ? (
          <div className="blog-journal-section__state">
            <div className="blog-journal-card__skeleton" aria-hidden />
            <div className="blog-journal-card__skeleton hidden sm:block" aria-hidden />
            <div className="blog-journal-card__skeleton hidden lg:block" aria-hidden />
          </div>
        ) : blogs.length === 0 ? (
          <p className="blog-journal-section__empty">New stories are on the way — check back soon.</p>
        ) : useSlider ? (
          <div className="blog-journal-carousel">
            <div className="blog-journal-carousel__fade blog-journal-carousel__fade--left" aria-hidden />
            <div className="blog-journal-carousel__fade blog-journal-carousel__fade--right" aria-hidden />

            <Swiper
              modules={[Autoplay, Pagination, A11y]}
              className="blog-journal-swiper"
              spaceBetween={20}
              slidesPerView={1.12}
              speed={reduceMotion ? 0 : 680}
              grabCursor={!reduceMotion}
              loop={canLoop && !reduceMotion}
              watchOverflow
              autoplay={
                reduceMotion
                  ? false
                  : {
                      delay: 5200,
                      disableOnInteraction: false,
                      pauseOnMouseEnter: true,
                    }
              }
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              breakpoints={{
                480: {
                  slidesPerView: 1.35,
                  spaceBetween: 18,
                },
                640: {
                  slidesPerView: 2.05,
                  spaceBetween: 22,
                },
                1024: {
                  slidesPerView: 2.55,
                  spaceBetween: 26,
                },
                1280: {
                  slidesPerView: 3.1,
                  spaceBetween: 28,
                },
              }}
              a11y={{
                prevSlideMessage: 'Previous story',
                nextSlideMessage: 'Next story',
              }}
            >
              {blogs.map((blog) => (
                <SwiperSlide key={blog.id} className="!h-auto">
                  <BlogCard blog={blog} variant="journal" />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : null}

        <div className="blog-journal-section__cta-wrap">
          <Link href="/blog" className="blog-journal-section__cta">
            <span>Explore the full journal</span>
            <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
