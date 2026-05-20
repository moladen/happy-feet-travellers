'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { getBlogs } from '@/services/api';
import BlogCard from '@/components/common/BlogCard';

export default function BlogSection() {
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

  return (
    <section className="section-ambient section-tone-cream relative overflow-hidden py-14 md:py-16">
      <motion.div
        className="container relative z-10 mx-auto px-4"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8 text-center md:mb-10">
          <p className="section-eyebrow mb-2">From the journal</p>
          <h2 className="section-title mb-3 text-3xl md:text-4xl lg:text-5xl">Recent blogs</h2>
          <p className="mx-auto max-w-2xl text-base text-foreground/80 md:text-lg">
            Swipe through recent posts—practical tips and destination notes from our team.
          </p>
        </div>

        {loading ? (
          <p className="text-center text-foreground/75">Loading posts…</p>
        ) : blogs.length === 0 ? (
          <p className="text-center text-foreground/75">No posts yet. Check back soon.</p>
        ) : (
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={20}
            slidesPerView={1}
            autoplay={{ delay: 4500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="!pb-10 [&_.swiper-pagination-bullet-active]:bg-primary"
          >
            {blogs.map((blog) => (
              <SwiperSlide key={blog.id} className="!h-auto">
                <div className="h-full">
                  <BlogCard blog={blog} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        <div className="mt-6 text-center">
          <Link
            href="/blog"
            className="inline-flex rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white shadow-[0_10px_26px_-6px_rgba(31,78,121,0.45)] ring-1 ring-white/15 transition hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-6px_rgba(31,78,121,0.5)]"
          >
            View all posts →
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
