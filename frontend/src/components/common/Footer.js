import Image from 'next/image';
import Link from 'next/link';
import NewsletterForm from '@/components/common/NewsletterForm';
import SocialMediaIcons from '@/components/common/SocialMediaIcons';
import { formatIndianPhone, mergeSiteSettings, telHref } from '@/lib/siteContact';

function ContactIcon({ children }) {
  return (
    <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/20 bg-white/10 text-white">
      {children}
    </span>
  );
}

export default function Footer({ settings: settingsProp }) {
  const settings = mergeSiteSettings(settingsProp);
  const phoneDisplay = formatIndianPhone(settings.whatsappNumber);
  const phoneHref = telHref(settings.whatsappNumber);
  const payHref = settings.paymentLink || 'https://www.fundayoption.com/pay-online/';

  return (
    <footer className="relative mt-14 overflow-hidden border-t border-white/10 bg-gradient-to-b from-[#1a4d78] via-primary to-[#153a5c] text-blue-100 shadow-[0_-20px_48px_-12px_rgba(31,78,121,0.35)] md:mt-16">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_80%_0%,rgba(79,163,209,0.12),transparent_50%)]"
        aria-hidden
      />
      <div className="container relative z-10 mx-auto px-4 py-10 md:py-12">
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4 md:gap-8">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="overflow-hidden rounded-full border border-white/25 bg-white shadow-sm">
                <Image
                  src="/happy-feet-logo.png"
                  alt="Happy Feet Travellers logo"
                  width={52}
                  height={52}
                  className="h-12 w-12 object-cover"
                />
              </div>
              <div>
                <div className="text-xl font-bold text-white">Happy Feet Travellers</div>
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-100/75">
                  Pune, Maharashtra
                </div>
              </div>
            </div>
            <p className="mb-4 text-sm font-medium text-white/95">
              {settings.footerTagline || 'Affordable group tours · Trusted local experts'}
            </p>
            <p className="text-sm text-blue-100/90">
              {settings.footerDetails ||
                "Pune-based small-group travel. Fixed departures and customised trips across India—run by people who've actually been there."}
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/upcoming-departures" className="transition hover:text-white">
                  Upcoming Tours
                </Link>
              </li>
              <li>
                <Link href="/customized-trips" className="transition hover:text-white">
                  Custom Packages
                </Link>
              </li>
              <li>
                <Link href="/blog" className="transition hover:text-white">
                  Travel Blog
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <a href={payHref} target="_blank" rel="noopener noreferrer" className="transition hover:text-white">
                  Pay Online
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold text-white">Policies</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/policies/terms" className="transition hover:text-white">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/policies/privacy" className="transition hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/cancellation" className="transition hover:text-white">
                  Cancellation Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold text-white">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <ContactIcon>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
                    />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </ContactIcon>
                <span className="pt-1.5">{settings.officeAddress}</span>
              </li>
              <li className="flex gap-3">
                <ContactIcon>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </ContactIcon>
                <a href={phoneHref} className="pt-1.5 transition hover:text-white">
                  {phoneDisplay}
                </a>
              </li>
              <li className="flex gap-3">
                <ContactIcon>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </ContactIcon>
                <a href={`mailto:${settings.email}`} className="break-all pt-1.5 transition hover:text-white">
                  {settings.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-white/15 bg-white/5 px-5 py-6 md:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-blue-100/70">
                Stay connected
              </p>
              <h3 className="mt-1 text-lg font-bold text-white">Follow us on social media</h3>
              <p className="mt-1 max-w-lg text-sm text-blue-100/85">
                Trip updates, travel reels, and quick replies on WhatsApp.
              </p>
            </div>
            <SocialMediaIcons
              settings={settings}
              size="lg"
              forFooter
              className="justify-start md:justify-end"
            />
          </div>
        </div>

        <div className="mt-2 grid grid-cols-1 items-start gap-6 rounded-2xl border border-white/15 bg-white/5 p-5 md:grid-cols-[1.2fr_1fr] md:p-6">
          <div>
            <h3 className="text-lg font-bold text-white">Get trip drops in your inbox</h3>
            <p className="mt-1 text-sm text-blue-100/85">
              One short email a month: new departures from Pune, early-bird seats and packing notes — no spam, ever.
            </p>
          </div>
          <NewsletterForm source="footer" />
        </div>

        <div className="mt-6 border-t border-white/20 pt-6 md:mt-8 md:pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row md:items-center">
            <p className="text-center text-sm text-blue-100/80 md:text-left">
              © 2026 Happy Feet Travellers. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm md:justify-end">
              <Link href="/policies/terms" className="text-blue-100/80 hover:text-white">
                Terms
              </Link>
              <span className="text-blue-100/50" aria-hidden>
                |
              </span>
              <Link href="/policies/privacy" className="text-blue-100/80 hover:text-white">
                Privacy
              </Link>
              <span className="text-blue-100/50" aria-hidden>
                |
              </span>
              <Link href="/policies/cancellation" className="text-blue-100/80 hover:text-white">
                Cancellation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
