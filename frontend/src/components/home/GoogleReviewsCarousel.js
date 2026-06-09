'use client';

import { useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Autoplay, Pagination } from 'swiper/modules';
import GoogleReviewCard from '@/components/home/GoogleReviewCard';
import { GOOGLE_REVIEWS } from '@/lib/googleReviews';

import 'swiper/css';
import 'swiper/css/pagination';

/**
 * Responsive Google Reviews carousel with autoplay and pagination dots.
 */
export default function GoogleReviewsCarousel({ reviews = GOOGLE_REVIEWS, className = '' }) {
  const reduceMotion = useReducedMotion();
  const paginationRef = useRef(null);
  const shouldAutoplay = !reduceMotion && reviews.length > 1;

  if (!reviews.length) return null;

  return (
    <div className={`google-reviews-carousel ${className}`.trim()}>
      <Swiper
        modules={[Autoplay, Pagination, A11y]}
        onBeforeInit={(swiper) => {
          swiper.params.pagination.el = paginationRef.current;
        }}
        autoplay={
          shouldAutoplay
            ? {
                delay: 2600,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }
            : false
        }
        loop={reviews.length > 3}
        pagination={{ clickable: true, dynamicBullets: true }}
        grabCursor
        speed={reduceMotion ? 0 : 720}
        spaceBetween={16}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 1.15, spaceBetween: 18 },
          768: { slidesPerView: 2, spaceBetween: 20 },
          1100: { slidesPerView: 3, spaceBetween: 22 },
        }}
        className="google-reviews-carousel__swiper"
        aria-label="Google traveller reviews"
      >
        {reviews.map((review) => (
          <SwiperSlide key={review.id} className="!h-auto">
            <GoogleReviewCard review={review} />
          </SwiperSlide>
        ))}
      </Swiper>

      <div ref={paginationRef} className="google-reviews-carousel__pagination" />
    </div>
  );
}
