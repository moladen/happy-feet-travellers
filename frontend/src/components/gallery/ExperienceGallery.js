'use client';



import Image from 'next/image';

import { useId, useMemo, useRef } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';

import { Autoplay, Pagination, A11y } from 'swiper/modules';

import 'swiper/css';

import 'swiper/css/pagination';



import { sanitiseStockImageUrl, TRAVEL_FALLBACK_IMAGE } from '@/lib/stockImages';



const FALLBACK = TRAVEL_FALLBACK_IMAGE;

const AUTOPLAY_DELAY = 3200;



function SlideCard({ slide }) {

  const typeLabel = slide.type === 'memory' ? 'Traveller memory' : 'Destination';

  return (

    <article className="experience-gallery__slide group relative h-full overflow-hidden rounded-2xl border border-[#dceaf5] bg-[#0f1c2e] shadow-[0_20px_48px_-28px_rgba(15,28,44,0.55)]">

      <div className="relative aspect-[4/3] w-full min-h-[11rem] sm:min-h-[13rem] md:aspect-[16/10] md:min-h-[15rem]">

        <Image

          src={sanitiseStockImageUrl(slide.image) || FALLBACK}

          alt={slide.caption || 'Travel experience'}

          fill

          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 55vw, 42vw"

          className="object-cover transition duration-700 group-hover:scale-[1.04]"

          priority={false}

        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#061525]/88 via-[#061525]/15 to-transparent" />

        <span className="absolute left-3 top-3 rounded-full border border-white/25 bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-sm">

          {typeLabel}

        </span>

        {slide.caption ? (

          <p className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-10 text-sm font-semibold leading-snug text-white md:text-base">

            {slide.caption}

          </p>

        ) : null}

      </div>

    </article>

  );

}



/** Duplicate slides so Swiper loop + autoplay stay smooth with few images. */

function prepareCarouselSlides(slides) {

  if (slides.length <= 1) return slides;

  if (slides.length >= 5) return slides;

  let expanded = [...slides];

  while (expanded.length < 5) {

    expanded = [...expanded, ...slides];

  }

  return expanded;

}



/**

 * @param {{

 *   slides?: Array<{ image: string; caption?: string; type?: string }>;

 *   eyebrow?: string;

 *   title?: string;

 *   lede?: string;

 *   className?: string;

 * }} props

 */

export default function ExperienceGallery({

  slides = [],

  eyebrow = 'Visual journey',

  title = 'Experience the destination',

  lede = 'See landscapes, culture, and real traveller moments before you dive into the day-by-day plan.',

  className = '',

}) {

  const swiperRef = useRef(null);

  const headingId = useId();

  const display = slides.filter((s) => s?.image);

  const carouselSlides = useMemo(() => prepareCarouselSlides(display), [display]);

  const canAutoplay = display.length >= 2;

  const canLoop = carouselSlides.length >= 3;

  const memorySlides = display.filter((s) => s.type === 'memory').slice(0, 4);



  if (!display.length) return null;



  return (

    <section

      className={`experience-gallery ${className}`.trim()}

      aria-labelledby={headingId}

    >

      <div className="experience-gallery__header">

        <p className="experience-gallery__eyebrow">{eyebrow}</p>

        <h2 id={headingId} className="experience-gallery__title">

          {title}

        </h2>

        {lede ? <p className="experience-gallery__lede">{lede}</p> : null}

      </div>



      <div

        className="experience-gallery__carousel-wrap"

        onMouseEnter={() => swiperRef.current?.autoplay?.stop()}

        onMouseLeave={() => swiperRef.current?.autoplay?.start()}

      >

        <Swiper

          modules={[Autoplay, Pagination, A11y]}

          onSwiper={(swiper) => {

            swiperRef.current = swiper;

            if (canAutoplay) swiper.autoplay?.start();

          }}

          loop={canLoop}

          rewind={!canLoop && canAutoplay}

          speed={750}

          grabCursor

          touchEventsTarget="container"

          autoplay={

            canAutoplay

              ? {

                  delay: AUTOPLAY_DELAY,

                  disableOnInteraction: false,

                  pauseOnMouseEnter: true,

                  waitForTransition: true,

                }

              : false

          }

          pagination={{ clickable: true, dynamicBullets: true }}

          spaceBetween={16}

          slidesPerView={1.08}

          breakpoints={{

            640: { slidesPerView: 1.35, spaceBetween: 18 },

            900: { slidesPerView: 1.65, spaceBetween: 20 },

            1200: { slidesPerView: 2.05, spaceBetween: 22 },

          }}

          className="experience-gallery__swiper overflow-hidden [&_.swiper-pagination-bullet]:bg-primary/25 [&_.swiper-pagination-bullet-active]:bg-primary"

          aria-label="Destination experience gallery"

        >

          {carouselSlides.map((slide, index) => (

            <SwiperSlide key={`${slide.image}-${index}`} className="!h-auto">

              <SlideCard slide={slide} />

            </SwiperSlide>

          ))}

        </Swiper>

      </div>



      {memorySlides.length > 0 ? (

        <div className="experience-gallery__proof">

          <p className="experience-gallery__proof-title">Traveller memories</p>

          <div className="experience-gallery__proof-grid">

            {memorySlides.map((slide, index) => (

              <figure key={`proof-${index}`} className="experience-gallery__proof-card">

                <div className="relative aspect-[4/3] overflow-hidden rounded-xl">

                  <Image

                    src={sanitiseStockImageUrl(slide.image)}

                    alt=""

                    fill

                    sizes="160px"

                    className="object-cover"

                  />

                </div>

                {slide.caption ? (

                  <figcaption className="experience-gallery__proof-caption">{slide.caption}</figcaption>

                ) : null}

              </figure>

            ))}

          </div>

        </div>

      ) : null}

    </section>

  );

}

