'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function BlogCard({ blog }) {
  return (
    <Link
      href={`/blog/${blog.id}`}
      className="group block h-full rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <motion.article
        className="relative flex h-full flex-col overflow-hidden rounded-3xl glass-card transition-[box-shadow,border-color] duration-500 hover:border-secondary/30 hover:shadow-[0_24px_48px_-16px_rgba(31,78,121,0.18)]"
        whileHover={{ y: -5 }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      >
        <div className="card-shimmer-hover relative h-48 w-full overflow-hidden bg-gradient-to-br from-section-alt to-[#dceaf7]">
          <img
            src={blog.image}
            alt=""
            className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.06] group-hover:brightness-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <motion.span
            className="absolute right-3 top-3 rounded-full border border-white/40 bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white backdrop-blur-md"
            whileHover={{ scale: 1.06 }}
          >
            {blog.category}
          </motion.span>
        </div>

        <div className="relative flex flex-1 flex-col p-5 md:p-6">
          <h3 className="mb-2 line-clamp-2 text-lg font-bold text-primary transition-colors duration-300 group-hover:text-[#2a6094]">
            {blog.title}
          </h3>
          <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-foreground/85">{blog.excerpt}</p>

          <div className="mb-4 flex items-center justify-between gap-2 border-b border-[#eaf4fb] pb-4 text-xs text-foreground/75">
            <span className="font-semibold text-primary/90">By {blog.author}</span>
            <span>{blog.date}</span>
          </div>

          <div className="mt-auto flex items-center justify-between pt-1">
            <span className="text-sm font-bold text-primary">Read article</span>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-section-alt text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white">
              <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
