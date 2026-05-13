'use client';

import { motion } from 'framer-motion';

export default function Gallery() {
  const images = [
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=80',
      alt: 'Houseboat in the Kerala backwaters',
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80',
      alt: 'High-altitude lake in the Himalayas',
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=900&q=80',
      alt: 'Hawa Mahal facade, Jaipur',
    },
    {
      id: 4,
      src: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=80',
      alt: 'Quiet Goa shoreline at sunset',
    },
    {
      id: 5,
      src: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=900&q=80',
      alt: 'Monasteries and prayer flags in Sikkim',
    },
    {
      id: 6,
      src: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=80',
      alt: 'Group sunset at a Rajasthan dune',
    },
  ];

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.45 },
    },
  };

  return (
    <motion.section
      id="gallery"
      className="section-ambient relative overflow-hidden border-t border-white/50 bg-white/90 pb-14 pt-12 backdrop-blur-sm md:pb-16 md:pt-14"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="container relative z-10 mx-auto px-4">
        <motion.div className="mb-7 text-center md:mb-9" variants={headerVariants}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-secondary">Gallery</p>
          <h2 className="mb-2.5 text-3xl font-bold text-primary md:text-4xl lg:text-5xl">Postcards from our trips</h2>
          <p className="mx-auto max-w-2xl text-base text-foreground/85 md:text-lg">
            From Goa shorelines to Sikkim valleys — a peek into the places our Pune travellers have explored with us.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6"
          variants={gridVariants}
        >
          {images.map((image) => (
            <motion.div
              key={image.id}
              className="group relative cursor-pointer overflow-hidden rounded-3xl glass-card shadow-md ring-1 ring-primary/[0.06] transition-[box-shadow,transform] duration-500 hover:-translate-y-1 hover:shadow-[0_24px_48px_-16px_rgba(31,78,121,0.2)] hover:ring-secondary/20"
              variants={itemVariants}
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            >
              <div className="card-shimmer-hover relative aspect-[4/3] w-full overflow-hidden bg-section-alt">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.08] group-hover:brightness-[1.04]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent opacity-80 transition duration-500 group-hover:from-black/75 group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 flex translate-y-2 items-end justify-start p-4 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100 sm:p-5">
                  <p className="text-base font-bold leading-snug text-white drop-shadow-md md:text-lg">{image.alt}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
