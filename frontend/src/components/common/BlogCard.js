'use client';

import Link from 'next/link';
import Image from 'next/image';

function formatReadLabel(category) {
  const c = String(category || '').trim();
  if (!c) return 'Story';
  return c;
}

export default function BlogCard({ blog, variant = 'default' }) {
  if (variant === 'journal') {
    return (
      <Link
        href={`/blog/${blog.id}`}
        className="blog-journal-card group block h-full rounded-[1.35rem] focus:outline-none focus-visible:ring-2 focus-visible:ring-cta/60 focus-visible:ring-offset-2"
      >
        <article className="blog-journal-card__inner flex h-full flex-col overflow-hidden">
          <div className="blog-journal-card__media">
            {blog.image ? (
              <Image
                src={blog.image}
                alt=""
                fill
                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 380px"
                className="object-cover transition duration-700 ease-out group-hover:scale-[1.05]"
              />
            ) : (
              <div className="blog-journal-card__placeholder" aria-hidden />
            )}
            <div className="blog-journal-card__overlay" aria-hidden />
            <span className="blog-journal-card__tag">{formatReadLabel(blog.category)}</span>
          </div>

          <div className="blog-journal-card__body">
            <h3 className="blog-journal-card__title">{blog.title}</h3>
            <p className="blog-journal-card__excerpt">{blog.excerpt}</p>
            <div className="blog-journal-card__meta">
              <span className="blog-journal-card__author">{blog.author || 'Happy Feet'}</span>
              <span className="blog-journal-card__dot" aria-hidden>
                ·
              </span>
              <time className="blog-journal-card__date">{blog.date}</time>
            </div>
            <span className="blog-journal-card__cta">
              Continue reading
              <svg className="blog-journal-card__cta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${blog.id}`}
      className="group block h-full rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <article className="relative flex h-full flex-col overflow-hidden rounded-3xl glass-card transition-[box-shadow,border-color] duration-500 hover:border-cta/25 hover:shadow-[0_24px_48px_-16px_rgba(15,28,46,0.18)]">
        <div className="card-shimmer-hover relative h-48 w-full overflow-hidden bg-gradient-to-br from-section-alt to-[#dceaf7]">
          {blog.image ? (
            <img
              src={blog.image}
              alt=""
              className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.06]"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <span className="absolute right-3 top-3 rounded-full border border-white/40 bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white backdrop-blur-md">
            {blog.category}
          </span>
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
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
