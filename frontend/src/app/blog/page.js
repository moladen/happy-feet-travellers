import { getBlogs } from '@/services/api';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Blog - Happy Feet Travellers',
  description: 'Travel tips, destination guides, and stories from Happy Feet Travellers',
};

export default async function BlogPage() {
  const blogs = await getBlogs();
  const featured = blogs[0];
  const rest = blogs.slice(1);

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-[#dceaf7] bg-gradient-to-br from-primary via-[#2a6094] to-secondary py-14 text-white">
        <div className="container mx-auto px-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">Stories & guides</p>
          <h1 className="text-4xl font-bold md:text-5xl">Travel Blog</h1>
          <p className="mt-3 max-w-2xl text-lg text-white/90">
            Inspiration, packing tips, and destination notes from our team — written for curious travellers planning their
            next journey across India.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-14 lg:py-16">
        {featured && (
          <article className="mb-16 overflow-hidden rounded-3xl border border-[#dceaf7] bg-white shadow-xl">
            <div className="grid lg:grid-cols-2">
              <div className="relative min-h-[280px] bg-section-alt lg:min-h-[420px]">
                <img src={featured.image} alt={featured.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent lg:bg-gradient-to-r" />
              </div>
              <div className="flex flex-col justify-center p-8 lg:p-12">
                <span className="mb-3 inline-flex w-fit rounded-full bg-section-alt px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
                  Featured
                </span>
                <h2 className="text-3xl font-bold text-primary md:text-4xl">{featured.title}</h2>
                <p className="mt-4 leading-relaxed text-foreground">{featured.excerpt}</p>
                <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-[#eaf4fb] pt-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-secondary">Author</p>
                    <p className="font-semibold text-primary">{featured.author}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-secondary">Published</p>
                    <p className="font-medium text-foreground">{featured.date}</p>
                  </div>
                </div>
                <Link
                  href={`/blog/${featured.id}`}
                  className="mt-8 inline-flex w-fit rounded-full bg-cta px-6 py-3 text-sm font-semibold text-primary transition hover:bg-[#E76F51] hover:text-white"
                >
                  Read full article
                </Link>
              </div>
            </div>
          </article>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:grid-rows-[auto_1fr] lg:items-start lg:gap-x-10 lg:gap-y-0">
          <h2 className="text-2xl font-bold text-primary lg:col-start-1 lg:row-start-1 lg:mb-8">
            Recent articles
          </h2>

          <div className="min-w-0 space-y-6 sm:space-y-8 lg:col-start-1 lg:row-start-2">
            {rest.length === 0 && featured && (
              <p className="text-foreground">More articles coming soon.</p>
            )}
            {rest.map((blog) => (
              <article
                key={blog.id}
                className="group flex flex-col gap-6 overflow-hidden rounded-2xl border border-[#dceaf7] bg-white p-5 shadow-sm transition hover:shadow-lg md:flex-row md:p-6"
              >
                <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-xl bg-section-alt md:h-40 md:w-52">
                  <img
                    src={blog.image}
                    alt=""
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-center">
                  <span className="text-xs font-bold uppercase tracking-wide text-secondary">{blog.category}</span>
                  <h3 className="mt-2 text-xl font-bold text-primary group-hover:text-secondary">{blog.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-foreground">{blog.excerpt}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-foreground/80">
                    <span>{blog.author}</span>
                    <span>{blog.date}</span>
                  </div>
                  <Link href={`/blog/${blog.id}`} className="mt-4 text-sm font-semibold text-primary hover:text-secondary">
                    Read more →
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <aside className="min-w-0 lg:col-start-2 lg:row-start-2 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-[#dceaf7] bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-primary">On this journey</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground">
                We publish practical guides for group travelers—budgeting, packing, and choosing the right departure.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-foreground">
                {blogs.slice(0, 5).map((b) => (
                  <li key={b.id} className="border-b border-[#eaf4fb] pb-3 last:border-0 last:pb-0">
                    <Link href={`/blog/${b.id}`} className="font-medium text-primary hover:text-secondary">
                      {b.title}
                    </Link>
                    <p className="mt-1 text-xs text-foreground/70">{b.date}</p>
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className="mt-6 flex w-full items-center justify-center rounded-full bg-primary py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Plan a trip with us
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
