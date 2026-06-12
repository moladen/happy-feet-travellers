import Link from 'next/link';
import { notFound } from 'next/navigation';
import RelatedPackagesSection from '@/components/content/RelatedPackagesSection';
import { blogHref } from '@/lib/contentTopics';
import { getBlogById, getBlogs } from '@/services/api';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const blog = await getBlogById(id);
  if (!blog) return { title: 'Post not found' };
  return {
    title: `${blog.title} - Happy Feet Travellers`,
    description: blog.excerpt,
  };
}

function paragraphs(content) {
  if (Array.isArray(content)) return content;
  if (typeof content === 'string' && content.trim() && content !== '...') {
    return content.split('\n\n').filter(Boolean);
  }
  return [];
}

export default async function BlogArticlePage({ params }) {
  const { id } = await params;
  const blog = await getBlogById(id);
  if (!blog) notFound();

  const all = await getBlogs();
  const others = all.filter((b) => String(b.id) !== String(blog.id) && b.slug !== blog.slug).slice(0, 8);
  const body = paragraphs(blog.content);
  const relatedPackages = blog.relatedPackages || blog.relatedLandingPage?.packages || [];
  const relatedLandingPage = blog.relatedLandingPage || null;
  const packagesTitle = relatedLandingPage?.title
    ? `Rann Utsav packages — ${relatedLandingPage.title.replace(/\s*Season.*/i, '').trim() || relatedLandingPage.title}`
    : 'Related packages';

  return (
    <div className="page-shell">
      <article className="page-hero-brand py-10 md:py-14">
        <div className="container mx-auto px-4 md:px-6">
          <p className="section-eyebrow mb-3 text-white/80">{blog.category}</p>
          <h1 className="max-w-4xl text-3xl font-bold leading-tight md:text-5xl">{blog.title}</h1>
          <p className="mt-4 max-w-3xl text-lg text-white/90">{blog.excerpt}</p>
          <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-white/20 pt-6">
            <div className="flex items-center gap-3">
              {blog.authorPhoto ? (
                <img
                  src={blog.authorPhoto}
                  alt=""
                  className="h-14 w-14 rounded-full border-2 border-white/40 object-cover"
                />
              ) : (
                <div className="grid h-14 w-14 place-items-center rounded-full border-2 border-white/40 bg-white/10 text-xl">
                  ✍️
                </div>
              )}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-white/75">Author</p>
                <p className="font-semibold">{blog.author}</p>
                {blog.authorInstagram && (
                  <a
                    href={`https://instagram.com/${blog.authorInstagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-cta hover:underline"
                  >
                    @{blog.authorInstagram.replace('@', '')}
                  </a>
                )}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-white/75">Published</p>
              <p className="font-medium">{blog.date}</p>
            </div>
          </div>
        </div>
      </article>

      <div className="section-tone-cream py-10 md:py-14">
        <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_300px]">
          <div className="min-w-0">
            <div className="overflow-hidden rounded-2xl border border-[#dceaf7] bg-white shadow-sm">
              <div className="aspect-[21/9] max-h-80 w-full bg-section-alt">
                <img src={blog.image} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="prose prose-neutral max-w-none p-8 prose-p:text-foreground prose-p:leading-relaxed">
                {body.length === 0 ? (
                  <p className="text-foreground/80">Full article body will appear here when connected to your CMS.</p>
                ) : (
                  body.map((para, i) => (
                    <p key={i} className="mb-4 last:mb-0">
                      {para}
                    </p>
                  ))
                )}
              </div>
            </div>

            <RelatedPackagesSection
              packages={relatedPackages}
              landingPage={relatedLandingPage}
              title={packagesTitle}
            />

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/blog"
                className="rounded-full border border-primary bg-white px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-section-alt"
              >
                ← All posts
              </Link>
              <Link
                href="/contact"
                className="rounded-full bg-cta px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-[#E76F51] hover:text-white"
              >
                Plan a trip
              </Link>
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-[#dceaf7] bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-primary">More from the blog</h2>
              <ul className="mt-4 space-y-4">
                {others.map((b) => (
                  <li key={b.id} className="border-b border-[#eaf4fb] pb-4 last:border-0 last:pb-0">
                    <Link href={blogHref(b)} className="font-medium text-primary hover:text-secondary">
                      {b.title}
                    </Link>
                    <p className="mt-1 text-xs text-foreground/65">{b.date}</p>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
        </div>
      </div>
    </div>
  );
}
