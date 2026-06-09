import Link from 'next/link';
import Image from 'next/image';
import { blogHref } from '@/lib/contentTopics';

/**
 * @param {{ blogs?: object[]; landingPage?: object | null; title?: string }} props
 */
export default function RelatedBlogsSection({
  blogs = [],
  landingPage = null,
  title = 'Travel guides & stories',
}) {
  if (!blogs.length && !landingPage?.href) return null;

  return (
    <section className="content-crosslink border-t border-[#dceaf7] bg-white py-12 md:py-14" aria-labelledby="related-blogs-heading">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary">View blogs</p>
            <h2 id="related-blogs-heading" className="mt-1 font-display text-2xl font-bold text-primary md:text-3xl">
              {title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-foreground/75">
              Destination guides and field notes — helpful context before you book.
            </p>
          </div>
          <Link
            href="/blog"
            className="rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary transition hover:bg-section-alt"
          >
            All blog posts
          </Link>
        </div>

        {landingPage?.href ? (
          <div className="mt-6 rounded-xl border border-[#e5d4bc] bg-[#fffdf9] px-4 py-3 text-sm">
            <span className="text-foreground/75">Season hub: </span>
            <Link href={landingPage.href} className="font-semibold text-primary hover:text-cta">
              {landingPage.title}
            </Link>
          </div>
        ) : null}

        {blogs.length > 0 ? (
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <li key={blog.id || blog.slug}>
                <Link
                  href={blogHref(blog)}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#dceaf7] bg-[#f8fbff] shadow-sm transition hover:border-cta/35 hover:shadow-md"
                >
                  <div className="relative aspect-[16/10] bg-section-alt">
                    {blog.coverImage || blog.image ? (
                      <Image
                        src={blog.coverImage || blog.image}
                        alt=""
                        fill
                        className="object-cover transition duration-500 group-hover:scale-[1.03]"
                        sizes="(max-width: 640px) 100vw, 33vw"
                      />
                    ) : null}
                    {blog.category ? (
                      <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary">
                        {blog.category}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="line-clamp-2 font-semibold text-primary group-hover:text-secondary">{blog.title}</h3>
                    {blog.excerpt ? (
                      <p className="mt-2 line-clamp-3 text-sm text-foreground/70">{blog.excerpt}</p>
                    ) : null}
                    <span className="mt-auto pt-3 text-xs font-semibold text-cta">Read article →</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
