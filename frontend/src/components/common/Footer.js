import Link from 'next/link';
import BrandLogo from '@/components/common/BrandLogo';
import NewsletterForm from '@/components/common/NewsletterForm';
import SocialMediaIcons from '@/components/common/SocialMediaIcons';
import {
  formatIndianPhone,
  mergeSiteSettings,
  SITE_PAYMENT_PAGE,
  telHref,
  whatsappHref,
} from '@/lib/siteContact';

const exploreLinks = [
  { href: '/upcoming-departures', label: 'Upcoming departures' },
  { href: '/customized-trips', label: 'Customized trips' },
  { href: '/discover', label: 'Discover the world' },
  { href: '/blog', label: 'Travel blog' },
];

const companyLinks = [
  { href: '/about', label: 'About us' },
  { href: '/contact', label: 'Contact' },
];

const legalLinks = [
  { href: '/policies/terms', label: 'Terms' },
  { href: '/policies/privacy', label: 'Privacy' },
  { href: '/policies/cancellation', label: 'Cancellation' },
];

function FooterHeading({ children }) {
  return (
    <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">{children}</h3>
  );
}

function FooterLink({ href, children }) {
  return (
    <Link
      href={href}
      className="text-sm text-white/75 transition-colors duration-200 hover:text-white hover:underline decoration-white/30 underline-offset-4"
    >
      {children}
    </Link>
  );
}

function IconPin() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 11a3 3 0 100-6 3 3 0 000 6z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 22s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11z" />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M3 5a2 2 0 012-2h2.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    </svg>
  );
}

function IconMail() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function ContactRow({ href, icon, children }) {
  const inner = (
    <span className="flex items-start gap-3 text-sm text-white/75 transition-colors group-hover:text-white">
      <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-secondary">
        {icon}
      </span>
      <span className="pt-1.5 leading-relaxed">{children}</span>
    </span>
  );

  if (href) {
    return (
      <a href={href} className="group block rounded-xl py-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cta/50">
        {inner}
      </a>
    );
  }

  return <div className="group py-0.5">{inner}</div>;
}

export default function Footer({ settings: settingsProp }) {
  const settings = mergeSiteSettings(settingsProp);
  const phoneDisplay = formatIndianPhone(settings.whatsappNumber);
  const phoneHref = telHref(settings.whatsappNumber);
  const waHref = whatsappHref(settings.whatsappNumber, "Hi, I'd like to know about your tours from Pune.");

  return (
    <footer className="relative mt-16 overflow-hidden bg-[#0a1520] text-white">
      <div
        className="pointer-events-none absolute -left-32 top-0 h-72 w-72 rounded-full bg-secondary/20 blur-[100px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-20 h-80 w-80 rounded-full bg-cta/15 blur-[110px]"
        aria-hidden
      />

      {/* Top CTA strip */}
      <div className="relative border-b border-white/10">
        <div className="container relative z-10 mx-auto flex flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between md:py-12">
          <div className="max-w-xl">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-secondary">Plan your next escape</p>
            <p className="font-display text-2xl font-bold leading-tight text-white md:text-3xl">
              Group tours &amp; custom holidays from Pune
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/65 md:text-base">
              Fixed departures, honest pricing, and WhatsApp support before you book.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/upcoming-departures"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-cta px-6 py-3 text-sm font-bold text-[#1a1208] shadow-[0_10px_28px_-12px_rgba(231,111,81,0.65)] transition hover:bg-[#f6b078]"
            >
              View departures
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#25D366]/50 bg-[#25D366]/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-[#25D366] hover:bg-[#25D366]/25"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path d="M20.52 3.48A11.85 11.85 0 0 0 12.09 0C5.53 0 .19 5.34.19 11.9c0 2.1.55 4.15 1.59 5.95L.09 24l6.3-1.65a11.93 11.93 0 0 0 5.69 1.45h.01c6.56 0 11.9-5.34 11.91-11.9 0-3.18-1.24-6.17-3.48-8.42Zm-8.43 18.31h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.74.98 1-3.65-.24-.38a9.86 9.86 0 0 1-1.51-5.25c0-5.45 4.44-9.89 9.9-9.89 2.64 0 5.12 1.03 6.99 2.9a9.84 9.84 0 0 1 2.9 6.99c0 5.45-4.44 9.89-9.89 9.89Zm5.42-7.41c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35Z" />
              </svg>
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="container relative z-10 mx-auto px-4 py-12 md:py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 xl:gap-10">
          {/* Brand */}
          <div className="lg:col-span-4">
            <BrandLogo variant="footer" href="/" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/65">
              {settings.footerTagline || 'Affordable group tours from Pune — small groups, vetted stays, and support you can reach on WhatsApp.'}
            </p>
            <Link
              href={SITE_PAYMENT_PAGE}
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/90 transition hover:border-cta/40 hover:bg-white/10"
            >
              <svg className="h-4 w-4 text-cta" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              Pay online securely
            </Link>
            <div className="mt-6">
              <SocialMediaIcons settings={settings} size="sm" forFooter className="justify-start" />
            </div>
          </div>

          {/* Explore */}
          <div className="lg:col-span-2">
            <FooterHeading>Explore</FooterHeading>
            <ul className="space-y-3">
              {exploreLinks.map((item) => (
                <li key={item.href}>
                  <FooterLink href={item.href}>{item.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Company + legal */}
          <div className="lg:col-span-2">
            <FooterHeading>Company</FooterHeading>
            <ul className="space-y-3">
              {companyLinks.map((item) => (
                <li key={item.href}>
                  <FooterLink href={item.href}>{item.label}</FooterLink>
                </li>
              ))}
            </ul>
            <FooterHeading>Policies</FooterHeading>
            <ul className="space-y-3">
              {legalLinks.map((item) => (
                <li key={item.href}>
                  <FooterLink href={item.href}>{item.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + newsletter */}
          <div className="sm:col-span-2 lg:col-span-4">
            <FooterHeading>Get in touch</FooterHeading>
            <ul className="mb-8 space-y-4">
              <li>
                <ContactRow icon={<IconPin />}>{settings.officeAddress}</ContactRow>
              </li>
              <li>
                <ContactRow href={phoneHref} icon={<IconPhone />}>
                  {phoneDisplay}
                </ContactRow>
              </li>
              <li>
                <ContactRow href={`mailto:${settings.email}`} icon={<IconMail />}>
                  <span className="break-all">{settings.email}</span>
                </ContactRow>
              </li>
            </ul>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
              <p className="text-sm font-semibold text-white">Trip drops in your inbox</p>
              <p className="mt-1 text-xs text-white/55">New departures and offers — no spam.</p>
              <div className="[&_form]:mt-3">
                <NewsletterForm source="footer" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/10 bg-black/20">
        <div className="container relative z-10 mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} Happy Feet Travellers · Pune, Maharashtra
          </p>
          <p className="text-xs text-white/40">Group tours &amp; customized holidays across India &amp; beyond</p>
        </div>
      </div>
    </footer>
  );
}
