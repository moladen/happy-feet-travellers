import Link from 'next/link';

const POLICY_LINKS = [
  { slug: 'terms', href: '/policies/terms', label: 'Terms & Conditions' },
  { slug: 'privacy', href: '/policies/privacy', label: 'Privacy Policy' },
  { slug: 'cancellation', href: '/policies/cancellation', label: 'Cancellation Policy' },
];

const linkClass =
  'font-semibold text-secondary underline-offset-2 transition hover:text-primary hover:underline';

export default function PolicyPageView({ title, lastUpdated, html, currentSlug }) {
  const otherLinks = POLICY_LINKS.filter((link) => link.slug !== currentSlug);

  return (
    <div className="page-shell">
      <div className="page-hero-brand py-10 md:py-14">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <p className="section-eyebrow mb-3 text-white/80">Policies</p>
          <h1 className="font-display text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
            {title}
          </h1>
          <p className="mt-3 text-sm text-white/90 md:text-base">Last updated: {lastUpdated}</p>
        </div>
      </div>

      <div className="section-tone-cream py-10 md:py-14">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <div className="mx-auto max-w-3xl rounded-2xl border border-[#dceaf7] bg-white p-6 shadow-[0_12px_32px_-16px_rgba(15,28,46,0.12)] ring-1 ring-primary/[0.04] md:rounded-3xl md:p-8 lg:p-10">
            <div
              className="policy-content prose prose-sm max-w-none prose-headings:font-display prose-headings:text-primary prose-headings:font-bold prose-p:text-foreground/85 prose-li:text-foreground/85 prose-a:text-secondary prose-a:no-underline hover:prose-a:text-primary prose-table:w-full prose-th:bg-[#f7fbfe] prose-th:px-4 prose-th:py-2 prose-th:text-primary prose-td:px-4 prose-td:py-2 prose-tr:border-b prose-tr:border-[#eaf4fb]"
              dangerouslySetInnerHTML={{ __html: html }}
            />

            <div className="mt-8 flex flex-col gap-4 border-t border-[#eaf4fb] pt-8 sm:flex-row sm:flex-wrap sm:items-center">
              {otherLinks.map((link, index) => (
                <span key={link.slug} className="contents sm:flex sm:items-center sm:gap-4">
                  {index > 0 ? <span className="hidden sm:block text-[#d5e1eb]">|</span> : null}
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </span>
              ))}
              <span className="hidden sm:block text-[#d5e1eb]">|</span>
              <Link href="/" className={linkClass}>
                Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
