import Image from 'next/image';
import Link from 'next/link';
import NewsletterForm from '@/components/common/NewsletterForm';

export default function Footer() {
  return (
    <footer className="relative mt-14 overflow-hidden border-t border-white/10 bg-gradient-to-b from-[#1a4d78] via-primary to-[#153a5c] text-blue-100 shadow-[0_-20px_48px_-12px_rgba(31,78,121,0.35)] md:mt-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_80%_0%,rgba(79,163,209,0.12),transparent_50%)]" aria-hidden />
      <div className="container relative z-10 mx-auto px-4 py-10 md:py-12">
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4 md:gap-8">
          {/* Company Info */}
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
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-100/75">Pune, Maharashtra</div>
              </div>
            </div>
            <p className="mb-4 text-sm font-medium text-white/95">Affordable group tours · Trusted local experts</p>
            <p className="mb-4 text-sm text-blue-100/90">
              Pune-based small-group travel. Fixed departures and customised trips across India—run by people who&apos;ve
              actually been there.
            </p>
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m5.521 17.921h-11.04V7.079h11.04v10.842z" />
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 002.856-3.9 10.02 10.02 0 01-2.856.975 5.01 5.01 0 00-8.79 4.55A14.157 14.157 0 011.392 4.744a5.01 5.01 0 001.553 6.686 5.005 5.005 0 01-2.266-.616v.06a5.01 5.01 0 004.01 4.909 5.002 5.002 0 01-2.26.085 5.01 5.01 0 004.678 3.488 10.06 10.06 0 01-6.177 2.13c-.398 0-.779-.023-1.17-.067a14.13 14.13 0 007.671 2.252c9.203 0 14.23-7.557 14.23-14.128 0-.215-.005-.43-.015-.645a10.12 10.12 0 002.479-2.59z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
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
                <a
                  href="https://www.fundayoption.com/pay-online/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-white"
                >
                  Pay Online
                </a>
              </li>
            </ul>
          </div>

          {/* Policies */}
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

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-white">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <div className="flex gap-2">
                  <span>📍</span>
                  <span>Pune, Maharashtra, India</span>
                </div>
              </li>
              <li>
                <div className="flex gap-2">
                  <span>📞</span>
                  <a href="tel:+919876543210" className="transition hover:text-white">
                    +91 9876543210
                  </a>
                </div>
              </li>
              <li>
                <div className="flex gap-2">
                  <span>📧</span>
                  <a href="mailto:info@happyfeet.com" className="transition hover:text-white">
                    info@happyfeet.com
                  </a>
                </div>
              </li>
              <li>
                <div className="flex gap-2">
                  <span>💬</span>
                  <a
                    href="https://wa.me/919876543210"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition hover:text-white"
                  >
                    WhatsApp Us
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-2 grid grid-cols-1 items-start gap-6 rounded-2xl border border-white/15 bg-white/5 p-5 md:grid-cols-[1.2fr_1fr] md:p-6">
          <div>
            <h3 className="text-lg font-bold text-white">Get trip drops in your inbox</h3>
            <p className="mt-1 text-sm text-blue-100/85">
              One short email a month: new departures from Pune, early-bird seats and packing notes — no spam, ever.
            </p>
          </div>
          <NewsletterForm source="footer" />
        </div>

        {/* Divider */}
        <div className="mt-6 border-t border-white/20 pt-6 md:mt-8 md:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-blue-100/80">
              © 2026 Happy Feet Travellers. All rights reserved.
            </p>
            <div className="flex gap-4 text-sm">
              <Link href="/policies/terms" className="text-blue-100/80 hover:text-white">
                Terms
              </Link>
              <span className="text-blue-100/60">|</span>
              <Link href="/policies/privacy" className="text-blue-100/80 hover:text-white">
                Privacy
              </Link>
              <span className="text-blue-100/60">|</span>
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
