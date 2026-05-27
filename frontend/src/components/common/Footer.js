import Link from 'next/link';
import BrandLogo from '@/components/common/BrandLogo';
import NewsletterForm from '@/components/common/NewsletterForm';
import SocialMediaIcons from '@/components/common/SocialMediaIcons';
import { FOOTER_DESTINATION_LINKS } from '@/lib/footerDestinations';
import {
  formatIndianPhone,
  mergeSiteSettings,
  SITE_PAYMENT_PAGE,
  telHref,
  whatsappHref,
} from '@/lib/siteContact';

const exploreLinks = [
  { href: '/upcoming-departures', label: 'Upcoming departures' },
  { href: '/customized-trips', label: 'Personalized tours' },
  { href: '/discover', label: 'Discover the world' },
  { href: '/blog', label: 'Travel journal' },
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
  return <h3 className="site-footer__heading">{children}</h3>;
}

function FooterLink({ href, children }) {
  return (
    <Link href={href} className="site-footer__link">
      {children}
    </Link>
  );
}

function IconPin() {
  return (
    <svg className="site-footer__contact-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 11a3 3 0 100-6 3 3 0 000 6z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 22s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11z" />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg className="site-footer__contact-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
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
    <svg className="site-footer__contact-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function IconWhatsApp() {
  return (
    <svg className="site-footer__contact-icon-svg" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M20.52 3.48A11.85 11.85 0 0 0 12.09 0C5.53 0 .19 5.34.19 11.9c0 2.1.55 4.15 1.59 5.95L.09 24l6.3-1.65a11.93 11.93 0 0 0 5.69 1.45h.01c6.56 0 11.9-5.34 11.91-11.9 0-3.18-1.24-6.17-3.48-8.42Zm-8.43 18.31h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.74.98 1-3.65-.24-.38a9.86 9.86 0 0 1-1.51-5.25c0-5.45 4.44-9.89 9.9-9.89 2.64 0 5.12 1.03 6.99 2.9a9.84 9.84 0 0 1 2.9 6.99c0 5.45-4.44 9.89-9.89 9.89Zm5.42-7.41c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35Z" />
    </svg>
  );
}

function ContactRow({ href, icon, label, children }) {
  const inner = (
    <>
      <span className="site-footer__contact-icon" aria-hidden>
        {icon}
      </span>
      <span className="site-footer__contact-body">
        {label ? <span className="site-footer__contact-label">{label}</span> : null}
        <span className="site-footer__contact-value">{children}</span>
      </span>
    </>
  );

  if (href) {
    return (
      <a href={href} className="site-footer__contact-row">
        {inner}
      </a>
    );
  }

  return <div className="site-footer__contact-row">{inner}</div>;
}

export default function Footer({ settings: settingsProp }) {
  const settings = mergeSiteSettings(settingsProp);
  const phoneDisplay = formatIndianPhone(settings.whatsappNumber);
  const phoneHref = telHref(settings.whatsappNumber);
  const waHref = whatsappHref(settings.whatsappNumber, "Hi, I'd like to know about your curated group tours.");

  return (
    <footer className="site-footer relative mt-10 overflow-hidden text-white md:mt-12">
      <div className="site-footer__glow site-footer__glow--left" aria-hidden />
      <div className="site-footer__glow site-footer__glow--right" aria-hidden />

      <div className="site-footer__cta-strip">
        <div className="container relative z-10 mx-auto max-w-6xl px-4">
          <div className="site-footer__cta-inner">
            <div className="site-footer__cta-copy">
              <p className="site-footer__cta-eyebrow">Plan your next escape</p>
              <p className="site-footer__cta-title">Curated journeys across India</p>
            </div>
            <div className="site-footer__cta-actions">
              <Link href="/upcoming-departures" className="site-footer__btn site-footer__btn--primary">
                View departures
              </Link>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="site-footer__btn site-footer__btn--whatsapp"
              >
                <IconWhatsApp />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="site-footer__main container relative z-10 mx-auto max-w-6xl px-4">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <BrandLogo variant="footer" navTone="hero" href="/" />
            <p className="site-footer__tagline">
              {settings.footerTagline ||
                'Experience-first group departures and personalized holidays — honest pricing and real support on WhatsApp.'}
            </p>
            <Link href={SITE_PAYMENT_PAGE} className="site-footer__payment-link">
              Pay online securely
            </Link>
            <div className="site-footer__social-wrap">
              <p className="site-footer__social-label">Follow our journeys</p>
              <SocialMediaIcons
                settings={settings}
                size="sm"
                forFooter
                premiumFooter
                className="site-footer__social-list"
              />
            </div>
          </div>

          <nav className="site-footer__nav-col" aria-labelledby="footer-explore-heading">
            <FooterHeading>
              <span id="footer-explore-heading">Explore</span>
            </FooterHeading>
            <ul className="site-footer__link-list">
              {exploreLinks.map((item) => (
                <li key={item.href}>
                  <FooterLink href={item.href}>{item.label}</FooterLink>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="site-footer__nav-col" aria-labelledby="footer-company-heading">
            <FooterHeading>
              <span id="footer-company-heading">Company</span>
            </FooterHeading>
            <ul className="site-footer__link-list">
              {companyLinks.map((item) => (
                <li key={item.href}>
                  <FooterLink href={item.href}>{item.label}</FooterLink>
                </li>
              ))}
            </ul>
            <FooterHeading>Policies</FooterHeading>
            <ul className="site-footer__link-list">
              {legalLinks.map((item) => (
                <li key={item.href}>
                  <FooterLink href={item.href}>{item.label}</FooterLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="site-footer__contact-col">
            <FooterHeading>Get in touch</FooterHeading>
            <ul className="site-footer__contact-list">
              <li>
                <ContactRow icon={<IconPin />} label="Office">
                  {settings.officeAddress}
                </ContactRow>
              </li>
              <li>
                <ContactRow href={phoneHref} icon={<IconPhone />} label="Phone">
                  {phoneDisplay}
                </ContactRow>
              </li>
              <li>
                <ContactRow href={waHref} icon={<IconWhatsApp />} label="WhatsApp">
                  {phoneDisplay}
                </ContactRow>
              </li>
              <li>
                <ContactRow href={`mailto:${settings.email}`} icon={<IconMail />} label="Email">
                  <span className="break-all">{settings.email}</span>
                </ContactRow>
              </li>
            </ul>

            <div className="site-footer__newsletter">
              <p className="site-footer__newsletter-title">Trip updates in your inbox</p>
              <p className="site-footer__newsletter-hint">New departures — no spam.</p>
              <NewsletterForm source="footer" />
            </div>
          </div>
        </div>

        <nav className="site-footer__destinations" aria-labelledby="footer-destinations-heading">
          <FooterHeading>
            <span id="footer-destinations-heading">Popular destinations</span>
          </FooterHeading>
          <ul className="site-footer__destination-pills">
            {FOOTER_DESTINATION_LINKS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="site-footer__destination-pill">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="site-footer__bar">
        <div className="site-footer__bar-inner container relative z-10 mx-auto max-w-6xl px-4">
          <p className="site-footer__copyright">
            © {new Date().getFullYear()} Happy Feet Travellers · Pune, Maharashtra
          </p>
          <p className="site-footer__bar-tagline">Curated group tours &amp; personalized holidays</p>
        </div>
      </div>
    </footer>
  );
}
